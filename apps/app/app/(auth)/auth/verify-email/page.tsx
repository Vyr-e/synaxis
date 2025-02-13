'use client';

import { captureException } from '@/sentry';
import { zodResolver } from '@hookform/resolvers/zod';
import { /*sendVerificationEmail,*/ useSession } from '@repo/auth/client';
import { cn } from '@repo/design-system';
import { Button } from '@repo/design-system/components/ui/button';
import { Form } from '@repo/design-system/components/ui/form';
import { Input } from '@repo/design-system/components/ui/input';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import { clashDisplay } from '@repo/design-system/fonts';
import { Loader2, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const verifyEmailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type VerifyEmailForm = z.infer<typeof verifyEmailSchema>;

const COOLDOWN_DELAY = 30; // 30 seconds between attempts
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_DELAY = 120; // 2 minutes rate limit after max attempts

// Mock function for testing UI
const mockSendVerification = () =>
  new Promise<void>((resolve, reject) => {
    if (Math.random() > 0.3) {
      setTimeout(resolve, 1000);
    } else {
      setTimeout(() => reject(new Error('Failed to send email')), 1000);
    }
  });

export default function VerifyEmailPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const user = session?.user;
  const [isResending, setIsResending] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const form = useForm<VerifyEmailForm>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: user?.email || '',
    },
  });

  useEffect(() => {
    const checkVerification = async () => {
      if (await user?.emailVerified) {
        router.push('/auth/setup-profile');
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

  // Calculate circle properties
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
      scale: 0.8 + 0.2 * progress, // Scale from 0.8 to 1.0
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
        toast({
          variant: 'destructive',
          title: 'Too Many Attempts',
          description: 'Please try again in 2 minutes.',
        });
        return;
      }
      // TODO: Comment out real implementation
      // await sendVerificationEmail({
      //   email: user?.email || form.getValues('email'),
      //   callbackURL: '/auth/setup-profile',
      // })
      await mockSendVerification();

      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox and spam folder.',
      });

      setCountdown(COOLDOWN_DELAY);
    } catch (error: unknown) {
      captureException(error as Error, {
        level: 'error',
        extra: {
          email: user?.email,
        },
      });
      toast({
        variant: 'destructive',
        title: 'Failed to send email',
        description:
          'Please try again or contact support if the problem persists.',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Icon and Header */}
          <div className="space-y-2 text-center">
            <div className="mb-6 flex justify-center">
              <div className="relative rounded-full bg-primary/10 p-3">
                <Mail
                  className={cn(
                    'h-8 w-8 text-primary transition-opacity duration-300',
                    countdown > 0 && 'opacity-0'
                  )}
                />
                {countdown > 0 && !isRateLimited && (
                  <div className="absolute inset-0">
                    <svg
                      className="h-full w-full text-muted-foreground/20"
                      viewBox="0 0 100 100"
                      fill="transparent"
                    >
                      <title>Countdown</title>
                      {[0, 1, 2].map((index) => {
                        const { length, scale } = getSegmentProperties();
                        return (
                          <circle
                            key={index}
                            className="origin-center text-primary transition-all duration-300 ease-in-out"
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
                    <span className="absolute inset-0 flex items-center justify-center font-medium text-xs">
                      {countdown}s
                    </span>
                  </div>
                )}
              </div>
            </div>
            <h1
              className={cn(
                'font-bold text-4xl text-zinc-950 tracking-tight dark:text-zinc-50',
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

          {/* Form Section */}
          <Form {...form}>
            <form className="space-y-4">
              {!user?.email && (
                <Input
                  {...form.register('email')}
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 w-full rounded-xl border-none bg-zinc-900 px-4 text-base text-white transition-all ease-in-out placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-white"
                />
              )}
              <Button
                type="button"
                className={cn(
                  'w-full',
                  'relative h-12 overflow-hidden rounded-xl px-4 py-2 font-medium text-sm transition-all hover:scale-[1.02]',
                  isResending && 'bg-gray-500 text-white',
                  isRateLimited && 'bg-red-500/10 text-red-500',
                  !isResending && !isRateLimited && 'bg-white text-black'
                )}
                onClick={handleResendVerification}
                disabled={isResending || countdown > 0}
              >
                {isResending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isRateLimited
                  ? `Rate limited - Try again in ${countdown}s`
                  : 'Resend verification email'}
              </Button>
            </form>
          </Form>

          {/* Help Text */}
          <div className="text-center text-muted-foreground text-sm">
            <p>
              Didn't receive the email? Check your spam folder or{' '}
              <Button
                variant="link"
                className={cn('p-0 text-primary dark:text-muted-foreground')}
                onClick={() => router.push('/auth/sign-in')}
              >
                try another email
              </Button>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
