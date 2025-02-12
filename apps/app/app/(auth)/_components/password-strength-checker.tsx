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
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[0-9]/, text: 'At least 1 number' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  { regex: /[!@#$%^&*(),.?":{}|<>]/, text: 'At least 1 special character' },
  {
    regex:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{12,}$/,
    text: 'High complexity (optional)',
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

  const getStrengthColor = (score: number) => {
    if (score === 0) {
      return 'bg-border';
    }
    if (score <= 2) {
      return 'bg-red-500';
    }
    if (score <= 3) {
      return 'bg-orange-500';
    }
    if (score === 4) {
      return 'bg-amber-500';
    }
    return 'bg-emerald-500';
  };

  const getStrengthText = (score: number) => {
    if (score === 0) {
      return 'Enter a password';
    }
    if (score <= 2) {
      return 'Weak password';
    }
    if (score <= 3) {
      return 'Medium password';
    }
    if (score === 4) {
      return 'Strong password';
    }
    return 'Very strong password';
  };

  // Calculate actual score excluding optional requirements
  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met && !req.optional).length;
  }, [strength]);

  // Calculate bonus score for optional requirements
  const bonusScore = useMemo(() => {
    return strength.filter((req) => req.met && req.optional).length;
  }, [strength]);

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
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
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
        {(isFocused || password) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* biome-ignore lint/nursery/useAriaPropsSupportedByRole: <explanation> */}
            <div
              tabIndex={0}
              className="relative mt-3 mb-4 h-2 w-full overflow-hidden rounded-full bg-border"
              role="progressbar"
              aria-valuenow={strengthScore}
              aria-valuemin={0}
              aria-valuemax={5}
              aria-label="Password strength"
            >
              <div
                className={cn(
                  'absolute inset-y-0 left-0 flex transition-all duration-500 ease-out',
                  getStrengthColor(strengthScore)
                )}
                style={{
                  width: `${((strengthScore + bonusScore * 0.5) / 5) * 100}%`,
                  borderRadius: '9999px',
                }}
              >
                {bonusScore > 0 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
                )}
              </div>
            </div>

            {/* Password strength description */}
            <p
              id={`${id}-description`}
              className="mb-2 font-medium text-foreground text-sm"
            >
              {getStrengthText(strengthScore)}. Must contain:
            </p>

            {/* Password requirements list */}
            <ul className="space-y-1.5" aria-label="Password requirements">
              {strength.map((req, index) => (
                <li key={index} className="flex items-center gap-2">
                  {req.met ? (
                    <Check
                      size={16}
                      className="text-emerald-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <X
                      size={16}
                      className={cn(
                        'text-muted-foreground/80',
                        req.optional && 'opacity-50'
                      )}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={cn(
                      'text-xs',
                      req.met
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-muted-foreground',
                      req.optional && !req.met && 'opacity-50'
                    )}
                  >
                    {req.text}
                    {req.optional && ' (optional)'}
                    <span className="sr-only">
                      {req.met
                        ? ' - Requirement met'
                        : ' - Requirement not met'}
                      {req.optional ? ' (optional)' : ''}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

PasswordStrengthChecker.displayName = 'PasswordStrengthChecker';

export { PasswordStrengthChecker };
