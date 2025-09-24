import { LayoutWrapper } from './_components/layout-wrapper';

interface OnboardLayoutProps {
  children: React.ReactNode;
}

export default function OnboardLayout({ children }: OnboardLayoutProps) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}