import type { Metadata } from 'next';
import PrivacyPage from './_view/client';

export const metadata: Metadata = {
  title: 'Privacy Policy | Synaxis',
  description: 'Privacy Policy for Synaxis platform and data protection practices.',
};

export default function page() {
  return <PrivacyPage />;
}