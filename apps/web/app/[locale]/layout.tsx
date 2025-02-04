import '@repo/design-system/styles/globals.css';
import '../styles/web.css';
import { Header } from '@/components/header';
import type { Locale } from '@/config/languages';
import { routing } from '@/i18n/routing';
import { DesignSystemProvider } from '@repo/design-system';
import { clashDisplay, lora } from '@repo/design-system/fonts';
import { cn } from '@repo/design-system/lib/utils';
import { LenisProvider } from '@repo/ui-utils/components/smooth-scroll';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

type LocaleLayoutProperties = {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProperties) {
  const { locale } = await params;
  if (!routing.locales.includes(await locale)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html
      lang={(await locale) || 'en'}
      className={cn('scroll-smooth', clashDisplay.variable, lora.variable)}
      suppressHydrationWarning
    >
      <body className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/20 hover:scrollbar-thumb-black/30">
        <NextIntlClientProvider messages={messages}>
          <DesignSystemProvider defaultTheme="light">
            <main className="accent min-h-dvh px-2 py-2 antialiased">
              <Header />
              <LenisProvider>{children}</LenisProvider>
            </main>
          </DesignSystemProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
