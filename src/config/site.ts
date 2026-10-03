import type { Plan } from '../../shared/contracts';
export const sitePath = (path = '') => import.meta.env.BASE_URL + path.replace(/^\//, '');
export const waitlistPath = (plan?: Plan) => sitePath(plan ? `?plan=${plan}#waitlist` : '#waitlist');
export const navLinks = [
  { href: '#features', label: 'Features' }, { href: '#pricing', label: 'Pricing' },
  { href: '#audience', label: 'For You' }, { href: '#social-proof', label: 'Feedback' },
];
export const legalLinks = ['privacy', 'terms', 'cookies'].map(page => ({ href: sitePath(page), label: page[0].toUpperCase() + page.slice(1) }));
function profile(value: string | undefined, hosts: string[]) {
  if (!value) return undefined;
  const url = new URL(value);
  if (url.protocol !== 'https:' || !hosts.includes(url.hostname) || url.pathname === '/')
    throw new Error('Social URLs must identify a specific HTTPS profile or repository.');
  return url.href;
}
const email = import.meta.env.VITE_CONTACT_EMAIL?.trim();
if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid contact email.');
export const site = {
  contactEmail: email,
  contactUrl: 'https://github.com/wuemilyy-stack/YummyFitWeb/issues/new?title=Private%20contact%20request',
  socials: [
    { label: 'GitHub', href: profile(import.meta.env.VITE_GITHUB_URL || 'https://github.com/wuemilyy-stack/YummyFitWeb', ['github.com']) },
    { label: 'Instagram', href: profile(import.meta.env.VITE_INSTAGRAM_URL, ['instagram.com', 'www.instagram.com']) },
    { label: 'LinkedIn', href: profile(import.meta.env.VITE_LINKEDIN_URL, ['linkedin.com', 'www.linkedin.com']) },
    { label: 'X', href: profile(import.meta.env.VITE_X_URL, ['x.com', 'www.x.com', 'twitter.com']) },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href)),
};
export const apiBase = (import.meta.env.VITE_API_BASE_URL || sitePath('api')).replace(/\/$/, '');
