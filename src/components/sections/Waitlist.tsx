import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useSignup } from '@/hooks/useSignup';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { sitePath } from '@/config/site';
import { PLANS, type Plan } from '../../../shared/contracts';

export function Waitlist() {
  const selected = new URLSearchParams(window.location.search).get('plan');
  const [plan, setPlan] = useState<Plan | ''>(PLANS.includes(selected as Plan) ? selected as Plan : '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [marketing, setMarketing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { pending, saved, error, submit } = useSignup('intakes');
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim() || name.trim().length > 120) next.name = 'Enter a name of 1–120 characters.';
    if (email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email.';
    setErrors(next);
    if (Object.keys(next).length || pending) return;
    await submit({ name: name.trim(), email: email.trim().toLowerCase(), selectedPlan: plan || null, marketingConsent: marketing });
  }
  return <section id="waitlist" tabIndex={-1} className="section-padding bg-brand-800 text-white">
    <div className="container-custom max-w-2xl">
      {saved ? <div role="status" className="text-center">
        <CheckCircle className="w-12 h-12 mx-auto mb-4" /><h2 className="text-3xl font-bold mb-3 text-white">You're on the list!</h2>
        <p>Your signup has been saved. Thank you for helping shape YummyFit.</p>
        <p className="mt-3 text-white/80">Joining the waitlist does not purchase a membership.</p>
      </div> : <>
        <h2 className="text-3xl font-bold mb-3 text-white text-center">Join the YummyFit waitlist</h2>
        <p className="text-white/80 text-center mb-8">Tell us what you would value in a fitness and nutrition app. No payment required.</p>
        <form onSubmit={handleSubmit} noValidate aria-busy={pending} className="rounded-card bg-white/5 border border-white/20 p-6 space-y-5">
          <fieldset disabled={pending} className="space-y-5">
            <Input id="waitlist-name" name="name" label="Name" labelClassName="text-white" autoComplete="name" required maxLength={120} value={name} onChange={e => setName(e.target.value)} error={errors.name} />
            <Input id="waitlist-email" name="email" label="Email" labelClassName="text-white" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} error={errors.email} />
            <label className="block font-medium text-white">Membership interest
              <select name="selectedPlan" value={plan} onChange={e => setPlan(e.target.value as Plan | '')} className="input-field mt-2">
                <option value="">Still exploring</option><option value="free">Free</option><option value="premium">Premium</option><option value="founding">Founding Member</option>
              </select>
            </label>
            <label className="flex gap-3 items-start"><input type="checkbox" name="marketingConsent" checked={marketing} onChange={e => setMarketing(e.target.checked)} />
              <span>Send me optional launch news and product updates.</span></label>
          </fieldset>
          {error && <p role="alert" className="text-red-200">{error}</p>}
          <Button type="submit" loading={pending} icon={<ArrowRight className="w-4 h-4" aria-hidden="true" />} iconPosition="right" className="w-full bg-white text-brand-800 hover:bg-yummy-100">Join the Waitlist</Button>
          <p className="text-sm text-white/80">By joining, you accept our <a className="underline" href={sitePath('terms')}>Terms</a>.
            Read our <a className="underline" href={sitePath('privacy')}>Privacy Policy</a> for how we handle signup data.</p>
        </form>
      </>}
    </div>
  </section>;
}
