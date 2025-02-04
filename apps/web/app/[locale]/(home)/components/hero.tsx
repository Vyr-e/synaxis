'use client';
import { Button } from '@repo/design-system/components/ui/button';
import { clashDisplay, lora } from '@repo/design-system/fonts';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { memo } from 'react';
import PlayButton from './PlayButton';

const AudioVisualizer = dynamic(() => import('./audio-visualizer'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-full bg-gray-200" />
  ),
});

const dynamicStyles = {
  bubble: (gradient: string) => `
    relative h-12 w-12 overflow-hidden rounded-full 
    md:h-16 md:w-16 ${gradient} 
    flex items-center justify-center 
    border border-white/20 backdrop-blur-sm
  `,
};

// Memoize bubble components to prevent unnecessary re-renders
const Bubble = memo(({ bubble }: { bubble: (typeof bubbles)[0] }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      key={bubble.id}
      className="absolute cursor-grab active:cursor-grabbing"
      style={{
        left: `calc(50% + ${bubble.position.x}px)`,
        top: `calc(50% + ${bubble.position.y}px)`,
        pointerEvents: 'auto',
        zIndex: 20,
        willChange: 'transform',
      }}
      initial={prefersReducedMotion ? { scale: bubble.size } : { scale: 0 }}
      animate={{ scale: bubble.size }}
      drag={!prefersReducedMotion}
      dragConstraints={{
        top: -300,
        left: -400,
        right: 400,
        bottom: 300,
      }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.1 }}
      transition={{
        duration: 0.2,
        delay: bubble.delay * 0.05,
      }}
    >
      <div className="group relative">
        <div className={dynamicStyles.bubble(bubble.gradient)}>
          {/* Only render AudioVisualizer for visible bubbles */}
          <div className="absolute inset-0">
            <AudioVisualizer />
          </div>
          <Image
            src={bubble.image}
            alt=""
            width={64}
            height={64}
            draggable={false}
            priority={bubble.delay === 0}
            loading={bubble.delay === 0 ? 'eager' : 'lazy'}
            className="relative z-10 h-full w-full rounded-full object-cover opacity-90 transition-transform duration-300 hover:opacity-100"
          />
        </div>
      </div>
    </motion.div>
  );
});

Bubble.displayName = 'Bubble';

// Define scattered positions that surround the content area
const bubbles = [
  {
    id: 1,
    position: { x: -180, y: -120 },
    size: 0.9,
    delay: 0,
    image: '/headshots/headshot-1.png',
    gradient: 'from-blue-100/40 to-blue-200/40',
  },
  {
    id: 2,
    position: { x: 160, y: -140 },
    size: 1,
    delay: 0.2,
    image: '/headshots/headshot-2.png',
    gradient: 'from-purple-100/40 to-purple-200/40',
  },
  {
    id: 3,
    position: { x: -150, y: 30 },
    size: 0.85,
    delay: 0.4,
    image: '/headshots/headshot-3.png',
    gradient: 'from-emerald-100/40 to-emerald-200/40',
  },
  {
    id: 4,
    position: { x: 140, y: 60 },
    size: 0.95,
    delay: 0.6,
    image: '/headshots/headshot-4.png',
    gradient: 'from-rose-100/40 to-rose-200/40',
  },
  {
    id: 5,
    position: { x: -120, y: 140 },
    size: 1.1,
    delay: 0.8,
    image: '/headshots/headshot-5.png',
    gradient: 'from-amber-100/40 to-amber-200/40',
  },
  {
    id: 6,
    position: { x: 130, y: 120 },
    size: 0.8,
    delay: 1,
    image: '/headshots/headshot-6.png',
    gradient: 'from-cyan-100/40 to-cyan-200/40',
  },
];

export const Hero = () => {
  const t = useTranslations('hero');
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`hero-section relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-white py-6 pt-24 pb-8 shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.05)] md:min-h-[80dvh] ${clashDisplay.className}`}
    >
      <div className="relative mx-auto max-w-5xl px-4">
        <motion.div
          initial={prefersReducedMotion || { y: 10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative text-center"
        >
          <div className="mb-6 flex items-center justify-center">
            <div className="flex items-center space-x-2 rounded-full border border-gray-300 bg-white px-3 py-1 shadow-md md:px-4 md:py-2">
              <PlayButton size={16} color="#4A5568" />
              <p className="text-gray-700">Coming soon</p>
            </div>
          </div>
          <h1 className="mb-6 font-bold text-4xl tracking-tight md:mb-8 md:text-7xl">
            {t('title')}
          </h1>

          <p
            className={`mx-auto mb-8 max-w-2xl text-gray-600 text-lg sm:text-xl md:mb-12 md:text-2xl ${lora.className}`}
          >
            {t('description')}
          </p>

          <div className="flex flex-col items-center gap-4 md:gap-6">
            <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 md:flex-row">
              <input
                type="email"
                placeholder={t('cta.email')}
                className="w-full rounded-full border-2 border-black/20 bg-transparent px-4 py-3 text-lg transition-all focus:outline-none md:flex-1"
              />
              <Button
                size="lg"
                className="w-full rounded-full bg-black px-6 py-3 font-medium text-lg text-white md:w-auto"
              >
                {t('cta.button')}
              </Button>
            </div>
            <p className="font-medium text-gray-500 text-sm">
              {t('cta.subtext')}
            </p>
          </div>
        </motion.div>

        {/* Bubbles container */}
        {/* <div className="pointer-events-none absolute inset-0">
          {bubbles.map((bubble) => (
            <Bubble key={bubble.id} bubble={bubble} />
          ))}
        </div> */}
      </div>
    </div>
  );
};
