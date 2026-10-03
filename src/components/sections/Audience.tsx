import { motion } from 'framer-motion';
import { Briefcase, HeartPulse, ShoppingBag, Baby, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/utils/helpers';

const personas = [
  {
    icon: Briefcase,
    title: 'Busy Professionals',
    description: 'Automated planners + grocery delivery',
    details: [
      '15-min efficient workouts',
      'Meal prep for hectic weeks',
      'Doorstep grocery delivery',
      'Calendar integration',
    ],
    color: 'brand-600',
    bgColor: 'yummy-100',
  },
  {
    icon: HeartPulse,
    title: 'Health & Healing',
    description: 'Allergen filters + curated recipe libraries',
    details: [
      'Custom allergen profiles',
      'Anti-inflammatory recipes',
      'Condition-specific plans',
      'Progress sharing with providers',
    ],
    color: 'brand-600',
    bgColor: 'yummy-100',
  },
  {
    icon: ShoppingBag,
    title: 'Everyday Shoppers',
    description: 'Instant food clarity with barcode scanning',
    details: [
      'Health grades on every product',
      'Better-for-you swaps',
      'Budget-friendly alternatives',
      'Pantry inventory tracking',
    ],
    color: 'brand-600',
    bgColor: 'yummy-100',
  },
  {
    icon: Baby,
    title: 'Beginners',
    description: 'Step-by-step cooking guidance + budget-friendly lists',
    details: [
      'Video cooking tutorials',
      'No-equipment workouts',
      'Simple ingredient recipes',
      'Habit-building coaching',
    ],
    color: 'brand-600',
    bgColor: 'yummy-100',
  },
];

export function Audience() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      id="audience"
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
          <span className="section-eyebrow">Who It's For</span>
          <h2 className="section-title">
            Built for real life.
          </h2>
        </motion.div>

        {/* Persona Cards */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {personas.map((persona, index) => (
            <PersonaCard key={persona.title} persona={persona} index={index} />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 16 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <p className="text-yummy-600 mb-4 max-w-xl mx-auto text-sm">
            Don't see yourself here? YummyFit adapts to <span className="font-semibold text-brand-800">your</span> unique journey — whoever you are, wherever you're starting from.
          </p>
          <a href="#waitlist" className="btn-ghost inline-flex items-center gap-1.5 text-sm">
            See all use cases
            <Sparkles className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function PersonaCard({ persona, index }: { persona: typeof personas[0]; index: number }) {
  return (
    <motion.article
      className="group relative overflow-hidden p-5 rounded-card bg-white border border-yummy-200 hover:border-transparent hover:shadow-card-hover transition-all duration-300"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.2 + index * 0.06, duration: 0.4 }}
      whileHover={{ y: -3 }}
    >
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-600" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Icon */}
        <motion.div
          className={cn('w-12 h-12 rounded-lg flex items-center justify-center mb-4', `bg-${persona.bgColor} text-${persona.color} border border-yummy-200`)}
          whileHover={{ scale: 1.05, rotate: 3 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <persona.icon className="w-6 h-6" />
        </motion.div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-yummy-900 mb-1">{persona.title}</h3>
        <p className="text-yummy-600 text-sm mb-4 flex-1">{persona.description}</p>

        {/* Details List */}
        <ul className="space-y-2 mb-5">
          {persona.details.map((detail, detailIndex) => (
            <motion.li
              key={detail}
              className="flex items-start gap-2 text-sm text-yummy-600"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + index * 0.06 + detailIndex * 0.04, duration: 0.3 }}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0', `bg-${persona.color}`)} />
              <span>{detail}</span>
            </motion.li>
          ))}
        </ul>

        {/* Bottom indicator */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />
      </div>
    </motion.article>
  );
}