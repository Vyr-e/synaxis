'use client';

import { useFormStore } from '@/store/use-onboarding-store';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { HelloEffect } from '../_animations/hello-effect';

export function Completion() {
  const username = useFormStore((state) => state.formData.username);
  const firstName = useFormStore((state) => state.formData.firstName);

  const [animationComplete, setAnimationComplete] = useState(false);
  const [showUsername, setShowUsername] = useState(false);

  useEffect(() => {
    if (animationComplete) {
      const timer = setTimeout(() => {
        setShowUsername(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [animationComplete]);

  const displayName = firstName || (username ? `@${username}` : 'Welcome!');

  return (
    <div className="flex min-h-[400px] w-full max-w-lg flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center space-y-4">
        <HelloEffect
          className="h-16 text-[#0057FF]"
          onAnimationComplete={() => setAnimationComplete(true)}
        />

        <motion.div
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={
            showUsername
              ? {
                  opacity: 1,
                  filter: 'blur(0px)',
                  transition: {
                    opacity: { duration: 0.8 },
                    filter: { duration: 1.2 },
                  },
                }
              : {}
          }
          className="font-semibold text-gray-900 text-xl"
        >
          {displayName}
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={
          showUsername
            ? { opacity: 1, transition: { delay: 0.5, duration: 0.8 } }
            : {}
        }
        className="mt-4 text-gray-600"
      >
        Your account has been created successfully. You can now start exploring
        events and connecting with others.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={
          showUsername
            ? { opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.5 } }
            : {}
        }
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="mt-8 rounded-lg bg-[#0057FF] px-6 py-3 text-white transition-colors hover:bg-[#0057FF]/90"
      >
        Get Started
      </motion.button>
    </div>
  );
}
