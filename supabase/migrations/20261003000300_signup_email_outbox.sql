BEGIN;
SELECT pg_advisory_xact_lock(741853);
CREATE TABLE IF NOT EXISTS yummyfit_web.email_outbox (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 signup_kind text NOT NULL CHECK(signup_kind IN ('intake','newsletter')),
 recipient text NOT NULL,
 notification boolean NOT NULL,
 payload jsonb NOT NULL,
 state text NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','sending','sent','failed')),
 attempts integer NOT NULL DEFAULT 0,
 available_at timestamptz NOT NULL DEFAULT now(),
 created_at timestamptz NOT NULL DEFAULT now(),
 sent_at timestamptz,
 UNIQUE(signup_kind,recipient,notification)
);
REVOKE ALL ON yummyfit_web.email_outbox FROM PUBLIC, anon, authenticated, service_role;
ALTER TABLE yummyfit_web.email_outbox ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION yummyfit_web.queue_signup_email()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE kind text := CASE WHEN TG_TABLE_NAME='waitlist_intakes' THEN 'intake' ELSE 'newsletter' END;
BEGIN
 INSERT INTO yummyfit_web.email_outbox(signup_kind,recipient,notification,payload)
 SELECT kind, NEW.email, notice, jsonb_build_object('kind',kind,'recipient',NEW.email,'name',to_jsonb(NEW)->>'name','selectedPlan',to_jsonb(NEW)->>'selected_plan','marketingConsent',NEW.marketing_consent,'notification',notice)
 FROM unnest(ARRAY[false,true]) notice ON CONFLICT DO NOTHING;
 RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION yummyfit_web.queue_signup_email() FROM PUBLIC,anon,authenticated;
DROP TRIGGER IF EXISTS signup_email ON yummyfit_web.waitlist_intakes;
CREATE TRIGGER signup_email AFTER INSERT ON yummyfit_web.waitlist_intakes FOR EACH ROW EXECUTE FUNCTION yummyfit_web.queue_signup_email();
DROP TRIGGER IF EXISTS signup_email ON yummyfit_web.newsletter_subscriptions;
CREATE TRIGGER signup_email AFTER INSERT ON yummyfit_web.newsletter_subscriptions FOR EACH ROW EXECUTE FUNCTION yummyfit_web.queue_signup_email();
CREATE OR REPLACE FUNCTION public.yummyfit_web_claim_emails()
RETURNS SETOF yummyfit_web.email_outbox LANGUAGE sql SECURITY DEFINER SET search_path='' AS $$
 UPDATE yummyfit_web.email_outbox SET state='failed' WHERE state IN ('pending','sending') AND attempts>=8 AND available_at<=now();
 UPDATE yummyfit_web.email_outbox SET state='sending',attempts=attempts+1,available_at=now()+interval '5 minutes'
 WHERE id IN (SELECT id FROM yummyfit_web.email_outbox WHERE state IN ('pending','sending') AND attempts<8 AND available_at<=now() ORDER BY created_at LIMIT 5 FOR UPDATE SKIP LOCKED)
 RETURNING *;
$$;
CREATE OR REPLACE FUNCTION public.yummyfit_web_finish_email(p_id uuid,p_attempt integer,p_sent boolean)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path='' AS $$
 UPDATE yummyfit_web.email_outbox SET state=CASE WHEN p_sent THEN 'sent' WHEN attempts>=8 THEN 'failed' ELSE 'pending' END,
 sent_at=CASE WHEN p_sent THEN now() ELSE NULL END,
 available_at=now()+make_interval(secs=>least(3600,60*power(2,attempts)::integer))
 WHERE id=p_id AND attempts=p_attempt AND state='sending';
$$;
REVOKE ALL ON FUNCTION public.yummyfit_web_claim_emails() FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.yummyfit_web_finish_email(uuid,integer,boolean) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.yummyfit_web_claim_emails() TO service_role;
GRANT EXECUTE ON FUNCTION public.yummyfit_web_finish_email(uuid,integer,boolean) TO service_role;
COMMIT;
