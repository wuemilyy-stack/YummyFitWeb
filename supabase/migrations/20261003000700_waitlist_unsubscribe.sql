BEGIN;
SELECT pg_advisory_xact_lock(741853);
ALTER TABLE yummyfit_web.waitlist_intakes ADD COLUMN IF NOT EXISTS unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_unsubscribe_token ON yummyfit_web.waitlist_intakes(unsubscribe_token);
ALTER TABLE yummyfit_web.waitlist_intakes ADD COLUMN IF NOT EXISTS unsubscribed_at timestamptz;

CREATE OR REPLACE FUNCTION yummyfit_web.queue_signup_email()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE kind text := CASE WHEN TG_TABLE_NAME='waitlist_intakes' THEN 'intake' ELSE 'newsletter' END;
BEGIN
 IF kind='newsletter' AND NEW.unsubscribed_at IS NOT NULL THEN RETURN NEW; END IF;
 INSERT INTO yummyfit_web.email_outbox(signup_kind,recipient,notification,payload)
 SELECT kind, NEW.email, notice, jsonb_build_object('kind',kind,'recipient',NEW.email,'name',to_jsonb(NEW)->>'name','selectedPlan',to_jsonb(NEW)->>'selected_plan','marketingConsent',NEW.marketing_consent,'notification',notice,'unsubscribeToken',NEW.unsubscribe_token)
 FROM unnest(ARRAY[false,true]) notice ON CONFLICT DO NOTHING;
 RETURN NEW;
END;
$$;
UPDATE yummyfit_web.email_outbox o SET payload=payload||jsonb_build_object('unsubscribeToken',s.unsubscribe_token)
FROM yummyfit_web.waitlist_intakes s WHERE o.signup_kind='intake' AND o.recipient=s.email;

CREATE OR REPLACE FUNCTION public.yummyfit_web_unsubscribe(p_token uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE address text;
BEGIN
 SELECT email INTO address FROM (
   SELECT email FROM yummyfit_web.newsletter_subscriptions WHERE unsubscribe_token=p_token
   UNION ALL SELECT email FROM yummyfit_web.waitlist_intakes WHERE unsubscribe_token=p_token
 ) subscriptions LIMIT 1;
 IF address IS NULL THEN RAISE EXCEPTION 'Invalid unsubscribe token' USING ERRCODE='22023'; END IF;
 UPDATE yummyfit_web.newsletter_subscriptions SET unsubscribed_at=coalesce(unsubscribed_at,now()) WHERE email=address AND unsubscribed_at IS NULL;
 UPDATE yummyfit_web.waitlist_intakes SET unsubscribed_at=coalesce(unsubscribed_at,now()) WHERE email=address AND unsubscribed_at IS NULL;
 UPDATE yummyfit_web.email_outbox SET state='cancelled' WHERE signup_kind='newsletter' AND recipient=address AND notification=false AND state IN ('pending','sending');
END;
$$;
REVOKE ALL ON FUNCTION public.yummyfit_web_unsubscribe(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.yummyfit_web_unsubscribe(uuid) TO service_role;
COMMIT;
