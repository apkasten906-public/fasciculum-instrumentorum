import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { Given, Then, When } from '@cucumber/cucumber';

import { getMarketplaceCopy } from '../../src/features/marketplace/copy';
import { World } from '../support/world';

type StoryLocale = 'en' | 'de';

Given('my locale is German', async function (this: World) {
  this.setData('storyLocale', 'de' satisfies StoryLocale);
});

Given('my locale is English', async function (this: World) {
  this.setData('storyLocale', 'en' satisfies StoryLocale);
});

When('I open the marketplace', async function (this: World) {
  const locale = this.getData<StoryLocale>('storyLocale');
  assert.ok(locale, 'Expected the story locale to be set');
  this.setData('marketplaceCopy', getMarketplaceCopy(locale));
});

Then(
  'I see German navigation, buttons, form labels, and status messages',
  async function (this: World) {
    const copy = this.getData<ReturnType<typeof getMarketplaceCopy>>('marketplaceCopy');
    assert.ok(copy, 'Expected marketplace copy to be loaded');
    assert.equal(copy.navigation.marketplace, 'Marktplatz');
    assert.equal(copy.actions.browseListings, 'Angebote ansehen');
    assert.equal(copy.form.sellerTypeLabel, 'Verkaeufertyp');
    assert.equal(copy.status.reviewReady, 'Pruefbereites Angebot');
  }
);

Then(
  'I see English navigation, buttons, form labels, and status messages',
  async function (this: World) {
    const copy = this.getData<ReturnType<typeof getMarketplaceCopy>>('marketplaceCopy');
    assert.ok(copy, 'Expected marketplace copy to be loaded');
    assert.equal(copy.navigation.marketplace, 'Marketplace');
    assert.equal(copy.actions.browseListings, 'Browse listings');
    assert.equal(copy.form.sellerTypeLabel, 'Seller type');
    assert.equal(copy.status.reviewReady, 'Review-ready listing');
  }
);

Given('a new MVP component is built', async function (this: World) {
  const marketplacePagePath = path.join(
    process.cwd(),
    'app',
    '[locale]',
    'marketplace',
    'page.tsx'
  );
  const marketplacePageSource = fs.readFileSync(marketplacePagePath, 'utf8');
  this.setData('marketplacePageSource', marketplacePageSource);
});

When('it contains visible text', async function () {
  // The scenario verifies that visible text is sourced indirectly via locale files.
});

Then('that text is not hard-coded directly in the component', async function (this: World) {
  const source = this.getData<string>('marketplacePageSource');
  assert.ok(source, 'Expected marketplace page source to be loaded');

  const forbiddenLiterals = [
    'Marketplace for fine instruments and bows',
    'Marktplatz fuer hochwertige Instrumente und Boegen',
    'Browse listings',
    'Angebote ansehen',
    'Seller type',
    'Verkaeufertyp',
    'Review-ready listing',
    'Pruefbereites Angebot',
  ];

  for (const literal of forbiddenLiterals) {
    assert.equal(
      source.includes(literal),
      false,
      `Expected component source not to hard-code visible UI literal: ${literal}`
    );
  }
});

Then('entries exist for English and German', async function () {
  const localeFiles = [
    path.join(process.cwd(), 'public', 'locales', 'en', 'marketplace.json'),
    path.join(process.cwd(), 'public', 'locales', 'de', 'marketplace.json'),
  ];

  for (const localeFile of localeFiles) {
    assert.equal(fs.existsSync(localeFile), true, `Expected locale file to exist: ${localeFile}`);
    const parsed = JSON.parse(fs.readFileSync(localeFile, 'utf8')) as {
      navigation?: { marketplace?: string };
      actions?: { browseListings?: string };
      form?: { sellerTypeLabel?: string };
      status?: { reviewReady?: string };
    };
    assert.ok(parsed.navigation?.marketplace, `Expected navigation.marketplace in ${localeFile}`);
    assert.ok(parsed.actions?.browseListings, `Expected actions.browseListings in ${localeFile}`);
    assert.ok(parsed.form?.sellerTypeLabel, `Expected form.sellerTypeLabel in ${localeFile}`);
    assert.ok(parsed.status?.reviewReady, `Expected status.reviewReady in ${localeFile}`);
  }
});
