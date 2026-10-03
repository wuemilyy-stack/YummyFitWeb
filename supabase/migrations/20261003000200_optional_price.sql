BEGIN;
SELECT pg_advisory_xact_lock(741853);
-- Preserve historical answers. New signups no longer collect a price preference.
ALTER TABLE yummyfit_web.waitlist_intakes ALTER COLUMN price_range DROP NOT NULL;
COMMIT;
