// import { AnalyticsProvider } from '@repo/analytics';
import { AuthProvider } from '@repo/auth/provider';
import { env } from '@repo/env';
import { VercelToolbar } from '@vercel/toolbar/next';
import type { ThemeProviderProps } from 'next-themes';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { ThemeProvider } from './providers/theme';

export { capitalize, cn } from './lib/utils';

type DesignSystemProviderProperties = ThemeProviderProps;

export const DesignSystemProvider = ({
  children,
  ...properties
}: DesignSystemProviderProperties) => (
  <ThemeProvider {...properties}>
    <AuthProvider>
      {/* <AnalyticsProvider> */}
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
      {env.NODE_ENV === 'development' && env.FLAGS_SECRET && env.TOOLBAR && (
        <VercelToolbar />
      )}
      {/* </AnalyticsProvider> */}
    </AuthProvider>
  </ThemeProvider>
);
