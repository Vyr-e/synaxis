'use client';

import { completeOnboarding } from '@/actions/onboarding/onboarding';
import { useFormStore } from '@/store/use-onboarding-store';
import { updateUser } from '@repo/auth/client';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Progress } from '@repo/design-system/components/ui/progress';
import { captureException } from '@sentry/nextjs';
import { TextShimmerWave } from '../_animations/text-shimmer-wave';

const progressSteps = [
  { text: 'Validating your profile information' },
  { text: 'Updating your user preferences' },
  { text: 'Setting up your account settings' },
  { text: 'Finalizing your experience' },
  { text: 'Welcome to your new adventure!' },
];

export function OnboardingFlow() {
  const {
    formData,
    isSubmitting,
    isComplete,
    setSubmitting,
    setComplete,
    clear,
  } = useFormStore();
  const [isPending, startTransition] = useTransition();

  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [animationCycles, setAnimationCycles] = useState(0);
  const [actionCompleted, setActionCompleted] = useState(false);

  // Calculate shimmer duration based on text length
  const getShimmerDuration = (text: string) => {
    return Math.max(1.5, text.length * 0.06);
  };

  // Handle the actual onboarding completion
  const handleOnboardingCompletion = useCallback(async () => {
    try {
      // First update user with Better Auth client (for immediate UI updates)
      await updateUser({
        username: formData.username,
        name: `${formData.firstName} ${formData.lastName}`,
        image:
          formData.generatedAvatarMetadata ||
          formData.profilePictureUrl ||
          undefined,
      });

      // Then complete the full onboarding process
      await completeOnboarding(formData);

      setActionCompleted(true);
      toast.success('Profile setup completed successfully!');

      // Fast forward progress if not already at 100%
      setProgress(100);
      setCurrentStepIndex(progressSteps.length - 1);

      setTimeout(() => {
        setSubmitting(false);
        setComplete(true);
        clear(); // Clear sensitive data from localStorage
      }, 1000);
    } catch (error) {
      // Log to Sentry if available
      captureException('onboarding failed', {
        extra: {
          error,
          formData,
        },
      });
      console.error(error);
      setSubmitting(false);
      setProgress(0);
      setCurrentStepIndex(0);
      setAnimationCycles(0);
      setActionCompleted(false);

      const errorMessage =
        error instanceof Error
          ? `Failed to complete profile setup: ${error.message}`
          : 'Failed to complete profile setup. Please try again.';
      toast.error(errorMessage);
    }
  }, [formData, setSubmitting, setComplete, clear]);

  // Handle step progression
  useEffect(() => {
    if (!isSubmitting || actionCompleted) return;

    // If action completed, fast forward
    if (actionCompleted) {
      setProgress(100);
      setCurrentStepIndex(progressSteps.length - 1);
      return;
    }

    // Normal step progression after 2 animation cycles
    if (animationCycles >= 2) {
      const timer = setTimeout(() => {
        setProgress((prev) => {
          const newProgress = prev + 25; // Faster progression (4 steps to 100%)

          if (newProgress >= 100) {
            return 100;
          }

          // Move to next step
          setCurrentStepIndex((prevIndex) =>
            Math.min(prevIndex + 1, progressSteps.length - 1)
          );
          setAnimationCycles(0);
          return newProgress;
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isSubmitting, animationCycles, actionCompleted]);

  // Start the onboarding process
  useEffect(() => {
    if (!isSubmitting) return;

    // Start the actual action with transition
    startTransition(() => {
      handleOnboardingCompletion();
    });
  }, [isSubmitting, handleOnboardingCompletion]);

  // Auto-start the submission process
  useEffect(() => {
    const AUTO_START_DELAY = 3000; // 3 seconds

    const timer = setTimeout(() => {
      setSubmitting(true);
    }, AUTO_START_DELAY);

    return () => clearTimeout(timer);
  }, [setSubmitting]);

  const currentStep = progressSteps[currentStepIndex];
  const shimmerDuration = currentStep
    ? getShimmerDuration(currentStep.text)
    : 1.5;

  return (
    <div className="flex min-h-[400px] w-full max-w-lg flex-col items-center justify-center space-y-8">
      <div className="w-full space-y-4">
        <h2 className="text-center text-2xl font-semibold text-foreground">
          Almost there!
        </h2>
        <p className="text-center text-muted-foreground">
          We're setting up your personalized experience
        </p>
      </div>

      <div className="w-full space-y-2">
        <Progress
          value={progress}
          className="w-full transition-all duration-500"
        />
        <p className="text-center text-sm text-muted-foreground">
          {progress}% complete
        </p>
      </div>

      {isSubmitting && currentStep && (
        <div className="flex h-16 items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, filter: 'blur(8px)', y: -10 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <TextShimmerWave
                className="text-sm text-muted-foreground"
                duration={shimmerDuration}
                spread={0.8}
                transition={{
                  repeat: 1,
                  repeatDelay: 0.3,
                  onRepeat: () => setAnimationCycles((prev) => prev + 1),
                  onComplete: () => setAnimationCycles((prev) => prev + 1),
                }}
              >
                {currentStep.text}
              </TextShimmerWave>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {isPending && (
        <div className="text-xs text-muted-foreground">
          Processing your information...
        </div>
      )}
    </div>
  );
}
