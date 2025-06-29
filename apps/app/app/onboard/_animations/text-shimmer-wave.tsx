'use client';

import type { JSX } from 'react';
import type React from 'react';
import { useMemo } from 'react';

import { cn } from '@repo/design-system/lib/utils';
import { type Transition, motion } from 'motion/react';

export type TextShimmerWaveProps = {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  zDistance?: number;
  xDistance?: number;
  yDistance?: number;
  spread?: number;
  scaleDistance?: number;
  rotateYDistance?: number;
  transition?: Transition;
};

export function TextShimmerWave({
  children,
  as: Component = 'p',
  className,
  duration = 1,
  zDistance = 10,
  xDistance = 2,
  yDistance = -2,
  spread = 1,
  scaleDistance = 1.1,
  rotateYDistance = 10,
  transition,
}: TextShimmerWaveProps) {
  const chars = useMemo(() => children.split(''), [children]);
  const delays = useMemo(
    () => chars.map((_, i) => (i * duration * (1 / spread)) / chars.length),
    [chars, duration, spread]
  );

  const MotionComponent = motion.create(
    Component as keyof JSX.IntrinsicElements
  );

  return (
    <MotionComponent
      className={cn(
        'relative inline-block [perspective:500px]',
        '[--base-color:#a1a1aa] [--base-gradient-color:#000]',
        'dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff]',
        '[&>*]:motion-reduce:!animate-none',
        className
      )}
      style={{ color: 'var(--base-color)' }}
    >
      {chars.map((char, i) => {
        const delay = delays[i];

        return (
          <motion.span
            key={`${char}-${i}`}
            className={cn(
              'inline-block whitespace-pre [transform-style:preserve-3d]'
            )}
            initial={{
              translateZ: 0,
              scale: 1,
              rotateY: 0,
              color: 'var(--base-color)',
            }}
            animate={{
              translateZ: [0, zDistance, 0],
              translateX: [0, xDistance, 0],
              translateY: [0, yDistance, 0],
              scale: [1, scaleDistance, 1],
              rotateY: [0, rotateYDistance, 0],
              color: [
                'var(--base-color)',
                'var(--base-gradient-color)',
                'var(--base-color)',
              ],
            }}
            transition={{
              duration: duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: (chars.length * 0.05) / spread,
              delay,
              ease: 'easeInOut',
              ...(typeof window !== 'undefined' &&
                window.matchMedia('(prefers-reduced-motion: reduce)')
                  .matches && {
                  duration: 0,
                  repeat: 0,
                }),
              ...transition,
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </MotionComponent>
  );
}
