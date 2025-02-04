import { Features } from './components/features';
import { Hero } from './components/hero';
import { HowItWorks } from './components/how-it-works';

import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { Pricing } from './components/pricing';
import { PricingProvider } from './components/pricing-context';
import { Support } from './components/support';

const meta = {
  title: 'Synaxis - Connecting Voices, Building Communities',
  description:
    'Create vibrant spaces where conversations flow naturally and every voice matters. Host dynamic events that bring people together.',
};

export const metadata: Metadata = createMetadata(meta);

export default function HomePage() {
  return (
    <PricingProvider>
      <main>
        <Hero />
        <div className="grid grid-cols-1 gap-1.5 md:grid-cols-5">
          <div className="md:col-span-2">
            <Features />
          </div>
          <div className="md:col-span-3">
            <HowItWorks />
          </div>
        </div>
        <Pricing />
        <Support />
      </main>
    </PricingProvider>
  );
}
