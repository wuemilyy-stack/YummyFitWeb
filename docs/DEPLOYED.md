# Deployment record — October 3, 2026

- Website: https://wuemilyy-stack.github.io/YummyFitWeb/
- Supabase project: https://supabase.com/dashboard/project/nzhjnzovbxznzadtbzgm
- API base: https://nzhjnzovbxznzadtbzgm.supabase.co/functions/v1/yummyfit-web-api
- Application release: `ef9d680b2ecdd7d008488b54cb28be25a6bd910b`, pushed to master and codex/reliability-fixes.
- Successful Pages release workflow: https://github.com/wuemilyy-stack/YummyFitWeb/actions/runs/37119541094
- Successful reliability workflow: https://github.com/wuemilyy-stack/YummyFitWeb/actions/runs/37119541067

The SQL migration was applied to the new YummyFitWeb project in the YummyFitweb organization. Readiness returned ready; anonymous schema access and direct write-RPC execution both returned false. The function was deployed through the dashboard with a commit-pinned import of the reviewed handler and https://wuemilyy-stack.github.io as the allowed origin. Public signup requests use the approved disabled legacy-JWT gateway check; private tables and server-only RPC credentials remain protected.

Live API checks passed for database readiness, intake acceptance, identical retry receipt, changed-payload conflict, invalid-price rejection, foreign-origin rejection, newsletter capture, CORS preflight and API 404. Newsletter persistence was read back in the dashboard. A synthetic signup from the deployed browser form displayed confirmed success. Two labeled example.com test intakes and one test newsletter entry were used; an operator may remove these synthetic records through the protected database console.

The deployed website passed desktop/mobile checks for rendered links and fragment targets, legal direct loads and reloads, intentional HTTP 404, no horizontal overflow and no JavaScript exceptions. Built JS/CSS and favicon resolved with the expected content types. CI also passed SQLite and disposable PostgreSQL tests, Supabase RPC permission/transaction/rate-limit tests and both root/subdirectory browser suites.

The contact channel is the repository maintainer issue page. The UI requests private contact and tells visitors not to publish personal signup data. No working mailbox is claimed, and no confirmation email is promised or sent.

Supabase GitHub integration was already enabled when the project became available. Initial schema setup was executed manually; the checked-in migration remains the source for future managed migration runs. Netlify was superseded by the requested Supabase/GitHub Pages deployment and was not deployed.

## Gmail workflow deployment — October 3, 2026

The private email outbox, Gmail worker and background dispatch are deployed. A one-minute cron job invokes the JWT-protected worker with a separate private token; both scheduling credentials are stored in Vault. Public API readiness returns 200. Live schema drift had removed price_range, so migration 004 restored it as nullable to keep the capture RPC working without restoring the form question.

The delivery test created two jobs addressed to yummyfitsupport@gmail.com: a subscriber welcome and a support notification. Gmail authentication returned EAUTH / 535. Neither email was delivered; the jobs remain eligible for retry. Replace GMAIL_APP_PASSWORD with an app password for that exact Gmail account, verify the protected ?check=smtp endpoint, then inspect queue sent status and the inbox before claiming email delivery is enabled.
