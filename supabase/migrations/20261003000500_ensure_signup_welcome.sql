BEGIN;
SELECT pg_advisory_xact_lock(741853);
-- Re-submission of legacy subscribers ensures a single welcome job without changing saved details.
DROP TRIGGER IF EXISTS signup_email ON yummyfit_web.waitlist_intakes;
CREATE TRIGGER signup_email AFTER INSERT OR UPDATE ON yummyfit_web.waitlist_intakes FOR EACH ROW EXECUTE FUNCTION yummyfit_web.queue_signup_email();
DROP TRIGGER IF EXISTS signup_email ON yummyfit_web.newsletter_subscriptions;
CREATE TRIGGER signup_email AFTER INSERT OR UPDATE ON yummyfit_web.newsletter_subscriptions FOR EACH ROW EXECUTE FUNCTION yummyfit_web.queue_signup_email();
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
      ON CONFLICT(email) DO UPDATE SET email=EXCLUDED.email;
  ELSE
    INSERT INTO yummyfit_web.newsletter_subscriptions(email,policy_version,marketing_consent)
      VALUES(p_payload->>'email',p_payload->>'policyVersion',(p_payload->>'marketingConsent')::boolean) ON CONFLICT(email) DO UPDATE SET email=EXCLUDED.email;
  END IF;
  RETURN jsonb_build_object('id',accepted_id,'status','accepted');
END;
$$;
REVOKE ALL ON FUNCTION public.yummyfit_web_capture(text,jsonb,uuid,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.yummyfit_web_capture(text,jsonb,uuid,text,text) TO service_role;
COMMIT;
