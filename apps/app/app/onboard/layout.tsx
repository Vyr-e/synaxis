import type React from 'react';
import { LayoutWrapper } from './_components/layout-wrapper';


export default function OnboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}

