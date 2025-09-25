'use client';

import { AuthForm } from '@/app/(auth)/_components/auth-form';
import { AnimatedIcon } from '@/components/animated-logo';
import { AuthBackground } from '@/components/auth-background';
import { cn } from '@repo/design-system';
import { clashDisplay } from '@repo/design-system/fonts';
import { motion } from 'motion/react';

export default function SignInPage() {
  return (
    <div className="flex relative flex-col min-h-screen md:flex-row">
      {/* Background Section - Always full width/height on mobile */}
      <div className="absolute inset-0 z-10 md:relative md:z-20 lg:w-[55%] w-full">
        <AuthBackground
          className="w-full h-full"
          colors1={'#000000'}
          colors2={'#0f0f0f'}
          colors3={'#1a1a1a'}
          colors4={'#2a2a2a'}
          speed={0.5}
          edge={'0%'}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            style={{ borderRadius: '0%' }}
          />

          {/* Branding Content - Visible on desktop or as overlay on mobile */}
          <div className="flex relative z-10 flex-col items-center p-8 h-full">
            {/* Logo Section */}
            <motion.div
              className="flex gap-2 items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-xl bg-white/5" />
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
            <div className="hidden flex-1 justify-center items-center md:flex">
              <motion.div
                className="relative max-w-lg text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="absolute -inset-4 bg-gradient-to-r rounded-3xl blur-3xl from-white/5 to-white/10" />
                <div className="relative p-8 space-y-6">
                  <h2
                    className={cn(
                      'bg-gradient-to-r from-gray-100/90 via-gray-300/80 to-gray-100/90 bg-clip-text font-bold text-5xl text-transparent backdrop-blur-sm',
                      clashDisplay.className
                    )}
                  >
                    Welcome to Your Digital Space
                  </h2>
                  <p className="text-lg leading-relaxed text-zinc-300">
                    Where every conversation matters and communities thrive
                    together in real-time
                  </p>

                  {/* Floating Badges */}
                  <div className="flex gap-4 justify-center py-4">
                    {['Real-time', 'Secure', 'Scalable'].map((badge, i) => (
                      <motion.span
                        key={badge}
                        className="px-4 py-1 text-sm rounded-full border shadow-sm backdrop-blur-sm border-white/10 bg-black/50 text-white/70"
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
              className="hidden gap-2 items-center md:flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-zinc-600 to-transparent" />
              <span className="text-sm text-zinc-400">
                Trusted by industry leaders
              </span>
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-zinc-600 to-transparent" />
            </motion.div>
          </div>
        </AuthBackground>
      </div>

      {/* Form Section - Overlays on mobile, side-by-side on desktop */}
      <div
        className={cn(
          'relative z-20 flex min-h-screen  flex-col md:h-dvh md:min-h-0 w-full lg:w-[45%]',
          'bg-gradient-to-t from-background via-background/90 to-transparent md:bg-background'
        )}
      >
        <div className="flex flex-1 justify-center items-center px-4 py-8">
          <AuthForm type="sign-in" />
        </div>
        {/* Footer - Now properly positioned */}
        <footer className="p-4 w-full text-sm text-center border-t text-muted-foreground">
          © {new Date().getFullYear()} Synaxis. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
