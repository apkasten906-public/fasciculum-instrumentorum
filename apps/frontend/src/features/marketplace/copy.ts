import marketplaceDe from '../../../public/locales/de/marketplace.json';
import marketplaceEn from '../../../public/locales/en/marketplace.json';
import { type SupportedLocale } from '../locale/config';

export interface MarketplaceCopy {
  eyebrow: string;
  title: string;
  description: string;
  navigation: {
    marketplace: string;
    sell: string;
    inquiries: string;
  };
  actions: {
    browseListings: string;
    sellInstrument: string;
  };
  form: {
    title: string;
    sellerTypeLabel: string;
    priceModeLabel: string;
    submitLabel: string;
  };
  status: {
    reviewReady: string;
  };
  values: {
    sellerType: string;
    priceMode: string;
  };
}

const marketplaceCopyByLocale: Record<SupportedLocale, MarketplaceCopy> = {
  en: marketplaceEn,
  de: marketplaceDe,
};

export function getMarketplaceCopy(locale: SupportedLocale): MarketplaceCopy {
  return marketplaceCopyByLocale[locale];
}
