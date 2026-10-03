import test from 'node:test';
import assert from 'node:assert/strict';
import { signupEmail } from '../server/email-messages.mjs';
const signup = { kind: 'intake', recipient: 'subscriber@example.com', name: '<script>alert(1)</script>', selectedPlan: 'founding', marketingConsent: false };
test('welcome is addressed to the subscriber and remains transactional without marketing consent', () => {
  const email = signupEmail(signup);
  assert.equal(email.to, signup.recipient);
  assert.equal(email.replyTo, 'yummyfitsupport@gmail.com');
  assert.ok(email.text.includes('does not purchase a membership'));
  assert.ok(!email.html.includes('<script>'));
  assert.ok(email.html.includes('&lt;script&gt;'));
});
test('owner notification goes only to the requested support inbox', () => {
  const email = signupEmail({ ...signup, notification: true });
  assert.equal(email.to, 'yummyfitsupport@gmail.com');
  assert.ok(email.text.includes('Launch-news consent: No'));
  assert.ok(email.text.includes(signup.recipient));
});
test('newsletter confirmation avoids membership claims and rejects malformed recipients', () => {
  assert.ok(signupEmail({ ...signup, kind: 'newsletter' }).text.includes('newsletter subscription'));
  assert.throws(() => signupEmail({ ...signup, recipient: 'invalid' }));
});
