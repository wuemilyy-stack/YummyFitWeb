import { gmailWorker, gmailTransport } from '../_shared/email.ts';
Deno.serve(async request=>{
  const workerToken=Deno.env.get('EMAIL_WORKER_TOKEN');
  if(!workerToken||request.headers.get('x-worker-token')!==workerToken)
    return Response.json({error:'Unauthorized'},{status:401});
  if(request.method!=='POST')return Response.json({error:'Method not allowed'},{status:405});
  if(new URL(request.url).searchParams.get('check')==='smtp') {
    const transport=gmailTransport();
    try {await transport.verify();return Response.json({smtp:'ready'});}
    catch(error) {return Response.json({smtp:'unavailable',code:['EAUTH','ECONNECTION','ETIMEDOUT','ESOCKET'].includes(error.code)?error.code:'SMTP_ERROR',smtpStatus:Number.isInteger(error.responseCode)?error.responseCode:undefined,appPasswordFormatValid:/^[a-z]{16}$/i.test((Deno.env.get('GMAIL_APP_PASSWORD')||'').replace(/\s/g,''))},{status:503});}
    finally {transport.close();}
  }
  try{return Response.json(await gmailWorker()());}
  catch {console.error(JSON.stringify({event:'email_worker_unavailable'}));return Response.json({error:'Email worker unavailable'},{status:503});}
});
