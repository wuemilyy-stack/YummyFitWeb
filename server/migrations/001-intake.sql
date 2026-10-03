CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS waitlist_intakes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
  email TEXT NOT NULL UNIQUE CHECK (length(email) BETWEEN 3 AND 254 AND email = lower(trim(email))),
  price_range TEXT NOT NULL CHECK (price_range IN ('0-9', '10-19', '20-29', '30+')),
  selected_plan TEXT CHECK (selected_plan IN ('free', 'premium', 'founding')),
  policy_version TEXT NOT NULL,
  marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE CHECK (length(email) BETWEEN 3 AND 254 AND email = lower(trim(email))),
  policy_version TEXT NOT NULL,
  marketing_consent BOOLEAN NOT NULL CHECK (marketing_consent = TRUE),
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS request_receipts (
  request_key TEXT PRIMARY KEY,
  payload_hash TEXT NOT NULL,
  receipt_id TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);
