'use client';
import { clashDisplay, lora } from '@repo/design-system/fonts';
import { AnimatePresence, motion } from 'framer-motion';
import {} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export function HowItWorks() {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalDuration = 15000; // 8 seconds per step

  const steps = [
    {
      id: 1,
      title: t('howItWorks.steps.discover.title'),
      description: t('howItWorks.steps.discover.description'),
      features: [
        {
          title: t('howItWorks.steps.discover.features.discovery.title'),
          content: t('howItWorks.steps.discover.features.discovery.content'),
        },
        {
          title: t('howItWorks.steps.discover.features.types.title'),
          content: t('howItWorks.steps.discover.features.types.content'),
        },
        {
          title: t('howItWorks.steps.discover.features.formats.title'),
          content: t('howItWorks.steps.discover.features.formats.content'),
        },
        {
          title: t('howItWorks.steps.discover.features.profile.title'),
          content: t('howItWorks.steps.discover.features.profile.content'),
        },
      ],
      demo: {
        type: 'video',
        src: '/path/to/demo1.mp4',
      },
    },
    {
      id: 2,
      title: t('howItWorks.steps.engage.title'),
      description: t('howItWorks.steps.engage.description'),
      features: [
        {
          title: t('howItWorks.steps.engage.features.audio.title'),
          content: t('howItWorks.steps.engage.features.audio.content'),
        },
        {
          title: t('howItWorks.steps.engage.features.interactive.title'),
          content: t('howItWorks.steps.engage.features.interactive.content'),
        },
        {
          title: t('howItWorks.steps.engage.features.management.title'),
          content: t('howItWorks.steps.engage.features.management.content'),
        },
        {
          title: t('howItWorks.steps.engage.features.engagement.title'),
          content: t('howItWorks.steps.engage.features.engagement.content'),
        },
      ],
    },
    {
      id: 3,
      title: t('howItWorks.steps.manage.title'),
      description: t('howItWorks.steps.manage.description'),
      features: [
        {
          title: t('howItWorks.steps.manage.features.ticketing.title'),
          content: t('howItWorks.steps.manage.features.ticketing.content'),
        },
        {
          title: t('howItWorks.steps.manage.features.promotional.title'),
          content: t('howItWorks.steps.manage.features.promotional.content'),
        },
        {
          title: t('howItWorks.steps.manage.features.guest.title'),
          content: t('howItWorks.steps.manage.features.guest.content'),
        },
        {
          title: t('howItWorks.steps.manage.features.analytics.title'),
          content: t('howItWorks.steps.manage.features.analytics.content'),
        },
      ],
    },
  ];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % steps.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + steps.length) % steps.length);
    setProgress(0);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + (100 / intervalDuration) * 100; // Update every 100ms
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section
      id="how-it-works"
      className="relative mt-1.5 min-h-[40em] overflow-hidden rounded-lg bg-white py-8 shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.05)]"
    >
      <div className="sticky top-0 z-10 bg-white/80 py-1 backdrop-blur-sm">
        <h2 className="text-center font-bold font-clash-display text-3xl sm:text-4xl md:text-5xl">
          {t('howItWorks.title')}
        </h2>
        <p
          className={`px-2 text-center text-gray-600 md:px-0 ${lora.className}`}
        >
          {t('howItWorks.subtitle')}
        </p>
      </div>

      <div className="relative flex h-full flex-col px-12 py-4">
        {/* Content Carousel */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{
              x: direction > 0 ? '100%' : '-100%',
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: direction > 0 ? '-100%' : '100%',
              opacity: 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="w-full"
          >
            <motion.h3
              className={`mb-4 text-center font-bold text-2xl ${clashDisplay.className}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {steps[currentIndex].title}
            </motion.h3>

            <motion.p
              className={`mb-6 text-center text-gray-600 ${lora.className}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {steps[currentIndex].description}
            </motion.p>

            <div className="flex flex-wrap gap-4 md:grid md:grid-cols-2">
              {steps[currentIndex].features.map((feature, featureIndex) => (
                <motion.div
                  key={feature.title}
                  className="w-full rounded-lg bg-gray-50/50 p-4 backdrop-blur-sm transition-colors hover:bg-gray-100/50 md:w-auto"
                  initial={{
                    opacity: 0,
                    x: featureIndex % 2 === 0 ? -20 : 20,
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.4 + featureIndex * 0.1,
                    type: 'spring',
                    stiffness: 100,
                  }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                >
                  <h4 className="mb-2 font-medium">{feature.title}</h4>
                  <p className="text-gray-600 text-sm">{feature.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
      </div>
      <div className="absolute right-0 bottom-0 left-0 z-20 bg-gradient-to-t from-white via-white/90 to-transparent pt-4 pb-8">
        <div className="flex justify-center gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
                setProgress(0);
              }}
              type="button"
              className={`h-1.5 rounded-full transition-all ${
                currentIndex === index
                  ? 'w-6 bg-purple-600'
                  : 'w-1.5 bg-gray-300'
              }`}
              style={
                currentIndex === index
                  ? {
                      background: `linear-gradient(to right, #6c5ce7 ${progress}%, #6c5ce767; ${progress}%)`,
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
