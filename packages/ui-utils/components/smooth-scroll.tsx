'use client';

import gsap from 'gsap';
import { ReactLenis, useLenis } from 'lenis/react';
import { type ReactNode, useEffect, useRef } from 'react';

interface LenisProviderProps {
  children: Readonly<ReactNode>;
  options?: {
    // Core options
    duration?: number;
    easing?: (t: number) => number;
    lerp?: number;
    smoothWheel?: boolean;

    // Touch handling
    smoothTouch?: boolean;
    touchMultiplier?: number;
    syncTouch?: boolean;
    syncTouchLerp?: number;
    touchInertiaMultiplier?: number;

    // Scroll behavior
    orientation?: 'vertical' | 'horizontal';
    gestureOrientation?: 'vertical' | 'horizontal' | 'both';
    infinite?: boolean;
    wheelMultiplier?: number;

    // Advanced options
    autoResize?: boolean;
    autoRaf?: boolean;
    overscroll?: boolean;
  };
  onScroll?: (e: {
    scroll: number;
    limit: number;
    velocity: number;
    direction: number;
    progress: number;
  }) => void;
}

export function LenisProvider({
  children,
  options = {},
  onScroll,
}: LenisProviderProps) {
  const lenisRef = useRef(null);

  // Use Lenis hook for scroll updates
  useLenis(({ scroll, limit, velocity, direction, progress }) => {
    onScroll?.({ scroll, limit, velocity, direction, progress });
  });

  useEffect(() => {
    function update(time: number) {
      //@ts-ignore
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    // Use GSAP ticker for smooth animation
    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        // Default options
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,

        // Advanced defaults
        lerp: 0.1,
        autoResize: true,
        syncTouch: false,
        syncTouchLerp: 0.075,
        touchInertiaMultiplier: 35,
        autoRaf: false, // We're using GSAP ticker
        ...options,
      }}
    >
      {children}
    </ReactLenis>
  );
}

// Export utility for manual scroll control
export function scrollTo(
  target: string | number | HTMLElement,
  options?: {
    offset?: number;
    lerp?: number;
    duration?: number;
    immediate?: boolean;
    lock?: boolean;
    onComplete?: () => void;
  }
) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const lenis = (window as any).lenis;
  if (lenis) {
    lenis.scrollTo(target, options);
  }
}
