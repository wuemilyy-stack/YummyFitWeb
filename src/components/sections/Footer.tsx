import { motion } from 'framer-motion';
import { Zap, Twitter, Instagram, Linkedin, Github, Mail, Heart } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Integrations', href: '#' },
    { label: 'API Docs', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
  company: [
    { label: 'About', href: '#about' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Contact', href: '#contact' },
  ],
  resources: [
    { label: 'Help Center', href: '#' },
    { label: 'Community', href: '#' },
    { label: 'Recipes', href: '#' },
    { label: 'Workouts', href: '#' },
    { label: 'Nutrition Guides', href: '#' },
  ],
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Security', href: '#' },
    { label: 'Accessibility', href: '#' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Mail, href: 'mailto:hello@yummyfit.app', label: 'Email' },
];

export function Footer() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });

  return (
    <footer
      ref={ref}
      id="contact"
      className="bg-yummy-950 text-white relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.01%22%3E%3Cpath d=%22M0 38.59L38.59 0H40V1.41L1.41 40H0z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      
      {/* Top glow - subtle */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      />

      <div className="container-custom relative py-10 lg:py-14">
        {/* Main Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5 }}
        >
          {/* Brand Column */}
          <motion.div className="lg:col-span-1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-base text-white">YummyFit</span>
            </div>
            <p className="text-yummy-400 text-sm leading-relaxed mb-4">
              Healthy living, made effortless. The first app unifying fitness, nutrition, shopping & coaching.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-yummy-400 hover:bg-white/10 hover:border-white/20 hover:text-white transition-colors duration-150"
                  whileHover={{ scale: 1.05, y: -1 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.04, type: 'spring' }}
                  aria-label={social.label}
                >
                  <social.icon className="w-4.5 h-4.5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links], catIndex) => (
            <motion.nav
              key={category}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + catIndex * 0.04 }}
            >
              <h4 className="font-semibold text-white mb-3 tracking-wider text-xs uppercase text-yummy-400">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link, linkIndex) => (
                  <motion.li key={link.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + catIndex * 0.04 + linkIndex * 0.02 }}>
                    <a
                      href={link.href}
                      className="text-yummy-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          ))}
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          className="relative rounded-card bg-gradient-to-r from-brand-800 to-brand-900 p-5 sm:p-6 lg:p-8 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M0 38.59L38.59 0H40V1.41L1.41 40H0z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
          
          <div className="relative max-w-xl mx-auto text-center">
            <motion.div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3, type: 'spring' }}>
              <Mail className="w-6 h-6 text-white" />
            </motion.div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Stay in the loop</h3>
            <p className="text-white/80 text-sm mb-4 max-w-md mx-auto">Get early access updates, health tips, and founding member offers. No spam, unsubscribe anytime.</p>
            <form className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 rounded-input bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-colors text-sm"
              />
              <button type="submit" className="px-5 py-2.5 bg-white text-brand-800 font-semibold rounded-input hover:bg-white/90 transition-colors whitespace-nowrap text-sm">
                Subscribe
              </button>
            </form>
            <p className="mt-2.5 text-white/60 text-xs">Join 10,000+ members getting exclusive updates</p>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <p className="text-yummy-500 text-xs">
            © 2026 YummyFit. All rights reserved.
          </p>
          
          <div className="flex items-center gap-5 text-xs text-yummy-500">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/cookies" className="hover:text-white transition-colors">Cookies</a>
            <span className="flex items-center gap-1 text-brand-400">
              <Heart className="w-3.5 h-3.5" />
              Built with care
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}