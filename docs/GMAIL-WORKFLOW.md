# Gmail signup emails

Sender and reply-to: yummyfitsupport@gmail.com. A new waitlist or newsletter signup queues one welcome confirmation to the subscriber and one notification to this support inbox. These messages are confirmations; no promotional campaign or retroactive bulk send is enabled.

## Activation

1. Enable Google 2-Step Verification for the support account and create an app password. Store it only in Supabase Edge Function Secrets as GMAIL_APP_PASSWORD. Never use the normal Gmail password or a frontend VITE variable.
2. Apply supabase/migrations/20261003000300_signup_email_outbox.sql. The private queue is populated in the same transaction as signup. Existing subscriptions are not backfilled.
3. Deploy yummyfit-email-worker with JWT verification ON. Its code additionally requires the private EMAIL_WORKER_TOKEN secret in the x-worker-token header. Store the same token in Vault as yummyfit_email_worker_token for the scheduler. Deploy the updated yummyfit-web-api, retaining its approved public gateway configuration. Both functions use _shared/email.ts and server/email-worker.mjs.
4. Add a Supabase Cron job every minute to POST to /functions/v1/yummyfit-email-worker with the service-role Authorization header and private worker-token header. Keep both credentials in Supabase Vault, never in checked-in SQL. The signup API also dispatches queued emails in the background when its new entrypoint is deployed. Cron is required to recover failures without another signup.
5. Create a test signup using an inbox you control. Confirm both inboxes receive mail and email_outbox shows two sent rows. SMTP acceptance is not proof of inbox delivery; check spam and Gmail's sending limits.

## Behavior

Duplicates do not enqueue more messages. Workers claim up to five jobs atomically with five-minute leases. Temporary failures retry with exponential backoff; eight unsuccessful attempts become failed for operator review. Logs contain job IDs, not subscriber details or secrets. Historical price answers remain untouched.

Delivery is at least once. A crash after Gmail accepts mail but before the queue acknowledgement can cause a duplicate; the same Message-ID is reused, but Gmail does not guarantee deduplication. Do not blindly replay old sent messages. Monitor failed jobs and sending jobs older than their lease.

This Gmail workflow applies to the Supabase deployment. The local Express server remains a capture/testing service and does not send real mail. Welcome templates can be inspected with signupEmail in server/email-messages.mjs. Gmail credentials and SQL activation are prerequisites; this code alone does not activate sending.

The protected worker also supports POST ?check=smtp to verify connectivity/authentication without sending a message. It reports only a sanitized error category and numeric SMTP status. EAUTH / 535 means Gmail rejected the account credential; replace GMAIL_APP_PASSWORD with an app password belonging to the configured sender account.

Provider references: https://support.google.com/accounts/answer/185833 and https://github.com/supabase/supabase/blob/master/examples/edge-functions/supabase/functions/send-email-smtp/index.ts

## Newsletter unsubscribe

Newsletter confirmations include an unsubscribe clause in HTML and plain text, plus List-Unsubscribe headers. Each subscriber has an unguessable private token. GET displays a confirmation page and does not revoke consent; POST records unsubscribed_at and cancels pending newsletter messages. Repeated requests are safe. Waitlist entries remain intact. Future newsletter campaign queries must require marketing_consent=true AND unsubscribed_at IS NULL. Do not use historical marketing_consent alone: it records the original consent, while unsubscribed_at records withdrawal. Individual messages already accepted by SMTP cannot be recalled.
