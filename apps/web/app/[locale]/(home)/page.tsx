import { Hero } from './components/hero';
import {Features} from './components/features'
import { HowItWorks } from './components/how-it-works'

import { createMetadata } from '@repo/seo/metadata';
import type {Metadata} from 'next'
import { LenisProvider } from '@repo/ui-utils';



const meta = {
  title: 'Synaxis - Connecting Voices, Building Communities',
  description:
    "Create vibrant spaces where conversations flow naturally and every voice matters. Host dynamic events that bring people together.",
};

export const metadata: Metadata = createMetadata(meta);

export default function HomePage() {
  return (
    <main>
      <>
        <Hero />
        <Features/>
        <HowItWorks />
      </>
    </main>
  );
}
