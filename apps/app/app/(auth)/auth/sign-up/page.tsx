'use client';

import { AuthBackground } from '@/app/(auth)/_components/auth-background';
import { AuthForm } from '@/app/(auth)/_components/auth-form';
import { AnimatedIcon } from '@/components/animated-logo';
import { cn } from '@repo/design-system';
import { clashDisplay } from '@repo/design-system/fonts';
import { motion } from 'motion/react';

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen flex-col md:flex-row">
      {/* Form Section - Always on top on mobile, left side on desktop */}
      <div
        className={cn(
          'relative z-20 flex min-h-screen w-full flex-col md:h-dvh md:min-h-0 md:w-[45%]',
          'bg-gradient-to-t from-50% from-black via-black/90 to-transparent'
        )}
      >
        <div className="flex flex-1 items-center justify-center px-4 py-8">
          <AuthForm type="sign-up" />
        </div>

        {/* Footer - Now properly positioned */}
        <footer className="w-full border-t p-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} Synaxis. All rights reserved.
        </footer>
      </div>
      
      {/* Background Section - Behind on mobile, right side on desktop */}
      <div className="absolute inset-0 z-10 md:relative md:z-20 md:w-[55%]">
        <AuthBackground
          className="h-full w-full"
          colors1={'#545454'}
          colors2={'#1a1a1d'}
          colors3={'#010104'}
          colors4={'#f4f4f6'}
          speed={0.5}
          edge={'0%'}
        >
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20 md:to-black/40"
            style={{ borderRadius: '0%' }}
          />

          {/* Branding Content */}
          <div className="relative z-10 flex h-full flex-col items-center p-8">
            {/* Logo Section */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-white/20 blur-xl" />
                <AnimatedIcon className={'relative'} />
              </div>
              <span
                className={cn(
                  'font-semibold text-2xl text-white drop-shadow-2xl',
                  clashDisplay.className
                )}
              >
                Synaxis
              </span>
            </motion.div>

            {/* Center Content */}
            <div className="hidden flex-1 items-center justify-center md:flex">
              <motion.div
                className="relative max-w-lg text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="-inset-4 absolute rounded-3xl bg-gradient-to-r from-white/5 to-white/10 blur-3xl" />
                <div className="relative space-y-6 p-8">
                  <h2
                    className={cn(
                      'bg-gradient-to-br from-white to-white/70 bg-clip-text font-bold text-5xl text-transparent',
                      clashDisplay.className
                    )}
                  >
                    Join Your Digital Space
                  </h2>
                  <p className="text-lg text-zinc-400 leading-relaxed">
                    Start building your community and engage with your audience
                  </p>

                  {/* Floating Badges */}
                  <div className="flex justify-center gap-4 py-4">
                    {['Real-time', 'Secure', 'Scalable'].map((badge, i) => (
                      <motion.span
                        key={badge}
                        className="rounded-full border-2 border-white/10 bg-white/5 px-4 py-1 text-sm text-white/80 shadow-sm backdrop-blur-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                      >
                        {badge}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom Section */}
            <motion.div
              className="hidden items-center gap-2 md:flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-zinc-500 to-transparent" />
              <span className="text-sm text-zinc-500">
                Trusted by industry leaders
              </span>
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-zinc-500 to-transparent" />
            </motion.div>
          </div>
        </AuthBackground>
      </div>

    
    </div>
  );
}
