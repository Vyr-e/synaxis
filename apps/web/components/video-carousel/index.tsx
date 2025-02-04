'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import Progress from '../slider/Test';

interface VideoCarouselProps {
  items: {
    id: number;
    title: string;
    description: string;
    videoPath: string;
    duration: number;
  }[];
}

const VideoCarousel = ({ items }: VideoCarouselProps) => {
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const calculateInterval = () => {
    const duration = items[currentIndex].duration;
    return (duration * 1000) / 100;
  };

  useEffect(() => {
    const startInterval = () => {
      const intervalTime = calculateInterval();
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev === 100) return 0;
          return prev + 1;
        });
      }, intervalTime);
    };

    if (isPlaying) startInterval();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentIndex]);

  useEffect(() => {
    if (progress === 100) handleNext();
  }, [progress]);

  const restartInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0);
  };

  const handleControlPlay = () => {
    if (intervalRef.current && isPlaying) {
      clearInterval(intervalRef.current);
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
    restartInterval();
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    restartInterval();
    setIsPlaying(true);
  };

  const currentItem = items[currentIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Video Card */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentItem.id}
            className="absolute inset-0"
            initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <video
              ref={videoRef}
              src={currentItem.videoPath}
              className="h-full w-full object-cover"
              muted
              playsInline
              autoPlay={isPlaying}
              onEnded={handleNext}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3 className="font-medium text-lg">{currentItem.title}</h3>
          <p className="mt-1 text-gray-600 text-sm">
            {currentItem.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          className="flex aspect-square w-10 items-center justify-center rounded-full bg-gray-300/50 transition-all duration-300 ease-in-out hover:bg-gray-200/80"
          onClick={handlePrev}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="#000000"
            viewBox="0 0 256 256"
          >
            <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
          </svg>
        </button>

        <div className="relative aspect-square w-14 rounded-full">
          <Progress
            activeIndex={currentIndex}
            totalSlides={items.length}
            progress={progress}
          />
          <button
            type="button"
            className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex aspect-square w-10 items-center justify-center rounded-full bg-gray-300/50 transition-all duration-300 ease-in-out hover:bg-gray-200/80"
            onClick={handleControlPlay}
          >
            {isPlaying ? (
              <PauseIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="ml-0.5 h-5 w-5" />
            )}
          </button>
        </div>

        <button
          type="button"
          className="flex aspect-square w-10 items-center justify-center rounded-full bg-gray-300/50 transition-all duration-300 ease-in-out hover:bg-gray-200/80"
          onClick={handleNext}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="#000000"
            viewBox="0 0 256 256"
          >
            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VideoCarousel;
