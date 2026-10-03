BEGIN;
SELECT pg_advisory_xact_lock(741853);
ALTER TABLE yummyfit_web.newsletter_subscriptions ADD COLUMN IF NOT EXISTS unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_unsubscribe_token ON yummyfit_web.newsletter_subscriptions(unsubscribe_token);
ALTER TABLE yummyfit_web.newsletter_subscriptions ADD COLUMN IF NOT EXISTS unsubscribed_at timestamptz;
ALTER TABLE yummyfit_web.email_outbox DROP CONSTRAINT IF EXISTS email_outbox_state_check;
ALTER TABLE yummyfit_web.email_outbox ADD CONSTRAINT email_outbox_state_check CHECK(state IN ('pending','sending','sent','failed','cancelled'));
CREATE OR REPLACE FUNCTION yummyfit_web.queue_signup_email()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE kind text := CASE WHEN TG_TABLE_NAME='waitlist_intakes' THEN 'intake' ELSE 'newsletter' END;
BEGIN
 IF kind='newsletter' AND to_jsonb(NEW)->>'unsubscribed_at' IS NOT NULL THEN RETURN NEW; END IF;
 INSERT INTO yummyfit_web.email_outbox(signup_kind,recipient,notification,payload)
 SELECT kind, NEW.email, notice, jsonb_build_object('kind',kind,'recipient',NEW.email,'name',to_jsonb(NEW)->>'name','selectedPlan',to_jsonb(NEW)->>'selected_plan','marketingConsent',NEW.marketing_consent,'notification',notice,'unsubscribeToken',to_jsonb(NEW)->>'unsubscribe_token')
 FROM unnest(ARRAY[false,true]) notice ON CONFLICT DO NOTHING;
 RETURN NEW;
END;
$$;
UPDATE yummyfit_web.email_outbox o SET payload=payload||jsonb_build_object('unsubscribeToken',s.unsubscribe_token)
FROM yummyfit_web.newsletter_subscriptions s WHERE o.signup_kind='newsletter' AND o.recipient=s.email;
CREATE OR REPLACE FUNCTION public.yummyfit_web_unsubscribe(p_token uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE address text;
BEGIN
 UPDATE yummyfit_web.newsletter_subscriptions SET unsubscribed_at=coalesce(unsubscribed_at,now()) WHERE unsubscribe_token=p_token RETURNING email INTO address;
 UPDATE yummyfit_web.email_outbox SET state='cancelled' WHERE signup_kind='newsletter' AND recipient=address AND notification=false AND state='pending';
END;
$$;
REVOKE ALL ON FUNCTION public.yummyfit_web_unsubscribe(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.yummyfit_web_unsubscribe(uuid) TO service_role;
COMMIT;
