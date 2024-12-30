'use client';

import { motion } from 'framer-motion';

export function AnimatedLogo() {
  const itemCount = 8;
  const centerX = 50;
  const centerY = 50;

  const pathVariants = {
    initial: (i: number) => ({
      rotate: i * 45,
      scale: 0,
      opacity: 0,
      x: Math.cos((i * Math.PI) / 4) * 20,
      y: Math.sin((i * Math.PI) / 4) * 20,
    }),
    animate: (i: number) => ({
      rotate: i * 45,
      scale: 1,
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 60,
        damping: 12,
        delay: i * 0.1,
        duration: 1.2,
        opacity: { duration: 0.3 },
      },
    }),
  };

  const containerVariants = {
    initial: { opacity: 1 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 2,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.svg
      width="300"
      height="300"
      viewBox="0 0 100 100"
      fill="#1A1A1A"
      xmlns="http://www.w3.org/2000/svg"
      initial="initial"
      animate="animate"
      aria-label="Synaxis Logo"
      role="img"
    >
      <motion.rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx="18"
        stroke="#5FFF2F"
        strokeWidth="4"
        fill="#1A1A1A"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1.1 }}
        transition={{ duration: 1.3, ease: 'easeInOut' }}
      />
      <motion.g variants={containerVariants}>
        {Array.from({ length: itemCount }).map((_, i) => (
          <motion.g
            key={i}
            custom={i}
            variants={pathVariants}
            style={{
              originX: `${centerX}px`,
              originY: `${centerY}px`,
              position: 'absolute',
            }}
          >
            <motion.path
              d="M50 30.5C52.4853 30.5 54.5 32.5147 54.5 35V45C54.5 47.4853 52.4853 49.5 50 49.5C47.5147 49.5 45.5 47.4853 45.5 45V35C45.5 32.5147 47.5147 30.5 50 30.5Z"
              fill="#1E1E1E"
              stroke="#5FFF2F"
              animate={{
                fill: ['#1E1E1E', '#2A2A2A', '#1E1E1E'],
                transition: {
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                  ease: 'easeInOut',
                },
              }}
            />
          </motion.g>
        ))}
      </motion.g>
      <motion.circle
        cx={centerX}
        cy={centerY}
        r="3"
        fill="#5FFF2F"
        stroke="#1E1E1E"
        variants={pulseVariants}
      />
    </motion.svg>
  );
}
