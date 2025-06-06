'use client';

import {
  type FormData as StoreFormData,
  useFormStore,
} from '@/store/use-onboarding-store';
import { cn } from '@repo/design-system';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { toast } from '@repo/design-system/components/ui/sonner';
import { Loader2, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderStatusIndicator } from '../_animations/renderStatusIndicator';
import { generateSuggestions } from '../_utils/generateSuggestions';

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'error';

export function IdentityForm() {
  const username = useFormStore((state) => state.formData.username);
  const setField = useFormStore((state) => state.setField);
  const validateCurrentStep = useFormStore(
    (state) => state.validateCurrentStep
  );
  const pathname = usePathname();

  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState<boolean>(false);
  const [isSuggestionSelected, setIsSuggestionSelected] =
    useState<boolean>(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const inputClassName =
    'h-12 rounded-xl border-2 bg-white/80 px-4 text-base text-black transition-all ease-in-out placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-quantum-blue';

  useEffect(() => {
    if (username && username.length >= 3 && pathname?.includes('/identity')) {
      validateCurrentStep('user', 'identity');
    }
  }, [username, pathname, validateCurrentStep]);

  const checkAvailability = useCallback(
    async (nameToCheck: string) => {
      if (!nameToCheck || nameToCheck.length < 3) {
        setUsernameStatus('idle');
        setSuggestions([]);
        return;
      }

      setUsernameStatus('checking');
      setSuggestions([]);
      setSuggestionsLoading(false);

      try {
        const response = await fetch(
          `/api/check-username?username=${encodeURIComponent(nameToCheck)}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: { available: boolean; error?: string } =
          await response.json();

        if (data.error) {
          setUsernameStatus('error');
        } else if (data.available) {
          setUsernameStatus('available');
          setField('username', nameToCheck);
        } else {
          setUsernameStatus('taken');
          const currentFirstName = useFormStore.getState().formData.firstName;
          const currentLastName = useFormStore.getState().formData.lastName;
          fetchAndSetSuggestions(
            nameToCheck,
            currentFirstName,
            currentLastName
          );
        }
      } catch (error) {
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.error('Failed to check username:', error);
        setUsernameStatus('error');
      }
    },
    [setField]
  );

  const fetchAndSetSuggestions = useCallback(
    async (baseUsername: string, fName = '', lName = '') => {
      setSuggestionsLoading(true);
      const potentialSuggestions = generateSuggestions(
        baseUsername,
        fName,
        lName
      );
      const availableSuggestions: string[] = [];

      await Promise.allSettled(
        potentialSuggestions.map(async (suggestion) => {
          try {
            const response = await fetch(
              `/api/check-username?username=${encodeURIComponent(suggestion)}`
            );
            if (!response.ok) {
              return;
            }
            const data: { available: boolean } = await response.json();
            if (data.available) {
              availableSuggestions.push(suggestion);
            }
          } catch (error) {
            // biome-ignore lint/suspicious/noConsole: <explanation>
            console.error(`Failed to check suggestion ${suggestion}:`, error);
          }
        })
      );

      setSuggestions(availableSuggestions);
      setSuggestionsLoading(false);
    },
    []
  );

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (username && username.length >= 3 && !isSuggestionSelected) {
      debounceTimeoutRef.current = setTimeout(() => {
        checkAvailability(username);
      }, 500);
    } else {
      setUsernameStatus('idle');
      setSuggestions([]);
      setSuggestionsLoading(false);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [username, checkAvailability, isSuggestionSelected]);

  const handleSuggestionClick = async (suggestion: string) => {
    // Immediate UI feedback
    setIsSuggestionSelected(true);
    setField('username', suggestion);
    setSuggestions([]);
    setUsernameStatus('checking');

    try {
      const response = await fetch(
        `/api/check-username?username=${encodeURIComponent(suggestion)}`
      );
      const data = await response.json();

      if (data.available) {
        setUsernameStatus('available');
        validateCurrentStep('user', 'identity');
      } else {
        // Edge case: suggestion became unavailable
        setUsernameStatus('taken');
        setField('username', '');
        validateCurrentStep('user', 'identity'); // Will return false

        // Show helpful message
        toast.error(
          `@${suggestion} became unavailable. Choose another option.`
        );

        // Fetch fresh suggestions
        const { firstName, lastName } = useFormStore.getState().formData;
        fetchAndSetSuggestions(suggestion, firstName, lastName);
      }
    } catch (error) {
      setUsernameStatus('error');
      toast.error('Could not verify username. Please try again.');
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setIsSuggestionSelected(false);
    setField(name as keyof StoreFormData, value);
  };

  return (
    <div className="w-full max-w-screen-lg space-y-6">
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Label
          htmlFor="username"
          className="block font-medium text-black text-sm"
        >
          Username <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            type="text"
            name="username"
            id="username"
            className={cn(
              inputClassName,
              'pl-8',
              usernameStatus !== 'idle' && username.length >= 3 ? 'pr-10' : ''
            )}
            placeholder="your-unique-username"
            value={username}
            onChange={handleInputChange}
            required
            minLength={3}
            autoComplete="username"
            aria-describedby="username-status"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 text-zinc-500">
            <span className="text-lg">@</span>
          </div>
          {username.length >= 3 && (
            <div
              id="username-status"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {renderStatusIndicator({ usernameStatus })}
            </div>
          )}
        </div>
        <AnimatePresence>
          {(suggestionsLoading || suggestions.length > 0) &&
            usernameStatus === 'taken' && (
              <motion.div
                className="mt-2 max-w-[400px] overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {suggestionsLoading ? (
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Checking suggestions...
                    </span>
                  ) : suggestions.length > 0 ? (
                    <>
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      <span className="text-muted-foreground text-xs">
                        Try:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((s) => (
                          <Button
                            key={s}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-auto rounded-full bg-gray-100 px-3 py-1 text-xs hover:bg-gray-200"
                            onClick={() => handleSuggestionClick(s)}
                          >
                            @{s}
                          </Button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      No suggestions available right now.
                    </span>
                  )}
                </div>
              </motion.div>
            )}
        </AnimatePresence>
        {usernameStatus === 'error' && (
          <p className="mt-1 text-red-600 text-xs">
            Could not verify username. Please try again later.
          </p>
        )}
      </motion.div>
    </div>
  );
}
