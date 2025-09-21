'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';

import { useFormStore } from '@/store/use-onboarding-store';

// Define interests list directly inside the component
const interests = [
  'Workshops',
  'AMAs',
  'Music',
  'Tech',
  'Design',
  'Business',
  'Marketing',
  'Finance',
  'Health',
  'Fitness',
  'Food',
  'Travel',
  'Gaming',
  'Sports',
  'Art',
  'Photography',
  'Writing',
  'Education',
  'Science',
  'Politics',
  'Environment',
  'Social Impact',
  'Entertainment',
  'Networking',
];

// Animation properties
const transitionProps = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
  mass: 0.5,
};

export function InterestSelector() {
  const selectedInterests = useFormStore((state) => state.formData.interests);
  const toggleInterestAction = useFormStore((state) => state.toggleInterest);

  return (
    <div className="w-full">
      <motion.div
        className="flex flex-wrap gap-3 overflow-visible"
        layout
        transition={transitionProps}
      >
        {interests.map((interest) => {
          const isSelected = selectedInterests?.includes(interest);
          return (
            <motion.button
              key={interest}
              onClick={() => toggleInterestAction(interest)}
              layout
              initial={false}
              animate={{
                backgroundColor: isSelected
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(64, 64, 64, 0.5)',
              }}
              whileHover={{
                backgroundColor: isSelected
                  ? 'rgba(255, 255, 255, 0.15)'
                  : 'rgba(64, 64, 64, 0.8)',
              }}
              whileTap={{
                backgroundColor: isSelected
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(64, 64, 64, 0.9)',
              }}
              transition={{
                ...transitionProps,
                backgroundColor: { duration: 0.1 },
              }}
              className={`inline-flex h-10 items-center overflow-hidden whitespace-nowrap rounded-full px-4 py-2 font-medium text-base ring-1 ring-inset ${isSelected ? 'text-white ring-white' : 'text-white/60 ring-neutral-600'}
              `}
            >
              <motion.div
                className="relative flex items-center"
                animate={{
                  width: isSelected ? 'auto' : '100%',
                  paddingRight: isSelected ? '1.5rem' : '0',
                }}
                transition={{
                  ease: [0.175, 0.885, 0.32, 1.275],
                  duration: 0.3,
                }}
              >
                <span>{interest}</span>
                <AnimatePresence>
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={transitionProps}
                      className="absolute right-0"
                    >
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white">
                        <Check
                          className="h-3 w-3 text-black"
                          strokeWidth={1.5}
                        />
                      </div>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.button>
          );
        })}
      </motion.div>
      <p className="mt-4 text-white/60 text-xs">
        Select at least one interest or skip this step.
      </p>
    </div>
  );
}
