import { notFound } from 'next/navigation';
import type { JSX } from 'react';

import { isSupportedLocale, type SupportedLocale } from '@/src/features/locale/config';
import { getMarketplaceCopy } from '@/src/features/marketplace/copy';

interface MarketplacePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function MarketplacePage({
  params,
}: MarketplacePageProps): Promise<JSX.Element> {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const activeLocale = locale as SupportedLocale;
  const copy = getMarketplaceCopy(activeLocale);

  return (
    <section
      lang={activeLocale}
      className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-5xl flex-col justify-center px-6 py-16"
    >
      <nav
        aria-label={copy.navigation.marketplace}
        className="mb-6 flex gap-3 text-sm text-stone-600"
      >
        <span className="rounded-full bg-stone-900 px-3 py-1 text-white">
          {copy.navigation.marketplace}
        </span>
        <span className="rounded-full border border-stone-300 px-3 py-1">
          {copy.navigation.sell}
        </span>
        <span className="rounded-full border border-stone-300 px-3 py-1">
          {copy.navigation.inquiries}
        </span>
      </nav>
      <div className="max-w-3xl rounded-3xl border border-stone-200 bg-stone-50 p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
          {copy.eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">{copy.title}</h1>
        <p className="mt-6 text-lg leading-8 text-stone-700">{copy.description}</p>
        <div className="mt-6 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800">
          {copy.status.reviewReady}
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <button
            type="button"
            className="rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white"
          >
            {copy.actions.browseListings}
          </button>
          <button
            type="button"
            className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700"
          >
            {copy.actions.sellInstrument}
          </button>
        </div>
        <form className="mt-10 grid gap-4 rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-stone-900">{copy.form.title}</h2>
          <label className="grid gap-2 text-sm font-medium text-stone-700">
            <span>{copy.form.sellerTypeLabel}</span>
            <input
              type="text"
              readOnly
              value={copy.values.sellerType}
              className="rounded-xl border border-stone-300 px-3 py-2 text-stone-900"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-stone-700">
            <span>{copy.form.priceModeLabel}</span>
            <input
              type="text"
              readOnly
              value={copy.values.priceMode}
              className="rounded-xl border border-stone-300 px-3 py-2 text-stone-900"
            />
          </label>
          <button
            type="button"
            className="w-fit rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white"
          >
            {copy.form.submitLabel}
          </button>
        </form>
      </div>
    </section>
  );
}
