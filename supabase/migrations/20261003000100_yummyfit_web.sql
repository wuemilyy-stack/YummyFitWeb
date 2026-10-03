BEGIN;
SELECT pg_advisory_xact_lock(741853);
CREATE SCHEMA IF NOT EXISTS yummyfit_web;
REVOKE ALL ON SCHEMA yummyfit_web FROM PUBLIC, anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS yummyfit_web.waitlist_intakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
  email text NOT NULL UNIQUE CHECK (length(email) BETWEEN 3 AND 254 AND email = lower(trim(email))),
  price_range text NOT NULL CHECK (price_range IN ('0-9','10-19','20-29','30+')),
  selected_plan text CHECK (selected_plan IN ('free','premium','founding')),
  policy_version text NOT NULL,
  marketing_consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS yummyfit_web.newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE CHECK (length(email) BETWEEN 3 AND 254 AND email = lower(trim(email))),
  policy_version text NOT NULL,
  marketing_consent boolean NOT NULL CHECK (marketing_consent = true),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS yummyfit_web.request_receipts (
  request_key uuid PRIMARY KEY,
  payload_hash text NOT NULL CHECK (length(payload_hash) = 64),
  receipt_id uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS yummyfit_web.rate_limits (
  client_hash text NOT NULL CHECK (length(client_hash) = 64),
  bucket timestamptz NOT NULL,
  requests integer NOT NULL,
  PRIMARY KEY (client_hash, bucket)
);
ALTER TABLE yummyfit_web.waitlist_intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE yummyfit_web.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE yummyfit_web.request_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE yummyfit_web.rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ALL TABLES IN SCHEMA yummyfit_web FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.yummyfit_web_capture(p_kind text, p_payload jsonb, p_key uuid, p_hash text, p_client_hash text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  accepted_id uuid;
  existing_hash text;
  calls integer;
  window_start timestamptz := date_bin('15 minutes', now(), timestamptz '2000-01-01 00:00:00+00');
BEGIN
  IF p_kind NOT IN ('intake','newsletter') OR p_payload->>'policyVersion' IS DISTINCT FROM '2026-10-02'
    OR jsonb_typeof(p_payload->'marketingConsent') IS DISTINCT FROM 'boolean'
    OR length(p_hash) IS DISTINCT FROM 64 OR length(p_client_hash) IS DISTINCT FROM 64 THEN
    RAISE EXCEPTION 'Invalid intake contract' USING ERRCODE = '22023';
  END IF;
  INSERT INTO yummyfit_web.rate_limits(client_hash,bucket,requests) VALUES (p_client_hash,window_start,1)
    ON CONFLICT(client_hash,bucket) DO UPDATE SET requests=yummyfit_web.rate_limits.requests+1 RETURNING requests INTO calls;
  DELETE FROM yummyfit_web.rate_limits WHERE bucket < now() - interval '1 day';
  IF calls > 30 THEN RETURN jsonb_build_object('error','RATE_LIMITED'); END IF;

  INSERT INTO yummyfit_web.request_receipts(request_key,payload_hash) VALUES(p_key,p_hash)
    ON CONFLICT(request_key) DO NOTHING RETURNING receipt_id INTO accepted_id;
  IF accepted_id IS NULL THEN
    SELECT receipt_id,payload_hash INTO accepted_id,existing_hash FROM yummyfit_web.request_receipts WHERE request_key=p_key;
    IF existing_hash IS DISTINCT FROM p_hash THEN RETURN jsonb_build_object('error','REQUEST_CONFLICT'); END IF;
    RETURN jsonb_build_object('id',accepted_id,'status','accepted');
  END IF;
  IF p_kind = 'intake' THEN
    INSERT INTO yummyfit_web.waitlist_intakes(name,email,price_range,selected_plan,policy_version,marketing_consent)
      VALUES(p_payload->>'name',p_payload->>'email',p_payload->>'priceRange',p_payload->>'selectedPlan',p_payload->>'policyVersion',(p_payload->>'marketingConsent')::boolean)
      ON CONFLICT(email) DO NOTHING;
  ELSE
    INSERT INTO yummyfit_web.newsletter_subscriptions(email,policy_version,marketing_consent)
      VALUES(p_payload->>'email',p_payload->>'policyVersion',(p_payload->>'marketingConsent')::boolean) ON CONFLICT(email) DO NOTHING;
  END IF;
  RETURN jsonb_build_object('id',accepted_id,'status','accepted');
END;
$$;
CREATE OR REPLACE FUNCTION public.yummyfit_web_ready()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM id FROM yummyfit_web.waitlist_intakes LIMIT 0;
  PERFORM id FROM yummyfit_web.newsletter_subscriptions LIMIT 0;
  PERFORM request_key FROM yummyfit_web.request_receipts LIMIT 0;
  PERFORM client_hash FROM yummyfit_web.rate_limits LIMIT 0;
  RETURN jsonb_build_object('status','ready');
END;
$$;
REVOKE ALL ON FUNCTION public.yummyfit_web_capture(text,jsonb,uuid,text,text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.yummyfit_web_ready() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.yummyfit_web_capture(text,jsonb,uuid,text,text) TO service_role;
GRANT EXECUTE ON FUNCTION public.yummyfit_web_ready() TO service_role;
NOTIFY pgrst, 'reload schema';
COMMIT;
