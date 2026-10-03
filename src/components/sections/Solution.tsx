import { motion } from 'framer-motion';
import { Dumbbell, Apple, ShoppingCart, UserCheck, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/utils/helpers';

const pillars = [
  {
    icon: Dumbbell,
    title: 'Fitness',
    description: 'Personalized workouts that adapt to your goals',
    color: 'brand-600',
    bgColor: 'yummy-100',
  },
  {
    icon: Apple,
    title: 'Nutrition',
    description: 'Smart meal plans built around your lifestyle',
    color: 'brand-600',
    bgColor: 'yummy-100',
  },
  {
    icon: ShoppingCart,
    title: 'Shopping',
    description: 'Grocery lists + delivery auto‑generated from your plan',
    color: 'brand-600',
    bgColor: 'yummy-100',
  },
  {
    icon: UserCheck,
    title: 'Coaching',
    description: 'Real-time guidance from certified experts',
    color: 'brand-600',
    bgColor: 'yummy-100',
  },
];

export function Solution() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      id="solution"
      className="section-padding bg-yummy-50 relative overflow-hidden"
    >
      {/* Background blobs - subtle */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-100/50 rounded-full blur-3xl"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-brand-100/50 rounded-full blur-3xl"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 14, repeat: Infinity, delay: 3 }}
        />
      </div>

      <div className="container-custom relative">
        {/* Section Header */}
        <motion.div
          className="section-header mb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 24 }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-eyebrow">The Solution</span>
          <h2 className="section-title">
            One app. Four pillars. Everything in sync.
          </h2>
        </motion.div>

        {/* Center Hub + Pillars */}
        <div className="relative max-w-6xl mx-auto">
          {/* Central Hub */}
          <motion.div
            className="relative flex justify-center mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
            transition={{ delay: 0.15, duration: 0.5, type: 'spring' }}
          >
            <div className="relative">
              {/* Pulse rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-brand-300/50"
                animate={{ scale: [1, 1.3], opacity: [0.4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                style={{ width: '72px', height: '72px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-brand-200/50"
                animate={{ scale: [1, 1.3], opacity: [0.25, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
                style={{ width: '72px', height: '72px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              />
              
              {/* Hub */}
              <div className="relative z-10 w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-600/30">
                <Sparkles className="w-9 h-9 sm:w-10 sm:h-10 text-white" />
              </div>
              
              <motion.p className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-center text-xs font-medium text-yummy-600 whitespace-nowrap bg-white/80 px-2 py-0.5 rounded-full shadow-sm border border-yummy-200" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}>
                Your Health Hub
              </motion.p>
            </div>
          </motion.div>

          {/* Pillars Grid */}
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {pillars.map((pillar, index) => (
              <motion.article
                key={pillar.title}
                className="group relative p-5 rounded-card bg-white border border-yummy-200 hover:border-transparent hover:shadow-card-hover transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.35 + index * 0.06, duration: 0.4 }}
                whileHover={{ y: -3 }}
              >
                {/* Colored top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-brand-600" />
                
                {/* Icon */}
                <motion.div
                  className={cn('w-12 h-12 rounded-lg flex items-center justify-center mb-4', `bg-${pillar.bgColor} text-${pillar.color} border border-yummy-200`)}
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <pillar.icon className="w-6 h-6" />
                </motion.div>

                {/* Content */}
                <h3 className="text-base font-bold text-yummy-900 mb-1.5">{pillar.title}</h3>
                <p className="text-yummy-600 text-sm leading-relaxed">{pillar.description}</p>

                {/* Hover indicator */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
              </motion.article>
            ))}
          </motion.div>

          {/* Supporting line */}
          <motion.p
            className="text-center text-base text-yummy-600 mt-10 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 16 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            Finally — your entire health routine connected in one intelligent system.
          </motion.p>
        </div>
      </div>
    </section>
  );
}