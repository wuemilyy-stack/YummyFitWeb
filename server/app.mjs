import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { PAGE_PATHS } from '../shared/contracts.ts';
import { HttpError, validateSignup, requestKey } from './validation.mjs';

export function createApp({ storage, distDir = resolve('dist'), base = '/', origins = [], connectOrigins = [], rateMax = 30, trustProxy = 0, logger = console } = {}) {
  if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base)) throw new Error('Site base must be an absolute directory path ending in /.');
  if (!Number.isInteger(trustProxy) || trustProxy < 0) throw new Error('TRUST_PROXY_HOPS must be a nonnegative integer.');
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', trustProxy);
  app.use(helmet({
    contentSecurityPolicy: { directives: {
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'connect-src': ["'self'", ...connectOrigins],
      'upgrade-insecure-requests': process.env.NODE_ENV === 'production' ? [] : null,
    }},
    strictTransportSecurity: process.env.NODE_ENV === 'production' ? undefined : false,
  }));
  const router = express.Router();
  const api = express.Router();
  api.use((req, res, next) => {
    req.requestId = randomUUID();
    res.set('Cache-Control', 'no-store');
    res.set('X-Request-Id', req.requestId);
    const origin = req.get('Origin');
    const ownOrigin = `${req.protocol}://${req.get('host')}`;
    if (origin && origin !== ownOrigin && !origins.includes(origin))
      return next(new HttpError(403, 'ORIGIN_NOT_ALLOWED', 'This origin is not allowed.'));
    next();
  });
  api.use(cors({ origin: (origin, cb) => cb(null, !origin || origins.includes(origin)),
    methods: ['GET', 'POST', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Idempotency-Key'] }));
  api.get('/health/live', (_req, res) => res.json({ status: 'ok' }));
  api.get('/health/ready', async (_req, res) => {
    try { await storage.ready(); res.json({ status: 'ready' }); }
    catch { res.status(503).json({ error: { code: 'DATABASE_UNAVAILABLE', message: 'Service temporarily unavailable.' } }); }
  });
  api.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: rateMax, standardHeaders: 'draft-8', legacyHeaders: false,
    message: { error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } } }));
  api.use(express.json({ limit: '8kb', strict: true }));
  for (const [route, kind] of [['/intakes', 'intake'], ['/newsletter', 'newsletter']]) {
    api.post(route, async (req, res) => {
      if (!req.is('application/json')) throw new HttpError(415, 'JSON_REQUIRED', 'Send application/json.');
      const payload = validateSignup(req.body, kind);
      const key = requestKey(req.get('Idempotency-Key'));
      const result = await storage.capture(kind, payload, key);
      res.status(200).json(result);
    });
  }
  api.use((_req, _res, next) => next(new HttpError(404, 'NOT_FOUND', 'API endpoint not found.')));
  api.use((error, req, res, _next) => {
    let status = error.status || 503;
    let code = error instanceof HttpError ? error.code : 'DATABASE_UNAVAILABLE';
    let message = error instanceof HttpError ? error.message : 'We could not save your signup. Please try again.';
    if (error.type === 'entity.too.large') { status = 413; code = 'BODY_TOO_LARGE'; message = 'Request is too large.'; }
    if (error instanceof SyntaxError && error.status === 400) { code = 'INVALID_JSON'; message = 'Invalid JSON.'; }
    if (!(error instanceof HttpError) && status >= 500)
      logger.error(JSON.stringify({ event: 'request_failed', requestId: req.requestId, code: 'DATABASE_UNAVAILABLE' }));
    res.status(status).json({ error: { code, message, ...(error.fields ? { fields: error.fields } : {}) } });
  });
  router.use('/api', api);
  // Missing APIs/assets must never be rewritten to the homepage.
  router.use(express.static(distDir, { index: false, fallthrough: true, dotfiles: 'deny' }));
  router.get(/.*/, (req, res) => {
    const known = PAGE_PATHS.includes(req.path);
    if (!existsSync(resolve(distDir, 'index.html'))) return res.status(404).type('text').send('Build the frontend with npm run build.');
    if (known || (req.accepts('html') && !req.path.split('/').at(-1).includes('.')))
      return res.status(known ? 200 : 404).sendFile(resolve(distDir, 'index.html'), { dotfiles: 'allow' });
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Resource not found.' } });
  });
  app.use(base === '/' ? '/' : base.slice(0, -1), router);
  app.use((_req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Resource not found.' } }));
  return app;
}
