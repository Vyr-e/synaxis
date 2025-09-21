'use client';

import { cn } from '@repo/design-system';
import { Button } from '@repo/design-system/components/ui/button';
import { clashDisplay } from '@repo/design-system/fonts';
import { ArrowRight, CheckCircle2 } from 'lucide-react'; // Using CheckCircle2 for success
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';

export default function VerifiedPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/onboard' as Route); // Navigate to the start of onboarding
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="relative flex flex-1 flex-col items-center justify-center bg-background p-4">
        {/* Removed the back button as it's a success page */}
        <motion.div
          className="w-full max-w-md space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="space-y-2 text-center">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <motion.div
                className="rounded-full bg-green-500/10 p-3 text-green-500"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                  delay: 0.2,
                }}
              >
                <CheckCircle2 className="h-10 w-10" />
              </motion.div>
            </div>

            {/* Title */}
            <h1
              className={cn(
                'font-bold text-4xl text-foreground tracking-tight',
                clashDisplay.className
              )}
            >
              Email Verified!
            </h1>

            {/* Description */}
            <p className="text-muted-foreground">
              Your email address has been successfully verified. You can now
              proceed to set up your account.
            </p>
          </div>

          {/* Continue Button */}
          <div className="pt-4">
            <Button
              onClick={handleContinue}
              className="relative h-12 w-full overflow-hidden rounded-xl bg-neutral-700/10 px-4 py-2 font-medium text-sm text-white transition-all hover:scale-[1.02] hover:bg-neutral-600/10 hover:border-2 "
            >
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-white/0 via-white/5 to-white/0" />
              <div className="relative flex items-center justify-center gap-2">
                <span>Continue to Account Setup</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
