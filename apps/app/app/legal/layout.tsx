import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Synaxis',
    default: 'Legal | Synaxis',
  },
  description: 'Legal information and policies for Synaxis platform.',
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {children}
    </div>
  );
}