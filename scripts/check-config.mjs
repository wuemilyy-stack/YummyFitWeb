import { resolveMx } from 'node:dns/promises';
export function assertProductionConfig(env = process.env) {
  if (env.VITE_CONTACT_EMAIL && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(env.VITE_CONTACT_EMAIL))
    throw new Error('VITE_CONTACT_EMAIL must be a valid operational mailbox when configured.');
}
if (process.argv[1]?.endsWith('check-config.mjs')) {
  assertProductionConfig();
  if (!process.env.VITE_CONTACT_EMAIL) {
    const response = await fetch('https://github.com/wuemilyy-stack/YummyFitWeb/issues/new', { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Maintainer contact page is unavailable.');
    console.log('Maintainer contact page validated; no mailbox is claimed.');
  } else {
  const domain = process.env.VITE_CONTACT_EMAIL.split('@')[1];
  const records = await resolveMx(domain);
  if (!records.some(record => record.exchange && record.exchange !== '.')) throw new Error('Contact domain has no usable MX records.');
  console.log('Production contact configuration and MX records validated.');
  }
}
