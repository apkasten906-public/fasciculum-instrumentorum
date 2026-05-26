export const defaultLocale = 'en';
export const supportedLocales = ['en', 'de'] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export function isSupportedLocale(value: string): value is SupportedLocale {
  return supportedLocales.includes(value as SupportedLocale);
}

export function getLocaleOrDefault(value: string): SupportedLocale {
  return isSupportedLocale(value) ? value : defaultLocale;
}
