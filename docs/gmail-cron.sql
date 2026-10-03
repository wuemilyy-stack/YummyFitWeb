-- Prerequisites: enable pg_cron and pg_net in Supabase; deploy yummyfit-email-worker.
-- In Supabase Vault, create yummyfit_email_service_key containing the project's
-- service-role JWT. Never paste that credential in source control or chat.
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM vault.decrypted_secrets WHERE name='yummyfit_email_service_key') THEN
   RAISE EXCEPTION 'Create yummyfit_email_service_key in Supabase Vault first';
 END IF;
END $$;
SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname='yummyfit-signup-emails';
SELECT cron.schedule('yummyfit-signup-emails','* * * * *',$job$
 SELECT net.http_post(
   url:='https://nzhjnzovbxznzadtbzgm.supabase.co/functions/v1/yummyfit-email-worker',
   headers:=jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||(SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='yummyfit_email_service_key' LIMIT 1)),
   body:='{}'::jsonb,
   timeout_milliseconds:=90000
 );
$job$);
