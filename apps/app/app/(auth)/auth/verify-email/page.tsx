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

const INITIAL_DELAY = 30; // 30 seconds
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_DELAY = 300; // 5 minutes in seconds

// Mock function for testing UI
const mockSendVerification = () =>
  new Promise<void>((resolve, reject) => {
    // Randomly succeed or fail to test both paths
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
    // Check if user is already verified
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

  const getDelayForAttempt = (attemptCount: number) => {
    if (attemptCount >= MAX_ATTEMPTS) {
      return RATE_LIMIT_DELAY;
    }
    return INITIAL_DELAY * 2 ** (attemptCount - 1); // Progressive delay
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
          title: 'Rate limited',
          description: 'Too many attempts. Please try again later.',
        });
        return;
      }

      // Comment out the real implementation
      // await sendVerificationEmail({
      //   email: user?.email || form.getValues('email'),
      //   callbackURL: '/auth/setup-profile',
      // });

      // Use mock instead
      await mockSendVerification();

      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox and spam folder.',
      });

      const delay = getDelayForAttempt(newAttemptCount);
      setCountdown(delay);
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

  // Calculate circle properties
  const CIRCLE_RADIUS = 48;
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

  const progress =
    countdown > 0
      ? ((getDelayForAttempt(attempts) - countdown) /
          getDelayForAttempt(attempts)) *
        CIRCLE_CIRCUMFERENCE
      : 0;

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
                <Mail className={cn("h-8 w-8 text-primary", countdown > 0 && "opacity-0")} />
                {countdown > 0 && (
                  <div className="absolute inset-0">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <title>Countdown</title>
                      {[0, 120, 240].map((startAngle, index) => (
                        <circle
                          key={index}
                          className="text-primary transition-all duration-300 ease-in-out"
                          strokeWidth="4"
                          strokeDasharray={`${CIRCLE_CIRCUMFERENCE / 3} ${CIRCLE_CIRCUMFERENCE}`}
                          strokeDashoffset={(index + 1) * (CIRCLE_CIRCUMFERENCE / 3) - progress}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r={CIRCLE_RADIUS}
                          cx="50"
                          cy="50"
                          style={{
                            transform: `rotate(${startAngle - 90}deg)`,
                            transformOrigin: '50% 50%',
                          }}
                        />
                      ))}
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
                  'bg-white text-black'
                )}
                onClick={handleResendVerification}
                disabled={isResending}
              >
                {isResending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Resend verification email
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