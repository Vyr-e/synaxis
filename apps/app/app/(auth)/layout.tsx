import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AuthLayoutWrapper } from './_components/layout-wrapper';

export const metadata: Metadata = {
  title: {
    template: '%s | Synaxis',
    default: 'Authentication | Synaxis',
  },
  description:
    'Sign in, create an account, or manage your credentials to join vibrant communities on Synaxis.',
};

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center overflow-y-hidden">
      <div className="w-full">
        <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
      </div>
    </div>
  );
}
