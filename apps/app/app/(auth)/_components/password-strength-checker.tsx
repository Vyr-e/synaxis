'use client';

import { cn } from '@repo/design-system';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { Check, Eye, EyeOff, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  type InputHTMLAttributes,
  forwardRef,
  useId,
  useMemo,
  useState,
} from 'react';

interface PasswordStrengthCheckerProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showLabel?: boolean;
  error?: boolean;
}
const requirements = [
  { regex: /[0-9]/, text: 'At least 1 number' },
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  { regex: /[!@#$%^&*(),.?":{}|<>]/, text: 'At least 1 special character' },
  {
    regex:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{16,}$/,
    text: 'High complexity (optional) max of 16 characters',
    optional: true,
  },
];

const PasswordStrengthChecker = forwardRef<
  HTMLInputElement,
  PasswordStrengthCheckerProps
>(({ label, showLabel = true, error, className, ...props }, ref) => {
  const id = useId();
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
      optional: req.optional || false,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met && !req.optional).length;
  }, [strength]);

  const getColor = (index: number, strengthScore: number) => {
    if (index < strengthScore) {
      if (index === 4) {
        return 'bg-green-500';
      }
      if (index < 4) {
        switch (index) {
          case 1:
            return 'bg-orange-300 dark:bg-orange-400';
          case 2:
            return 'bg-orange-400 dark:bg-orange-500';
          case 3:
            return 'bg-orange-500 dark:bg-orange-600';
          default:
            return 'bg-muted';
        }
      }
    }
    return 'bg-muted';
  };

  return (
    <div className="space-y-2">
      {showLabel && label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          id={id}
          className={cn('pe-9', error && 'border-destructive', className)}
          type={isVisible ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            props.onChange?.(e);
          }}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          aria-invalid={strengthScore < 4}
          aria-describedby={`${id}-description`}
        />
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/90 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          aria-controls="password"
        >
          {isVisible ? (
            <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Eye size={16} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 mb-3 flex gap-1.5">
              {requirements.slice(0, 6).map((_, index) => {
                const isActive = index < strengthScore;
                return (
                  <motion.div
                    key={index}
                    className={cn(
                      'h-2 flex-1 rounded-full transition-colors duration-300',
                      getColor(index, strengthScore),
                      index === 5 && strengthScore === 5 ? 'bg-violet-500 dark:bg-violet-600' : ''
                    )}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: isActive ? 1 : 0.8,
                      opacity: isActive ? 1 : 0.5,
                    }}
                    transition={{ delay: index * 0.1 }}
                  />
                );
              })}
            </div>
            {/* Revert to showing only the current requirement text */}
            <AnimatePresence mode="wait">
              {strengthScore < 5 && (
                <motion.div
                  key={strengthScore} // Key changes when score changes
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="flex h-5 items-center gap-2"
                >
                  {/* Show X and text for the current unmet requirement */}
                  {strengthScore < requirements.length - 1 &&
                    !requirements[strengthScore].optional && (
                      <>
                        <X
                          size={16}
                          className="flex-shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <span className="text-xs text-muted-foreground">
                          {requirements[strengthScore].text}
                        </span>
                      </>
                    )}
                </motion.div>
              )}

              {/* Show final required and optional when score is 4+ */}
              {strengthScore >= 4 && (
                <motion.div
                  key="completed-optional"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-1"
                >
                  {/* Final mandatory requirement (index 4) - always show check */}
                  <div className="flex items-center gap-2">
                    <Check
                      size={16}
                      className="flex-shrink-0 text-emerald-500 dark:text-emerald-400"
                      aria-hidden="true"
                    />
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
                      {requirements[4].text}
                    </span>
                  </div>
                  {/* Optional requirement (index 5) */}
                  <div className="flex items-center gap-2">
                    {strength[5].met ? (
                      <Check
                        size={16}
                        className="flex-shrink-0 text-violet-500 dark:text-violet-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <X
                        size={16}
                        className="flex-shrink-0 text-muted-foreground/50"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={cn(
                        'text-xs',
                        strength[5].met
                          ? 'text-violet-500 dark:text-violet-400'
                          : 'text-muted-foreground/50'
                      )}
                    >
                      {requirements[5].text}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

PasswordStrengthChecker.displayName = 'PasswordStrengthChecker';

export { PasswordStrengthChecker };
