import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createSupabaseHandler } from '../server/supabase-handler.mjs';
import { POLICY_VERSION } from '../shared/contracts.ts';
const base = 'https://example.supabase.co/functions/v1/yummyfit-web-api';
const payload = { name: 'Edge Test', email: ' TEST@EXAMPLE.COM ', priceRange: '10-19', selectedPlan: null, marketingConsent: false, policyVersion: POLICY_VERSION };
const request = (body = payload, extra = {}, path = '/intakes') => new Request(base + path, {
  method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': randomUUID(), origin: 'https://wuemilyy-stack.github.io', ...extra }, body: JSON.stringify(body),
});
function fixture(fetcher) { return createSupabaseHandler({ url: 'https://example.supabase.co', serviceKey: 'server-only-secret', origins: ['https://wuemilyy-stack.github.io'], fetcher }); }
test('Edge validates and normalizes data, forwards only server credentials, and acknowledges a database receipt', async () => {
  let captured;
  const handler = fixture(async (_url, options) => {
    captured = JSON.parse(options.body);
    assert.equal(options.headers.apikey, 'server-only-secret');
    return Response.json({ id: randomUUID(), status: 'accepted' });
  });
  const response = await handler(request());
  assert.equal(response.status, 200);
  assert.equal(captured.p_payload.email, 'test@example.com');
  assert.equal(captured.p_client_hash.length, 64);
  assert.ok(!JSON.stringify(captured).includes('server-only-secret'));
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://wuemilyy-stack.github.io');
});
test('Edge rejects invalid, oversized and disallowed-origin requests before database access', async () => {
  const handler = fixture(async () => { throw new Error('Should not call database'); });
  assert.equal((await handler(request({ ...payload, priceRange: 'invalid' }))).status, 422);
  assert.equal((await handler(request({ ...payload, name: 'x'.repeat(9000) }))).status, 413);
  assert.equal((await handler(request(payload, { origin: 'https://untrusted.example' }))).status, 403);
  assert.equal((await handler(request(payload, { 'Idempotency-Key': 'bad' }))).status, 400);
  assert.equal((await handler(request(payload, {}, '/unknown'))).status, 404);
  assert.equal((await handler(request({ email: 'test@example.com', marketingConsent: false, policyVersion: POLICY_VERSION }, {}, '/newsletter'))).status, 422);
});
test('Edge handles preflight, readiness, conflicts, rate limits and database failure', async () => {
  assert.equal((await fixture(async () => {})(new Request('https://edge.runtime/yummyfit-web-api/health/live'))).status, 200);
  assert.equal((await fixture(async () => Response.json({ status: 'ready' }))(new Request(base + '/health/ready'))).status, 200);
  assert.equal((await fixture(async () => {})(new Request(base + '/intakes', { method: 'OPTIONS', headers: { origin: 'https://wuemilyy-stack.github.io' } }))).status, 204);
  for (const [error, status] of [['REQUEST_CONFLICT',409],['RATE_LIMITED',429]]) {
    assert.equal((await fixture(async () => Response.json({ error }))(request())).status, status);
  }
  const failed = await fixture(async () => { throw new Error('secret database details'); })(request());
  assert.equal(failed.status, 503);
  assert.ok(!(await failed.text()).includes('secret database details'));
});
