// Import all language message types
type EnMessages = typeof import('./messages/en.json');
type EsMessages = typeof import('./messages/es.json');
type FrMessages = typeof import('./messages/fr.json');
type DeMessages = typeof import('./messages/de.json');
type JpMessages = typeof import('./messages/jp.json');

// Verify all messages match the English structure
export type VerifyMessages<T> = {
  [P in keyof EnMessages]: P extends keyof T
    ? T[P] extends Record<string, unknown>
      ? VerifyMessages<T[P]>
      : string
    : never;
};

// Ensure all translations follow the same structure
type Messages = EnMessages;
declare interface IntlMessages extends Messages {}

// Helper type for nested translation paths
type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

// Type for valid translation paths
type TranslationPath = NestedKeyOf<IntlMessages>;
