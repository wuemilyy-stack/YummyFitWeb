import { gmailWorker } from '../_shared/email.ts';
Deno.serve(async request=>{
  const serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if(!serviceKey||request.headers.get('authorization')!==`Bearer ${serviceKey}`)
    return Response.json({error:'Unauthorized'},{status:401});
  if(request.method!=='POST')return Response.json({error:'Method not allowed'},{status:405});
  try{return Response.json(await gmailWorker()());}
  catch {console.error(JSON.stringify({event:'email_worker_unavailable'}));return Response.json({error:'Email worker unavailable'},{status:503});}
});
