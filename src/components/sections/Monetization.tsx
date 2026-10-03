import { motion } from 'framer-motion';
import { Check, Crown, Sparkles, Gift } from 'lucide-react';
import { BrandMark } from '@/components/ui/Brand';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { waitlistPath } from '@/config/site';
import type { Plan } from '../../../shared/contracts';
import { cn } from '@/utils/helpers';

const plans = [
  {
    name: 'Free',
    id: 'free' as Plan,
    description: 'Tracking + basic features',
    price: '$0',
    period: '/month',
    features: [
      'Workout & meal logging',
      'Basic progress tracking',
      'Community access',
      'Limited recipe library',
      'Barcode scanner (5/day)',
    ],
    cta: 'Join Free Waitlist',
    variant: 'secondary' as const,
    highlight: false,
    color: 'yummy-600',
    bgColor: 'yummy-100',
    icon: Sparkles,
  },
  {
    name: 'Premium',
    id: 'premium' as Plan,
    description: 'Personalized plans + coaching + grocery',
    price: '$19',
    period: '/month',
    features: [
      'Everything in Free',
      'AI-personalized workouts',
      'Adaptive meal planning',
      'Unlimited barcode scans',
      'Grocery delivery integration',
      'Real-time coach messaging',
      'Advanced analytics',
      'Recipe library + meal prep guides',
    ],
    cta: 'Join Premium Waitlist',
    variant: 'primary' as const,
    highlight: true,
    color: 'brand-600',
    bgColor: 'yummy-100',
    icon: BrandMark,
    badge: 'Most Popular',
  },
  {
    name: 'Founding Member',
    id: 'founding' as Plan,
    description: 'Early access + exclusive perks',
    price: '$299',
    period: '/lifetime',
    features: [
      'Everything in Premium',
      'Early access to new features',
      'Direct line to product team',
      'Exclusive community access',
      'Founding member badge',
      'Quarterly coaching calls',
    ],
    cta: 'Register Founding Interest',
    variant: 'primary' as const,
    highlight: true,
    color: 'brand-600',
    bgColor: 'yummy-100',
    icon: Crown,
    badge: 'Limited to 50',
  },
];

export function Monetization() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      id="pricing"
      tabIndex={-1}
      className="section-padding bg-white relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%232f850f%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M0 38.59L38.59 0H40V1.41L1.41 40H0z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />

      <div className="container-custom relative">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 24 }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-eyebrow">Pricing</span>
          <h2 className="section-title">
            Choose your path
          </h2>
        </motion.div>

        {/* Plans Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-4 items-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} isVisible={isVisible} />
          ))}
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          className="text-center text-yummy-600 text-xs mt-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 16 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <span className="font-semibold text-yummy-800">Pricing and benefits are indicative.</span> Final offers may vary. Joining records your interest and does not purchase or reserve a membership.
        </motion.p>

        {/* FAQ Hint */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <a href="#faq" className="btn-ghost inline-flex items-center gap-1.5 text-sm">
            Have questions? View FAQ
            <Sparkles className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function PricingCard({ plan, index, isVisible }: { plan: typeof plans[0]; index: number; isVisible: boolean }) {
  return (
    <motion.article
      className={cn(
        'relative p-5 rounded-card border transition-all duration-300',
        plan.highlight
          ? 'border-brand-300 bg-white shadow-card-hover ring-1 ring-brand-200'
          : 'border-yummy-200 bg-white hover:border-brand-300 hover:shadow-card-hover'
      )}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20, scale: isVisible ? 1 : 0.98 }}
      transition={{ delay: 0.2 + index * 0.06, duration: 0.4 }}
      whileHover={{ y: plan.highlight ? -2 : -4 }}
    >
      {/* Highlight badge */}
      {plan.badge && (
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-max max-w-[calc(100%-1.5rem)] whitespace-nowrap rounded-full border border-brand-200 bg-brand-100 px-3 py-1 text-xs leading-none font-bold text-brand-600"
        >
          {plan.badge}
        </div>
      )}

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-card" style={{ background: `linear-gradient(135deg, ${plan.color}, ${plan.color}dd)` }} />

      {/* Header */}
      <div className="relative z-10 text-center mb-5 pt-7">
        <motion.div
          className={cn('w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3', `bg-${plan.bgColor} text-${plan.color} border border-yummy-200`)}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3 + index * 0.06, type: 'spring', stiffness: 200 }}
        >
          <plan.icon className="w-6 h-6" />
        </motion.div>
        
        <h3 className="text-lg font-bold text-yummy-900 mb-1">{plan.name}</h3>
        <p className="text-yummy-600 text-sm mb-3">{plan.description}</p>

        {/* Price */}
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-3xl sm:text-4xl font-bold text-yummy-900">{plan.price}</span>
          <span className="text-yummy-500 text-sm">{plan.period}</span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-2.5 mb-6">
        {plan.features.map((feature, featureIndex) => (
          <motion.li
            key={feature}
            className="flex items-start gap-2.5 text-sm text-yummy-600"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + index * 0.06 + featureIndex * 0.03, duration: 0.25 }}
          >
            <Check className={cn('w-4.5 h-4.5 flex-shrink-0 mt-0.5', `text-${plan.color}`)} />
            <span>{feature}</span>
          </motion.li>
        ))}
      </ul>

      {/* CTA */}
      <a href={waitlistPath(plan.id)} className={cn('w-full', plan.variant === 'primary' ? 'btn-primary' : 'btn-secondary')}>
        {plan.cta}
        {plan.highlight && <Crown className="w-4 h-4 ml-1.5" />}
      </a>

      {/* Founding member extra note */}
      {plan.name === 'Founding Member' && (
        <motion.p
          className="text-center text-xs text-yummy-500 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 + index * 0.06 }}
        >
          <Gift className="w-3 h-3 inline mr-1" />
          Express interest · No payment required
        </motion.p>
      )}
    </motion.article>
  );
}
