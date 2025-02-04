'use client';
import Menu from '@/app/[locale]/(home)/components/menu';
import { clashDisplay } from '@repo/design-system/fonts';
import { useEffect, useState } from 'react';
import { AnimatedIcon } from '../animated-logo';

export function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showScrollbar, setShowScrollbar] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setShowScrollbar(false);
      } else {
        setShowScrollbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  if (!isMounted) {
    return null;
  }

  return (
    <nav
      className={`${clashDisplay.className} fixed top-8 right-0 left-0 z-50`}
      style={{ overflow: showScrollbar ? 'auto' : 'hidden' }}
    >
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="rounded-full ring-2 ring-white ">
            <AnimatedIcon dark={true} w="w-6" h="h-6" />
          </div>
          <span className="rounded-full bg-white px-3 py-1 font-bold text-black/90 text-xl mix-blend-difference">
            Synaxis
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Menu />
        </div>
      </div>
    </nav>
  );
}
