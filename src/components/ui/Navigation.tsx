import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from './Brand';
import { navLinks, sitePath, waitlistPath } from '@/config/site';
export function Navigation() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, []);
  return <nav aria-label="Main navigation" className="fixed top-0 inset-x-0 z-50 bg-white/95 border-b border-yummy-200">
    <div className="container-custom flex items-center justify-between py-3 gap-4">
      <a href={sitePath('#top')} aria-label="YummyFit Home" className="shrink-0"><BrandLogo className="h-11 sm:h-12 w-auto rounded-lg" /></a>
      <div className="hidden lg:flex gap-6">{navLinks.map(link => <a key={link.href} href={sitePath(link.href)}>{link.label}</a>)}</div>
      <a className="btn-primary hidden lg:inline-flex" href={waitlistPath()}>Join Waitlist</a>
      <button type="button" className="lg:hidden p-2" aria-expanded={open} aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </div>
    {open && <div id="mobile-menu" className="lg:hidden container-custom pb-4 flex flex-col gap-3">
      {navLinks.map(link => <a key={link.href} href={sitePath(link.href)} onClick={() => setOpen(false)}>{link.label}</a>)}
      <a href={waitlistPath()} className="btn-primary" onClick={() => setOpen(false)}>Join the Waitlist</a>
    </div>}
  </nav>;
}
