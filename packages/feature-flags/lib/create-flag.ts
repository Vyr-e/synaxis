import { analytics } from '@repo/analytics/posthog/server';
import { useSession } from '@repo/auth/client';
import { unstable_flag as flag } from '@vercel/flags/next';

export const createFlag = (key: string) =>
  flag({
    key,
    defaultValue: false,
    async decide() {
      const { data } = await useSession();

      if (!data?.user) {
        return this.defaultValue as boolean;
      }

      const isEnabled = await analytics.isFeatureEnabled(key, data.user.id);

      return isEnabled ?? (this.defaultValue as boolean);
    },
  });
