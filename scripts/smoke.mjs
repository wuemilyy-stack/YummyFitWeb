import assert from 'node:assert/strict';
const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3001/';
const url = new URL(base);
if (!url.pathname.endsWith('/')) throw new Error('SMOKE_BASE_URL must end in /.');
for (const path of ['', 'privacy', 'terms', 'cookies', 'favicon.svg', 'api/health/ready']) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(10000) });
  assert.equal(response.status, 200, `${path} must resolve`);
  if (path === '') {
    const html = await response.text();
    const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map(match => match[1]);
    assert.ok(assets.some(asset => asset.endsWith('.js')), 'Built JavaScript must be referenced');
    for (const asset of assets) {
      const result = await fetch(new URL(asset, base), { signal: AbortSignal.timeout(10000) });
      assert.equal(result.status, 200, `${asset} must resolve`);
      assert.match(result.headers.get('content-type'), asset.endsWith('.js') ? /javascript/ : /css/);
    }
  }
  if (path === 'api/health/ready') assert.equal((await response.json()).status, 'ready');
}
const missingApi = await fetch(new URL('api/nonexistent', base), { signal: AbortSignal.timeout(10000) });
assert.equal(missingApi.status, 404);
assert.match(missingApi.headers.get('content-type'), /json/);
assert.equal((await fetch(new URL('missing-page', base), { signal: AbortSignal.timeout(10000) })).status, 404);
console.log('Routes, assets, API isolation, and database readiness passed.');
