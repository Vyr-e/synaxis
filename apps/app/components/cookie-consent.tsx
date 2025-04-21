'use client';

import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
} from '@repo/design-system/components/ui/dialog';
import { Switch } from '@repo/design-system/components/ui/switch';
import { X } from 'lucide-react';
// Assuming motion/react is intentional. If using framer-motion, import from 'framer-motion'
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface ConsentOption {
  id: string;
  label: string;
  description: string;
  required?: boolean;
}

const consentOptions: ConsentOption[] = [
  {
    id: 'marketing',
    label: 'Marketing',
    description:
      'Allow us to analyze marketing campaigns and provide personalized recommendations.',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description:
      'Help us understand how you use our platform to improve our services.',
  },
  {
    id: 'functional',
    label: 'Functional',
    description:
      'Enable features that enhance your Browse experience and preferences.',
  },
  {
    id: 'essential',
    label: 'Essential',
    description:
      'Required cookies that enable basic site functionality and security.',
    required: true,
  },
];

const COOKIE_CONSENT_KEY = 'cookie-consent';
const CONSENT_SETTINGS_KEY = 'consent-settings';

const setCookie = (
  name: string,
  value: string,
  options: { expires?: Date; path?: string; sameSite?: string } = {}
) => {
  // Ensure this only runs client-side
  if (typeof document === 'undefined') {
    return;
  }
  let cookie = `${name}=${value}`;

  if (options.expires) {
    cookie += `; expires=${options.expires.toUTCString()}`;
  }

  if (options.path) {
    cookie += `; path=${options.path}`;
  }

  if (options.sameSite) {
    cookie += `; SameSite=${options.sameSite}`;
  }

  // biome-ignore lint/nursery/noDocumentCookie: Intentional cookie setting
  document.cookie = cookie;
};

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consents, setConsents] = useState<Record<string, boolean>>(() => {
    // Client-side check for document access
    if (typeof window === 'undefined') {
      return {
        marketing: false,
        analytics: false,
        functional: false,
        essential: true,
      };
    }
    const savedConsents = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${CONSENT_SETTINGS_KEY}=`))
      ?.split('=')[1];

    const initialState = savedConsents
      ? JSON.parse(decodeURIComponent(savedConsents))
      : {
          marketing: false,
          analytics: false,
          functional: false,
          essential: true,
        };
    initialState.essential = true;
    return initialState;
  });
  const consentTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

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

    const newConsents = accepted
      ? { marketing: true, analytics: true, functional: true, essential: true }
      : { ...consents, essential: true };

    setCookie(COOKIE_CONSENT_KEY, accepted ? 'true' : 'false', {
      expires: expiryDate,
      path: '/',
      sameSite: 'Lax',
    });

    setCookie(
      CONSENT_SETTINGS_KEY,
      encodeURIComponent(JSON.stringify(newConsents)),
      {
        expires: expiryDate,
        path: '/',
        sameSite: 'Lax',
      }
    );

    setConsents(newConsents as Record<string, boolean>);
    setShowConsent(false);
    setShowSettings(false);
  };

  const handleToggle = (id: string) => {
    if (id === 'essential') {
      return;
    }

    const newConsents = { ...consents, [id]: !consents[id] };
    setConsents(newConsents);

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    setCookie(
      CONSENT_SETTINGS_KEY,
      encodeURIComponent(JSON.stringify(newConsents)),
      {
        expires: expiryDate,
        path: '/',
        sameSite: 'Lax',
      }
    );

    const consentCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith(COOKIE_CONSENT_KEY));
    if (!consentCookie || consentCookie.split('=')[1] === 'false') {
      setCookie(COOKIE_CONSENT_KEY, 'true', {
        expires: expiryDate,
        path: '/',
        sameSite: 'Lax',
      });
    }
  };

  const handleSaveSettings = () => {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    setCookie(COOKIE_CONSENT_KEY, 'true', {
      expires: expiryDate,
      path: '/',
      sameSite: 'Lax',
    });

    // Save the specific settings
    setCookie(
      CONSENT_SETTINGS_KEY,
      encodeURIComponent(JSON.stringify(consents)),
      {
        expires: expiryDate,
        path: '/',
        sameSite: 'Lax',
      }
    );
    setShowSettings(false);
    setShowConsent(false);
  };

  return (
    <>
      <AnimatePresence>
        {showConsent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-4 left-4 z-[100] w-[400px] max-w-3xl"
          >
            {/* Banner appearance as per your original code */}
            <div className="rounded-xl bg-gray-100 p-4 text-gray-800 shadow-lg">
              <div className="space-y-4">
                <p className="text-sm">
                  This site uses tracking technologies. You may opt in or opt
                  out of the use of these technologies.
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex gap-2">
                    {/* Deny Button - original styles */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConsent(false)}
                      className="rounded-full border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 transition-all duration-300 hover:border-quantum-blue hover:from-gray-100 hover:to-gray-200 hover:shadow-[0_0_10px_rgba(0,119,255,0.3)]"
                    >
                      Deny
                    </Button>
                    {/* Accept All Button - original styles */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConsent(true)}
                      className="rounded-full border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 transition-all duration-300 hover:border-quantum-blue hover:from-gray-100 hover:to-gray-200 hover:shadow-[0_0_10px_rgba(0,119,255,0.3)]"
                    >
                      Accept all
                    </Button>
                  </div>
                  {/* Consent Settings Button - original styles */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setShowSettings(true);
                      setShowConsent(false);
                      if (consentTimeout.current) {
                        clearTimeout(consentTimeout.current);
                      }
                    }}
                    className="rounded-full bg-quantum-blue text-white transition-colors duration-300 hover:bg-[#0066DD]"
                  >
                    Consent Settings
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Settings Dialog --- */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent
          className="max-w-lg gap-0 overflow-hidden p-0"
          defaultCloseIcon={false}
        >
          <DialogClose className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 transition-all duration-200 hover:border-gray-400 hover:bg-gray-100">
            <div className="">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </div>
          </DialogClose>

          <div className="p-6">
            <div className="mb-6 flex items-center">
              <h2 className="font-semibold text-2xl">Your Privacy</h2>
            </div>
          </div>

          <div className="bg-gray-50 px-6 pb-6">
            <div className="space-y-6">
              {consentOptions.map((option) => (
                <div key={option.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-md px-3 py-1 font-medium text-sm ${
                        option.required
                          ? 'text-gray-600'
                          : 'bg-[#0077FF] text-white'
                      }`}
                    >
                      {option.label}
                    </span>
                    <Switch
                      checked={consents[option.id]}
                      onCheckedChange={() => handleToggle(option.id)}
                      disabled={option.required}
                      className="data-[state=checked]:bg-[#0077FF]"
                      aria-label={option.label}
                    />
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {option.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end border-t bg-muted/30 px-6 py-4">
            <Button onClick={handleSaveSettings}>Save Preferences</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
