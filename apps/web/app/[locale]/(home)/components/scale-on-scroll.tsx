'use client';

import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { type ComponentProps, type ReactNode, useRef } from 'react';

interface ScaleOnScrollProps extends ComponentProps<typeof motion.div> {
  children: ReactNode;
  startScale?: number;
  endScale?: number;
  startTrigger?: number;
  endTrigger?: number;
  once?: boolean;
}

export const ScaleOnScroll = ({
  children,
  startScale = 0.8,
  endScale = 1,
  startTrigger = 0.05,
  endTrigger = 0.95,
  once = true,
  ...props
}: ScaleOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const scaleProgress = useTransform(
    scrollYProgress,
    [startTrigger, endTrigger],
    [0, 1]
  );

  const springScaleProgress = useSpring(scaleProgress, {
    stiffness: 50,
    damping: 15,
    mass: 0.2,
    restDelta: 0.001,
  });

  const scale = useTransform(
    springScaleProgress,
    [0, 1],
    [startScale, endScale]
  );

  const isInView = useInView(ref, { once });

  return (
    <motion.div
      ref={ref}
      style={{
        scale: once && !isInView ? startScale : scale,
        width: '100%',
        maxWidth: '1000px',
        ...props.style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
