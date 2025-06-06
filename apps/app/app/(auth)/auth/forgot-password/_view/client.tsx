'use client';

import { captureException } from '@/sentry';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgetPassword } from '@repo/auth/client';
import { cn } from '@repo/design-system';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { Input } from '@repo/design-system/components/ui/input';
import { toast } from '@repo/design-system/components/ui/sonner';
import { clashDisplay } from '@repo/design-system/fonts';
import { ChevronLeft, KeyRound, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function page() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ForgotPasswordForm) {
    try {
      setIsSubmitting(true);

      await forgetPassword({
        email: data.email,
        redirectTo: '/auth/reset-password',
      });

      toast('Reset link sent');

      setTimeout(() => router.push('/auth/sign-in'), 2000);
    } catch (error: unknown) {
      captureException(error as Error, {
        level: 'error',
        extra: {
          email: data.email,
        },
      });
      toast.error('Failed to send reset link', {
        description:
          'Please try again or contact support if the problem persists.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="relative flex flex-1 flex-col items-center justify-center bg-white p-4">
        <button
          type="button"
          onClick={handleGoBack}
          className="group absolute top-4 left-4 flex items-center"
        >
          <div className="relative flex items-center gap-2 rounded-full bg-black/5 px-3 py-1.5 transition-all duration-300 hover:bg-black/10">
            <ChevronLeft className="size-4 text-black/60" />
            <span className="font-medium text-black/60 text-sm">Go back</span>
          </div>
        </button>

        <motion.div
          className="w-full max-w-md space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-2 text-center">
            <div className="mb-6 flex justify-center">
              <div className="relative rounded-full bg-primary/10 p-3">
                <KeyRound className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1
              className={cn(
                'font-bold text-4xl text-zinc-950 tracking-tight dark:text-zinc-50',
                clashDisplay.className
              )}
            >
              Forgot Password
            </h1>
            <p className="text-muted-foreground">
              Enter your email address and we'll send you a reset link
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        className="h-12 rounded-xl border-2 bg-white/80 px-4 text-base text-black transition-all ease-in-out placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-quantum-blue"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className={cn(
                  'w-full',
                  'relative h-12 w-full overflow-hidden rounded-xl px-4 py-2 font-medium text-sm transition-all hover:scale-[1.02] hover:bg-quantum-blue/80',
                  isSubmitting && 'bg-gray-500 text-white',
                  'bg-quantum-blue text-white'
                )}
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send reset link
              </Button>
            </form>
          </Form>

          <div className="text-center text-muted-foreground text-sm">
            <p>
              Remember your password?{' '}
              <Button
                variant="link"
                className="p-0 text-primary dark:text-muted-foreground"
                onClick={() => router.push('/auth/sign-in')}
              >
                Back to sign in
              </Button>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
