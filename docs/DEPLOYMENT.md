# Deployment and operating checklist

Use Node 24. The supported production topology is the Node application serving built dist/ and the same-origin API, with PostgreSQL for multiple instances. Local development uses a real, persistent SQLite file.

1. Copy .env.example to .env and supply DATABASE_URL. Optional VITE_CONTACT_EMAIL must be a real operational mailbox; otherwise the maintainer issue page provides the contact destination, with a warning against public personal information. Optional social profiles remain hidden unless configured. Run npm run check:deployment to validate the contact destination or mailbox MX records.
2. Review the included privacy/terms/cookies copy against the actual operator, hosting providers, retention practices, and planned launch. These are initial policy documents, not a legal sign-off.
3. Run npm ci, npm run check, npm run build, and npm run db:migrate.
4. Use a dedicated runtime PostgreSQL role with CONNECT, schema USAGE, SELECT/INSERT on waitlist_intakes, newsletter_subscriptions and request_receipts, and SELECT on schema_migrations. Apply migrations with a separate schema owner. No public list/update endpoint exists. Updates, deletion and opt-out requests require verification by the operator before a privileged database change.
5. Set NODE_ENV=production and HOST=0.0.0.0 only in the deployment environment; run npm start behind HTTPS. TRUST_PROXY_HOPS must match the actual trusted proxy path, not arbitrary forwarded headers.
6. Configure PostgreSQL TLS through the database URL/provider CA. Do not disable certificate verification. Runtime connections and statements have bounded timeouts; migrations are transactional and versioned.
7. Run npm run smoke with SMOKE_BASE_URL set to the deployed URL, including a trailing /. This is read-only and checks readiness, routes, assets, unknown paths, and API isolation.
8. Exercise a synthetic signup in staging, then verify the row from a privileged connection. Do not seed real-user data in CI.
9. Backup the database and test restore. Keep the SQLite file on a persistent volume if explicitly choosing a single-instance SQLite deployment; never use an ephemeral serverless filesystem.
10. Document and operate retention, verified privacy-request handling, and unsubscribe handling before sending any email. No email sending is implemented and the UI does not promise immediate confirmation.
11. The current rate limiter is per process. Add a shared limiter at the gateway/store before running multiple public instances. Deploy the included CSP and other security headers through the Node app; static-only hosts need equivalent headers.
12. CI includes a disposable PostgreSQL service and SQLite tests. A live PostgreSQL deployment still requires its own connection/TLS/read-back smoke test.

## Subdirectory/static hosting
Set VITE_SITE_BASE=/YummyFitWeb/ before build and use the same value in the Node runtime. All assets, legal links and same-origin API requests respect this base. BrowserRouter uses the matching basename. Unknown pages return HTTP 404 from the Node server.

GitHub Pages can host dist/ but cannot run this API. A static-only deployment needs a separately deployed API, VITE_API_BASE_URL, explicit CORS_ORIGINS, and hosting-specific legal/deep-link fallback behavior. Vite preview is for local inspection and does not implement the backend. The supported Node deployment provides correct direct loads and HTTP status codes without blanket SPA rewrites.

## Intake semantics
POST /api/intakes and POST /api/newsletter require application/json and a UUID Idempotency-Key. The response contains an acceptance receipt, not a customer identifier. A repeated key/payload returns the same receipt; changed payload with the same key returns 409. A repeated normalized email with a fresh key is accepted without overwriting the original entry or marketing preference. There is no unauthenticated update/read endpoint. Newsletter signup requires explicit consent; optional waitlist marketing consent defaults to false in the UI.

## Development/build dependencies
Vite 8 and Tailwind 4 replace the affected Vite 5/Tailwind 3 chains. Tailwind 4 requires modern browsers (Safari 16.4+, Chrome 111+, Firefox 128+). The existing palette and custom utilities remain in tailwind.config.js, explicitly loaded from src/index.css. npm audit checks all dependencies in CI.
