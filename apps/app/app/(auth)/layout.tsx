import type { Metadata } from 'next';
import { AuthLayoutWrapper } from './_components/layout-wrapper';

export const metadata: Metadata = {
  title: {
    template: '%s | Synaxis',
    default: 'Authentication | Synaxis',
  },
  description:
    'Sign in, create an account, or manage your credentials to join vibrant communities on Synaxis.',
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center overflow-y-hidden bg-black/50">
      <div className="w-full">
        <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
      </div>
    </div>
  );
}