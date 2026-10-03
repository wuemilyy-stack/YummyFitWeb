import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmailWorker } from '../server/email-worker.mjs';
test('worker sends queued messages to the right inboxes and acknowledges outcomes',async()=>{
 const sent=[],finished=[];
 const jobs=[false,true].map((notification,i)=>({id:`job-${i}`,attempts:1,payload:{kind:'intake',recipient:'person@example.com',marketingConsent:false,notification}}));
 const worker=createEmailWorker({url:'https://example.supabase.co',serviceKey:'server-secret',sendMail:async message=>sent.push(message),fetcher:async(url,options)=>{
  assert.equal(options.headers.Authorization,'Bearer server-secret');
  if(url.endsWith('claim_emails'))return Response.json(jobs);
  finished.push(JSON.parse(options.body));return new Response(null,{status:204});
 }});
 assert.deepEqual(await worker(),{sent:2,failed:0});
 assert.deepEqual(sent.map(m=>m.to),['person@example.com','yummyfitsupport@gmail.com']);
 assert.ok(sent.every(m=>m.from==='YummyFit <yummyfitsupport@gmail.com>'));
 assert.ok(finished.every(m=>m.p_sent===true));
});
test('SMTP failure queues a retry and never logs credentials or recipient data',async()=>{
 const logs=[],finished=[];
 const worker=createEmailWorker({url:'https://example.supabase.co',serviceKey:'secret',sendMail:async()=>{throw new Error('SMTP secret person@example.com');},logger:{error:m=>logs.push(m)},fetcher:async(url,options)=>{
  if(url.endsWith('claim_emails'))return Response.json([{id:'job',attempts:2,payload:{kind:'newsletter',recipient:'person@example.com'}}]);
  finished.push(JSON.parse(options.body));return new Response(null,{status:204});
 }});
 assert.deepEqual(await worker(),{sent:0,failed:1});assert.equal(finished[0].p_sent,false);
 assert.ok(!logs.join('').includes('secret'));assert.ok(!logs.join('').includes('person@example.com'));
});
