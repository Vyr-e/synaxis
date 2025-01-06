'use client'
import { Button } from '@repo/design-system/components/ui/button';
import { env } from '@repo/env';
import Link from 'next/link';
import AudioVisualizer from './audio-visualizer';
import { motion } from 'framer-motion';
import { clashDisplay, lora } from "@repo/design-system/fonts";
import Image from 'next/image';
import { useTranslations } from 'next-intl';

// Define scattered positions that surround the content area
const bubbles = [
  {
    id: 1,
    position: { x: -180, y: -120 },
    size: 0.9,
    delay: 0,
    image: '/headshots/headshot-1.png',
    gradient: 'from-blue-100/40 to-blue-200/40'
  },
  {
    id: 2,
    position: { x: 160, y: -140 },
    size: 1,
    delay: 0.2,
    image: '/headshots/headshot-2.png',
    gradient: 'from-purple-100/40 to-purple-200/40'
  },
  {
    id: 3,
    position: { x: -150, y: 30 },
    size: 0.85,
    delay: 0.4,
    image: '/headshots/headshot-3.png',
    gradient: 'from-emerald-100/40 to-emerald-200/40'
  },
  {
    id: 4,
    position: { x: 140, y: 60 },
    size: 0.95,
    delay: 0.6,
    image: '/headshots/headshot-4.png',
    gradient: 'from-rose-100/40 to-rose-200/40'
  },
  {
    id: 5,
    position: { x: -120, y: 140 },
    size: 1.1,
    delay: 0.8,
    image: '/headshots/headshot-5.png',
    gradient: 'from-amber-100/40 to-amber-200/40'
  },
  {
    id: 6,
    position: { x: 130, y: 120 },
    size: 0.8,
    delay: 1,
    image: '/headshots/headshot-6.png',
    gradient: 'from-cyan-100/40 to-cyan-200/40'
  }
];


export const Hero = () => {
  const t = useTranslations('hero')

  return (
    <div className={`hero-section relative w-full min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden ${clashDisplay.className}`}>
      <div className="relative max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center relative"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 md:mb-8 tracking-tight">
            {t('title')}
          </h1>
          
          <p className={`text-lg sm:text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-8 md:mb-12 ${lora.className}`}>
            {t('description')}
          </p>

          <div className="flex flex-col items-center gap-4 md:gap-6">
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-md mx-auto items-center">
              <input 
                type="email" 
                placeholder={t('cta.email')}
                className="w-full md:flex-1 px-4 py-3 rounded-full border-2 border-black/20 
                focus:outline-none bg-transparent transition-all text-lg"
              />
              <Button 
                size="lg" 
                className="w-full md:w-auto rounded-full px-6 py-6 bg-black text-white text-lg font-medium"
              >
                {t('cta.button')}
              </Button>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              {t('cta.subtext')}
            </p>
          </div>
        </motion.div>

        {/* Scattered Audio Bubbles with Headshots - Now with higher z-index */}
        <div className="absolute inset-0" style={{ pointerEvents: 'none' }}>
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              className="absolute cursor-grab active:cursor-grabbing"
              style={{
                left: `calc(50% + ${bubble.position.x}px)`,
                top: `calc(50% + ${bubble.position.y}px)`,
                pointerEvents: 'auto',
                zIndex: 20
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1,
                scale: bubble.size
              }}
              drag
              dragConstraints={{
                top: -300,
                left: -400,
                right: 400,
                bottom: 300
              }}
              dragElastic={0.1}
              whileDrag={{ scale: 1.1 }}
              transition={{
                duration: 1,
                ease: "easeOut"
              }}
            >
              <div className="relative group">
                <div className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden 
                  bg-gradient-to-br ${bubble.gradient} backdrop-blur-sm border border-white/20 flex items-center justify-center`}>
                  <div className="absolute inset-0 -z-10">
                    <AudioVisualizer />
                  </div>
                  <Image
                    src={bubble.image}
                    alt="Community member"
                    width={64}
                    height={64}
                    draggable={false}
                    className="object-cover w-full h-full rounded-full relative z-10 opacity-90 hover:opacity-100 transition-all duration-300"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
