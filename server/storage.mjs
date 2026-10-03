import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, chmodSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import pg from 'pg';
import { HttpError } from './validation.mjs';

const migration = readFileSync(new URL('./migrations/001-intake.sql', import.meta.url), 'utf8');
export async function openStorage({ databaseUrl, databaseFile, production = false, migrate = false } = {}) {
  if (production && !databaseUrl && !databaseFile) throw new Error('Production requires DATABASE_URL or an explicit persistent DATABASE_FILE.');
  if (production && !databaseUrl && databaseFile === ':memory:') throw new Error('Production requires persistent storage, not an in-memory database.');
  if (databaseUrl && !/^postgres(ql)?:\/\//.test(databaseUrl)) throw new Error('DATABASE_URL must be a PostgreSQL connection URL.');
  let storage;
  if (databaseUrl) {
    const pool = new pg.Pool({
      connectionString: databaseUrl, max: 5, connectionTimeoutMillis: 5000,
      statement_timeout: 5000, query_timeout: 6000,
    });
    pool.on('error', () => console.error(JSON.stringify({ event: 'database_pool_error' })));
    storage = {
      async transaction(fn) {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          const result = await fn((sql, values = []) => client.query(sql, values));
          await client.query('COMMIT');
          return result;
        } catch (error) {
          await client.query('ROLLBACK').catch(() => {});
          throw error;
        } finally { client.release(); }
      },
      query: (sql, values = []) => pool.query(sql, values),
      close: () => pool.end(),
    };
  } else {
    const file = databaseFile === ':memory:' ? ':memory:' : resolve(databaseFile || 'var/yummyfit.sqlite');
    if (file !== ':memory:') mkdirSync(dirname(file), { recursive: true });
    const db = new DatabaseSync(file);
    if (file !== ':memory:' && process.platform !== 'win32') chmodSync(file, 0o600);
    db.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
    const query = async (sql, values = []) => ({
      rows: db.prepare(sql.replace(/\$\d+/g, '?')).all(...values.map(v => typeof v === 'boolean' ? Number(v) : v)),
    });
    let tail = Promise.resolve();
    storage = {
      async transaction(fn) {
        const previous = tail;
        let release;
        tail = new Promise(resolveTail => { release = resolveTail; });
        await previous;
        try {
          db.exec('BEGIN IMMEDIATE');
          const result = await fn(query);
          db.exec('COMMIT');
          return result;
        } catch (error) { try { db.exec('ROLLBACK'); } catch { /* Preserve the original failure if BEGIN failed. */ } throw error; }
        finally { release(); }
      },
      query,
      close: async () => { await tail; db.close(); },
      sqlite: db,
    };
  }
  storage.migrate = async () => {
    await storage.transaction(async query => {
      // PostgreSQL migration runners serialize against the same advisory lock.
      if (databaseUrl) await query('SELECT pg_advisory_xact_lock(741852)');
      if (storage.sqlite) storage.sqlite.exec(migration);
      else await query(migration);
      await query('INSERT INTO schema_migrations(version, applied_at) VALUES ($1, $2) ON CONFLICT (version) DO NOTHING',
        ['001', new Date().toISOString()]);
      if (!(await query("SELECT version FROM schema_migrations WHERE version = '002'")).rows.length) {
        if (storage.sqlite) storage.sqlite.exec(readFileSync(new URL('./migrations/002-optional-price-sqlite.sql', import.meta.url), 'utf8'));
        else await query('ALTER TABLE waitlist_intakes ALTER COLUMN price_range DROP NOT NULL');
        await query('INSERT INTO schema_migrations(version, applied_at) VALUES ($1, $2)', ['002', new Date().toISOString()]);
      }
    });
  };
  storage.ready = async () => {
    const result = await storage.query("SELECT version FROM schema_migrations WHERE version = '002'");
    if (!result.rows.length) throw new Error('Run npm run db:migrate before starting this deployment.');
    await storage.query('SELECT id FROM waitlist_intakes LIMIT 0');
    await storage.query('SELECT id FROM newsletter_subscriptions LIMIT 0');
    await storage.query('SELECT request_key FROM request_receipts LIMIT 0');
  };
  storage.capture = async (kind, payload, key) => {
    const hash = createHash('sha256').update(JSON.stringify({ kind, payload })).digest('hex');
    return storage.transaction(async query => {
      const receipt = randomUUID();
      const now = new Date().toISOString();
      const inserted = await query(
        'INSERT INTO request_receipts(request_key, payload_hash, receipt_id, created_at) VALUES ($1,$2,$3,$4) ON CONFLICT (request_key) DO NOTHING RETURNING receipt_id',
        [key, hash, receipt, now]);
      if (!inserted.rows.length) {
        const existing = (await query('SELECT payload_hash, receipt_id FROM request_receipts WHERE request_key=$1', [key])).rows[0];
        if (existing.payload_hash !== hash) throw new HttpError(409, 'REQUEST_CONFLICT', 'This request key was already used for different details.');
        return { id: existing.receipt_id, status: 'accepted' };
      }
      if (kind === 'intake') {
        await query(
          'INSERT INTO waitlist_intakes(id,name,email,price_range,selected_plan,policy_version,marketing_consent,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (email) DO NOTHING',
          [randomUUID(), payload.name, payload.email, payload.priceRange, payload.selectedPlan, payload.policyVersion, payload.marketingConsent, now]);
      } else {
        await query(
          'INSERT INTO newsletter_subscriptions(id,email,policy_version,marketing_consent,created_at) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (email) DO NOTHING',
          [randomUUID(), payload.email, payload.policyVersion, true, now]);
      }
      // A receipt acknowledges acceptance, never exposes an intake ID or existing signup details.
      return { id: receipt, status: 'accepted' };
    });
  };
  try {
    if (migrate || (!databaseUrl && !production)) await storage.migrate();
    await storage.ready();
    return storage;
  } catch (error) { await storage.close(); throw error; }
}
