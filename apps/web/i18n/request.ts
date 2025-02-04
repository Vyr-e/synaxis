import { getRequestConfig } from 'next-intl/server';

import type { Locale } from '../config/languages';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let baseLocale = new Intl.Locale((await requestLocale) as string).baseName;
  if (!baseLocale || !routing.locales.includes(baseLocale as Locale)) {
    baseLocale = routing.defaultLocale;
  }

  return {
    locale: baseLocale,
    messages: (await import(`../messages/${baseLocale}.json`)).default,
  };
});
