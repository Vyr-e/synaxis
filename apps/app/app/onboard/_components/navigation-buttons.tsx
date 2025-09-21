'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
// Correct import for motion component
import { motion } from 'motion/react';

interface NavigationButtonsProps {
  // Removed currentStep
  isStepValid: boolean;
  onNext: () => void;
  onPrev: () => void;
  isNavigating: boolean;
  canGoBack: boolean;
}

export function NavigationButtons({
  isStepValid,
  onNext,
  onPrev,
  isNavigating,
  canGoBack,
}: NavigationButtonsProps) {
  return (
    <div className="fixed right-12 bottom-12 flex items-center gap-4">
      {/* Always show Prev button if navigation is visible */}
      {canGoBack && (
        <motion.button
          onClick={onPrev}
          disabled={isNavigating} // Disable during navigation
          className={`flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-colors hover:border-primary ${
            isNavigating ? 'cursor-wait opacity-50' : ''
          }`}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={isNavigating ? {} : { scale: 1.05 }}
          whileTap={isNavigating ? {} : { scale: 0.95 }}
        >
          <ArrowLeft className="h-5 w-5 stroke-2 text-foreground" />
        </motion.button>
      )}

      <motion.button
        onClick={onNext}
        disabled={!isStepValid || isNavigating}
        className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm transition-all ${
          isStepValid && !isNavigating
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'cursor-not-allowed bg-muted text-muted-foreground'
        } ${isNavigating ? 'cursor-wait opacity-50' : ''}`}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 20, opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        whileHover={isStepValid && !isNavigating ? { scale: 1.05 } : {}}
        whileTap={isStepValid && !isNavigating ? { scale: 0.95 } : {}}
      >
        <ArrowRight className="h-5 w-5 stroke-2" />
      </motion.button>
    </div>
  );
}
