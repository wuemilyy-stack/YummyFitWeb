import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { openStorage } from '../server/storage.mjs';
import { POLICY_VERSION } from '../shared/contracts.ts';
test('PostgreSQL migration, concurrent commit/read-back, retry conflict and rollback', { skip: !process.env.TEST_DATABASE_URL }, async () => {
  // TEST_DATABASE_URL must point at a disposable test DB, never production.
  const storage = await openStorage({ databaseUrl: process.env.TEST_DATABASE_URL, migrate: true });
  const suffix = randomUUID();
  const email = `test-${suffix}@example.com`;
  const key = randomUUID();
  const payload = { name: 'Postgres Test', email, priceRange: '20-29', selectedPlan: 'founding', marketingConsent: false, policyVersion: POLICY_VERSION };
  const keys = [key];
  try {
    const results = await Promise.all(Array.from({ length: 8 }, () => storage.capture('intake', payload, key)));
    assert.equal(new Set(results.map(result => result.id)).size, 1);
    const readback = await storage.query('SELECT * FROM waitlist_intakes WHERE email=$1', [email]);
    assert.equal(readback.rows.length, 1); assert.equal(readback.rows[0].selected_plan, 'founding');
    await assert.rejects(storage.capture('intake', { ...payload, name: 'Changed' }, key), { status: 409 });
    const invalidKey = randomUUID(); keys.push(invalidKey);
    await assert.rejects(storage.capture('intake', { ...payload, email: `invalid-${suffix}@example.com`, priceRange: 'invalid' }, invalidKey));
    assert.equal((await storage.query('SELECT * FROM request_receipts WHERE request_key=$1', [invalidKey])).rows.length, 0);
  } finally {
    await storage.query('DELETE FROM waitlist_intakes WHERE email=$1', [email]);
    for (const request of keys) await storage.query('DELETE FROM request_receipts WHERE request_key=$1', [request]);
    await storage.close();
  }
});
