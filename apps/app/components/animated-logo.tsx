'use client';

import { cn } from '@repo/design-system';
import { motion } from 'motion/react';

export function AnimatedIcon({
  dark = true,
  w = 'w-6',
  h = 'h-6',
  className,
}: {
  dark?: boolean;
  w?: string;
  h?: string;
  className?: string;
}) {
  return (
    <motion.svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(w, h, className)}
    >
      <title>logo</title>
      <motion.circle
        cx="16"
        cy="16"
        r="14"
        className={cn(dark ? 'fill-black' : 'fill-white')}
        initial={{ scale: 0, rotate: 0 }}
        animate={{
          scale: 1,
          rotate: 360,
        }}
        stroke={'#ffffff'}
        strokeWidth={5}
        transition={{
          scale: {
            duration: 0.5,
            ease: 'easeOut',
          },
          rotate: {
            duration: 1,
            ease: 'anticipate',
          },
        }}
      />
    </motion.svg>
  );
}
