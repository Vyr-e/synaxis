'use client';


export const dynamic = 'force-dynamic';

import { PasswordStrengthChecker } from '@/app/(auth)/_components/password-strength-checker';
import { captureException } from '@/sentry';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPassword } from '@repo/auth/client';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const resetPasswordSchema = z
  .object({
    password: z.string().min(1, 'Password is required'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (!resetToken) {
      toast({
        variant: 'destructive',
        title: 'Invalid or Missing Token',
        description: 'Please request a new password reset link.',
      });
      router.push('/auth/forgot-password');
      return;
    }
    setToken(resetToken);
  }, [searchParams, router, toast]);

  async function onSubmit(data: ResetPasswordForm) {
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Invalid or Missing Token',
        description: 'Please request a new password reset link.',
      });
      router.push('/auth/forgot-password');
      return;
    }

    try {
      setIsSubmitting(true);

      await resetPassword({
        newPassword: data.password,
        token,
      });

      toast({
        title: 'Password reset successful',
        description: 'You can now sign in with your new password.',
      });

      setTimeout(() => router.push('/auth/sign-in'), 2000);
    } catch (error: unknown) {
      captureException(error as Error, {
        level: 'error',
      });
      toast({
        variant: 'destructive',
        title: 'Failed to reset password',
        description:
          'The reset link may have expired. Please request a new one.',
      });
      router.push('/auth/forgot-password');
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
                'text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50',
                clashDisplay.className
              )}
            >
              Reset Password
            </h1>
            <p className="text-muted-foreground">
              Enter your new password below
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PasswordStrengthChecker
                        placeholder="New password"
                        autoComplete="new-password"
                        className="h-12 w-full rounded-xl border-none bg-zinc-900 px-4 text-base text-white transition-all ease-in-out placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-white"
                        error={!!form.formState.errors.password}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Confirm password"
                        type="password"
                        autoComplete="new-password"
                        className="h-12 w-full rounded-xl border-none bg-zinc-900 px-4 text-base text-white transition-all ease-in-out placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !token}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Reset password
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-muted-foreground">
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