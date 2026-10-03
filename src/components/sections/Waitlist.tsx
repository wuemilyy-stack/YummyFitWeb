import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { User, DollarSign, CheckCircle, ArrowRight, Sparkles, Shield } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils/helpers';

export function Waitlist() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    price: '',
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.price) newErrors.price = 'Please select a price range';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  if (submitted) {
    return (
      <section
        ref={ref}
        id="waitlist"
        className="section-padding bg-gradient-to-br from-brand-800 to-brand-900 relative overflow-hidden text-white"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M0 38.59L38.59 0H40V1.41L1.41 40H0z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="container-custom relative text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="mb-6"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">You're on the list!</h2>
            <p className="text-white/80 text-base max-w-xl mx-auto mb-6">
              Thanks for joining thousands of early members shaping YummyFit. Check your inbox for confirmation and exclusive updates.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-white/70 text-xs">
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> No spam</span>
              <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Early access</span>
              <span className="flex items-center gap-1"><ArrowRight className="w-3.5 h-3.5" /> Founding priority</span>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      id="waitlist"
      className="section-padding bg-gradient-to-br from-brand-800 to-brand-900 relative overflow-hidden text-white"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M0 38.59L38.59 0H40V1.41L1.41 40H0z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      
      {/* Glow orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-brand-600/15 rounded-full blur-3xl"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 12, repeat: Infinity, delay: 3 }}
      />

      <div className="container-custom relative">
        <div className="max-w-xl mx-auto text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 24 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold mb-3 backdrop-blur-sm uppercase tracking-wider">
              Join the Waitlist
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-balance">
              Be first to experience the future of fitness and nutrition.
            </h2>
            <p className="text-white/80 text-base mb-6 max-w-xl mx-auto">
              Join thousands of early members shaping YummyFit. Get founding member pricing, early access, and a direct line to our product team.
            </p>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 16 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <CheckCircle className="w-4 h-4 text-brand-400" />
              <span>10,000+ members</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <Shield className="w-4 h-4 text-brand-400" />
              <span>No spam, ever</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Founding perks</span>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white/5 backdrop-blur-xl rounded-card p-5 sm:p-6 border border-white/10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 24 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <Input
                label="Name"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                className="bg-white/5 border-white/10 text-white placeholder-white/40 focus:ring-brand-600 focus:border-transparent"
                labelClassName="text-white/80"
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                className="bg-white/5 border-white/10 text-white placeholder-white/40 focus:ring-brand-600 focus:border-transparent"
                labelClassName="text-white/80"
              />
            </div>

            <div className="mb-5">
              <label className="label-text text-white/80">How much would you pay for YummyFit?</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {['$0-9/mo', '$10-19/mo', '$20-29/mo', '$30+/mo'].map((option) => (
                  <motion.button
                    key={option}
                    type="button"
                    onClick={() => handleChange('price', option)}
                    className={cn(
                      'px-3 py-2.5 rounded-input text-xs font-medium transition-all duration-150 border',
                      formData.price === option
                        ? 'bg-white text-brand-800 border-white shadow-md'
                        : 'bg-white/5 text-white/90 border-white/10 hover:bg-white/10 hover:border-white/20'
                    )}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + Math.random() * 0.15, type: 'spring' }}
                  >
                    {option}
                    <DollarSign className="w-3.5 h-3.5 ml-0.5 inline" />
                  </motion.button>
                ))}
              </div>
              {errors.price && (
                <p className="mt-1.5 text-xs text-red-400">{errors.price}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="w-full bg-white text-brand-800 hover:bg-white/90 shadow-md"
              loading={submitting}
            >
              Join the Waitlist
              <ArrowRight className="w-4 h-4" />
            </Button>

            <p className="mt-3 text-xs text-white/60 text-center">
              By joining, you agree to our <a href="/terms" className="underline hover:text-white">Terms</a> and <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>.
            </p>
          </motion.form>

          {/* Benefits */}
          <motion.div
            className="mt-8 grid sm:grid-cols-3 gap-3 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <div className="p-3 rounded-input bg-white/5 border border-white/10">
              <Sparkles className="w-5 h-5 mx-auto mb-1.5 text-brand-400" />
              <p className="font-medium text-white text-sm">Early Access</p>
              <p className="text-white/60 text-xs mt-0.5">Be first to download</p>
            </div>
            <div className="p-3 rounded-input bg-white/5 border border-white/10">
              <Shield className="w-5 h-5 mx-auto mb-1.5 text-brand-400" />
              <p className="font-medium text-white text-sm">Locked-In Pricing</p>
              <p className="text-white/60 text-xs mt-0.5">Founding member rates</p>
            </div>
            <div className="p-3 rounded-input bg-white/5 border border-white/10">
              <User className="w-5 h-5 mx-auto mb-1.5 text-brand-400" />
              <p className="font-medium text-white text-sm">Shape the Product</p>
              <p className="text-white/60 text-xs mt-0.5">Direct feedback line</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}