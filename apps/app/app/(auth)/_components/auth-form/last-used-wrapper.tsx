import { cn } from '@repo/design-system';
import type { ReactNode } from 'react';

interface LastUsedWrapperProps {
  children: ReactNode;
  className?: string;
  type: 'button' | 'form';
  show: boolean;
}

export function LastUsedWrapper({
  children,
  className = '',
  type,
  show,
}: LastUsedWrapperProps) {
  if (!show) {
    return <>{children}</>;
  }

  if (type === 'button') {
    return <div className={cn('relative', className)}>{children}</div>;
  }

  // For form inputs
  return (
    <div
      className={cn('relative rounded-xl border border-white/10', className)}
    >
      <div className="-top-2 absolute right-4 space-x-1 bg-black px-2 text-[10px]">
        <span className="text-zinc-500">Last used</span>
        <span className=" h-2 w-2 animate-ping rounded-full bg-blue-500" />
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
