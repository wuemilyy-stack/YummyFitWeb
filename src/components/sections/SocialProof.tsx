export function SocialProof() {
  return <section id="social-proof" tabIndex={-1} className="section-padding bg-yummy-950 text-white">
    <div className="container-custom text-center"><h2 className="text-3xl font-bold mb-4">Help shape YummyFit</h2>
      <p className="max-w-2xl mx-auto text-yummy-200">We are preparing for launch and gathering feedback on the features, memberships, and pricing people would find useful.</p>
      <div className="grid sm:grid-cols-3 gap-6 mt-8">{['Tell us your priorities', 'Share your pricing preferences', 'Choose the updates you want'].map(text =>
        <p key={text} className="rounded-card border border-white/20 p-5">{text}</p>)}</div>
    </div>
  </section>;
}
