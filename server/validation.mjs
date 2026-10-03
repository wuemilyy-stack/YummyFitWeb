import { POLICY_VERSION, PRICE_OPTIONS, PLANS } from '../shared/contracts.ts';

export class HttpError extends Error {
  constructor(status, code, message, fields) {
    super(message);
    Object.assign(this, { status, code, fields });
  }
}
export function validateSignup(body, kind) {
  if (!body || typeof body !== 'object' || Array.isArray(body))
    throw new HttpError(422, 'INVALID_INPUT', 'Please check your signup details.');
  const allowed = kind === 'intake'
    ? ['name', 'email', 'priceRange', 'selectedPlan', 'policyVersion', 'marketingConsent']
    : ['email', 'policyVersion', 'marketingConsent'];
  const fields = {};
  if (Object.keys(body).some(key => !allowed.includes(key))) fields.form = 'Unexpected fields.';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fields.email = 'Enter a valid email.';
  if (body.policyVersion !== POLICY_VERSION) fields.policyVersion = 'Refresh this page to review the current policies.';
  if (typeof body.marketingConsent !== 'boolean') fields.marketingConsent = 'Choose your email preference.';
  if (kind === 'newsletter' && body.marketingConsent !== true) fields.marketingConsent = 'Consent is required for newsletter updates.';
  const data = { email, policyVersion: POLICY_VERSION, marketingConsent: body.marketingConsent };
  if (kind === 'intake') {
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (name.length < 1 || name.length > 120) fields.name = 'Enter a name of 1–120 characters.';
    if (body.priceRange != null && !PRICE_OPTIONS.some(option => option.value === body.priceRange)) fields.priceRange = 'Select a valid price range.';
    if (body.selectedPlan != null && !PLANS.includes(body.selectedPlan)) fields.selectedPlan = 'Select a valid membership.';
    Object.assign(data, { name, priceRange: body.priceRange ?? null, selectedPlan: body.selectedPlan ?? null });
  }
  if (Object.keys(fields).length) throw new HttpError(422, 'INVALID_INPUT', 'Please check your signup details.', fields);
  return data;
}
export function requestKey(value) {
  if (typeof value !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value))
    throw new HttpError(400, 'INVALID_REQUEST_KEY', 'A valid Idempotency-Key is required.');
  return value.toLowerCase();
}
