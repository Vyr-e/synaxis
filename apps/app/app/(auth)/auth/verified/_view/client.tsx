'use client';

import { cn } from '@repo/design-system';
import { Button } from '@repo/design-system/components/ui/button';
import { clashDisplay } from '@repo/design-system/fonts';
import { ArrowRight, CheckCircle2 } from 'lucide-react'; // Using CheckCircle2 for success
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

export default function VerifiedPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/onboard'); // Navigate to the start of onboarding
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="relative flex flex-1 flex-col items-center justify-center bg-white p-4">
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
                'font-bold text-4xl text-zinc-950 tracking-tight dark:text-zinc-50',
                clashDisplay.className
              )}
            >
              Email Verified!
            </h1>

            {/* Description */}
            <p className="text-zinc-500">
              Your email address has been successfully verified. You can now
              proceed to set up your account.
            </p>
          </div>

          {/* Continue Button */}
          <div className="pt-4">
            <Button
              onClick={handleContinue}
              className="relative h-12 w-full overflow-hidden rounded-xl bg-quantum-blue px-4 py-2 font-medium text-sm text-white transition-all hover:scale-[1.02] hover:bg-quantum-blue/90"
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
