import { useState, type FormEvent } from 'react';
import { useSignup } from '@/hooks/useSignup';
import { Button } from '@/components/ui/Button';
import { BrandLogo } from '@/components/ui/Brand';
import { legalLinks, navLinks, site, sitePath } from '@/config/site';
export function Footer() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [validation, setValidation] = useState('');
  const { pending, saved, error, submit } = useSignup('newsletter');
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!consent || email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setValidation('Enter a valid email and consent to receive updates.'); return;
    }
    setValidation('');
    await submit({ email: email.trim().toLowerCase(), marketingConsent: true });
  }
  return <footer id="contact" tabIndex={-1} className="bg-yummy-950 text-white">
    <div className="container-custom py-12">
      <div className="grid md:grid-cols-3 gap-8 mb-10">
        <div><BrandLogo className="h-12 w-auto rounded-lg mb-3" /><p className="text-yummy-200">Fitness and nutrition, connected. Currently preparing for launch.</p>
          <div className="flex flex-wrap gap-4 mt-4">{site.socials.map(link => <a key={link.label} href={link.href} className="underline">{link.label}</a>)}</div>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-col gap-3">{navLinks.map(link => <a key={link.href} href={sitePath(link.href)}>{link.label}</a>)}
          <a href={sitePath('#about')}>About</a><a href={sitePath('#faq')}>FAQ</a></nav>
        <div><h3 className="font-semibold mb-3">Contact</h3>{site.contactEmail
          ? <a href={`mailto:${site.contactEmail}`} className="underline">{site.contactEmail}</a>
          : <><a href={site.contactUrl} className="underline">Contact the project maintainer</a><p className="text-yummy-200 mt-2 text-sm">Request a private contact channel. Do not post personal signup information in public issues.</p></>}
          <nav aria-label="Legal" className="flex flex-wrap gap-4 mt-4">{legalLinks.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
        </div>
      </div>
      <section aria-labelledby="newsletter-heading" className="bg-brand-800 rounded-card p-6 max-w-2xl mx-auto">
        <h3 id="newsletter-heading" className="text-xl font-bold mb-3">Stay in the loop</h3>
        {saved ? <p role="status">Your newsletter signup has been saved.</p> :
          <form onSubmit={handleSubmit} noValidate aria-busy={pending} className="space-y-4">
            <label htmlFor="newsletter-email" className="block">Email</label>
            <input id="newsletter-email" name="email" type="email" autoComplete="email" required maxLength={254} className="input-field"
              placeholder="Enter your email" disabled={pending} value={email} onChange={e => setEmail(e.target.value)} />
            <label className="flex gap-3 items-start"><input type="checkbox" required checked={consent} disabled={pending} onChange={e => setConsent(e.target.checked)} />
              <span>I want launch news and product updates. Read the <a className="underline" href={sitePath('privacy')}>Privacy Policy</a>.</span></label>
            {(validation || error) && <p role="alert" className="text-red-200">{validation || error}</p>}
            <Button type="submit" loading={pending}>Subscribe</Button>
          </form>}
      </section>
      <p className="text-yummy-300 text-sm mt-10">© {new Date().getFullYear()} YummyFit.</p>
    </div>
  </footer>;
}
