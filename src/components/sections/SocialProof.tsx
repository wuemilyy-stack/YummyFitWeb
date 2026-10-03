import { motion } from 'framer-motion';
import { Star, MessageSquare, Users, Award, TrendingUp, Shield } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/utils/helpers';

const testimonials = [
  {
    quote: '"YummyFit finally makes healthy living feel doable. I\'ve tried everything — this is the first time it all clicks together."',
    author: 'Sarah M.',
    role: 'Beta Tester, 3 months',
    avatar: 'SM',
    result: 'Lost 18 lbs, gained energy',
  },
  {
    quote: '"Everything I need in one place — game changer. The grocery auto-fill from my meal plan saves me hours every week."',
    author: 'Marcus T.',
    role: 'Early Access Member',
    avatar: 'MT',
    result: 'Saves 6+ hrs/week',
  },
  {
    quote: '"The barcode scanner alone is worth it. I scan items while shopping and instantly know if they fit my plan. No more label confusion."',
    author: 'Priya K.',
    role: 'Founding Member',
    avatar: 'PK',
    result: '94% healthier cart',
  },
];

const stats = [
  { value: '94%', label: 'Healthier grocery carts', icon: TrendingUp, color: 'brand-600' },
  { value: '4.9/5', label: 'App Store rating (beta)', icon: Star, color: 'brand-600' },
  { value: '3.2x', label: 'More consistent workouts', icon: Users, color: 'brand-600' },
  { value: '87%', label: 'Stick with it past 90 days', icon: Award, color: 'brand-600' },
];

const badges = [
  { icon: Shield, label: 'HIPAA Compliant', color: 'brand-600' },
  { icon: Award, label: 'Top Health App 2025', color: 'brand-600' },
  { icon: Users, label: '10,000+ Waitlist', color: 'brand-600' },
  { icon: Star, label: 'Expert Certified', color: 'brand-600' },
];

export function SocialProof() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      id="social-proof"
      className="section-padding bg-yummy-950 relative overflow-hidden text-white"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yummy-950 via-yummy-900 to-yummy-950" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.01%22%3E%3Cpath d=%22M0 38.59L38.59 0H40V1.41L1.41 40H0z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      
      {/* Glow orbs - subtle */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 12, repeat: Infinity, delay: 3 }}
      />

      <div className="container-custom relative">
        {/* Section Header */}
        <motion.div
          className="section-header mb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 24 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-brand-600/20 text-brand-400 text-eyebrow font-semibold mb-3 uppercase tracking-wider">
            Social Proof
          </span>
          <h2 className="section-title text-white">
            Early testers love it.
          </h2>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 24 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-5 rounded-card bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              whileHover={{ y: -3 }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.06, type: 'spring' }}
            >
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <stat.icon className={cn('w-4.5 h-4.5', `text-${stat.color}`)} />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-0.5" style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                {stat.value}
              </div>
              <p className="text-yummy-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          className="grid md:grid-cols-3 gap-4 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.author} testimonial={testimonial} index={index} />
          ))}
        </motion.div>

        {/* Badges */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 16 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {badges.map((badge, index) => (
            <motion.div
              key={badge.label}
              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium', `text-${badge.color}`)}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + index * 0.06, type: 'spring' }}
            >
              <badge.icon className="w-3.5 h-3.5" />
              {badge.label}
            </motion.div>
          ))}
        </motion.div>

        {/* Partner Logos Placeholder */}
        <motion.div
          className="mt-12 pt-10 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <p className="text-center text-yummy-500 text-xs mb-6 tracking-wide uppercase">Trusted by leading health & wellness partners</p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-40">
            {['Apple Health', 'Google Fit', 'Fitbit', 'MyFitnessPal', 'Strava', 'Instacart'].map((partner) => (
              <motion.span
                key={partner}
                className="text-yummy-400 font-medium text-xs tracking-wide"
                whileHover={{ opacity: 1, scale: 1.03 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 0.4, y: 0 }}
                transition={{ delay: 0.8 + Math.random() * 0.2 }}
              >
                {partner}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.article
      className="relative p-5 rounded-card bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
      whileHover={{ y: -3 }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 + index * 0.06, duration: 0.4 }}
    >
      {/* Quote icon */}
      <MessageSquare className="absolute top-4 right-4 w-8 h-8 text-white/5" />

      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-white/90 leading-relaxed mb-5 text-sm">
        {testimonial.quote}
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center font-bold text-white text-xs">
          {testimonial.avatar}
        </div>
        <div>
          <p className="font-semibold text-white text-sm">{testimonial.author}</p>
          <p className="text-yummy-400 text-xs">{testimonial.role}</p>
        </div>
      </div>

      {/* Result */}
      <div className="pt-3 border-t border-white/10">
        <p className="text-brand-400 text-xs font-medium flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          {testimonial.result}
        </p>
      </div>
    </motion.article>
  );
}