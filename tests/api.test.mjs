import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { createServer } from 'node:http';
import { openStorage } from '../server/storage.mjs';
import { createApp } from '../server/app.mjs';
import { POLICY_VERSION } from '../shared/contracts.ts';

const payload = { name: 'Test Person', email: 'test@example.com', priceRange: '10-19',
  selectedPlan: 'premium', marketingConsent: false, policyVersion: POLICY_VERSION };
async function fixture(t, options = {}) {
  const directory = mkdtempSync(join(tmpdir(), 'yummyfit-test-'));
  const databaseFile = join(directory, 'test.sqlite');
  const storage = await openStorage({ databaseFile });
  const server = createServer(createApp({ storage, ...options }));
  await new Promise(resolveListen => server.listen(0, '127.0.0.1', resolveListen));
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    server.closeAllConnections();
    await new Promise(resolveClose => server.close(resolveClose));
    await storage.close();
    if (!resolve(directory).startsWith(resolve(tmpdir()) + sep + 'yummyfit-test-')) throw new Error('Unsafe cleanup path');
    rmSync(directory, { recursive: true, force: true });
  });
  const post = (body = payload, key = randomUUID(), route = '/api/intakes', headers = {}) => fetch(base + route, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key, ...headers }, body: JSON.stringify(body),
  });
  return { base, storage, post, databaseFile };
}

