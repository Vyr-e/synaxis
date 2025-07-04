'use client';

import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

// Import shared components
import { AuthBackground } from '@/components/auth-background';
import { NavigationButtons } from './navigation-buttons';
import { StepIndicator } from './step-indicator';

import { skipOnboarding } from '@/actions/onboarding';
import { type FormData, useFormStore } from '@/store/use-onboarding-store';

const onboardingSteps = {
  initial: '/onboard',
  user: ['identity', 'profile', 'interests'],
  brand: ['community'],
  completion: '/onboard/completion',
};

// --- Helper functions ---
function getStepIndex(sequence: string[], currentSubStep: string | undefined) {
  if (!currentSubStep) {
    return -1;
  }
  return sequence.indexOf(currentSubStep);
}

function getNextStepInSequence(
  steps: string[],
  currentStep: string
): string | null {
  const currentIndex = getStepIndex(steps, currentStep);
  return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
}

function getPrevStepInSequence(
  steps: string[],
  currentStep: string
): string | null {
  const currentIndex = getStepIndex(steps, currentStep);
  return currentIndex > 0 ? steps[currentIndex - 1] : null;
}

function getStepUrl(
  pathname: string,
  formData: FormData,
  direction: 'next' | 'prev'
): string | null {
  const pathSegments = pathname.split('/').filter(Boolean);
  const [, stepType, subStep] = pathSegments;

  const routeConfig: Record<string, Record<string, () => string | null>> = {
    next: {
      initial: () =>
        formData.accountType === 'user'
          ? '/onboard/user/identity'
          : formData.accountType === 'brand'
            ? '/onboard/brand/community'
            : null,
      user: () => {
        const nextStep = getNextStepInSequence(onboardingSteps.user, subStep);
        return nextStep
          ? `/onboard/user/${nextStep}`
          : onboardingSteps.completion;
      },
      brand: () => {
        const nextStep = getNextStepInSequence(onboardingSteps.brand, subStep);
        return nextStep
          ? `/onboard/brand/${nextStep}`
          : onboardingSteps.completion;
      },
    },
    prev: {
      completion: () => {
        const type = formData.accountType;
        const lastStep =
          type === 'user'
            ? onboardingSteps.user.at(-1)
            : type === 'brand'
              ? onboardingSteps.brand.at(-1)
              : null;
        return lastStep
          ? `/onboard/${type}/${lastStep}`
          : onboardingSteps.initial;
      },
      user: () => {
        const prevStep = getPrevStepInSequence(onboardingSteps.user, subStep);
        return prevStep ? `/onboard/user/${prevStep}` : onboardingSteps.initial;
      },
      brand: () => onboardingSteps.initial,
      initial: () => null,
    },
  };

  const currentContext =
    pathname === onboardingSteps.initial
      ? 'initial'
      : pathname === onboardingSteps.completion
        ? 'completion'
        : stepType;

  return (
    routeConfig[direction]?.[currentContext]?.() ?? onboardingSteps.initial
  );
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  const formData = useFormStore((state) => state.formData);
  const getStepValidation = useFormStore((state) => state.getStepValidation);

  // Ensure we only compute validation after hydration to prevent mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isCurrentStepValid = useMemo(() => {
    // Return false during SSR/before hydration to prevent mismatch
    if (!isHydrated) {
      return false;
    }

    if (pathname === onboardingSteps.initial) {
      return !!formData.accountType;
    }

    // Parse the current step from pathname
    const pathSegments = pathname.split('/').filter(Boolean);
    const steps = pathSegments.slice(1);
    const stepType = steps[0] as 'user' | 'brand';
    const subStep = steps[1];

    if (stepType && subStep) {
      // Use the synchronous getter instead of stored state
      return getStepValidation(stepType, subStep);
    }

    return false;
  }, [pathname, formData, getStepValidation, isHydrated]);

  // Rest of your component logic remains the same...
  const showNavButtons = useMemo(() => {
    if (pathname === onboardingSteps.completion) {
      return false;
    }
    if (pathname === onboardingSteps.initial) {
      return true;
    }
    return true;
  }, [pathname]);

  const showIndicator = useMemo(() => {
    return (
      pathname !== onboardingSteps.initial &&
      pathname !== onboardingSteps.completion
    );
  }, [pathname]);

  const handleNext = () => {
    if (isNavigating || !isCurrentStepValid) return;

    const nextUrl = getStepUrl(pathname, formData, 'next');
    if (nextUrl) {
      setIsNavigating(true);
      router.push(nextUrl);
      setTimeout(() => setIsNavigating(false), 500);
    } else {
      console.warn(
        'Could not determine next step from:',
        pathname,
        ' Is step valid?',
        isCurrentStepValid
      );
    }
  };

  const handlePrev = () => {
    if (isNavigating) return;
    const prevUrl = getStepUrl(pathname, formData, 'prev');
    if (prevUrl) {
      setIsNavigating(true);
      router.push(prevUrl);
      setTimeout(() => setIsNavigating(false), 500);
    } else {
      console.warn('Could not determine previous step from:', pathname);
    }
  };

  const handleSkip = async () => {
    if (isNavigating || isSkipping) return;

    try {
      setIsSkipping(true);
      await skipOnboarding();
      toast.success('Profile setup completed with guest settings');
      router.push('/');
    } catch (error) {
      console.error('Skip onboarding error:', error);
      toast.error('Failed to skip onboarding');
    } finally {
      setIsSkipping(false);
    }
  };

  // Step Indicator Logic
  const calculateIndicatorSteps = () => {
    if (!showIndicator) {
      return { current: -1, total: -1 };
    }

    const pathSegments = pathname.split('/').filter(Boolean);
    const steps = pathSegments.slice(1);
    const type = steps[0] as 'user' | 'brand' | undefined;
    const subStep = steps[1];

    if (type === 'user') {
      const total = onboardingSteps.user.length;
      const current = getStepIndex(onboardingSteps.user, subStep);
      return { current, total };
    }
    if (type === 'brand') {
      const total = onboardingSteps.brand.length;
      const current = getStepIndex(onboardingSteps.brand, subStep);
      return { current, total };
    }
    return { current: -1, total: -1 };
  };

  const indicator = calculateIndicatorSteps();

  return (
    <AuthBackground
      colors1={'#ffffff'}
      colors2={'#f8fafc'}
      colors3={'#f1f5f9'}
      colors4={'#e2e8f0'}
      speed={0.3}
      edge={'0%'}
      className="min-h-screen w-full "
    >
      <>
        {showIndicator && indicator.current !== -1 && (
          <StepIndicator
            currentStep={indicator.current}
            totalSteps={indicator.total}
          />
        )}

        {pathname !== onboardingSteps.completion && (
          <div className="absolute top-16 right-8">
            <motion.button
              aria-label="Skip onboarding process"
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isNavigating || isSkipping}
            >
              {isSkipping ? 'Skipping...' : 'Skip'}
            </motion.button>
          </div>
        )}
      </>

      <div className="flex min-h-dvh w-full items-center justify-center">
        {children}
      </div>

      {showNavButtons && (
        <motion.div
          key="nav-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <NavigationButtons
            isStepValid={isCurrentStepValid}
            onNext={handleNext}
            onPrev={handlePrev}
            isNavigating={isNavigating}
            canGoBack={pathname !== onboardingSteps.initial}
          />
        </motion.div>
      )}
    </AuthBackground>
  );
}
