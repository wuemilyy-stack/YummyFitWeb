# YummyFitWeb
React/TypeScript pre-launch website with working navigation, legal routes, durable waitlist and newsletter capture, and automated checks.

## Run locally
Requires Node 24 (see .nvmrc).
```sh
npm ci
# Copy .env.example to .env if custom configuration is needed.
npm run dev
```
Open http://127.0.0.1:5173. This starts both Vite and the API on port 3001. The local database persists in var/yummyfit.sqlite. Opening index.html directly or serving the source folder with Python will not run this application.

## Build and serve
```sh
npm run build
npm start
```
Open http://127.0.0.1:3001. The Node server serves dist/, legal pages, and the API. npm run preview is frontend-only inspection.

## Database
Local SQLite migrations apply automatically in development. PostgreSQL requires a server-only DATABASE_URL and an explicit migration:
```sh
npm run db:migrate
```
Intake succeeds only after a committed database write. Duplicate emails are accepted without overwriting the original. Newsletter capture requires consent. Confirmation emails are not sent.

## Checks
```sh
npm run build
npm test
npx playwright install chromium
npm run test:e2e
npm audit
npm run smoke
```
Browser tests start a production-style local Node server with a disposable SQLite database. PostgreSQL tests run when TEST_DATABASE_URL points to a disposable test database (CI supplies one). Set E2E_SITE_BASE=/YummyFitWeb/ and build with VITE_SITE_BASE=/YummyFitWeb/ to verify subdirectory hosting.
If the browser download is unavailable locally, use installed Chrome with PLAYWRIGHT_CHANNEL=chrome (PowerShell: $env:PLAYWRIGHT_CHANNEL='chrome'). CI uses Playwright's bundled Chromium.

## Deployment
See docs/DEPLOYMENT.md for database roles, TLS, contact configuration, migrations, readiness, base paths, privacy operations, and static-host limitations. Never expose DATABASE_URL in VITE_* variables. Before public deployment:
```sh
npm run check:deployment
```
Optional social/contact destinations are configured through .env; unavailable profiles are hidden. Frontend variables are baked into the build, so rebuild after changes.

The prior static scripts and audit wrappers are archived under archive/legacy/. The active application lives in src/ and server/.
