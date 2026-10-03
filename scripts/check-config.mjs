import { resolveMx } from 'node:dns/promises';
export function assertProductionConfig(env = process.env) {
  if (!env.VITE_CONTACT_EMAIL || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(env.VITE_CONTACT_EMAIL))
    throw new Error('Public production requires a real VITE_CONTACT_EMAIL for privacy/support requests.');
}
if (process.argv[1]?.endsWith('check-config.mjs')) {
  assertProductionConfig();
  const domain = process.env.VITE_CONTACT_EMAIL.split('@')[1];
  const records = await resolveMx(domain);
  if (!records.some(record => record.exchange && record.exchange !== '.')) throw new Error('Contact domain has no usable MX records.');
  console.log('Production contact configuration and MX records validated.');
}
