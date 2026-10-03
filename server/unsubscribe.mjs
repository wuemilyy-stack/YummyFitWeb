const TOKEN=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export async function handleUnsubscribe(request,rpc) {
 const token=new URL(request.url).searchParams.get('token');
 const headers={'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'"};
 const page=(title,body,status=200)=>new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | YummyFit</title><body style="background:#fffdf5;color:#143d2b;font:18px/1.6 Arial,sans-serif;padding:48px 24px"><main style="max-width:560px;margin:auto"><h1 style="font-family:Georgia,serif">${title}</h1>${body}</main></body></html>`,{status,headers});
 if(!TOKEN.test(token||''))return page('Invalid unsubscribe link','<p>Please contact yummyfitsupport@gmail.com for help.</p>',400);
 if(request.method==='GET')return page('Unsubscribe from YummyFit newsletters',`<p>You can stop future newsletter emails. Your waitlist signup will remain saved.</p><form method="post"><button style="background:#d2f36b;color:#143d2b;border:1px solid #143d2b;border-radius:999px;padding:14px 24px;font:inherit" type="submit">Unsubscribe</button></form>`);
 if(request.method!=='POST')return page('Method not allowed','',405);
 try {await rpc('yummyfit_web_unsubscribe',{p_token:token});return page('You’re unsubscribed','<p>You will no longer receive YummyFit newsletters. Your waitlist signup remains saved.</p>');}
 catch{return page('Please try again','<p>We could not update your preference. Please try again or contact yummyfitsupport@gmail.com.</p>',503);}
}
