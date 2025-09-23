import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Synaxis',
    default: 'Legal | Synaxis',
  },
  description: 'Legal documents and policies for Synaxis platform.',
};

export default function LegalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}