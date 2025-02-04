'use client';

import { createContext, useContext, useState } from 'react';

type PricingContextType = {
  isYearly: boolean;
  togglePricing: () => void;
};

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export function PricingProvider({ children }: { children: React.ReactNode }) {
  const [isYearly, setIsYearly] = useState(false);

  const togglePricing = () => {
    setIsYearly((prev) => !prev);
  };

  return (
    <PricingContext.Provider value={{ isYearly, togglePricing }}>
      {children}
    </PricingContext.Provider>
  );
}

export function usePricing() {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
}
