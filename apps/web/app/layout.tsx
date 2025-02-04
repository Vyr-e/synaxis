import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
