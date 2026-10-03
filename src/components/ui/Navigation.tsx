'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/helpers';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#audience', label: 'For You' },
  { href: '#social-proof', label: 'Proof' },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // Scroll detection for background opacity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 }
    );

    navLinks.forEach((link) => {
      const el = document.querySelector(link.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const headerOffset = 72;
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setIsMobileOpen(false);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 transition-all duration-300',
        isScrolled
          ? 'py-3 bg-white/95 backdrop-blur-md border-b border-yummy-200 shadow-sm'
          : 'py-4 bg-transparent'
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 group"
          whileTap={{ scale: 0.98 }}
          aria-label="YummyFit Home"
        >
          <motion.div
            className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center group-hover:rotate-6 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="w-5 h-5 text-white" />
          </motion.div>
          <span className="font-bold text-lg sm:text-xl text-yummy-900 tracking-tight">YummyFit</span>
        </motion.a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          <motion.div
            className="flex items-center gap-1 bg-yummy-100 rounded-lg p-1 border border-yummy-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {navLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => smoothScroll(e, link.href)}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
                  activeSection === link.href.replace('#', '')
                    ? 'text-brand-800 bg-white shadow-sm'
                    : 'text-yummy-600 hover:text-yummy-900'
                )}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {link.label}
                <AnimatePresence>
                  {activeSection === link.href.replace('#', '') && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    />
                  )}
                </AnimatePresence>
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Desktop CTA + Mobile Menu Button */}
        <div className="flex items-center gap-3">
          {/* Desktop CTA */}
          <motion.div className="hidden lg:flex" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Button variant="primary" size="sm" onClick={(e) => smoothScroll(e as any, '#waitlist')}>
              Join Waitlist
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 rounded-lg text-yummy-600 hover:bg-yummy-100 transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="mobile-menu"
            className="lg:hidden overflow-hidden border-t border-yummy-200 bg-white"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => smoothScroll(e, link.href)}
                  className={cn(
                    'block px-3 py-2.5 rounded-lg text-base font-medium transition-colors',
                    activeSection === link.href.replace('#', '')
                      ? 'bg-brand-50 text-brand-800'
                      : 'text-yummy-600 hover:bg-yummy-50 hover:text-yummy-900'
                  )}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  {link.label}
                </motion.a>
              ))}
              
              <motion.div className="pt-2 border-t border-yummy-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <Button 
                  variant="primary" 
                  className="w-full" 
                  size="md"
                  onClick={(e) => smoothScroll(e as any, '#waitlist')}
                >
                  Join the Waitlist
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}