'use client';

import { captureException } from '@/sentry';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  changeEmail,
  sendVerificationEmail,
  useSession,
} from '@repo/auth/client';
import { cn } from '@repo/design-system';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
} from '@repo/design-system/components/ui/form';
import { Input } from '@repo/design-system/components/ui/input';
import { toast } from '@repo/design-system/components/ui/sonner';
import { clashDisplay } from '@repo/design-system/fonts';
import { ChevronLeft, Loader2, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { Route } from 'next';

const verifyEmailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type VerifyEmailForm = z.infer<typeof verifyEmailSchema>;

const COOLDOWN_DELAY = 15; // 15 seconds between attempts
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_DELAY = 30; // 30 seconds rate limit after max attempts

export default function VerifyEmailPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const [isResending, setIsResending] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);

  const form = useForm<VerifyEmailForm>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: user?.email || '',
    },
  });

  useEffect(() => {
    const checkVerification = async () => {
      if (await user?.emailVerified) {
        router.push("/onboard" as Route);
      }
    };

    checkVerification();
  }, [router, user]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (isRateLimited && countdown === 0) {
      setIsRateLimited(false);
      setAttempts(0);
    }
  }, [countdown, isRateLimited]);

  const CIRCLE_RADIUS = 48;
  const SEGMENT_COUNT = 3;
  const GAP_SIZE = 4;

  const getSegmentProperties = () => {
    if (countdown === 0) {
      return { length: 0, scale: 1 };
    }

    const progress =
      countdown / (isRateLimited ? RATE_LIMIT_DELAY : COOLDOWN_DELAY);
    const maxLength = (360 - GAP_SIZE * SEGMENT_COUNT) / SEGMENT_COUNT;

    return {
      length: maxLength * progress,
      scale: 0.8 + 0.2 * progress,
    };
  };

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      const newAttemptCount = attempts + 1;
      setAttempts(newAttemptCount);

      if (newAttemptCount >= MAX_ATTEMPTS) {
        setIsRateLimited(true);
        setCountdown(RATE_LIMIT_DELAY);
        toast.warning('Too Many Attempts', {
          description: 'Please try again in 30 seconds.',
        });
        return;
      }

      const newEmail = form.getValues('email');

      await changeEmail({
        newEmail,
        callbackURL: '/onboard',
      });

      await sendVerificationEmail({
        email: user?.email || form.getValues('email'),
        callbackURL: '/onboard',
      }).then(() => {
        toast('Verification mail sent to your mail');
      });

      setCountdown(COOLDOWN_DELAY);
    } catch (error: unknown) {
      captureException(error as Error, {
        level: 'error',
        extra: {
          page: 'verify-mail',
          email: user?.email,
        },
      });
      toast.error('Failed to send email', {
        description:
          'Please try again or contact support if the problem persists.',
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleTryAnotherEmail = () => {
    setShowEmailInput(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="relative flex flex-1 flex-col items-center justify-center bg-background p-4">
        <button
          type="button"
          onClick={handleGoBack}
          className="group absolute top-4 left-4 flex items-center"
        >
          <div className="relative flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 transition-all duration-300 hover:bg-white/10">
            <ChevronLeft className="size-4 text-white/60" />
            <span className="font-medium text-white/60 text-sm">Go back</span>
          </div>
        </button>

        <motion.div
          className="w-full max-w-md space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-2 text-center">
            <div className="mb-6 flex justify-center">
              <div
                className={cn(
                  'relative rounded-full bg-primary/10 p-3',
                  isRateLimited ? 'bg-red-500/10 text-red-500' : 'text-primary',
                  'transition-all'
                )}
              >
                <motion.div
                  animate={{
                    opacity: countdown > 0 ? 0 : 1,
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <Mail
                    className={cn(
                      'h-8 w-8 transition-opacity',
                      countdown > 0 || (isRateLimited && 'opacity-0')
                    )}
                  />
                </motion.div>
                {countdown > 0 && !isRateLimited && (
                  <div className="absolute inset-0">
                    <svg
                      className="h-full w-full"
                      viewBox="0 0 100 100"
                      fill="transparent"
                    >
                      <title>Countdown</title>
                      {[0, 1, 2].map((index) => {
                        const { length, scale } = getSegmentProperties();
                        return (
                          <circle
                            key={index}
                            className="origin-center text-white transition-all duration-300 ease-in-out"
                            strokeWidth="4"
                            strokeDasharray={`${length} ${360}`}
                            strokeLinecap="round"
                            stroke="currentColor"
                            r={CIRCLE_RADIUS * scale}
                            cx="50"
                            cy="50"
                            style={{
                              transform: `rotate(${(360 / SEGMENT_COUNT) * index}deg)`,
                              transformOrigin: '50% 50%',
                            }}
                          />
                        );
                      })}
                    </svg>
                    <motion.span
                      className="absolute inset-0 flex items-center justify-center font-medium text-xs"
                      animate={{ opacity: 1 }}
                      initial={{ opacity: 0.5 }}
                    >
                      {countdown}s
                    </motion.span>
                  </div>
                )}
              </div>
            </div>
            <h1
              className={cn(
                'font-bold text-4xl text-foreground tracking-tight',
                clashDisplay.className
              )}
            >
              Check your email
            </h1>
            <p className="text-muted-foreground">
              We sent you a verification link. Please check your email to verify
              your account.
            </p>
          </div>

          {/* Email Input Section */}
          {showEmailInput && (
            // biome-ignore lint/style/useFragmentSyntax: This shouldnt be a rule
            <Fragment>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Form {...form}>
                  <form className="space-y-4">
                    {!user?.email && (
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter your email"
                              className="h-12 rounded-xl border-2 bg-input px-4 text-base text-foreground transition-all ease-in-out placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
                            />
                          </FormControl>
                        )}
                      />
                    )}
                    {/* relative h-12 w-full overflow-hidden rounded-xl bg-neutral-700/10 px-4 py-2 font-medium text-sm text-white transition-all hover:scale-[1.02] hover:bg-neutral-600/10 hover:border-2  */}
                    <Button
                      type="button"
                      className={cn(
                        'relative h-12 w-full overflow-hidden rounded-xl px-4 py-2 font-medium text-sm transition-all hover:scale-[1.02] hover:bg-primary/80',
                        isResending && 'bg-gray-500 text-white',
                        isRateLimited && 'bg-red-500/10 text-red-500',
                        !isResending &&
                          !isRateLimited &&
                          'bg-neutral-700/10 text-white'
                      )}
                      onClick={handleResendVerification}
                      disabled={isResending || countdown > 0}
                    >
                      {isResending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-white/0 via-white/5 to-white/0" />
                      <div className="relative flex items-center justify-center gap-2">
                        <span>
                          {isRateLimited
                            ? `Rate limited - Try again in ${countdown}s`
                            : 'Resend verification email'}
                        </span>
                      </div>
                    </Button>
                  </form>
                </Form>
              </motion.div>
            </Fragment>
          )}

          {/* Help Text with Try Another Email Link */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Didn't receive the email? Check your spam folder or{' '}
              <button
                type="button"
                onClick={handleTryAnotherEmail}
                className="text-primary underline hover:text-primary/80"
              >
                try another email
              </button>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
