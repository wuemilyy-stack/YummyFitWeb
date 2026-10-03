import { sitePath } from '@/config/site';
export function BrandLogo({ className = '' }: { className?: string }) {
  return <img src={sitePath('brand/logo-dark.svg')} width={760} height={220}
    alt="YummyFit — Eat smart · Train better" className={className} />;
}
export function BrandMark({ className = '' }: { className?: string }) {
  return <img aria-hidden="true" src={sitePath('brand/mark.svg')} alt="" className={`inline-block shrink-0 ${className}`} />;
}
