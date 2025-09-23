import type { Metadata } from 'next';
import TermsPage from './_view/client';

export const metadata: Metadata = {
  title: 'Terms of Service | Synaxis',
  description: 'Terms of Service for Synaxis platform and community guidelines.',
};

export default function page() {
  return <TermsPage />;
}