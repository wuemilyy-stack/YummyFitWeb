import { sitePath } from '@/config/site';
export function BrandLogo({ className = '' }: { className?: string }) {
  return <img src={sitePath('yummyfit-logo.png')} width={252} height={67}
    alt="YummyFit — Eat smart · Train better" className={className} />;
}
export function BrandMark({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`relative inline-block shrink-0 overflow-hidden rounded-[32%] ${className}`}>
    <img src={sitePath('yummyfit-logo.png')} alt="" className="absolute"
      style={{ width: '614.634%', maxWidth: 'none', height: 'auto', left: '-36.585%', top: '-31.707%' }} />
  </span>;
}
