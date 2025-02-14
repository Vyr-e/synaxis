'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const COOKIE_CONSENT_KEY = 'cookie-consent';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const consentTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const consent = document.cookie
      .split('; ')
      .find((row) => row.startsWith(COOKIE_CONSENT_KEY));

    if (!consent) {
      consentTimeout.current = setTimeout(() => {
        setShowConsent(true);
      }, 5000);
    }

    return () => {
      if (consentTimeout.current) {
        clearTimeout(consentTimeout.current);
      }
    };
  }, []);

  const handleConsent = (accepted: boolean) => {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    // biome-ignore lint/nursery/noDocumentCookie: Unnecessary Biome-Lint rule
    document.cookie = `${COOKIE_CONSENT_KEY}=${accepted}; expires=${expiryDate.toUTCString()}; path=/`;
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-x-0 bottom-4 z-[100] mx-auto w-[400px] max-w-3xl md:right-4 md:left-auto md:mx-0 md:w-full"
        >
          <div className="rounded-lg border border-border bg-background p-4 shadow-black/5 shadow-lg">
            <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row md:items-start">
              <div className="space-y-1 text-center md:text-left">
                <p className="font-medium text-sm">We Value Your Privacy 🍪</p>
                <p className="text-muted-foreground text-sm">
                  We use cookies to improve your experience, analyze site usage,
                  and show personalized content.
                </p>
                <p className="text-muted-foreground text-xs">
                  Read our{' '}
                  <Link
                    href="/privacy"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Privacy Policy
                  </Link>{' '}
                  to learn more.
                </p>
              </div>

              <div className="flex justify-end gap-2 self-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleConsent(false)}
                  className="rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5"
                  >
                    <title>Decline</title>
                    <path
                      fillRule="evenodd"
                      d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleConsent(true)}
                  className="rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="size-5"
                  >
                    <title>Accept</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
