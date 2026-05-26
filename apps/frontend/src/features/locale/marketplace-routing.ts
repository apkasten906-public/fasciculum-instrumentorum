import { defaultLocale, isSupportedLocale, type SupportedLocale } from './config';

export interface MarketplaceRouteResolution {
  action: 'render' | 'redirect';
  locale: SupportedLocale;
  targetPath: string;
}

export function resolveMarketplacePathname(pathname: string): MarketplaceRouteResolution | null {
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === '/') {
    return {
      action: 'redirect',
      locale: defaultLocale,
      targetPath: `/${defaultLocale}/marketplace`,
    };
  }

  const segments = normalizedPathname.split('/').filter(Boolean);
  const [candidateLocale, candidateSection] = segments;

  if (candidateSection !== 'marketplace') {
    return null;
  }

  if (!candidateLocale || !isSupportedLocale(candidateLocale)) {
    return {
      action: 'redirect',
      locale: defaultLocale,
      targetPath: `/${defaultLocale}/marketplace`,
    };
  }

  return {
    action: 'render',
    locale: candidateLocale,
    targetPath: `/${candidateLocale}/marketplace`,
  };
}

function normalizePathname(pathname: string): string {
  if (!pathname) {
    return '/';
  }

  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}
