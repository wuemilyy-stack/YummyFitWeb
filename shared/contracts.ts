export const POLICY_VERSION = '2026-10-02';
export const PRICE_OPTIONS = [
  { value: '0-9', label: '$0-9/mo' },
  { value: '10-19', label: '$10-19/mo' },
  { value: '20-29', label: '$20-29/mo' },
  { value: '30+', label: '$30+/mo' },
] as const;
export const PLANS = ['free', 'premium', 'founding'] as const;
export type Plan = typeof PLANS[number];
export type PriceRange = typeof PRICE_OPTIONS[number]['value'];
export const PAGE_PATHS = ['/', '/privacy', '/terms', '/cookies', '/unsubscribe'] as const;
