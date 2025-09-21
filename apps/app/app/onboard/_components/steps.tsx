'use client';

import { useFormStore } from '@/store/use-onboarding-store';
import { clashDisplay } from '@repo/design-system/fonts';
import { AnimatePresence, motion } from 'motion/react';
import { notFound } from 'next/navigation';
import type React from 'react';
import { useEffect, useMemo } from 'react';
import { AccountTypeSelector } from './account-type-selector';
import { CommunitySetupForm } from './community-setup-form';
import { IdentityForm } from './identity-form';
import { InterestSelector } from './interest-selector';
import { OnboardingFlow } from './onboarding-flow';
import { ProfileForm } from './profile-form';

interface StepsProps {
  steps: string[];
}

export default function StepsComponent({ steps }: StepsProps) {
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
        (steps[0] === 'brand' && ['community'].includes(steps[1])); // Only allow 'community' for brand

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
    } else if (type === 'brand' && subStep === 'community') {
      isValid = true; // Adjust validation as needed
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
    currentStepComponent = <OnboardingFlow />;
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
      case 'community': {
        componentKey = 'brand-community';
        currentStepComponent = <CommunitySetupForm />;
        break;
      }
      default:
        notFound();
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
        case 'community':
          return {
            title: 'Set up your community',
            description: 'Configure your community settings and preferences.',
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
          <div className="min-h-[400px] overflow-hidden rounded-xl px-2 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8 backdrop-blur-md md:min-h-[600px]">
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
                      <h1
                        className={`mb-4 font-bold ${clashDisplay.className} text-2xl text-foreground `}
                      >
                        {title}
                      </h1>
                      <p className="mb-8 max-w-lg text-center font-inter text-muted-foreground">
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
