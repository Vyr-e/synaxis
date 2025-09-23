'use client';

import { cn } from '@repo/design-system';
import { ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import client components to avoid SSG issues
const AnimatedIcon = dynamic(() => import('@/components/animated-logo').then(mod => ({ default: mod.AnimatedIcon })), {
  ssr: false,
  loading: () => <div className="w-6 h-6 bg-white/10 rounded-full" />
});

const MotionDiv = dynamic(() => import('motion/react').then(mod => ({ default: mod.motion.div })), {
  ssr: false,
  loading: () => <div />
});

export default function NotFound() {
  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <div className="flex relative flex-col min-h-screen md:flex-row">
      {/* Background Section - Same as auth pages */}
      <div className="absolute inset-0 z-10 md:relative md:z-20 md:w-[55%]">
        <div className="w-full h-full bg-gradient-to-br from-black via-gray-900 to-black">
          {/* Glass overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            style={{ borderRadius: '0%' }}
          />

          {/* Branding Content */}
          <div className="flex relative z-10 flex-col items-center p-8 h-full">
            {/* Logo Section */}
            <MotionDiv
              className="flex gap-2 items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-xl bg-white/5" />
                <AnimatedIcon className="relative" />
              </div>
              <span className="font-semibold text-2xl text-white drop-shadow-2xl font-clash-display">
                Synaxis
              </span>
            </MotionDiv>

            {/* Center Content - 404 Display */}
            <div className="flex flex-1 justify-center items-center">
              <MotionDiv
                className="relative max-w-lg text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="absolute -inset-4 bg-gradient-to-r rounded-3xl blur-3xl from-white/5 to-white/10" />
                <div className="relative p-8 space-y-6">
                  {/* 404 Number */}
                  <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-gray-100/90 via-gray-300/80 to-gray-100/90 bg-clip-text text-transparent backdrop-blur-sm mb-4 font-clash-display">
                    404
                  </h1>

                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-100/90 via-gray-300/80 to-gray-100/90 bg-clip-text text-transparent backdrop-blur-sm font-clash-display">
                    Page Not Found
                  </h2>

                  <p className="text-lg leading-relaxed text-zinc-300">
                    The page you are looking for does not exist or has been moved.
                  </p>
                </div>
              </MotionDiv>
            </div>

            {/* Bottom Section */}
            <MotionDiv
              className="hidden gap-2 items-center md:flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-zinc-600 to-transparent" />
              <span className="text-sm text-zinc-400">
                Return to your digital space
              </span>
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-zinc-600 to-transparent" />
            </MotionDiv>
          </div>
        </div>
      </div>

      {/* Content Section - Same layout as auth */}
      <div
        className={cn(
          'relative z-20 flex min-h-screen w-full flex-col md:h-dvh md:min-h-0 md:w-[45%]',
          'bg-gradient-to-b from-background from-25% to-transparent md:bg-black/70'
        )}
      >
        <div className="flex flex-1 justify-center items-center px-4 py-8">
          <MotionDiv
            className="relative mx-auto w-full max-w-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-6">
              <div className="mt-8 mb-4 space-y-2 text-center">
                <h1 className="text-3xl font-bold text-white">Oops!</h1>
                <p className="text-muted-foreground">
                  This page seems to have wandered off
                </p>
              </div>

              <div className="mx-auto space-y-4 w-full max-w-sm">
                {/* Action Button - Same style as auth form button */}
                <button
                  onClick={handleGoBack}
                  className={cn(
                    'relative h-12 w-full overflow-hidden rounded-xl bg-neutral-700/10 px-4 py-2 font-medium text-sm text-white transition-all hover:scale-[1.02] hover:bg-neutral-600/10 hover:border-2 flex items-center justify-center gap-2'
                  )}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Go Back</span>
                </button>

                {/* Alternative Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.href = '/'}
                    className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-xl hover:bg-muted"
                  >
                    Return Home
                  </button>

                  <button
                    onClick={() => window.location.href = '/auth/sign-in'}
                    className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-xl hover:bg-muted"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>

        <footer className="p-4 w-full text-sm text-center border-t border-border text-muted-foreground">
          © {new Date().getFullYear()} Synaxis. All rights reserved.
        </footer>
      </div>
    </div>
  );
}