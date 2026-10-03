export const SUPPORT_EMAIL = 'yummyfitsupport@gmail.com';
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export function signupEmail({ kind, recipient, name, selectedPlan, marketingConsent, notification = false }) {
  if (!['intake', 'newsletter'].includes(kind)) throw new Error('Invalid signup kind');
  if (typeof recipient !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) throw new Error('Invalid recipient');
  const greeting = name ? `Hi ${name},` : 'Hello,';
  const subject = notification ? `New YummyFit ${kind === 'intake' ? 'waitlist signup' : 'newsletter subscriber'}` : 'Welcome to YummyFit';
  const lines = notification
    ? [`New ${kind === 'intake' ? 'waitlist signup' : 'newsletter subscription'}.`, `Email: ${recipient}`, ...(name ? [`Name: ${name}`] : []), ...(selectedPlan ? [`Membership interest: ${selectedPlan}`] : []), `Launch-news consent: ${marketingConsent ? 'Yes' : 'No'}`]
    : [greeting, kind === 'intake' ? 'You’re on the YummyFit waitlist. Your signup has been saved—thank you for helping shape YummyFit.' : 'Your YummyFit newsletter subscription has been saved. Thank you for joining us.', ...(kind === 'intake' ? ['Joining the waitlist does not purchase a membership.'] : []), `Questions? Reply to this email or contact ${SUPPORT_EMAIL}.`];
  const text = lines.join('\n\n');
  return {
    to: notification ? SUPPORT_EMAIL : recipient,
    replyTo: SUPPORT_EMAIL,
    subject,
    text,
    html: `<html><body style="margin:0;padding:32px 16px;background:#fffdf5;color:#143d2b;font-family:Arial,sans-serif"><main style="max-width:560px;margin:auto"><div style="padding:28px;background:#143d2b;border-radius:20px;color:#fffdf5"><span style="font:bold 36px Georgia,serif">yummyfit</span><p style="color:#d2f36b;letter-spacing:2px;font-size:12px">EAT SMART · TRAIN BETTER</p></div><h1 style="font:32px Georgia,serif">${notification ? 'Someone new has joined.' : 'Welcome to YummyFit.'}</h1>${lines.map(line => `<p style="font-size:16px;line-height:1.7">${escape(line)}</p>`).join('')}<p style="font-size:12px;color:#426443">${notification ? 'Signup notification for the YummyFit team.' : 'This message confirms your signup. It does not change your optional marketing preferences.'}</p></main></body></html>`,
  };
}
