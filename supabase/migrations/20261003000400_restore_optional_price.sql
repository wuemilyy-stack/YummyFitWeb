-- Repair schema drift without bringing back the removed form question.
-- The capture RPC retains this nullable field for backward compatibility.
ALTER TABLE yummyfit_web.waitlist_intakes ADD COLUMN IF NOT EXISTS price_range text CHECK(price_range IN ('0-9','10-19','20-29','30+'));
ALTER TABLE yummyfit_web.waitlist_intakes ALTER COLUMN price_range DROP NOT NULL;
