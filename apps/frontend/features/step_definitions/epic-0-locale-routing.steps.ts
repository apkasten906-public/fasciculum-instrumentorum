import assert from 'node:assert/strict';

import { Given, Then, When } from '@cucumber/cucumber';

import { supportedLocales } from '../../src/features/locale/config';
import { resolveMarketplacePathname } from '../../src/features/locale/marketplace-routing';
import { getMarketplaceCopy } from '../../src/features/marketplace/copy';
import { World } from '../support/world';

function assertRouteResolution(
  resolution: ReturnType<typeof resolveMarketplacePathname> | undefined
): Exclude<ReturnType<typeof resolveMarketplacePathname>, null> {
  assert.ok(resolution, 'Expected a route resolution result');
  return resolution;
}

Given('the platform supports English and German', async function (this: World) {
  assert.deepEqual([...supportedLocales], ['en', 'de']);
});

When('I open the marketplace route {string}', async function (this: World, pathname: string) {
  this.setData('routeResolution', resolveMarketplacePathname(pathname));
});

Then('the route renders in locale {string}', async function (this: World, expectedLocale: string) {
  const resolution = assertRouteResolution(
    this.getData<ReturnType<typeof resolveMarketplacePathname>>('routeResolution')
  );
  assert.equal(resolution.action, 'render');
  assert.equal(resolution.locale, expectedLocale);
});

Then('I see the marketplace with German UI text', async function (this: World) {
  const resolution = assertRouteResolution(
    this.getData<ReturnType<typeof resolveMarketplacePathname>>('routeResolution')
  );
  assert.equal(resolution.locale, 'de');

  const copy = getMarketplaceCopy('de');
  assert.equal(copy.title, 'Marktplatz fuer hochwertige Instrumente und Boegen');
  assert.equal(copy.actions.browseListings, 'Angebote ansehen');
});

Then('I see the marketplace with English UI text', async function (this: World) {
  const resolution = assertRouteResolution(
    this.getData<ReturnType<typeof resolveMarketplacePathname>>('routeResolution')
  );
  assert.equal(resolution.locale, 'en');

  const copy = getMarketplaceCopy('en');
  assert.equal(copy.title, 'Marketplace for fine instruments and bows');
  assert.equal(copy.actions.browseListings, 'Browse listings');
});

Given('I open a marketplace route with an unsupported locale', async function (this: World) {
  this.setData('routePathname', '/it/marketplace');
});

When('the route is loaded', async function (this: World) {
  const pathname = this.getData<string>('routePathname');
  assert.ok(pathname, 'Expected a pathname before loading the route');
  this.setData('routeResolution', resolveMarketplacePathname(pathname));
});

Then('I am redirected to {string}', async function (this: World, expectedPathname: string) {
  const resolution = assertRouteResolution(
    this.getData<ReturnType<typeof resolveMarketplacePathname>>('routeResolution')
  );
  assert.equal(resolution.action, 'redirect');
  assert.equal(resolution.targetPath, expectedPathname);
});
