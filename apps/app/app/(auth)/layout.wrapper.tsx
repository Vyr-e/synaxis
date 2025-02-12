'use client';
import type { ReactNode } from 'react';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function AuthLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(pathname.includes('sign') ? 'dark' : 'light');
  }, [setTheme, pathname]);
  return <div className="bg-black">{children}</div>;
}
