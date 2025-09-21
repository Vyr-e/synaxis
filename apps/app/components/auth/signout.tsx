'use client';
import { signOut } from '@repo/auth/client';
import { SquircleLoader } from '@repo/design-system/components/loaders/squircle';
import { Button } from '@repo/design-system/components/ui/button';
import { cn } from '@repo/design-system/lib/utils';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = async () => {
    startTransition(async () => {
      await signOut({
        fetchOptions: {
          onSuccess: () => router.push('/auth/sign-in'),
        },
      });
    });
  };

  return (
    <Button
      onClick={handleSignOut}
      className={cn(
        'midnight-blue',
        ' h-fit',
        'text-sm',
        'w-40 flex justify-center rounded-lg',
        'hover:scale-105 transition-all duration-100',
        'hover:shadow-lg hover:shadow-black/20'
      )}
      aria-label="Sign out"
    >
      <div className="flex items-center gap-2">
        {isPending ? (
          <SquircleLoader size={20} color="white" />
        ) : (
          <span>Sign out</span>
        )}
      </div>
    </Button>
  );
}
