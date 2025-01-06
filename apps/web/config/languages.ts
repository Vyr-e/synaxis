// For future use with language selector
export const languages = {
  en: { name: 'English', flag: 'gb' },
  es: { name: 'Español', flag: 'es' },
  fr: { name: 'Français', flag: 'fr' },
  de: { name: 'Deutsch', flag: 'de' },
  jp: { name: 'Japanese', flag: 'jp' },
} as const;

export const locales = ['en', 'es', 'fr', 'de', 'jp'] ;
export type Locale = keyof typeof languages;

export const defaultLocale = 'en' as const; 