import { motion } from 'framer-motion';
import { Brain, Clock, FileText, Quote } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/utils/helpers';

const problemCards = [
  {
    icon: Brain,
    title: 'The Knowledge Gap',
    quote: '"I have a gym app, a calorie app, and a grocery app… and I\'m still confused."',
    color: 'brand-600',
    bgColor: 'yummy-100',
  },
  {
    icon: Clock,
    title: 'The Time Deficit',
    quote: '"I\'m exhausted before I even start cooking."',
    color: 'brand-600',
    bgColor: 'yummy-100',
  },
  {
    icon: FileText,
    title: 'The Information Maze',
    quote: '"Food labels feel like they\'re actively tricking me."',
    color: 'brand-600',
    bgColor: 'yummy-100',
  },
];

export function Problem() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      id="problem"
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
          <span className="section-eyebrow">The Problem</span>
          <h2 className="section-title">
            Most people want to eat better, move more, and feel amazing — but today's health journey is a maze.
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {problemCards.map((card, index) => (
            <motion.article
              key={card.title}
              className="group relative p-6 rounded-card bg-white border border-yummy-200 hover:border-brand-300 hover:shadow-card-hover transition-all duration-300"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.08, duration: 0.4 }}
              whileHover={{ y: -4 }}
            >
              {/* Icon Wrapper */}
              <motion.div
                className={cn('w-12 h-12 rounded-lg flex items-center justify-center mb-4', `bg-${card.bgColor} text-${card.color} border border-yummy-200`)}
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <card.icon className="w-6 h-6" />
              </motion.div>

              {/* Title */}
              <h3 className="text-lg font-bold text-yummy-900 mb-3">{card.title}</h3>

              {/* Quote */}
              <motion.blockquote className="relative pl-3 border-l-2 border-yummy-200">
                <Quote className="absolute -left-2 -top-1 w-5 h-5 text-yummy-200" />
                <p className="text-yummy-600 leading-relaxed italic text-sm">{card.quote}</p>
              </motion.blockquote>

              {/* Decorative accent */}
              <motion.div
                className="absolute bottom-0 right-0 w-20 h-20 rounded-tr-card opacity-5"
                style={{ background: `linear-gradient(135deg, transparent 50%, ${card.color} 50%)` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + index * 0.08, type: 'spring' }}
              />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}