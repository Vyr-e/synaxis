import { DesignSystemProvider, cn } from '@repo/design-system';
import { clashDisplay } from '@repo/design-system/fonts';
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
    <html
      lang="en"
      className={cn(inter.className, clashDisplay.variable)}
      suppressHydrationWarning
    >
      <body>
        <DesignSystemProvider defaultTheme="light">
          {children}
          <CookieConsent />
        </DesignSystemProvider>
      </body>
    </html>
  );
}
