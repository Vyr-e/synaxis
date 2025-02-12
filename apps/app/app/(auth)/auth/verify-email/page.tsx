'use client';

import { useSession } from '@repo/auth/client';
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
        router.push('/');
      }
      router.push('/auth/verify-email');
    };

    checkVerification();
  }, [router, user]);

  return <div>page</div>;
}
