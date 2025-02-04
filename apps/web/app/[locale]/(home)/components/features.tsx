'use client';

import Progress from '@/components/slider/Test';
import { lora } from '@repo/design-system/fonts';
import { AnimatePresence, motion } from 'framer-motion';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

export function Features() {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const features = [
    {
      id: 1,
      title: t('features.community.title'),
      description: t('features.community.description'),
      videoPath:
        'https://vsfl8k9xl7.ufs.sh/f/YmWCpnAsgDkwxJCyhvTBGMo2WERg4lOp0kvw9scFCm7TVSLQ',
      duration: 9,
    },
    {
      id: 2,
      title: t('features.events.title'),
      description: t('features.events.description'),
      videoPath:
        'https://vsfl8k9xl7.ufs.sh/f/YmWCpnAsgDkwIgFcuPyYtXcng83oTNQzkvI6F2hKpysHL4md',
      duration: 29,
    },
    {
      id: 3,
      title: t('features.audio.title'),
      description: t('features.audio.description'),
      videoPath:
        'https://vsfl8k9xl7.ufs.sh/f/YmWCpnAsgDkwQPkVx6llE4V5LSr9PRCmuNF8o6q7DWzAhgGd',
      duration: 19,
    },
  ];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % features.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Ignore errors - video might be removed or not ready
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const currentFeature = features[currentIndex];
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      let playPromise: Promise<void> | undefined;

      const playVideo = () => {
        if (isPlaying) {
          playPromise = video.play();
        }
      };

      video.load();
      video.addEventListener('loadedmetadata', playVideo);

      return () => {
        if (playPromise !== undefined) {
          playPromise.then(() => {
            video.pause();
          });
        }
        video.removeEventListener('loadedmetadata', playVideo);
      };
    }
  }, [currentIndex, isPlaying]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateProgress = () => {
        const currentTime = video.currentTime;
        const duration = video.duration;
        if (duration > 0) {
          const calculatedProgress = (currentTime / duration) * 100;
          setProgress(calculatedProgress);

          if (calculatedProgress >= 99.5) {
            handleNext();
            setProgress(0);
          }
        }
      };

      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('ended', handleNext);

      return () => {
        video.removeEventListener('timeupdate', updateProgress);
        video.removeEventListener('ended', handleNext);
      };
    }
  }, [currentFeature]);

  return (
    <section
      id="features"
      className="mt-1.5 flex h-fit flex-col items-center justify-center overflow-hidden rounded-lg bg-white py-12 shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.05)] md:h-[40em]"
    >
      <h2 className="mb-2 text-center font-bold font-clash-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
        {t('features.title')}
      </h2>
      <p
        className={`mb-8 max-w-2xl px-4 text-center text-gray-600 text-sm sm:text-base ${lora.className}`}
      >
        {t('features.description')}
      </p>

      <div className="relative w-full max-w-[1000px] px-4">
        <div className="flex flex-col gap-4">
          {/* Video */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.video
                key={currentFeature.id}
                ref={videoRef}
                src={currentFeature.videoPath}
                className="h-full w-full object-cover"
                initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                autoPlay={isPlaying}
                muted
                loop={false}
                playsInline
              />
            </AnimatePresence>
          </div>

          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeature.id}
              className="px-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3
                className={`text-lg sm:text-xl ${lora.className} font-semibold`}
              >
                {currentFeature.title}
              </h3>
              <p
                className={`mt-1 text-gray-600 text-xs sm:text-sm ${lora.className}`}
              >
                {currentFeature.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <button
              type="button"
              className="flex aspect-square w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-md transition-all duration-300 ease-in-out hover:bg-white/20 sm:w-10"
              onClick={handlePrev}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-6 sm:w-6"
                fill="#000000"
                viewBox="0 0 256 256"
              >
                <title>Left arrow</title>
                <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
              </svg>
            </button>

            <div className="relative aspect-square w-12 rounded-full sm:w-14">
              <Progress
                activeIndex={currentIndex}
                totalSlides={features.length}
                progress={progress}
                size={56}
              />
              <button
                type="button"
                className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex aspect-square w-6 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-md transition-all duration-300 ease-in-out hover:bg-white/20 sm:w-8"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <PauseIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <PlayIcon className="ml-0.5 h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            </div>

            <button
              type="button"
              className="flex aspect-square w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-md transition-all duration-300 ease-in-out hover:bg-white/20"
              onClick={handleNext}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="#000000"
                viewBox="0 0 256 256"
              >
                <title>Right arrow</title>
                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
