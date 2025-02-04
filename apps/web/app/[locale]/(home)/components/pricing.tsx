'use client';

import { clashDisplay, lora } from '@repo/design-system/fonts';
import { AnimatePresence, motion } from 'framer-motion';
import { usePricing } from './pricing-context';
import { PricingToggle } from './pricing-toggle';

interface PricingTier {
  title: string;
  subtitle: string;
  price: number;
  features: string[];
  cta: string;
}

const pricingTiers: Record<'free' | 'pro' | 'enterprise', PricingTier> = {
  free: {
    title: 'Free',
    subtitle: 'For Event Attendees',
    price: 0,
    features: [
      'Join unlimited events',
      'Access community spaces',
      'Basic profile',
      'Event chat participation',
      'Up to 30min Audio call',
    ],
    cta: 'Join Now',
  },
  pro: {
    title: 'Pro',
    subtitle: 'For Event Organizers',
    price: 29,
    features: [
      'Create & host events',
      'Custom branding',
      'Unlimited attendees',
      'Analytics dashboard',
      'Engagement metrics',
      'Ticketing & registration',
      'Multiple ticket types',
      'Promotional tools',
      'Priority support',
      'Up to 2 hours Audio call',
      'Echo: Smart Event Recommendations',
    ],
    cta: 'Start Free Trial',
  },
  enterprise: {
    title: 'Enterprise',
    subtitle: 'For Large Organizations',
    price: 299,
    features: [
      'All Pro features, plus:',
      'Custom integrations',
      'Advanced security',
      'SLA guarantee',
      'Unlimited hours on Audio call',
      'Dedicated Domain',
      'Multi-team management',
      'Custom analytics',
      'Dedicated success manager',
      '24/7 phone support',
    ],
    cta: 'Contact Sales',
  },
};

function AnimatedDigit({ digit }: { digit: string }) {
  return (
    <motion.span
      key={digit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="inline-block"
    >
      {digit}
    </motion.span>
  );
}

function AnimatedPrice({ price }: { price: number }) {
  const priceString = price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const digits = priceString.split('');

  return (
    <AnimatePresence mode="wait">
      <div className="flex items-baseline">
        {digits.map((digit, index) => (
          <AnimatedDigit key={index} digit={digit} />
        ))}
      </div>
    </AnimatePresence>
  );
}

export function Pricing() {
  const { isYearly } = usePricing();

  return (
    <section id="pricing" className="mt-1.5 rounded-md bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-xl text-center">
          <h2
            className={`font-bold text-2xl md:text-3xl ${clashDisplay.className}`}
          >
            Simple, transparent pricing
          </h2>
          <p
            className={`mt-2 text-gray-600 text-sm md:text-base ${lora.className}`}
          >
            Try for free with limited features, upgrade when you're ready
          </p>
          <div className="mt-4 flex justify-center">
            <PricingToggle />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:mt-12 md:grid-cols-12">
          {/* Free Card */}
          <motion.div
            layout
            className="relative md:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-full rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 md:p-6">
              <div>
                <h3 className={`font-bold text-xl ${clashDisplay.className}`}>
                  {pricingTiers.free.title}
                </h3>
                <p className={`mt-1 text-gray-600 text-sm ${lora.className}`}>
                  {pricingTiers.free.subtitle}
                </p>
              </div>

              <div className="mt-4 flex items-baseline">
                <AnimatedPrice price={0} />
                <span className="ml-1 text-gray-500 text-sm">forever</span>
              </div>

              <ul className="mt-6 space-y-3">
                {pricingTiers.free.features.map((feature) => (
                  <motion.li
                    key={feature}
                    layout
                    className="flex items-center gap-3"
                  >
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title>Checkmark</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                layout
                className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-2.5 font-medium text-sm text-white shadow-sm transition-colors hover:bg-gray-800"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {pricingTiers.free.cta}
              </motion.button>
            </div>
          </motion.div>

          {/* Pro Card */}
          <motion.div
            layout
            className="relative md:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative h-full rounded-2xl border-2 border-[#6c5ce7] bg-white p-4 shadow-sm md:p-6">
              <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
                <div>
                  <h3
                    className={`font-bold text-lg md:text-xl ${clashDisplay.className}`}
                  >
                    {pricingTiers.pro.title}
                  </h3>
                  <p
                    className={`mt-1 text-gray-600 text-xs md:text-sm ${lora.className}`}
                  >
                    {pricingTiers.pro.subtitle}
                  </p>
                </div>
                <span className="whitespace-nowrap rounded-full bg-purple-100 px-3 py-1 font-medium text-[#6c5ce7] text-xs">
                  Most Popular
                </span>
              </div>

              <div className="mt-4 flex items-baseline">
                <AnimatedPrice
                  price={
                    isYearly
                      ? pricingTiers.pro.price * 10
                      : pricingTiers.pro.price
                  }
                />
                <span className="ml-1 text-gray-500 text-sm">
                  / {isYearly ? 'year' : 'month'}
                </span>
              </div>

              <ul className="mt-6 space-y-3 ">
                {pricingTiers.pro.features.map((feature) => (
                  <motion.li
                    key={feature}
                    layout
                    className="flex items-center gap-3"
                  >
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title>Checkmark</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                layout
                className="mt-6 w-full rounded-lg bg-[#6c5ce7] px-4 py-2.5 font-medium text-sm text-white shadow-sm transition-colors hover:bg-[#6c5ce7ad]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {pricingTiers.pro.cta}
              </motion.button>
            </div>
          </motion.div>

          {/* Enterprise Card */}
          <motion.div
            layout
            className="relative md:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative h-full rounded-2xl bg-black p-4 text-white shadow-sm md:p-6">
              <div>
                <h3 className={`font-bold text-xl ${clashDisplay.className}`}>
                  {pricingTiers.enterprise.title}
                </h3>
                <p className={`mt-1 text-gray-400 text-sm ${lora.className}`}>
                  {pricingTiers.enterprise.subtitle}
                </p>
              </div>

              <div className="mt-4 flex items-baseline text-white">
                <AnimatedPrice
                  price={
                    isYearly
                      ? pricingTiers.enterprise.price * 10
                      : pricingTiers.enterprise.price
                  }
                />
                <span className="ml-1 text-gray-400 text-sm">
                  / {isYearly ? 'year' : 'month'}
                </span>
              </div>

              <ul className="mt-6 grid gap-x-6 gap-y-3 md:grid-cols-2">
                {pricingTiers.enterprise.features.map((feature) => (
                  <motion.li
                    key={feature}
                    layout
                    className="flex items-center gap-3"
                  >
                    <svg
                      className="h-5 w-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title>Checkmark</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                layout
                className="mt-6 w-full rounded-lg bg-white px-4 py-2.5 font-medium text-black text-sm shadow-sm transition-colors hover:bg-gray-100"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {pricingTiers.enterprise.cta}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Optional: Mobile scroll hint */}
        <p className="mt-4 text-center text-gray-500 text-sm md:hidden">
          Swipe to see more plans →
        </p>
      </div>
    </section>
  );
}
