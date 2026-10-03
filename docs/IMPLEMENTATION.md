# Review fixes implemented

Source review: `.codex-reviews/YummyFitWeb-review.md` in the surrounding workspace. Changes are isolated to the YummyFitWeb clone on `codex/reliability-fixes`.

| Finding | Implementation |
| --- | --- |
| F1: fake waitlist success | Express intake endpoint, transactional PostgreSQL/SQLite adapters, migration, validated contract, confirmed response, timeout and retry handling, UUID idempotency and duplicate protection. Removed confirmation-email promise. |
| F2: inert CTAs | Native anchors carry a stable membership enum into the intake form. Pricing CTAs explicitly register interest without claiming payment or reservation. |
| F3: legal URLs | Distinct React routes and initial privacy/terms/cookies documents; Node handles direct loads and unknown-page HTTP 404. Unknown APIs never return HTML. |
| F4: incorrect launch instructions | README documents Node 24, development API proxy, build and Node serving. Legacy scripts/styles/audit wrappers archived. |
| F5: missing fragments | Features and feedback sections mounted; about/FAQ added; centralized navigation, native hashes, scroll margin and focusable targets. Replaced unsupported testimonials before mounting feedback. |
| F6: discarded newsletter | Independent consent-required endpoint and table, accessible form, pending state and confirmed success/error feedback. |
| F7: placeholder footer | Unavailable destinations removed; remaining links resolve to sections or legal pages. |
| F8: generic/broken external links | Configurable specific profile URLs; unavailable profiles/contact hidden; repository link supplied. Deployment contact check requires a real mailbox domain with MX records. |
| F9: advisories/quality gates | Compatible Vite 8/Tailwind 4 migration, Node runtime pin, clean dependency audit, backend and desktop/mobile browser tests, root/subdirectory checks and PostgreSQL service CI. |

## Verification

`npm run check` builds and type-checks, exercises real SQLite commit/read-back, concurrent retries, duplicate semantics, validation, rollback/recovery, origin checks, rate limits, readiness and deployment smoke checks, then audits dependencies.

`npm run test:e2e` exercises all rendered internal links and five conversion CTAs, mobile navigation, legal direct loads/reloads, deliberate 404s, actual database-backed submissions, validation, unavailable API and timeout behavior. It also captures desktop/mobile screenshots and checks for horizontal overflow and JavaScript exceptions. The same suite runs against `/YummyFitWeb/` in CI.

The PostgreSQL integration test runs only with `TEST_DATABASE_URL` pointing to a disposable database. CI supplies PostgreSQL 17; it does not substitute for testing a deployed provider's TLS, credentials and network access.

## Deployment inputs still required

Supply a working operator contact address and review the initial legal policies; build with the chosen public configuration. Configure/migrate a persistent production database and test its actual connection. Set the site base consistently for build/runtime. No email delivery is implemented or promised. Multi-instance deployments require a shared gateway/store rate limiter. See DEPLOYMENT.md for operating details.

The review fixes were pushed to `codex/reliability-fixes`. Supabase/GitHub Pages deployment configuration is documented separately in SUPABASE-PAGES.md; publication requires the target project and public contact configuration.
