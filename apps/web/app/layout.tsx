import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
	icons: {
		icon: '/icon.png',
	},
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
