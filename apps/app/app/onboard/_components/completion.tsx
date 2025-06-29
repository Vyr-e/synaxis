'use client';

import { useFormStore } from '@/store/use-onboarding-store';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HelloEffect } from '../_animations/hello-effect';

export function Completion() {
  const formData = useFormStore((state) => state.formData);
  const { username, firstName } = formData;
  const router = useRouter();
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
        whileHover={{
          scale: 1.02,
          boxShadow:
            '0 20px 25px -5px rgba(0, 87, 255, 0.1), 0 10px 10px -5px rgba(0, 87, 255, 0.04)',
        }}
        whileTap={{ scale: 0.98 }}
        className="group relative mt-8 overflow-hidden rounded-xl bg-gradient-to-r from-[#0057FF] to-[#0041CC] px-8 py-4 text-white shadow-lg transition-all duration-300 hover:shadow-xl"
        onClick={() => {
          router.push('/');
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
        <span className="relative z-10 font-semibold">Launch Experience</span>
      </motion.button>
    </div>
  );
}
