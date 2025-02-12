'use client';

import { useSession } from '@repo/auth/client';
import { cn } from '@repo/design-system';
import { clashDisplay } from '@repo/design-system/fonts';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    // Check if user is already verified
    const checkVerification = async () => {
      if (await user?.emailVerified) {
        router.push('/auth/setup-profile');
      }
    };

    checkVerification();
  }, [router, user]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md space-y-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className={cn(
              'font-bold text-4xl text-foreground',
              clashDisplay.className
            )}
          >
            Check your email
          </h1>
          <p className="text-muted-foreground">
            We sent you a verification link. Please check your email to verify
            your account.
          </p>
        </motion.div>
      </main>

      {/* Footer - Always at bottom */}
      <footer className="w-full border-t p-4 text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} Synaxis. All rights reserved.
      </footer>
    </div>
  );
}
