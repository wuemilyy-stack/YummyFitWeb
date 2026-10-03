import { waitlistPath } from '@/config/site';
export function AboutFaq() {
  return <>
    <section id="about" tabIndex={-1} className="section-padding bg-white"><div className="container-custom max-w-3xl">
      <h2 className="section-title">About YummyFit</h2><p>YummyFit is a pre-launch project exploring how workouts, meal planning, shopping, and coaching can fit together. Join the waitlist to share your preferences.</p>
    </div></section>
    <section id="faq" tabIndex={-1} className="section-padding bg-yummy-50"><div className="container-custom max-w-3xl">
      <h2 className="section-title">Frequently asked questions</h2>
      {[
        ['Is YummyFit available now?', 'YummyFit is preparing for launch. The features shown describe the planned experience.'],
        ['Does joining cost anything?', 'No. Joining the waitlist is free and does not purchase or reserve a paid membership.'],
        ['Can I choose a membership?', 'You can record interest in Free, Premium, or Founding Member. Displayed prices are indicative and may change before launch.'],
        ['What happens if I submit twice?', 'Repeat signups do not create duplicate entries or change an existing signup.'],
      ].map(([question, answer]) => <details key={question} className="border-b border-yummy-300 py-4">
        <summary className="font-semibold cursor-pointer">{question}</summary><p className="mt-3">{answer}</p>
      </details>)}
      <a href={waitlistPath()} className="btn-primary mt-6">Join the Waitlist</a>
    </div></section>
  </>;
}
