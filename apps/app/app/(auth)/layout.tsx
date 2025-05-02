import type { Metadata } from 'next';
import type { JSX, ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Sign in or create an account to join vibrant communities',
};

type AuthLayoutProperties = {
  children: ReactNode;
};

export default function AuthLayout({
  children,
}: AuthLayoutProperties): JSX.Element {
  return (
    <div className="flex min-h-dvh items-center justify-center overflow-y-hidden">
      <div className="w-full">{children}</div>
    </div>
  );
}
