'use client';

import type React from 'react';

import { useFormStore } from '@/store/use-onboarding-store';
import { Building2, Check, User } from 'lucide-react';
import { motion } from 'motion/react';

interface AccountTypeOption {
  id: 'user' | 'brand';
  label: string;
  description: string;
  icon: React.ElementType;
}

interface AccountTypeSelectorProps {
  isInitialStep?: boolean;
}

const accountTypes: AccountTypeOption[] = [
  {
    id: 'user',
    label: 'Individual',
    description: 'Join events and connect with others',
    icon: User,
  },
  {
    id: 'brand',
    label: 'Brand',
    description: 'Host events and create communities',
    icon: Building2,
  },
];

export function AccountTypeSelector({
  isInitialStep = false,
}: AccountTypeSelectorProps) {
  const accountType = useFormStore((state) => state.formData.accountType);
  const setField = useFormStore((state) => state.setField);

  const handleChange = (type: 'user' | 'brand') => {
    setField('accountType', type);
  };

  if (isInitialStep) {
    return (
      <div className="w-full max-w-md">
        <div className="grid grid-cols-2 gap-6">
          {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ? */}
          {accountTypes.map((type) => {
            const isSelected = accountType === type.id;
            const Icon = type.icon;

            return (
              <motion.div
                key={type.id}
                onClick={() => handleChange(type.id as 'user' | 'brand')}
                layout
                className={`group relative flex cursor-pointer flex-col items-center overflow-hidden rounded-2xl p-8 shadow-sm transition-shadow duration-300 ${
                  isSelected
                    ? 'shadow-[#0057FF]/20 shadow-lg'
                    : 'border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
                animate={{
                  backgroundColor: isSelected ? '#0057FF' : '#FFFFFF',
                  borderColor: isSelected ? '#0057FF' : '#E5E7EB',
                  color: isSelected ? '#FFFFFF' : '#374151',
                  scale: isSelected ? 1.02 : 1,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                whileHover={{ y: -5, scale: 1.03 }}
                whileTap={{ y: 0, scale: 1 }}
              >
                <motion.div
                  animate={{
                    backgroundColor: isSelected
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(0, 87, 255, 0.05)',
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="mb-4 flex h-20 w-20 items-center justify-center rounded-full"
                >
                  <Icon
                    className={`h-10 w-10 transition-colors duration-300 ${
                      isSelected ? 'text-white' : 'text-[#0057FF]'
                    }`}
                  />
                </motion.div>

                <h3 className="mb-1 font-semibold text-lg">{type.label}</h3>
                <motion.p
                  animate={{
                    color: isSelected ? 'rgba(255, 255, 255, 0.8)' : '#6B7280',
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="text-center text-sm"
                >
                  {type.description}
                </motion.p>

                {isSelected && (
                  <motion.div   
                    className="absolute top-3 right-3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <div className="rounded-full bg-white p-1">
                      <Check className="h-4 w-4 text-[#0057FF]" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Regular account type selector for other steps
  return (
    <div className="w-full space-y-2">
      <span className="block font-medium text-gray-700 text-sm">
        Account Type <span className="text-red-500">*</span>
      </span>

      <div className="mt-2 flex gap-3">
        {accountTypes.map((type) => {
          const isSelected = accountType === type.id;
          const Icon = type.icon;

          return (
            <motion.button
              key={type.id}
              onClick={() => handleChange(type.id as 'user' | 'brand')}
              layout
              initial={false}
              animate={{
                backgroundColor: isSelected
                  ? 'rgba(0, 87, 255, 0.1)'
                  : 'rgba(229, 231, 235, 0.5)',
              }}
              whileHover={{
                backgroundColor: isSelected
                  ? 'rgba(0, 87, 255, 0.15)'
                  : 'rgba(229, 231, 235, 0.8)',
              }}
              whileTap={{
                backgroundColor: isSelected
                  ? 'rgba(0, 87, 255, 0.2)'
                  : 'rgba(229, 231, 235, 0.9)',
              }}
              className={`relative flex flex-1 flex-col items-center justify-center overflow-hidden whitespace-nowrap rounded-lg px-6 py-4 font-medium text-base ring-1 ring-inset ${isSelected ? 'text-[#0057FF] ring-[#0057FF]' : 'text-gray-600 ring-gray-300'}
              `}
            >
              <Icon
                className={`mb-2 h-5 w-5 ${isSelected ? 'text-[#0057FF]' : 'text-gray-500'}`}
              />
              <span className="font-semibold text-lg">{type.label}</span>
              <span className="mt-1 text-center text-xs">
                {type.description}
              </span>

              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute top-2 right-2"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0057FF]">
                    <Check className="h-3 w-3 text-white" strokeWidth={1.5} />
                  </div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
