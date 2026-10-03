import { motion } from 'framer-motion';
import { ArrowRight, Shield, Users } from 'lucide-react';
import { BrandMark } from '@/components/ui/Brand';
import { waitlistPath, sitePath } from '@/config/site';
import { Navigation } from '@/components/ui/Navigation';

export function Hero() {
  return (
    <section id="top" tabIndex={-1} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-yummy-50">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%232f850f%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M0 38.59L38.59 0H40V1.41L1.41 40H0z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      
      {/* Floating orbs - subtle */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-brand-200/50 rounded-full blur-3xl"
        animate={{ scale: [1, 1.05, 1], x: [0, 15, 0], y: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 bg-brand-100/50 rounded-full blur-3xl"
        animate={{ scale: [1, 1.03, 1], x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Navigation Bar */}
      <Navigation />

      {/* Main Hero Content */}
      <div className="relative z-10 container-custom px-4 py-16 pt-24 pb-12">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Trust badges */}
          <motion.div
            className="flex items-center justify-center gap-5 sm:gap-6 mb-6 flex-wrap"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <span className="flex items-center gap-1.5 text-sm text-yummy-600">
              <Users className="w-4 h-4 text-brand-600" />
              Preparing for launch
            </span>
            <span className="flex items-center gap-1.5 text-sm text-yummy-600">
              <Shield className="w-4 h-4 text-brand-600" />
              Expert-built
            </span>
            <span className="flex items-center gap-1.5 text-sm text-yummy-600">
              <BrandMark className="w-4 h-4" />
              Early access
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-yummy-900 tracking-tight leading-[1.1] mb-5 text-balance"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            Healthy living,{' '}
            <span className="text-gradient">made effortless.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-base sm:text-lg lg:text-xl text-yummy-600 leading-relaxed mb-8 max-w-2xl mx-auto text-balance"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            The first app that unifies personalized workouts, adaptive meal planning, grocery delivery, and real‑time coaching — all in one intelligent system.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <a href={waitlistPath()} className="btn-primary w-full sm:w-auto group">
              Join the Waitlist
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href={waitlistPath('founding')} className="btn-secondary w-full sm:w-auto">
              Become a Founding Member
            </a>
          </motion.div>

          {/* Micro-trust line */}
          <motion.p
            className="text-xs text-yummy-500 flex items-center justify-center gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
            Built by experts. Loved by early testers.
          </motion.p>
        </motion.div>

        {/* Center Brand Icon */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
        >
          <div className="relative">
            {/* Pulse rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-brand-300/50"
              animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              style={{ width: '80px', height: '80px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-brand-200/50"
              animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 2 }}
              style={{ width: '80px', height: '80px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            />
            
            {/* Hub */}
            <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 shadow-lg shadow-brand-600/30 rounded-[32%]">
              <BrandMark className="w-full h-full" />
            </div>
          </div>
        </motion.div>
        <figure className="mt-10 max-w-5xl mx-auto overflow-hidden rounded-[28px] border border-yummy-200 bg-white">
          <img src={sitePath('brand/vitality-campaign.png')} alt="Fresh avocado salad, citrus, a water bottle and workout essentials in natural sunlight" width={1672} height={941} loading="lazy" className="w-full h-48 sm:h-72 object-cover" />
          <figcaption className="flex flex-wrap justify-between gap-2 px-6 py-4 text-brand-800">
            <span className="font-display text-xl">A little more energy. Every day.</span>
            <span className="text-sm self-center">Eat smart · Train better</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
