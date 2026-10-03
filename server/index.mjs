import { createServer } from 'node:http';
import { createApp } from './app.mjs';
import { openStorage } from './storage.mjs';
import { assertProductionConfig } from '../scripts/check-config.mjs';

if (process.env.NODE_ENV === 'production') assertProductionConfig();

const storage = await openStorage({
  databaseUrl: process.env.DATABASE_URL,
  databaseFile: process.env.DATABASE_FILE,
  production: process.env.NODE_ENV === 'production',
});
const origins = (process.env.CORS_ORIGINS || '').split(',').filter(Boolean).map(value => {
  const url = new URL(value.trim());
  if (!['http:', 'https:'].includes(url.protocol) || url.origin !== value.trim()) throw new Error('CORS_ORIGINS must contain exact HTTP(S) origins.');
  return url.origin;
});
const apiUrl = process.env.VITE_API_BASE_URL;
const connectOrigins = apiUrl && /^https?:\/\//.test(apiUrl) ? [new URL(apiUrl).origin] : [];
const app = createApp({ storage, origins, connectOrigins, base: process.env.VITE_SITE_BASE || '/',
  trustProxy: Number(process.env.TRUST_PROXY_HOPS || 0) });
const server = createServer(app);
server.requestTimeout = 10000;
server.headersTimeout = 10000;
server.keepAliveTimeout = 5000;
server.listen(Number(process.env.API_PORT || 3001), process.env.HOST || '127.0.0.1', () => {
  console.log(JSON.stringify({ event: 'server_started', port: server.address().port }));
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {
  server.close(async () => { await storage.close(); process.exit(0); });
});
