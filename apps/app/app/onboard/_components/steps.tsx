'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { notFound, useRouter } from 'next/navigation'; // Import hooks
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';

import { useFormStore } from '@/store/use-onboarding-store';
import { AccountTypeSelector } from './account-type-selector';
import { Completion } from './completion';
import { IdentityForm } from './identity-form';
import { InterestSelector } from './interest-selector';
import { ProfileForm } from './profile-form';

// Define the starting points for the dynamic routes
const onboardingStartPaths = {
  user: '/onboard/user/identity',
  brand: '/onboard/brand/profile',
};

interface StepsProps {
  steps: string[];
}

export default function StepsComponent({ steps }: StepsProps) {
  const router = useRouter(); // Add router
  const [isNavigating, setIsNavigating] = useState(false); // Add navigation state

  // Fix: Access steps directly from params

  // --- Zustand Store Connection ---
  const formData = useFormStore((state) => state.formData);
  const setValidation = useFormStore((state) => state.setValidation);

  // --- Determine Current Step Info ---
  const { type, subStep, isValidRoute, isInitialStep } = useMemo(() => {
    // Handle the initial step (no steps in URL) -> /onboard
    if (steps.length === 0) {
      return {
        type: undefined,
        subStep: undefined,
        isValidRoute: true,
        isInitialStep: true,
      };
    }
    // Handle /onboard/completion
    if (steps.length === 1 && steps[0] === 'completion') {
      return {
        type: 'completion',
        subStep: undefined,
        isValidRoute: true,
        isInitialStep: false,
      };
    }
    // Handle /onboard/user/* or /onboard/brand/*
    if (steps.length === 2 && (steps[0] === 'user' || steps[0] === 'brand')) {
      const isValidSubstep =
        (steps[0] === 'user' &&
          ['identity', 'profile', 'interests'].includes(steps[1])) ||
        (steps[0] === 'brand' && ['profile'].includes(steps[1])); // Add more brand substeps if needed

      if (isValidSubstep) {
        return {
          type: steps[0] as 'user' | 'brand',
          subStep: steps[1],
          isValidRoute: true,
          isInitialStep: false,
        };
      }
    }
    // Invalid route if none of the above match
    return {
      type: undefined,
      subStep: undefined,
      isValidRoute: false,
      isInitialStep: false,
    };
  }, [steps]);
  // --- End Determine Current Step Info ---

  // Effect to handle navigation after account type selection
  useEffect(() => {
    // Only run on the initial step when an account type is selected and we aren't already navigating
    if (isInitialStep && formData.accountType && !isNavigating) {
      const nextUrl =
        onboardingStartPaths[formData.accountType as 'user' | 'brand'];
      if (nextUrl) {
        setIsNavigating(true);
        router.push(nextUrl);
      } else {
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.error(
          'Invalid account type for navigation:',
          formData.accountType
        );
      }
    }
  }, [formData.accountType, isInitialStep, isNavigating, router]);

  // --- Validation Logic ---
  useEffect(() => {
    // Skip validation for the initial step
    if (isInitialStep) {
      setValidation(true); // Initial step is always "valid" to proceed (selection handles navigation)
      return;
    }

    let isValid = false;
    // Keep existing validation logic for other steps
    if (type === 'user' && subStep === 'profile') {
      isValid =
        !!formData.username?.trim() &&
        !!formData.firstName?.trim() &&
        !!formData.lastName?.trim();
    } else if (type === 'user' && subStep === 'interests') {
      isValid = true; // Interests can be skipped
    } else if (type === 'brand' && subStep === 'profile') {
      isValid = !!formData.brandName?.trim(); // Add other brand profile fields if needed
    } else if (type === 'completion') {
      isValid = true; // Completion step is always valid
    }

    setValidation(isValid);
  }, [
    type,
    subStep,
    formData.username,
    formData.firstName,
    formData.lastName,
    formData.brandName,
    // formData.interests?.length, // Uncomment if interests become mandatory
    setValidation,
    isInitialStep, // Add dependency
  ]);
  // --- End Validation Logic ---

  // --- Render Logic ---
  if (!isValidRoute) {
    notFound();
  }

  let currentStepComponent: React.ReactNode = null;
  let componentKey = 'invalid';

  // Handle initial step rendering
  if (isInitialStep) {
    componentKey = 'account-type-selection';
    currentStepComponent = <AccountTypeSelector isInitialStep={true} />;
  } else if (type === 'completion') {
    componentKey = 'completion';
    currentStepComponent = <Completion />;
  } else if (type === 'user') {
    switch (subStep) {
      case 'identity': {
        componentKey = 'user-identity';
        currentStepComponent = <IdentityForm />;
        break;
      }
      case 'profile': {
        componentKey = 'user-profile';
        currentStepComponent = <ProfileForm />;
        break;
      }
      case 'interests': {
        componentKey = 'user-interests';
        currentStepComponent = (
          <div className="custom-scrollbar max-h-[60vh] w-full max-w-lg overflow-y-auto pr-2">
            <InterestSelector />
          </div>
        );
        break;
      }
      default:
        notFound(); // Should not happen if isValidRoute is true
    }
  } else if (type === 'brand') {
    switch (subStep) {
      case 'profile': {
        componentKey = 'brand-profile';
        currentStepComponent = <ProfileForm />; // Use ProfileForm for brand too
        break;
      }
      default:
        notFound(); // Should not happen if isValidRoute is true
    }
  }

  // --- Titles and Descriptions ---
  const getStepContent = () => {
    if (isInitialStep) {
      return {
        title: 'Choose your account type',
        description: 'Select how you want to use Synaxis',
      };
    }
    if (type === 'user') {
      switch (subStep) {
        case 'identity':
          return {
            title: 'Create your identity',
            description: 'Choose a unique username and tell us your name.',
          };
        case 'profile':
          return {
            title: "Let's set up your profile",
            description:
              'Tell us who you are and personalize your profile to stand out.',
          };
        case 'interests':
          return {
            title: 'What are your interests?',
            description:
              'Select topics that interest you to discover relevant events. You can skip this for now.',
          };
        default:
          return { title: '', description: '' };
      }
    }
    if (type === 'brand') {
      switch (subStep) {
        case 'profile':
          return {
            title: 'Set up your brand profile',
            description: 'Showcase your brand, events, and community.',
          };
        default:
          return { title: '', description: '' };
      }
    }
    if (type === 'completion') {
      return { title: 'Setup Complete!', description: '' };
    }
    return { title: '', description: '' };
  };

  const { title, description } = getStepContent();
  // Show headers unless on completion step (initial step WILL show headers)
  const showContentHeaders = type !== 'completion';

  // --- Animations ---
  const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  };

  return (
    <>
      {/* Background can be added here if needed */}
      <div className="inset-0 flex h-dvh items-center justify-center">
        <div className="w-full max-w-4xl px-6 md:px-0">
          {/* Adjusted min-height and padding */}
          <div className="min-h-[400px] overflow-hidden rounded-xl bg-white/60 p-8 backdrop-blur-md md:min-h-[600px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={componentKey}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  opacity: { duration: 0.2 },
                }}
                className="h-full w-full"
              >
                <div className="flex h-full flex-col items-center">
                  {showContentHeaders && (
                    <>
                      <h1 className="mb-4 font-bold font-poppins text-2xl text-gray-900">
                        {title}
                      </h1>
                      <p className="mb-8 max-w-lg text-center font-inter text-gray-700">
                        {description}
                      </p>
                    </>
                  )}

                  {/* Render the determined step component */}
                  {currentStepComponent}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
