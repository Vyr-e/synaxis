'use client';

import { AuthBackground } from '@/app/(auth)/_components/auth-background';
import { AuthForm } from '@/app/(auth)/_components/auth-form';
import { AnimatedIcon } from '@/components/animated-logo';
import { cn } from '@repo/design-system';
import { clashDisplay } from '@repo/design-system/fonts';
import { motion } from 'motion/react';

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen flex-col md:flex-row">
      {/* Background Section - Always full width/height on mobile */}
      <div className="absolute inset-0 md:relative md:w-[55%]">
        <AuthBackground
          className="h-full w-full"
          colors1={'#ffffff'}
          colors2={'#f8fafc'}
          colors3={'#f1f5f9'}
          colors4={'#e2e8f0'}
          speed={0.5}
          edge={'0%'}
        >
          <div
            className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"
            style={{ borderRadius: '0%' }}
          />

          {/* Branding Content - Visible on desktop or as overlay on mobile */}
          <div className="relative z-10 flex h-full flex-col items-center p-8">
            {/* Logo Section */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-black/5 blur-xl" />
                <AnimatedIcon className={'relative'} />
              </div>
              <span
                className={cn(
                  'font-semibold text-2xl text-black drop-shadow-2xl',
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
                      'bg-gradient-to-r from-gray-800/90 via-gray-600/80 to-gray-800/90 bg-clip-text font-bold text-5xl text-transparent backdrop-blur-sm',
                      clashDisplay.className
                    )}
                  >
                    Welcome to Your Digital Space
                  </h2>
                  <p className="text-lg text-zinc-600 leading-relaxed">
                    Where every conversation matters and communities thrive
                    together in real-time
                  </p>

                  {/* Floating Badges */}
                  <div className="flex justify-center gap-4 py-4">
                    {['Real-time', 'Secure', 'Scalable'].map((badge, i) => (
                      <motion.span
                        key={badge}
                        className="rounded-full border border-black/10 bg-white/50 px-4 py-1 text-black/70 text-sm shadow-sm backdrop-blur-sm"
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
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-zinc-400 to-transparent" />
              <span className="text-sm text-zinc-500">
                Trusted by industry leaders
              </span>
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-zinc-400 to-transparent" />
            </motion.div>
          </div>
        </AuthBackground>
      </div>

      {/* Form Section - Overlays on mobile, side-by-side on desktop */}
      <div
        className={cn(
          'relative z-20 flex min-h-screen w-full flex-col md:h-dvh md:min-h-0 md:w-[45%]',
          'bg-gradient-to-t from-white via-white/90 to-transparent md:bg-white'
        )}
      >
        <div className="flex flex-1 items-center justify-center px-4 py-8">
          <AuthForm type="sign-in" />
        </div>
        {/* Footer - Now properly positioned */}
        <footer className="w-full border-t p-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} Synaxis. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
