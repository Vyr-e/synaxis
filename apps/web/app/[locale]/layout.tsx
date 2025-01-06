import '@repo/design-system/styles/globals.css';
import '../styles/web.css';
import { DesignSystemProvider } from '@repo/design-system';
import { clashDisplay, lora } from '@repo/design-system/fonts';
import { cn } from '@repo/design-system/lib/utils';
import { LenisProvider } from '@repo/ui-utils';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Header } from '../components/header';
import { Locale } from '@/config/languages';
// import { Inter } from "next/font/google"
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';

// const inter = Inter({
// 	subsets: ['latin'],
// 	variable: '--font-inter',
// });



type LocaleLayoutProperties = {
	children: ReactNode;
	params: { locale: Promise<Locale> };
};

export default async function LocaleLayout({ 
	children, 
	params 
}: LocaleLayoutProperties) {
	
	const { locale } = await params || "en";
	if (!routing.locales.includes(await locale)) notFound()
	const messages =await  getMessages();

	return (
		<html
			lang={await locale}
			className={cn(
				'scroll-smooth',
				// inter.variable,
				clashDisplay.variable,
				lora.variable
			)}
			suppressHydrationWarning
		>
			<body className="font-sans">
				<NextIntlClientProvider messages={messages}>
					<DesignSystemProvider defaultTheme='light'>
						<LenisProvider>
							<main className='h-dvh p-4 antialiased'>
								<Header />
								{children}
							</main>
						</LenisProvider>
					</DesignSystemProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
} 