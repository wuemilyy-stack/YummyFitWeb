import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Hero } from '@/components/sections/Hero';
import { Problem } from '@/components/sections/Problem';
import { Solution } from '@/components/sections/Solution';
import { ProductGlimpses } from '@/components/sections/ProductGlimpses';
import { Differentiator } from '@/components/sections/Differentiator';
import { Audience } from '@/components/sections/Audience';
import { SocialProof } from '@/components/sections/SocialProof';
import { Monetization } from '@/components/sections/Monetization';
import { Waitlist } from '@/components/sections/Waitlist';
import { AboutFaq } from '@/components/sections/AboutFaq';
import { Footer } from '@/components/sections/Footer';
import { Legal } from '@/pages/Legal';
import { sitePath } from '@/config/site';
function Home() {
  return <><Hero /><main><Problem /><Solution /><ProductGlimpses /><Differentiator /><Audience />
    <SocialProof /><Monetization /><AboutFaq /><Waitlist /></main><Footer /></>;
}
function NotFound() {
  return <main className="container-custom py-24"><h1 className="text-4xl font-bold">Page not found</h1>
    <p className="my-5">The page you requested is unavailable.</p><a href={sitePath()} className="btn-primary">Return to YummyFit</a></main>;
}
function App() {
  return <MotionConfig reducedMotion="user"><BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
    <Routes><Route path="/" element={<Home />} /><Route path="/privacy" element={<Legal page="privacy" />} />
      <Route path="/terms" element={<Legal page="terms" />} /><Route path="/cookies" element={<Legal page="cookies" />} />
      <Route path="*" element={<NotFound />} /></Routes>
  </BrowserRouter></MotionConfig>;
}
export default App;
