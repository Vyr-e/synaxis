'use client';
import { lora } from '@repo/design-system/fonts';
import { AnimatePresence, motion, useAnimate } from 'framer-motion';
import { usePricing } from './pricing-context';

export function PricingToggle() {
  const { isYearly, togglePricing } = usePricing();
  const [scope, animate] = useAnimate();

  const handleToggle = async () => {
    togglePricing();

    await animate(
      '#handle',
      {
        width: '100%',
      },
      { duration: 0.2 }
    );

    await animate(
      scope.current,
      {
        justifyContent: isYearly ? 'flex-start' : 'flex-end',
      },
      { duration: 0.2 }
    );

    await animate(
      '#handle',
      {
        width: '20px',
      },
      { duration: 0.2 }
    );
  };

  return (
    <div
      className={`flex w-36 items-center gap-3 rounded-full bg-gray-50 px-4 py-2 font-sans shadow-sm ${lora.className}`}
    >
      <motion.div
        className={`relative flex h-6 w-12 cursor-pointer items-center overflow-hidden rounded-full p-0.5 transition-all duration-300 ease-in-out ${
          isYearly ? 'bg-[#6c5ce7]' : 'bg-zinc-700'
        }`}
        onClick={handleToggle}
        transition={{ duration: 0.3, type: 'spring' }}
        ref={scope}
        id="thumb"
        // biome-ignore lint/a11y/useSemanticElements: <explanation>
        role="button"
        tabIndex={0}
      >
        <motion.div
          className="size-5 rounded-full bg-white shadow-sm"
          layout
          id="handle"
        />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.span
          key={isYearly ? 'yearly' : 'monthly'}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`font-medium text-md ${isYearly ? 'text-[#6c5ce7]' : 'text-zinc-700'}`}
        >
          {isYearly ? 'Yearly' : 'Monthly'}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