test('optional-price migration preserves existing answers and can run twice', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'yummyfit-test-'));
  const databaseFile = join(directory, 'legacy.sqlite');
  try {
    const db = new DatabaseSync(databaseFile);
    db.exec(readFileSync(new URL('../server/migrations/001-intake.sql', import.meta.url), 'utf8'));
    db.prepare('INSERT INTO waitlist_intakes VALUES (?,?,?,?,?,?,?,?)').run(randomUUID(), payload.name, payload.email, payload.priceRange, payload.selectedPlan, POLICY_VERSION, 0, new Date().toISOString());
    db.close();
    const storage = await openStorage({ databaseFile });
    try {
      await storage.migrate();
      assert.equal((await storage.query('SELECT price_range FROM waitlist_intakes')).rows[0].price_range, '10-19');
      await storage.capture('intake', { ...payload, email: 'no-price@example.com', priceRange: null }, randomUUID());
      assert.equal((await storage.query("SELECT price_range FROM waitlist_intakes WHERE email='no-price@example.com'")).rows[0].price_range, null);
    } finally { await storage.close(); }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('intake without a price is stored as unknown, never as an invented answer', async t => {
  const { storage, post } = await fixture(t);
  const { priceRange, ...withoutPrice } = payload;
  assert.equal((await post(withoutPrice)).status, 200);
  assert.equal((await storage.query('SELECT price_range FROM waitlist_intakes')).rows[0].price_range, null);
});

test('valid intake is committed, normalized and survives a new database connection', async t => {
  const { storage, post, databaseFile } = await fixture(t);
  const response = await post({ ...payload, name: ' Test Person ', email: ' TEST@EXAMPLE.COM ' });
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.status, 'accepted');
  const observer = await openStorage({ databaseFile });
  try {
    const rows = (await observer.query('SELECT * FROM waitlist_intakes')).rows;
    assert.equal(rows.length, 1); assert.equal(rows[0].email, 'test@example.com');
    assert.equal(rows[0].name, 'Test Person'); assert.equal(rows[0].selected_plan, 'premium');
    assert.equal(Boolean(rows[0].marketing_consent), false); assert.equal(rows[0].policy_version, POLICY_VERSION);
    assert.notEqual(result.id, rows[0].id);
  } finally { await observer.close(); }
  await storage.ready();
});
test('concurrent retries return one receipt and one intake', async t => {
  const { post, storage } = await fixture(t);
  const key = randomUUID();
  const results = await Promise.all(Array.from({ length: 8 }, async () => {
    const response = await post(payload, key); assert.equal(response.status, 200); return response.json();
  }));
  assert.equal(new Set(results.map(row => row.id)).size, 1);
  assert.equal((await storage.query('SELECT * FROM waitlist_intakes')).rows.length, 1);
  assert.equal((await storage.query('SELECT * FROM request_receipts')).rows.length, 1);
});
test('fresh-key duplicate does not overwrite original details or consent', async t => {
  const { post, storage } = await fixture(t);
  const original = await (await post()).json();
  const duplicate = await (await post({ ...payload, name: 'Other Person', email: 'TEST@example.com', marketingConsent: true })).json();
  assert.notEqual(original.id, duplicate.id);
  const rows = (await storage.query('SELECT * FROM waitlist_intakes')).rows;
  assert.equal(rows.length, 1); assert.equal(rows[0].name, payload.name);
  assert.equal(Boolean(rows[0].marketing_consent), false);
});
test('same key with changed payload is a conflict and does not alter the record', async t => {
  const { post, storage } = await fixture(t); const key = randomUUID();
  await post(payload, key);
  const conflict = await post({ ...payload, email: 'different@example.com' }, key);
  assert.equal(conflict.status, 409);
  assert.equal((await conflict.json()).error.code, 'REQUEST_CONFLICT');
  assert.equal((await storage.query('SELECT * FROM waitlist_intakes')).rows.length, 1);
});
test('invalid and oversized fields are rejected without writes', async t => {
  const { post, storage } = await fixture(t);
  for (const invalid of [
    { ...payload, name: ' ' }, { ...payload, name: 'a'.repeat(121) }, { ...payload, email: 'bad' },
    { ...payload, priceRange: '999' }, { ...payload, selectedPlan: 'admin' },
    { ...payload, policyVersion: 'old' }, { ...payload, marketingConsent: 'true' },
    { ...payload, admin: true }, null, [],
  ]) assert.equal((await post(invalid)).status >= 400, true);
  assert.equal((await post(payload, '------------------------------------')).status, 400);
  assert.equal((await post({ ...payload, name: 'x'.repeat(9000) })).status, 413);
  assert.equal((await storage.query('SELECT * FROM waitlist_intakes')).rows.length, 0);
});
test('parameterized input cannot execute SQL', async t => {
  const { post, storage } = await fixture(t);
  const name = "Robert'); DROP TABLE waitlist_intakes; --";
  assert.equal((await post({ ...payload, name })).status, 200);
  assert.equal((await storage.query('SELECT name FROM waitlist_intakes')).rows[0].name, name);
});
test('database write failure rolls back the receipt and never reports success', async t => {
  const { storage, post } = await fixture(t);
  await storage.query('DROP TABLE waitlist_intakes');
  const response = await post();
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error.code, 'DATABASE_UNAVAILABLE');
  assert.equal((await storage.query('SELECT * FROM request_receipts')).rows.length, 0);
});
test('failed transaction can be retried with the same key after recovery', async t => {
  const { storage, post } = await fixture(t);
  const key = randomUUID();
  await storage.query('DROP TABLE waitlist_intakes');
  assert.equal((await post(payload, key)).status, 503);
  await storage.migrate();
  assert.equal((await post(payload, key)).status, 200);
  assert.equal((await storage.query('SELECT * FROM waitlist_intakes')).rows.length, 1);
});
test('newsletter requires consent and stores it independently', async t => {
  const { storage, post } = await fixture(t);
  const news = { email: payload.email, marketingConsent: true, policyVersion: POLICY_VERSION };
  assert.equal((await post({ ...news, marketingConsent: false }, randomUUID(), '/api/newsletter')).status, 422);
  assert.equal((await post(news, randomUUID(), '/api/newsletter')).status, 200);
  assert.equal((await post(news, randomUUID(), '/api/newsletter')).status, 200);
  assert.equal((await storage.query('SELECT * FROM newsletter_subscriptions')).rows.length, 1);
});
test('unknown API and unauthorized update/list never fall through to HTML', async t => {
  const { base } = await fixture(t);
  for (const path of ['/api/intakes', '/api/nonexistent']) {
    const response = await fetch(base + path); assert.equal(response.status, 404);
    assert.match(response.headers.get('content-type'), /application\/json/);
  }
  assert.equal((await fetch(base + '/api/intakes/test', { method: 'PATCH' })).status, 404);
  assert.equal((await fetch(base + '/privacy')).status, 200);
  assert.equal((await fetch(base + '/terms')).status, 200);
  assert.equal((await fetch(base + '/cookies')).status, 200);
  assert.equal((await fetch(base + '/unknown')).status, 404);
  assert.equal((await fetch(base + '/missing.js')).status, 404);
  assert.equal((await fetch(base + '/.env')).status, 404);
});
test('origin checks, rate limits and readiness return predictable errors', async t => {
  const { post, base } = await fixture(t, { rateMax: 1 });
  assert.equal((await post(payload, randomUUID(), '/api/intakes', { Origin: 'https://untrusted.example' })).status, 403);
  assert.equal((await post()).status, 200);
  assert.equal((await post()).status, 429);
  assert.equal((await fetch(base + '/api/health/ready')).status, 200);
});
test('subdirectory routes and APIs resolve without root leakage', async t => {
  const { base, post } = await fixture(t, { base: '/YummyFitWeb/' });
  assert.equal((await fetch(base + '/YummyFitWeb/privacy')).status, 200);
  assert.equal((await post(payload, randomUUID(), '/YummyFitWeb/api/intakes')).status, 200);
  assert.equal((await fetch(base + '/api/health/ready')).status, 404);
});
test('production storage refuses an implicit ephemeral/local fallback', async () => {
  await assert.rejects(openStorage({ production: true }), /Production requires/);
  await assert.rejects(openStorage({ production: true, databaseFile: ':memory:' }), /persistent storage/);
});

test('deployment smoke checks actual built assets and readiness', async t => {
  const { base, storage } = await fixture(t);
  await promisify(execFile)(process.execPath, ['scripts/smoke.mjs'], { env: { ...process.env, SMOKE_BASE_URL: base + '/' } });
  storage.sqlite.exec('DROP TABLE newsletter_subscriptions');
  assert.equal((await fetch(base + '/api/health/ready')).status, 503);
});
