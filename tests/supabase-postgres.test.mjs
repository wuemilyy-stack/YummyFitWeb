import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID, createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import pg from 'pg';
import { POLICY_VERSION } from '../shared/contracts.ts';
test('Supabase SQL transaction, concurrency, consent, rate limit and private access', { skip: !process.env.TEST_DATABASE_URL }, async () => {
  const pool = new pg.Pool({ connectionString: process.env.TEST_DATABASE_URL });
  const keys = []; const suffix = randomUUID();
  const email = `supabase-test-${suffix}@example.com`;
  const clientHash = createHash('sha256').update(suffix).digest('hex');
  const payload = { name: 'Supabase SQL Test', email, selectedPlan: null, marketingConsent: false, policyVersion: POLICY_VERSION };
  const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
  const capture = async (key, body = payload, kind = 'intake') => {
    keys.push(key);
    const result = await pool.query('SELECT public.yummyfit_web_capture($1,$2::jsonb,$3::uuid,$4,$5) AS receipt', [kind, JSON.stringify(body), key, hash(body), clientHash]);
    return result.rows[0].receipt;
  };
  try {
    // Only TEST_DATABASE_URL, explicitly disposable, may receive test roles.
    await pool.query(`DO $$ BEGIN
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='anon') THEN CREATE ROLE anon; END IF;
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='authenticated') THEN CREATE ROLE authenticated; END IF;
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='service_role') THEN CREATE ROLE service_role; END IF;
    END $$;`);
    await pool.query(readFileSync(new URL('../supabase/migrations/20261003000100_yummyfit_web.sql', import.meta.url), 'utf8'));
    await pool.query(readFileSync(new URL('../supabase/migrations/20261003000200_optional_price.sql', import.meta.url), 'utf8'));
    const key = randomUUID();
    const receipts = await Promise.all(Array.from({ length: 8 }, () => capture(key)));
    assert.equal(new Set(receipts.map(result => result.id)).size, 1);
    assert.equal((await pool.query('SELECT * FROM yummyfit_web.waitlist_intakes WHERE email=$1', [email])).rows.length, 1);
    assert.equal((await pool.query('SELECT price_range FROM yummyfit_web.waitlist_intakes WHERE email=$1', [email])).rows[0].price_range, null);
    assert.equal((await capture(key, { ...payload, name: 'Changed' })).error, 'REQUEST_CONFLICT');
    const badKey = randomUUID();
    await assert.rejects(capture(badKey, { ...payload, priceRange: 'invalid' }));
    assert.equal((await pool.query('SELECT * FROM yummyfit_web.request_receipts WHERE request_key=$1', [badKey])).rows.length, 0);
    await assert.rejects(capture(randomUUID(), { email, policyVersion: POLICY_VERSION, marketingConsent: false }, 'newsletter'));
    assert.equal((await capture(randomUUID(), { email, policyVersion: POLICY_VERSION, marketingConsent: true }, 'newsletter')).status, 'accepted');
    // Ten committed calls above; reach the thirty-request limit.
    for (let index = 0; index < 20; index++) assert.equal((await capture(randomUUID())).status, 'accepted');
    const limitedKey = randomUUID();
    assert.equal((await capture(limitedKey)).error, 'RATE_LIMITED');
    assert.equal((await pool.query('SELECT * FROM yummyfit_web.request_receipts WHERE request_key=$1', [limitedKey])).rows.length, 0);
    const privileges = await pool.query(`SELECT has_schema_privilege('anon','yummyfit_web','USAGE') AS schema_access,
      has_function_privilege('anon','public.yummyfit_web_capture(text,jsonb,uuid,text,text)','EXECUTE') AS anon_capture,
      has_function_privilege('authenticated','public.yummyfit_web_capture(text,jsonb,uuid,text,text)','EXECUTE') AS user_capture,
      has_function_privilege('service_role','public.yummyfit_web_capture(text,jsonb,uuid,text,text)','EXECUTE') AS server_capture`);
    assert.deepEqual(privileges.rows[0], { schema_access: false, anon_capture: false, user_capture: false, server_capture: true });
    const tables = await pool.query("SELECT relrowsecurity FROM pg_class JOIN pg_namespace ON pg_class.relnamespace=pg_namespace.oid WHERE nspname='yummyfit_web' AND relkind='r'");
    assert.equal(tables.rows.length, 4); assert.ok(tables.rows.every(table => table.relrowsecurity));
  } finally {
    await pool.query('DELETE FROM yummyfit_web.waitlist_intakes WHERE email=$1', [email]).catch(() => {});
    await pool.query('DELETE FROM yummyfit_web.newsletter_subscriptions WHERE email=$1', [email]).catch(() => {});
    await pool.query('DELETE FROM yummyfit_web.request_receipts WHERE request_key=ANY($1::uuid[])', [keys]).catch(() => {});
    await pool.query('DELETE FROM yummyfit_web.rate_limits WHERE client_hash=$1', [clientHash]).catch(() => {});
    await pool.end();
  }
});
