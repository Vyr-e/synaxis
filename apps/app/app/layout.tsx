import { DesignSystemProvider } from '@repo/design-system';
import '@repo/design-system/styles/globals.css';
// import { ErrorBoundary } from '@sentry';
import { CookieConsent } from '@/components/cookie-consent';
import { env } from '@repo/env';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { JSX } from 'react';

import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Synaxis',
    template: '%s | Synaxis',
  },
  description: 'Create vibrant spaces where conversations flow naturally',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Synaxis',
    description: 'Create vibrant spaces where conversations flow naturally',
    url: 'https://synaxis.to',
    siteName: 'Synaxis',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Synaxis',
    description: 'Create vibrant spaces where conversations flow naturally',
    creator: '@synaxis',
  },
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
};

type RootLayoutProperties = {
  readonly children: ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProperties): JSX.Element {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <DesignSystemProvider defaultTheme="dark">
          {children}
          <CookieConsent />
        </DesignSystemProvider>
      </body>
    </html>
  );
}
