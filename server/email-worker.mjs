import { signupEmail, SUPPORT_EMAIL } from './email-messages.mjs';
export function createEmailWorker({ url, serviceKey, sendMail, fetcher=fetch, logger=console }) {
  async function rpc(name, body={}) {
    const response=await fetcher(`${url}/rest/v1/rpc/${name}`,{method:'POST',headers:{apikey:serviceKey,Authorization:`Bearer ${serviceKey}`,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(10000)});
    if(!response.ok) throw new Error('Email queue unavailable');
    const text=await response.text();return text?JSON.parse(text):null;
  }
  return async () => {
    if(!url||!serviceKey||!sendMail) throw new Error('Email worker not configured');
    const jobs=await rpc('yummyfit_web_claim_emails');let sent=0,failed=0;
    for(const job of jobs) {
      try {
        const newsletter=job.payload.kind==='newsletter' && !job.payload.notification;
        if(newsletter && !job.payload.unsubscribeToken)throw new Error('Missing unsubscribe token');
        const unsubscribeUrl=newsletter?`${url}/functions/v1/yummyfit-web-api/unsubscribe?token=${encodeURIComponent(job.payload.unsubscribeToken)}`:undefined;
        const message=signupEmail({...job.payload,unsubscribeUrl});
        await sendMail({...message,from:`YummyFit <${SUPPORT_EMAIL}>`,messageId:`<yummyfit-${job.id}@gmail.com>`});
      } catch {
        failed++;
        logger.error(JSON.stringify({event:'signup_email_send_failed',jobId:job.id}));
        await rpc('yummyfit_web_finish_email',{p_id:job.id,p_attempt:job.attempts,p_sent:false});
        continue;
      }
      // If acknowledging SMTP success fails, preserve the lease for later retry.
      await rpc('yummyfit_web_finish_email',{p_id:job.id,p_attempt:job.attempts,p_sent:true});sent++;
    }
    return {sent,failed};
  };
}
