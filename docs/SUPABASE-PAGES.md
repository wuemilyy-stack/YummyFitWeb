# Supabase backend and GitHub Pages website

The supported hosted split is a Supabase Edge Function and private PostgreSQL schema, with GitHub Pages serving the built React website. Supabase functions do not serve frontend HTML.

## Backend

Create or select the intended Supabase project. Apply `supabase/migrations/20261003000100_yummyfit_web.sql` through the Supabase SQL editor or an authenticated migration runner. The migration creates only the `yummyfit_web` schema and two specifically named RPC functions; it does not modify other app tables. Private tables have RLS enabled and no grants to anonymous/authenticated clients. Only the server-side service role can invoke the RPCs. A transaction returns an acceptance receipt after capturing the signup, preserves existing duplicate-email details and consent, and enforces shared rate limits (30 requests per salted network digest per 15-minute bucket).

Deploy `supabase/functions/yummyfit-web-api/index.ts` under the function name `yummyfit-web-api`, with JWT verification disabled because the signup endpoint is public. Server validation, body limits, allowed origins and database rate limits protect the endpoint; no public read/update/list route exists. Set the function secret `YUMMYFIT_WEB_ORIGINS=https://wuemilyy-stack.github.io`. Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the function environment. Never put the service key in frontend variables.

For dashboard deployment, `npm run build:edge` creates a self-contained TypeScript-compatible script at `var/supabase-edge.ts` to paste into the function editor. That generated file is ignored by Git. CLI alternative: `supabase functions deploy yummyfit-web-api --project-ref YOUR_PROJECT_REF --no-verify-jwt --use-api`.

The API base is `https://YOUR_PROJECT_REF.supabase.co/functions/v1/yummyfit-web-api`. Verify `/health/ready`, a synthetic committed signup, retries/conflicts, and denial of unauthenticated direct RPC/table access before publishing the website. Maintain database backups and retention/verified privacy requests as described in DEPLOYMENT.md.

## Website

Set these non-secret repository Actions variables:

- `VITE_API_BASE_URL`: the deployed Supabase API base above.
- `VITE_CONTACT_EMAIL`: a real operational privacy/support mailbox.

Enable GitHub Pages with source GitHub Actions. The Pages workflow builds with `/YummyFitWeb/` as its base and creates physical privacy/terms/cookies documents plus a deliberate 404 document. It runs on master pushes or manual workflow dispatch. GitHub Pages supplies HTTPS. Review the initial policy copy before public launch.

Production API readiness uses the Supabase endpoint; the Node-only `npm run smoke` script expects same-origin Node API routes. Check the Pages legal/asset URLs separately when using this split deployment.

## Verification

Run `npm run check`, `npm run build:edge`, and browser checks. `tests/supabase-handler.test.mjs` tests the Edge HTTP contract. The SQL migration and actual Supabase service still need live transaction/read-back and access-denial checks. Browser state never receives database credentials or the service-role key.
