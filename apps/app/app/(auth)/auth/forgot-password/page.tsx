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
import { useToast } from '@repo/design-system/components/ui/use-toast';
import { clashDisplay } from '@repo/design-system/fonts';
import { KeyRound, Loader2 } from 'lucide-react';
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
  const { toast } = useToast();
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

      toast({
        title: 'Reset link sent',
        description: 'Please check your inbox for the password reset link.',
      });

      // Optional: Redirect after a delay to give user time to read the toast
      setTimeout(() => router.push('/auth/sign-in'), 2000);
    } catch (error: unknown) {
      captureException(error as Error, {
        level: 'error',
        extra: {
          email: data.email,
        },
      });
      toast({
        variant: 'destructive',
        title: 'Failed to send reset link',
        description:
          'Please try again or contact support if the problem persists.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center p-4">
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
                        className="h-12 rounded-xl border-none bg-zinc-900 px-4 text-base text-white transition-all ease-in-out placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-white"
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
                  'relative h-12 overflow-hidden rounded-xl px-4 py-2 font-medium text-sm transition-all hover:scale-[1.02]',
                  isSubmitting && 'bg-gray-500 text-white',
                  'bg-white text-black'
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
