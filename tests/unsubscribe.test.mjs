import test from 'node:test';
import assert from 'node:assert/strict';
import {handleUnsubscribe} from '../server/unsubscribe.mjs';
import {signupEmail} from '../server/email-messages.mjs';
const link='https://example.supabase.co/functions/v1/yummyfit-web-api/unsubscribe?token=11111111-1111-4111-8111-111111111111';
test('newsletter email includes a working clause in HTML, plain text and mail headers',()=>{
 const message=signupEmail({kind:'newsletter',recipient:'test@example.com',unsubscribeUrl:link});
 assert.ok(message.text.includes(link));assert.ok(message.html.includes('Unsubscribe from future newsletter emails'));
 assert.equal(message.headers['List-Unsubscribe'],`<${link}>`);
 assert.equal(message.headers['List-Unsubscribe-Post'],'List-Unsubscribe=One-Click');
 assert.equal(signupEmail({kind:'intake',recipient:'test@example.com'}).headers,undefined);
});
test('GET confirms without changing preferences; POST performs unsubscribe',async()=>{
 let calls=0;const rpc=async(name,args)=>{assert.equal(name,'yummyfit_web_unsubscribe');assert.ok(args.p_token);calls++;};
 const get=await handleUnsubscribe(new Request(link),rpc);assert.equal(get.status,200);assert.equal(calls,0);
 assert.ok((await get.text()).includes('method="post"'));
 assert.equal((await handleUnsubscribe(new Request(link,{method:'POST'}),rpc)).status,200);assert.equal(calls,1);
 assert.equal((await handleUnsubscribe(new Request(link,{method:'POST'}),rpc)).status,200);
});
test('invalid tokens never reach storage and database failure does not claim success',async()=>{
 assert.equal((await handleUnsubscribe(new Request(link.replace('11111111-1111-4111-8111-111111111111','bad')),()=>{throw new Error();})).status,400);
 assert.equal((await handleUnsubscribe(new Request(link,{method:'POST'}),()=>{throw new Error();})).status,503);
});
