import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { BrandMark } from '@/components/ui/Brand';
import { Check, X, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/utils/helpers';

const features = [
  { name: 'Personalized Workouts', fitness: true, diet: false, grocery: false, yummyfit: true },
  { name: 'Adaptive Meal Planning', fitness: false, diet: true, grocery: false, yummyfit: true },
  { name: 'Barcode Health Scoring', fitness: false, diet: false, grocery: false, yummyfit: true },
  { name: 'Grocery Delivery Integration', fitness: false, diet: false, grocery: true, yummyfit: true },
  { name: 'Real-Time Coaching', fitness: true, diet: false, grocery: false, yummyfit: true },
  { name: 'Progress Tracking', fitness: true, diet: true, grocery: false, yummyfit: true },
  { name: 'Community Features', fitness: true, diet: true, grocery: false, yummyfit: true },
  { name: 'AI-Powered Insights', fitness: false, diet: false, grocery: false, yummyfit: true },
];

const columns = [
  { key: 'fitness', label: 'Fitness Apps', color: 'brand-600', bg: 'yummy-100' },
  { key: 'diet', label: 'Diet Apps', color: 'brand-600', bg: 'yummy-100' },
  { key: 'grocery', label: 'Grocery Apps', color: 'brand-600', bg: 'yummy-100' },
  { key: 'yummyfit', label: 'YummyFit', color: 'brand-600', bg: 'yummy-100', highlight: true },
];

export function Differentiator() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      id="differentiator"
      className="section-padding bg-yummy-50 relative overflow-hidden"
    >
      {/* Background blobs - subtle */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 right-1/4 w-72 h-72 bg-brand-100/50 rounded-full blur-3xl"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 w-72 h-72 bg-brand-100/50 rounded-full blur-3xl"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 14, repeat: Infinity, delay: 3 }}
        />
      </div>

      <div className="container-custom relative">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 24 }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-eyebrow">Why YummyFit</span>
          <h2 className="section-title">
            Why YummyFit is different
          </h2>
          <p className="section-subtitle mt-3">
            Users currently juggle 3–4 separate apps to manage their health. YummyFit consolidates the entire stack.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          className="overflow-hidden rounded-card border border-yummy-200 bg-white shadow-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 24 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-yummy-200">
                  <th className="w-56 px-4 py-3 text-left font-semibold text-yummy-900 bg-yummy-50 text-sm">
                    Feature
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={cn(
                        'px-3 py-3 text-center font-semibold text-sm',
                        col.highlight ? 'text-brand-800 bg-yummy-50' : 'text-yummy-600 bg-yummy-50'
                      )}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="flex items-center gap-1.5">
                          <span className={cn('w-2 h-2 rounded-full', `bg-${col.color}`)} />
                          {col.label}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-yummy-200">
                {features.map((feature, rowIndex) => (
                  <motion.tr
                    key={feature.name}
                    className={cn('transition-colors', rowIndex % 2 === 0 ? 'bg-white' : 'bg-yummy-50/50')}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + rowIndex * 0.04, duration: 0.3 }}
                  >
                    <td className="w-56 px-4 py-3 font-medium text-yummy-900 text-sm">
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {feature.name}
                      </span>
                    </td>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          'px-3 py-3 text-center',
                          col.highlight && 'bg-yummy-50/50'
                        )}
                      >
                        {feature[col.key as keyof typeof feature] ? (
                          <motion.div
                            className={cn('inline-flex items-center justify-center w-7 h-7 mx-auto rounded-full', `bg-${col.bg} text-${col.color}`)}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3 + rowIndex * 0.04, type: 'spring', stiffness: 200 }}
                          >
                            <Check className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-7 h-7 mx-auto rounded-full bg-yummy-200 text-yummy-400">
                            <X className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Supporting line */}
        <motion.p
          className="text-center text-base text-yummy-600 mt-6 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 16 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <span className="font-semibold text-brand-800">The only platform connecting the entire journey.</span>
        </motion.p>

        {/* Highlight cards */}
        <motion.div
          className="grid sm:grid-cols-3 gap-4 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <HighlightCard
            icon="🎯"
            title="Unified Data"
            description="Workouts inform meals, meals generate grocery lists, coaches see it all"
          />
          <HighlightCard
            icon={<BrandMark className="w-7 h-7" />}
            title="Real-Time Sync"
            description="Change a workout, your meal plan and grocery list update instantly"
          />
          <HighlightCard
            icon="🧠"
            title="AI Intelligence"
            description="One brain learning your preferences across fitness, nutrition & lifestyle"
          />
        </motion.div>
      </div>
    </section>
  );
}

function HighlightCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <motion.div
      className="p-5 rounded-card bg-white border border-yummy-200 hover:border-brand-300 hover:shadow-card-hover transition-all duration-300"
      whileHover={{ y: -3 }}
    >
      <span className="text-2xl mb-3 block">{icon}</span>
      <h3 className="text-base font-bold text-yummy-900 mb-1.5">{title}</h3>
      <p className="text-yummy-600 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
