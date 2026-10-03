import nodemailer from 'npm:nodemailer@9';
import { createEmailWorker } from '../../../server/email-worker.mjs';
export function gmailWorker() {
  const password=Deno.env.get('GMAIL_APP_PASSWORD');
  if(!password) throw new Error('GMAIL_APP_PASSWORD is required');
  const transport=nodemailer.createTransport({host:'smtp.gmail.com',port:465,secure:true,
    auth:{user:'yummyfitsupport@gmail.com',pass:password.replace(/\s/g,'')},
    connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000});
  return createEmailWorker({url:Deno.env.get('SUPABASE_URL'),serviceKey:Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),sendMail:message=>transport.sendMail(message)});
}
