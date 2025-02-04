'use client';

import { cn } from '@repo/design-system/lib/utils';
import { motion } from 'framer-motion';

export function AnimatedIcon({
  dark,
  w = 'w-8',
  h = 'h-8',
}: {
  dark?: boolean;
  w?: string;
  h?: string;
}) {
  return (
    <motion.svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(w, h)}
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
