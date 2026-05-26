import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import authDe from './public/locales/de/auth.json';
import commonDe from './public/locales/de/common.json';
import dashboardDe from './public/locales/de/dashboard.json';
import homeDe from './public/locales/de/home.json';
import marketplaceDe from './public/locales/de/marketplace.json';
import authEn from './public/locales/en/auth.json';
import commonEn from './public/locales/en/common.json';
import dashboardEn from './public/locales/en/dashboard.json';
import homeEn from './public/locales/en/home.json';
import marketplaceEn from './public/locales/en/marketplace.json';

export const defaultLocale = 'en';
export const locales = ['en', 'de'] as const;
export type Locale = (typeof locales)[number];

export const languages = {
  en: 'English',
  de: 'Deutsch',
} as const;

const resources = {
  en: {
    common: commonEn,
    home: homeEn,
    dashboard: dashboardEn,
    auth: authEn,
    marketplace: marketplaceEn,
  },
  de: {
    common: commonDe,
    home: homeDe,
    dashboard: dashboardDe,
    auth: authDe,
    marketplace: marketplaceDe,
  },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  defaultNS: 'common',
  ns: ['common', 'home', 'dashboard', 'auth', 'marketplace'],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

void i18n.init();

export default i18n;
