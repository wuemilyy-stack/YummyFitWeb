import { useState } from 'react';
import { apiBase, sitePath } from '@/config/site';
import { BrandLogo } from '@/components/ui/Brand';
export function Unsubscribe() {
  const token=new URLSearchParams(window.location.search).get('token')||'';
  const valid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token);
  const [saved,setSaved]=useState(false),[pending,setPending]=useState(false),[error,setError]=useState('');
  async function unsubscribe(){
    if(pending)return;setPending(true);setError('');
    try{
      const response=await fetch(`${apiBase}/unsubscribe?token=${encodeURIComponent(token)}`,{method:'POST',signal:AbortSignal.timeout(10000)});
      if(!response.ok)throw new Error('We could not update your preference. Please try again.');
      setSaved(true);
    }catch{setError('We could not update your preference. Please try again or contact yummyfitsupport@gmail.com.');}
    finally{setPending(false);}
  }
  return <main className="container-custom max-w-xl py-16">
    <BrandLogo className="w-56 mb-8" />
    <h1 className="text-3xl mb-5">{saved?'You’re unsubscribed':valid?'Unsubscribe from YummyFit newsletters':'Invalid unsubscribe link'}</h1>
    <p className="mb-6">{saved?'You will no longer receive YummyFit newsletters. Your waitlist signup remains saved.':valid?'You can stop future newsletter emails. Your waitlist signup will remain saved.':'Please contact yummyfitsupport@gmail.com for help.'}</p>
    {valid&&!saved&&<button type="button" className="btn-primary" disabled={pending} onClick={unsubscribe}>{pending?'Updating…':'Unsubscribe'}</button>}
    {error&&<p role="alert" className="mt-4 text-red-700">{error}</p>}
    {saved&&<a className="btn-secondary" href={sitePath()}>Return to YummyFit</a>}
  </main>;
}
