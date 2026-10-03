import { Hero } from '@/components/sections/Hero';
import { Problem } from '@/components/sections/Problem';
import { Solution } from '@/components/sections/Solution';
import { Differentiator } from '@/components/sections/Differentiator';
import { Audience } from '@/components/sections/Audience';
import { Monetization } from '@/components/sections/Monetization';
import { Waitlist } from '@/components/sections/Waitlist';
import { Footer } from '@/components/sections/Footer';

function App() {
  return (
    <>
      <Hero />
      <Problem />
      <Solution />
      <Differentiator />
      <Audience />
      <Monetization />
      <Waitlist />
      <Footer />
    </>
  );
}

export default App;