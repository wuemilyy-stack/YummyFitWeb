import { motion } from 'framer-motion';
import { Dumbbell, Calendar, Barcode, ListChecks, MessageSquare, Trophy } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/utils/helpers';

const glimpses = [
  {
    icon: Dumbbell,
    title: 'Adaptive Workout Card',
    description: 'AI-powered workouts that evolve with your progress',
    color: 'brand-600',
    bgColor: 'yummy-100',
  },
  {
    icon: Calendar,
    title: 'Auto-Built Weekly Meal Plan',
    description: 'Personalized nutrition that fits your schedule',
    color: 'brand-600',
    bgColor: 'yummy-100',
  },
  {
    icon: Barcode,
    title: 'Barcode Health Grade',
    description: 'Instant nutrition scoring with a quick scan',
    color: 'brand-600',
    bgColor: 'yummy-100',
  },
  {
    icon: ListChecks,
    title: 'Grocery List Auto-Filled',
    description: 'One-tap ordering from your meal plan',
    color: 'brand-600',
    bgColor: 'yummy-100',
  },
  {
    icon: MessageSquare,
    title: 'Coach Chat Bubble',
    description: 'Real-time guidance when you need it most',
    color: 'brand-600',
    bgColor: 'yummy-100',
  },
  {
    icon: Trophy,
    title: 'Progress Badge',
    description: 'Celebrate every milestone on your journey',
    color: 'brand-600',
    bgColor: 'yummy-100',
  },
];

export function ProductGlimpses() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      id="features"
      className="section-padding bg-white relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%232f850f%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M0 38.59L38.59 0H40V1.41L1.41 40H0z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />

      <div className="container-custom relative">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 24 }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-eyebrow">Product Glimpses</span>
          <h2 className="section-title">
            A peek inside the experience
          </h2>
        </motion.div>

        {/* Glimpses Grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {glimpses.map((glimpse, index) => (
            <motion.article
              key={glimpse.title}
              className="group relative overflow-hidden rounded-card bg-white border border-yummy-200 hover:border-transparent hover:shadow-card-hover transition-all duration-300"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05, duration: 0.4 }}
              whileHover={{ y: -4 }}
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-brand-600" />

              {/* Card Content */}
              <div className="p-5 relative">
                {/* Icon */}
                <motion.div
                  className={cn('w-12 h-12 rounded-lg flex items-center justify-center mb-4', `bg-${glimpse.bgColor} text-${glimpse.color} border border-yummy-200`)}
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <glimpse.icon className="w-6 h-6" />
                </motion.div>

                <h3 className="text-base font-bold text-yummy-900 mb-1.5">{glimpse.title}</h3>
                <p className="text-yummy-600 text-sm leading-relaxed">{glimpse.description}</p>
              </div>

              {/* Bottom preview area */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-20 bg-yummy-50 border-t border-yummy-200 opacity-0 group-hover:opacity-100 transition-all duration-200"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="h-full flex items-center justify-center">
                  <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white rounded-input border border-yummy-200 shadow-sm">
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-brand-300" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.2, repeat: Infinity, delay: index * 0.15 }} />
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-brand-300" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.2, repeat: Infinity, delay: index * 0.15 + 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-brand-300" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.2, repeat: Infinity, delay: index * 0.15 + 0.4 }} />
                  </div>
                </div>
              </motion.div>
            </motion.article>
          ))}
        </motion.div>

        {/* Supporting line */}
        <motion.p
          className="text-center text-base text-yummy-600 mt-8 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 16 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          Designed to make healthy choices effortless — from sweat to supper.
        </motion.p>
      </div>
    </section>
  );
}