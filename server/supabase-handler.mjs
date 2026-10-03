import { HttpError, requestKey, validateSignup } from './validation.mjs';
const MAX_BYTES = 8192;
async function digest(value) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('');
}
async function readBody(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, 'INVALID_JSON', 'Send a JSON body.');
  const chunks = []; let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > MAX_BYTES) { await reader.cancel(); throw new HttpError(413, 'BODY_TOO_LARGE', 'Request is too large.'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw new HttpError(400, 'INVALID_JSON', 'Invalid JSON.'); }
}
export function createSupabaseHandler({ url, serviceKey, origins, fetcher = fetch, onCapture }) {
  const allowed = new Set(origins);
  async function rpc(name, body) {
    if (!url || !serviceKey) throw new Error('Missing server configuration');
    const response = await fetcher(`${url}/rest/v1/rpc/${name}`, {
      method: 'POST', headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body), signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('Database operation failed');
    return response.json();
  }
  return async request => {
    const requestId = crypto.randomUUID();
    const origin = request.headers.get('origin');
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
      'X-Request-Id': requestId, Vary: 'Origin',
      ...(origin && allowed.has(origin) ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Idempotency-Key', 'Access-Control-Max-Age': '600' } : {}) };
    const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });
    try {
      if (origin && !allowed.has(origin)) throw new HttpError(403, 'ORIGIN_NOT_ALLOWED', 'This origin is not allowed.');
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
      const pathname = new URL(request.url).pathname.replace(/^\/(?:functions\/v1\/)?yummyfit-web-api(?=\/|$)/, '');
      if (request.method === 'GET' && pathname === '/health/live') return json({ status: 'ok' });
      if (request.method === 'GET' && pathname === '/health/ready') {
        await rpc('yummyfit_web_ready', {}); return json({ status: 'ready' });
      }
      const kind = pathname === '/intakes' ? 'intake' : pathname === '/newsletter' ? 'newsletter' : null;
      if (!kind || request.method !== 'POST') throw new HttpError(404, 'NOT_FOUND', 'API endpoint not found.');
      if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') || ''))
        throw new HttpError(415, 'JSON_REQUIRED', 'Send application/json.');
      const payload = validateSignup(await readBody(request), kind);
      const key = requestKey(request.headers.get('idempotency-key'));
      // Supabase's gateway forwards the network address; only a salted digest is stored.
      const network = (request.headers.get('x-forwarded-for') || 'unknown').split(',').at(-1).trim();
      const result = await rpc('yummyfit_web_capture', { p_kind: kind, p_payload: payload, p_key: key,
        p_hash: await digest(JSON.stringify({ kind, payload })), p_client_hash: await digest(serviceKey + network) });
      if (result.error === 'RATE_LIMITED') throw new HttpError(429, 'RATE_LIMITED', 'Too many requests. Please try again later.');
      if (result.error === 'REQUEST_CONFLICT') throw new HttpError(409, 'REQUEST_CONFLICT', 'This request key was already used for different details.');
      if (result.status !== 'accepted' || typeof result.id !== 'string') throw new Error('Invalid database receipt');
      // Email is queued transactionally; dispatch failure must not turn a saved signup into an error.
      if (onCapture) { try { onCapture(); } catch { console.error(JSON.stringify({ event: 'email_dispatch_unavailable' })); } }
      return json(result);
    } catch (error) {
      if (error instanceof HttpError) return json({ error: { code: error.code, message: error.message, ...(error.fields ? { fields: error.fields } : {}) } }, error.status);
      console.error(JSON.stringify({ event: 'supabase_request_failed', requestId }));
      return json({ error: { code: 'DATABASE_UNAVAILABLE', message: 'We could not save your signup. Please try again.' } }, 503);
    }
  };
}
