'use client';
import type { ReactNode } from 'react';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function AuthLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setTheme(pathname.includes('auth') ? 'dark' : (theme as string));
  }, []); // Let it run on mount this way it will be set to dark if the user is on the auth page and any other page will be set to the theme the user has set
  return <div className="bg-black">{children}</div>;
}
