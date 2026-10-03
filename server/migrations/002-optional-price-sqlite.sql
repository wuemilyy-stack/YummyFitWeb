CREATE TABLE waitlist_intakes_optional (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
  email TEXT NOT NULL UNIQUE CHECK (length(email) BETWEEN 3 AND 254 AND email = lower(trim(email))),
  price_range TEXT CHECK (price_range IN ('0-9', '10-19', '20-29', '30+')),
  selected_plan TEXT CHECK (selected_plan IN ('free', 'premium', 'founding')),
  policy_version TEXT NOT NULL,
  marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TEXT NOT NULL
);
INSERT INTO waitlist_intakes_optional SELECT * FROM waitlist_intakes;
DROP TABLE waitlist_intakes;
ALTER TABLE waitlist_intakes_optional RENAME TO waitlist_intakes;
