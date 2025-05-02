'use client';

// Correct import for motion component
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
          className={`flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm transition-colors hover:border-[#0057FF] ${
            isNavigating ? 'cursor-wait opacity-50' : ''
          }`}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={isNavigating ? {} : { scale: 1.05 }}
          whileTap={isNavigating ? {} : { scale: 0.95 }}
        >
          <ArrowLeft className="h-5 w-5 stroke-2 text-gray-700" />
        </motion.button>
      )}

      <motion.button
        onClick={onNext}
        disabled={!isStepValid || isNavigating} // Disable if step invalid OR navigating
        className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm transition-colors ${
          isStepValid && !isNavigating
            ? 'bg-[#0057FF] text-white hover:bg-[#0057FF]/90'
            : 'cursor-not-allowed bg-gray-200 text-gray-400'
        } ${isNavigating ? 'cursor-wait opacity-50' : ''}`} // Style for navigating state
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
