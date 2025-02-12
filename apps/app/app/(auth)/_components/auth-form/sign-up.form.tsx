'use client';

import { captureException } from '@/sentry/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@repo/auth/client';
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
import { companies } from '@repo/design-system/icons';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const signUpSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(18, 'Password must be no more than 18 characters'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const socialProviders = [
  {
    id: 'google',
    icon: companies.google,
    label: 'Google',
    signUp: () =>
      authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
        newUserCallbackURL: '/auth/setup-profile',
      }),
  },
  {
    id: 'twitter',
    icon: companies.x,
    label: 'Twitter',
    signUp: () =>
      authClient.signIn.social({
        provider: 'twitter',
        callbackURL: '/',
        newUserCallbackURL: '/auth/verify-email',
      }),
  },
  {
    id: 'facebook',
    icon: companies.facebook,
    label: 'Facebook',
    signUp: () =>
      authClient.signIn.social({
        provider: 'facebook',
        callbackURL: '/',
        newUserCallbackURL: '/auth/verify-email',
      }),
  },
] as const;

export function SignUpForm() {
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: SignUpFormValues) {
    try {
      setFormStatus('success');
      const name = `${values.firstName.trim()} ${values.lastName.trim()}`;

      await authClient.signUp.email({
        name,
        email: values.email,
        password: values.password,
        callbackURL: '/auth/verify-email',
      });

      setTimeout(() => setFormStatus('idle'), 1000);
    } catch (error) {
      setFormStatus('error');

      // Handle validation errors
      if (error instanceof z.ZodError) {
        form.setError('root', {
          message: error.message,
        });
      }
      // Handle auth/network errors
      else if (error instanceof Error) {
        captureException(error, {
          context: 'sign-up-form',
          email: values.email,
        });
      }

      setTimeout(() => setFormStatus('idle'), 1000);
    }
  }

  const handleSocialSignUp = async (
    providerId: (typeof socialProviders)[number]['id']
  ) => {
    try {
      const provider = socialProviders.find((p) => p.id === providerId);
      if (provider) {
        await provider.signUp();
      }
    } catch (error) {
      if (error instanceof Error) {
        captureException(error, {
          context: 'social-sign-up',
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
          <h1 className="font-bold text-3xl">Join Synaxis</h1>
          <p className="text-gray-500">Create an account to get started</p>
        </div>

        <div className="mx-auto w-full max-w-sm space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {socialProviders.map((provider) => (
              <Button
                key={provider.id}
                onClick={() => handleSocialSignUp(provider.id)}
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
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn(
                'space-y-6 transition-all duration-200',
                formStatus === 'success' && 'ring-2 ring-green-500/50',
                formStatus === 'error' && 'ring-2 ring-red-500/50'
              )}
            >
              <div className="flex flex-col space-y-4">
                {/* Name Fields Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h2 className="font-medium text-sm text-white">
                      First Name
                    </h2>
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="John"
                              className="h-12 rounded-xl border-none bg-zinc-900 px-4 text-base text-white transition-all ease-in-out placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <h2 className="font-medium text-sm text-white">
                      Last Name
                    </h2>
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              className="h-12 rounded-xl border-none bg-zinc-900 px-4 text-base text-white transition-all ease-in-out placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Email Field */}
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
                              className="h-12 rounded-xl border-none bg-zinc-900 px-4 text-base text-white transition-all ease-in-out placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-white"
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <h2 className="font-medium text-sm text-white">Password</h2>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Create a password"
                              type={showPassword ? 'text' : 'password'}
                              className="h-12 rounded-xl border-none bg-zinc-900 px-4 text-base text-white transition-all ease-in-out placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-white"
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className={cn(
                  'relative h-12 w-full overflow-hidden rounded-xl px-4 py-2 font-medium text-sm transition-all hover:scale-[1.02]',

                  'bg-white text-black'
                )}
              >
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-white/0 via-white/5 to-white/0" />
                <span className="relative">Create Account</span>
              </Button>

              {/* Privacy and Sign In Link */}
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
                  Already have an account?{' '}
                  <Link
                    href="/auth/sign-in"
                    className="font-medium text-foreground underline hover:text-foreground/80"
                  >
                    Sign in
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
