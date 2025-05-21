'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Switch } from '@repo/design-system/components/ui/switch';
import { X } from 'lucide-react';
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

  // Add a ref for the settings panel for focus management
  const settingsRef = useRef<HTMLDialogElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);

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

  // Add focus trap and escape key handler for accessibility
  useEffect(() => {
    if (!showSettings) return;

    // Focus the first interactive element when opened
    if (initialFocusRef.current) {
      initialFocusRef.current.focus();
    }

    // Handle escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSettings(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSettings]);

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

  // Settings panel content section
  const renderSettingsPanel = () => {
    if (!showSettings) return null;

    return (
      <>
        {/* Backdrop overlay */}
        <div
          className="fixed inset-0 bg-black/50 z-[190]"
          onClick={() => setShowSettings(false)}
          onKeyDown={(e) => e.key === 'Enter' && setShowSettings(false)}
          aria-hidden="true"
        />

        {/* Settings panel */}
        <dialog
          ref={settingsRef}
          open={true}
          aria-labelledby="cookie-settings-title"
          aria-describedby="cookie-settings-desc"
          className="fixed left-[50%] top-[50%] z-[200] w-[95vw] max-h-[90vh] overflow-auto max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-background p-0 shadow-lg"
          style={{ margin: 0 }}
        >
          <div className="relative">
            <button
              type="button"
              ref={initialFocusRef}
              onClick={() => setShowSettings(false)}
              className="flex absolute top-6 right-6 justify-center items-center w-8 h-8 rounded-full border border-gray-300 transition-all duration-200 hover:border-gray-400 hover:bg-gray-100"
              aria-label="Close cookie settings"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6">
              <p id="cookie-settings-desc" className="sr-only">
                Cookie consent settings panel
              </p>
              <div className="flex items-center mb-6">
                <h2
                  id="cookie-settings-title"
                  className="text-2xl font-semibold"
                >
                  Your Privacy
                </h2>
              </div>
            </div>

            <div className="px-6 pb-6 bg-gray-50">
              <div className="space-y-6">
                {consentOptions.map((option) => (
                  <div key={option.id} className="space-y-2">
                    <div className="flex justify-between items-center">
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
                        className="rounded-md [&_span]:rounded data-[state=checked]:bg-[#0077FF] data-[state=checked]:[&_span]:ml-auto transition-all duration-300 ease-in-out [&_span]:size-[0.9rem] p-[0.1rem]"
                        aria-label={`${option.label} cookies ${option.required ? '(required)' : ''}`}
                      />
                    </div>
                    <p className="text-sm leading-relaxed text-gray-500">
                      {option.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end px-6 py-4 border-t bg-muted/30">
              <Button
                onClick={handleSaveSettings}
                className="rounded-md bg-quantum-blue px-6 font-medium text-white hover:bg-[#0066DD] transition-colors"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </dialog>
      </>
    );
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
            <div className="p-4 text-gray-800 bg-gray-100 rounded-xl shadow-lg">
              <div className="space-y-4">
                <p className="text-sm">
                  This site uses tracking technologies. You may opt in or opt
                  out of the use of these technologies.
                </p>
                <div className="flex flex-wrap gap-2 justify-between items-center">
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

      {/* Render custom settings panel */}
      {renderSettingsPanel()}
    </>
  );
}
