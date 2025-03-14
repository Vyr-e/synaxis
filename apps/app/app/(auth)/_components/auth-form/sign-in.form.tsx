'use client';

import { handleBackendError } from '@/app/(auth)/auth.util';
import { captureException } from '@/sentry/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from '@repo/auth/client';
import { cn } from '@repo/design-system';
import { Button } from '@repo/design-system/components/ui/button';
import { Checkbox } from '@repo/design-system/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { Eye, EyeOff, Mail, companies } from '@repo/design-system/icons';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type UseFormReturn, useForm } from 'react-hook-form';
import * as z from 'zod';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(18, 'Password must be no more than 18 characters'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const socialProviders = [
  {
    id: 'google',
    icon: companies.google,
    label: 'Google',
    signIn: () =>
      signIn.social({
        provider: 'google',
        callbackURL: '/',
        newUserCallbackURL: '/auth/verify-email',
      }),
  },
  {
    id: 'twitter',
    icon: companies.x,
    label: 'Twitter',
    signIn: () =>
      signIn.social({
        provider: 'twitter',
        callbackURL: '/',
        newUserCallbackURL: '/auth/verify-email',
      }),
  },
  {
    id: 'facebook',
    icon: companies.facebook,
    label: 'Facebook',
    signIn: () =>
      signIn.social({
        provider: 'facebook',
        callbackURL: '/',
        newUserCallbackURL: '/auth/verify-email',
      }),
  },
] as const;

export function SignInForm() {
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleValidationError = (error: z.ZodError) => {
    form.setError('root', {
      message: error.message,
    });
  };

  async function onSubmit(_values: SignInFormValues) {
    try {
      setFormStatus('success');
      await signIn.email(
        {
          email: _values.email,
          password: _values.password,
          rememberMe,
        },
        {
          onSuccess: (ctx) => {
            if (ctx.data.emailVerified) {
              router.push('/auth/setup-profile');
            } else {
              router.push('/auth/verify-email');
            }
          },
        }
      );

      setTimeout(() => setFormStatus('idle'), 1000);
    } catch (error) {
      setFormStatus('error');

      if (error instanceof z.ZodError) {
        handleValidationError(error);
      } else if (error instanceof Error) {
        handleBackendError(
          'sign-in',
          form as unknown as UseFormReturn<{ email: string }>,
          error as Error & { status?: number }
        );
      }

      setTimeout(() => setFormStatus('idle'), 1000);
    }
  }

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  const handleSocialSignIn = async (
    providerId: (typeof socialProviders)[number]['id']
  ) => {
    try {
      const provider = socialProviders.find((p) => p.id === providerId);
      if (provider) {
        await provider.signIn();
      }
    } catch (error) {
      if (error instanceof Error) {
        captureException(error, {
          context: 'social-sign-in',
          provider: providerId,
        });
      }
    }
  };

  return (
    <motion.div
      className="relative mx-auto w-full max-w-md"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="space-y-6">
        <div className="mb-4 space-y-2 text-center">
          <h1 className="font-bold text-3xl">Welcome back to Synaxis</h1>
          <p className="text-gray-500">Continue to your Communities</p>
        </div>

        <div className="mx-auto w-full max-w-sm space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {socialProviders.map((provider) => (
              <Button
                key={provider.id}
                onClick={() => handleSocialSignIn(provider.id)}
                className="flex h-10 w-fit items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
              >
                <provider.icon className="h-5 w-5" />
                <span>{provider.label}</span>
              </Button>
            ))}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-white/10 border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="rounded-full border bg-black px-2 text-zinc-500">
                Or
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col space-y-4">
                <div className="space-y-2">
                  <h2 className="font-medium text-sm text-white">Email</h2>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="eg. johnfran@gmail.com"
                              type="email"
                              className={cn(
                                'h-12 rounded-xl border-none bg-zinc-900 px-4 text-base text-white transition-all ease-in-out placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-white',
                                formStatus === 'error' &&
                                  'ring-2 ring-red-500/50'
                              )}
                              {...field}
                            />
                            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-zinc-500">
                              <Mail
                                size={20}
                                strokeWidth={1.5}
                                aria-hidden="true"
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage
                          className={cn(
                            'text-sm transition-all duration-200',
                            formStatus === 'error' && 'font-medium text-red-400'
                          )}
                        />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="font-medium text-sm text-white">Password</h2>
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-xs text-zinc-400 hover:text-white"
                      onClick={handleForgotPassword}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter your password"
                              type={showPassword ? 'text' : 'password'}
                              className={cn(
                                'h-12 rounded-xl border-none bg-zinc-900 px-4 text-base text-white transition-all ease-in-out placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-white',
                                formStatus === 'error' &&
                                  'ring-2 ring-red-500/90'
                              )}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-zinc-500 hover:text-zinc-300"
                            >
                              {showPassword ? (
                                <Eye
                                  size={20}
                                  strokeWidth={1.5}
                                  aria-hidden="true"
                                />
                              ) : (
                                <EyeOff
                                  size={20}
                                  strokeWidth={1.5}
                                  aria-hidden="true"
                                />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage
                          className={cn(
                            'text-sm transition-all duration-200',
                            formStatus === 'error' && 'font-medium text-red-400'
                          )}
                        />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                  className="h-4 w-4 rounded-sm border-zinc-600 data-[state=checked]:border-none data-[state=checked]:bg-white"
                />
                <Label className="text-sm text-zinc-400">Remember me</Label>
              </div>

              <div className="relative">
                <Button
                  type="submit"
                  className={cn(
                    'relative h-12 w-full overflow-hidden rounded-xl px-4 py-2 font-medium text-sm transition-all hover:scale-[1.02]',
                    'bg-white text-black'
                  )}
                >
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-white/0 via-white/5 to-white/0" />
                  <div className="relative flex items-center justify-center gap-2">
                    <span>Sign In</span>
                    {formStatus !== 'idle' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="relative h-2 w-2"
                      >
                        <div
                          className={cn(
                            'absolute h-2 w-2 rounded-full',
                            formStatus === 'success' && 'bg-emerald-500',
                            formStatus === 'error' && 'bg-red-500'
                          )}
                        />
                        <div
                          className={cn(
                            'absolute h-2 w-2 animate-ping rounded-full',
                            formStatus === 'success' && 'bg-emerald-500',
                            formStatus === 'error' && 'bg-red-500'
                          )}
                        />
                      </motion.div>
                    )}
                  </div>
                </Button>

                {/* Form Status Indicator */}
                {formStatus !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="-bottom-6 absolute right-0 left-0 text-center"
                  >
                    <span
                      className={cn(
                        'font-medium text-xs',
                        formStatus === 'success' && 'text-emerald-500',
                        formStatus === 'error' && 'text-red-500'
                      )}
                    >
                      {formStatus === 'success' && '✓ Signed in successfully'}
                      {formStatus === 'error' && '× Invalid email or password'}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Add privacy message and sign up link */}
              <div className="space-y-4 text-center text-muted-foreground text-sm">
                <p>
                  By continuing, you agree to our{' '}
                  <Link
                    href="/legal/terms"
                    className="underline hover:text-foreground"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/legal/privacy"
                    className="underline hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </p>

                <p>
                  Don't have an account?{' '}
                  <Link
                    href="/auth/sign-up"
                    className="font-medium text-foreground underline hover:text-foreground/80"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </motion.div>
  );
}
