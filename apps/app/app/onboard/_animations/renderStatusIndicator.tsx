'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'error';

interface StatusIndicatorProps {
  usernameStatus: UsernameStatus;
  size?: number;
}

export function AnimatedStatusIndicator({
  usernameStatus,
  size = 24,
}: StatusIndicatorProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    idle: { scale: 0, opacity: 0 },
    checking: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    available: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.4, ease: 'backOut' },
    },
    taken: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.4, ease: 'backOut' },
    },
    error: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.4, ease: 'backOut' },
    },
  };

  const pulseVariants = {
    checking: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    },
  };

  const iconVariants = {
    hidden: {
      scale: 0,
      rotate: -180,
      opacity: 0,
    },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.5,
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const getStatusConfig = () => {
    switch (usernameStatus) {
      case 'checking':
        return {
          bgColor: 'bg-neutral-800 dark:bg-neutral-200',
          iconColor: 'text-white dark:text-black',
          icon: null,
        };
      case 'available':
        return {
          bgColor: 'bg-gradient-to-r from-emerald-400 to-green-500',
          iconColor: 'text-white',
          icon: (
            <motion.svg
              width={size * 0.6}
              height={size * 0.6}
              viewBox="0 0 24 24"
              fill="none"
              variants={iconVariants}
              initial="hidden"
              animate="visible"
            >
              <title>Available</title>
              <motion.path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            </motion.svg>
          ),
        };
      case 'taken':
        return {
          bgColor: 'bg-gradient-to-r from-red-400 to-pink-500',
          iconColor: 'text-white',
          icon: (
            <motion.svg
              width={size * 0.6}
              height={size * 0.6}
              viewBox="0 0 24 24"
              fill="none"
              variants={iconVariants}
              initial="hidden"
              animate="visible"
            >
              <title>Taken</title>
              <motion.path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              />
            </motion.svg>
          ),
        };
      case 'error':
        return {
          bgColor: 'bg-gradient-to-r from-orange-400 to-yellow-500',
          iconColor: 'text-white',
          icon: (
            <motion.svg
              width={size * 0.6}
              height={size * 0.6}
              viewBox="0 0 24 24"
              fill="none"
              variants={iconVariants}
              initial="hidden"
              animate="visible"
            >
              <title>Error</title>
              <motion.path
                d="M12 9v4m0 4h.01"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              />
              <motion.circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              />
            </motion.svg>
          ),
        };
      default:
        return { bgColor: '', iconColor: '', icon: null };
    }
  };

  const config = getStatusConfig();

  if (usernameStatus === 'idle') return null;

  return (
    <motion.div
      className="relative flex items-center justify-center"
      variants={containerVariants}
      initial="idle"
      animate={usernameStatus}
      style={{ width: size, height: size }}
    >

      {/* Main indicator */}
      <motion.div
        className={`relative flex items-center justify-center rounded-full shadow-lg ${config.bgColor} ${config.iconColor}`}
        style={{ width: size, height: size }}
      >
        {config.icon}
      </motion.div>

      {/* Success celebration particles */}
      {usernameStatus === 'available' && !shouldReduceMotion && (
        <AnimatePresence>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-emerald-400"
              initial={{
                scale: 0,
                x: 0,
                y: 0,
                opacity: 1,
              }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI * 2) / 6) * 20,
                y: Math.sin((i * Math.PI * 2) / 6) * 20,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 0.8,
                delay: 0.5 + i * 0.1,
                ease: 'easeOut',
              }}
            />
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

// old function for backward compatibility
export const renderStatusIndicator = ({
  usernameStatus,
  size = 20,
}: { usernameStatus: string; size?: number }) => {
  const validStatuses: UsernameStatus[] = [
    'idle',
    'checking',
    'available',
    'taken',
    'error',
  ];

  const status = validStatuses.includes(usernameStatus as UsernameStatus)
    ? (usernameStatus as UsernameStatus)
    : 'idle';
  return <AnimatedStatusIndicator usernameStatus={status} size={size} />;
};
