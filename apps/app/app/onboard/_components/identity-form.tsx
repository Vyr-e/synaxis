'use client';

import {
  type FormData as StoreFormData,
  useFormStore,
} from '@/store/use-onboarding-store';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { useSession } from '@repo/auth/client';
import '@repo/auth/types';
import { Loader2, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatedStatusIndicator } from '../_animations/renderStatusIndicator';
import { generateSuggestions } from '../_utils/generateSuggestions';

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'error';

export function IdentityForm() {
  const { data: session } = useSession();
  const username = useFormStore((state) => state.formData.username);
  const setField = useFormStore((state) => state.setField);
  const setFormData = useFormStore((state) => state.setFormData);
  const validateCurrentStep = useFormStore(
    (state) => state.validateCurrentStep
  );
  const pathname = usePathname();

  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState<boolean>(false);
  const [isSuggestionSelected, setIsSuggestionSelected] =
    useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Populate form data from session
  useEffect(() => {
    if (session?.user) {
      const user = session.user as any; // Cast to access additional fields
      // TODO: Better accessor pattern for firstName/lastName
      const nameParts = user.name?.split(' ') || [];

      setFormData({
        firstName: user.firstName ?? nameParts[0] ?? '',
        lastName: user.lastName ?? nameParts.slice(1).join(' ') ?? '',
        username: user.username || username,
      });
    }
  }, [session, setFormData, username]);

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
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const text = await response.text();
        let data: { available: boolean; error?: string };

        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('Failed to parse JSON response:', text);
          throw new Error('Invalid JSON response from server');
        }

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

            const text = await response.text();
            let data: { available: boolean };

            try {
              data = JSON.parse(text);
            } catch (parseError) {
              console.error('Failed to parse suggestion response:', text);
              return;
            }
            if (data.available) {
              availableSuggestions.push(suggestion);
            }
          } catch (error) {
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
      setIsTyping(true);
      debounceTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        checkAvailability(username);
      }, 500);
    } else {
      setUsernameStatus('idle');
      setSuggestions([]);
      setSuggestionsLoading(false);
      setIsTyping(false);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [username, checkAvailability, isSuggestionSelected]);

  const handleSuggestionClick = (suggestion: string) => {
    // Immediate UI feedback - no need to re-check since we already verified it's available
    setIsSuggestionSelected(true);
    setField('username', suggestion);
    setSuggestions([]);
    setUsernameStatus('available');
    validateCurrentStep('user', 'identity');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setIsSuggestionSelected(false);
    setField(name as keyof StoreFormData, value);
  };

  const getInputBorderClass = () => {
    switch (usernameStatus) {
      case 'available':
        return 'border-emerald-500 focus-visible:ring-emerald-500';
      case 'taken':
      case 'error':
        return 'border-rose-500 focus-visible:ring-rose-500';
      case 'checking':
        return 'border-neutral-800 dark:border-neutral-200 focus-visible:ring-neutral-800 dark:focus-visible:ring-neutral-200';
      default:
        return 'border-2 focus-visible:ring-2 focus-visible:ring-primary';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[50vh] md:min-h-[40vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {/* Input Field */}
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-foreground">Username</h2>
          <div className="relative">
            <motion.div
              className="relative"
              animate={isTyping ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Input
                id="username"
                type="text"
                placeholder="your-awesome-username"
                value={username}
                onChange={handleInputChange}
                name="username"
                maxLength={20}
                className={`px-12 h-12 text-base text-foreground rounded-xl bg-input placeholder:text-muted-foreground transition-all ease-in-out ${getInputBorderClass()}`}
              />

              {/* @ Symbol */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-base font-medium">
                @
              </div>

              {/* Status Indicator */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <AnimatedStatusIndicator
                  usernameStatus={usernameStatus}
                  size={28}
                />
              </div>
            </motion.div>

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -bottom-8 left-0 flex items-center space-x-2 text-xs text-muted-foreground"
                >
                  <span>Checking availability...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Status Messages */}
        <AnimatePresence mode="wait">
          {usernameStatus === 'available' && (
            <motion.div
              key="available"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-950 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                Perfect! This username is available
              </span>
            </motion.div>
          )}

          {usernameStatus === 'taken' && (
            <motion.div
              key="taken"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 text-rose-600 bg-rose-50 dark:bg-rose-950 p-3 rounded-xl border border-rose-200 dark:border-rose-800">
                <div className="w-2 h-2 bg-rose-500 rounded-full" />
                <span className="text-sm font-medium">
                  This username is already taken
                </span>
              </div>
            </motion.div>
          )}

          {usernameStatus === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center space-x-2 text-amber-600 bg-amber-50 dark:bg-amber-950 p-3 rounded-xl border border-amber-200 dark:border-amber-800"
            >
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <span className="text-sm font-medium">
                Username must be at least 3 characters
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggestions */}
        <AnimatePresence>
          {(suggestionsLoading || suggestions.length > 0) &&
            usernameStatus === 'taken' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 overflow-hidden"
              >
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span>Try these available alternatives:</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {suggestionsLoading ? (
                    <span className="flex items-center gap-1 text-muted-foreground text-xs col-span-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Checking suggestions...
                    </span>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full h-10 rounded-xl border-2 border-border bg-card text-foreground hover:bg-muted transition-all duration-200 text-sm"
                        >
                          @{suggestion}
                        </Button>
                      </motion.div>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-xs col-span-2">
                      No suggestions available right now.
                    </span>
                  )}
                </div>
              </motion.div>
            )}
        </AnimatePresence>

        {/* Character count */}
        <div className="flex justify-between items-center text-xs text-muted-foreground min-h-[1rem]">
          <span>Minimum 3 characters</span>
          <span>{username.length}/20</span>
        </div>
      </motion.div>
    </div>
  );
}
