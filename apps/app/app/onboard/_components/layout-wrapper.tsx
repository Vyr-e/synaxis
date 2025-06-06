'use client';

import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import type React from 'react';
import { useMemo, useState } from 'react';

// Import shared components
import { AuthBackground } from '@/components/auth-background';
import { NavigationButtons } from './navigation-buttons';
import { StepIndicator } from './step-indicator';

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

function getStepUrl(
  pathname: string,
  formData: FormData,
  direction: 'next' | 'prev'
): string | null {
  const pathSegments = pathname.split('/').filter(Boolean);
  const steps = pathSegments.slice(1);

  // --- Handle navigation FROM initial step ---
  if (pathname === onboardingSteps.initial && direction === 'next') {
    if (formData.accountType === 'user') {
      return `${onboardingSteps.initial}/user/identity`;
    }
    if (formData.accountType === 'brand') {
      return `${onboardingSteps.initial}/brand/community`;
    }
    return null; // Cannot go next if type not selected
  }
  // --- End handle navigation FROM initial step ---

  if (direction === 'next') {
    if (steps[0] === 'user') {
      const currentSubStep = steps[1];
      const currentIndex = getStepIndex(onboardingSteps.user, currentSubStep);
      if (currentIndex < onboardingSteps.user.length - 1) {
        const nextSubStep = onboardingSteps.user[currentIndex + 1];
        return `${onboardingSteps.initial}/user/${nextSubStep}`;
      }
      return onboardingSteps.completion;
    }
    if (steps[0] === 'brand') {
      const currentSubStep = steps[1];
      const currentIndex = getStepIndex(onboardingSteps.brand, currentSubStep);
      if (currentIndex < onboardingSteps.brand.length - 1) {
        const nextSubStep = onboardingSteps.brand[currentIndex + 1];
        return `${onboardingSteps.initial}/brand/${nextSubStep}`;
      }
      return onboardingSteps.completion;
    }
  } else {
    // direction === 'prev'
    if (pathname === onboardingSteps.completion) {
      const accountType = formData?.accountType;
      if (accountType === 'user') {
        const lastUserStep = onboardingSteps.user.at(-1);
        return `${onboardingSteps.initial}/user/${lastUserStep}`;
      }
      if (accountType === 'brand') {
        const lastBrandStep = onboardingSteps.brand.at(-1);
        return `${onboardingSteps.initial}/brand/${lastBrandStep}`;
      }
      return onboardingSteps.initial;
    }
    if (steps[0] === 'user') {
      const currentSubStep = steps[1];
      const currentIndex = getStepIndex(onboardingSteps.user, currentSubStep);
      if (currentIndex > 0) {
        const prevSubStep = onboardingSteps.user[currentIndex - 1];
        return `${onboardingSteps.initial}/user/${prevSubStep}`;
      }
      // If on first user step (profile), go back to initial selection
      return onboardingSteps.initial;
    }
    if (steps[0] === 'brand') {
      // If on first brand step (profile), go back to initial selection
      return onboardingSteps.initial;
    }
    // If somehow on '/onboard' and prev is clicked, stay there (or handle error)
    if (pathname === onboardingSteps.initial) {
      return null;
    }
  }
  // Fallback should ideally not be reached with guarded logic
  return onboardingSteps.initial;
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  const formData = useFormStore((state) => state.formData);
  const getStepValidation = useFormStore((state) => state.getStepValidation);

  const isCurrentStepValid = useMemo(() => {
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
  }, [pathname, formData, getStepValidation]);

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
      {showIndicator && indicator.current !== -1 && (
        <StepIndicator
          currentStep={indicator.current}
          totalSteps={indicator.total}
        />
      )}

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
