# Project Start / Planning Prompt — High-Value Instrument and Bow Marketplace MVP

## Project context

We are building a one-week prototype for a web platform that supports buying and selling high-value string instruments and bows.

The platform is not a generic classifieds site. The central product thesis is:

> High-value string instruments and bows do not need another simple listing page. They need structured, trustworthy listing profiles that are qualified before publication and generate qualified buyer inquiries.

The first prototype must be demonstrable next week. It should be pragmatic, visually convincing, and implementation-ready inside the existing Next/Node Base App bootstrap.

## Project language

All project documentation, implementation notes, stories, acceptance criteria, issue descriptions, commit guidance, and coordination prompts must be written in English.

The product UI must support English and German in the MVP.

## Internationalization from day 1

Internationalization is a foundation, not later UI polish.

MVP locales:

```text
en
de
```

The architecture should later support additional target languages without major rework, for example:

```text
fr
es
pt
it
zh
ja
ko
ru
```

Italian should be considered important for future domain expansion because of its relevance to historical string instruments, violin making, provenance, and specialist vocabulary.

### I18n implementation principles

- Do not hard-code visible UI text in components.
- Navigation labels, buttons, form labels, validation errors, status messages, trust signals, domain labels, and helper text must use locale files or the existing i18n mechanism.
- Use locale-aware routes such as `/en/...` and `/de/...`.
- Provide a simple language switcher.
- Store stable internal domain codes and localize display labels.
- Format prices, dates, and numbers in a locale-aware way.
- Seller-generated free text does not need automatic translation in the one-week prototype, but the data model should not block later translation support.

## Core MVP listing scope

The MVP supports listings for high-value string instruments and bows.

Initial listing item types:

```text
violin
viola
cello
bow
```

Bows are first-class listing items, not accessories. The product, data model, filters, seed data, localized labels, trust panels, and inquiry flow must treat bows as part of the core marketplace scope.

Use `listingItemType` as the stable internal domain concept. Avoid `instrumentType` as the primary concept if it would exclude bows.

Deferred listing item types:

```text
double_bass
cases
accessories
sheet_music
services
```

## Strategic reference models

Use these existing market examples as input archetypes, not as direct copies:

- Tarisio: auction house, private sales, expertise, provenance, instrument data, trust.
- McNeela Music: e-commerce shop, clear categories, retail UX.
- Blue Danube Violins: local specialist dealer/workshop, consultation, commission sales, reputation.
- Facebook Marketplace: current informal workaround with reach and simplicity, but weak specialist structure and weak trust.

The prototype should communicate the product direction clearly:

> The simplicity of a marketplace, the specialist structure of a violin dealer, and the trust orientation of an expert auction house.

## Selected MVP value stream

The first value stream to prototype is:

```text
Seller/dealer creates a listing for an instrument or bow
-> Platform structures and qualifies the listing
-> Admin publishes or requests changes
-> Buyer can understand why the listing is trustworthy
-> Buyer submits a qualified inquiry
-> Seller and admin can see the inquiry
```

The seller/admin qualification loop must be built before or alongside the public buyer marketplace. Do not build a buyer-facing marketplace first and retrofit trust later.

## One-week prototype success path

The prototype must demonstrate this path:

```text
Seller creates listing
-> Seller submits listing for review
-> Admin publishes or requests changes
-> Seller can see requested changes
-> Buyer views localized trust panel
-> Buyer submits qualified inquiry with one required primary intent
-> Seller/admin sees inquiry
```

## Explicit non-goals for the one-week MVP

Do not implement:

```text
real payment
escrow
real document verification
automatic price valuation
auctions
shipping or insurance logic
legally binding purchase workflow
map UI
geolocation search
dealer map pins
appointment scheduling
multi-intent buyer inquiries
automatic professional translation of seller free text
```

## Future vision: dealer and workshop discovery while traveling

The long-term platform vision includes helping musicians discover trusted dealers and workshops wherever they are traveling. This may later become a map-based experience similar to travel booking platforms, where dealers and workshops are listed geographically and shown as pins on a map.

This is not part of the one-week prototype. The MVP may show seller city and country only. Do not implement map UI, geolocation search, latitude/longitude fields, map pins, or appointment scheduling.

## Price handling

The MVP supports both stated asking prices and price-on-request listings.

Stable internal fields:

```text
priceMode: asking_price | price_on_request
priceAmount: number | null
priceCurrency: EUR | USD | GBP | ...
```

Rules:

- If `priceMode` is `asking_price`, `priceAmount` is required.
- If `priceMode` is `price_on_request`, `priceAmount` is null.
- Public UI displays price-on-request listings with localized text.
- Numeric price filters apply only to listings with `priceMode = asking_price`.
- Price-on-request listings are excluded from numeric price-range results unless a separate include option is later added.
- The documentation score may recognize that a price state is provided, but should not imply that every high-value listing must publish an exact amount.

## MVP pages

Routes should be locale-aware. Logical route list:

```text
/[locale]/marketplace
-> public marketplace showing published listings only

/[locale]/marketplace/[listingId]
-> listing detail page with trust panel and inquiry form

/[locale]/seller/listings
-> seller sees own listings and their lifecycle status

/[locale]/seller/listings/new
-> seller creates a listing for a string instrument or bow

/[locale]/seller/inquiries
-> seller sees buyer inquiries for own listings

/[locale]/admin/review
-> admin reviews submitted listings

/[locale]/admin/review/[listingId]
-> review detail with checklist, documentation score, publish action, and request-changes action

/[locale]/admin/inquiries
-> simple internal view of all buyer inquiries
```

## Minimal domain model guidance

Use these concepts pragmatically. Persist them if the base app is ready; otherwise mock or seed them cleanly.

```text
SellerProfile
- id
- displayName
- sellerType: dealer | workshop | private_seller | institution
- city
- country
- verifiedStatus: unverified | pending | verified
- description

Listing
- id
- sellerId
- listingItemType: violin | viola | cello | bow
- title
- makerName
- attributedTo
- originCountry
- originCity
- yearLabel
- yearApproximation
- priceMode: asking_price | price_on_request
- priceAmount
- priceCurrency
- conditionSummary
- provenanceSummary
- status: draft | submitted | changes_requested | published
- reviewNote
- documentationScore
- sourceLocale: en | de | fr | es | pt | it | zh | ja | ko | ru
- createdAt
- updatedAt

ListingTranslation
- id
- listingId
- locale
- title
- conditionSummary
- provenanceSummary
- publicDescription
- translationStatus: source | draft | reviewed | machine_translated | human_reviewed

ListingPhoto
- id
- listingId
- url
- caption
- captionLocale
- sortOrder

ListingDocument
- id
- listingId
- documentType: certificate | appraisal | provenance | repair_history | dendrochronology | other
- title
- issuer
- issueDate
- isAvailableToBuyer
- verificationStatus: not_checked | present | verified | rejected

BuyerInquiry
- id
- listingId
- buyerName
- buyerEmail
- buyerType: professional_musician | student | collector | dealer | parent | institution | other
- primaryIntent: viewing | trial | price_question | certificate_question | purchase_interest | other
- preferredLocale: en | de | fr | es | pt | it | zh | ja | ko | ru
- budgetRange
- message
- consentToShareWithSeller
- status: new | contacted | closed
- createdAt
```

Trust signals may be stored or calculated. Prefer stable trust signal codes and localized display labels.

Example:

```text
trustSignalCode: certificate_present
English: Certificate available
German: Zertifikat vorhanden
```

## Lifecycle-aware seed data

Seed data must support the full trust flow, not only the public marketplace.

Include at least:

```text
- one draft listing
- one submitted listing
- one changes_requested listing
- several published listings
- listings for violin, viola, cello, and bow
- at least one price_on_request listing
- at least one strongly documented listing
- at least one partially documented listing
```

Public marketplace pages must show only `published` listings.

## Implementation order

Use this order so the build does not drift into a generic buyer marketplace:

```text
1. Locale routing and translation mechanism
2. Domain types, price model, and lifecycle-aware seed data
3. Seller create-listing flow
4. Seller submit for review
5. Admin review with publish and request-changes states
6. Seller requested-changes visibility
7. Public marketplace showing published listings only
8. Listing detail page with localized trust panel
9. Buyer inquiry form with one required primary intent and consent-to-share checkbox
10. Seller and admin inquiry views
11. Filters and UI polish if time allows
12. Demo role switcher if needed
```

## Development style

- Prefer simple vertical slices over speculative infrastructure.
- Keep names readable and self-documenting.
- Use explicit TypeScript return types where project standards require them.
- Keep visible text externalized from the start.
- Keep BDD acceptance criteria visible and use them to guide implementation.
- If full auth slows the demo down, use a demo role switcher.
- Do not overbuild future map/discovery functionality.

## Branching guidance

- Epic 0 implementation may begin.
- At minimum, each epic must have its own feature branch.
- Recommended default: use one feature branch per story to keep work atomic, reviewable, and reversible.
- Exception: if multiple stories are tightly coupled and cannot be demonstrated, reviewed, or merged independently without creating churn, they may share the epic branch or a shared feature branch.
- Prefer smaller story branches merged into the epic branch over long-running mixed-scope branches.

## Demo success criterion

The prototype is successful if viewers understand this within ten minutes:

> This platform is not Facebook Marketplace for violins. It makes high-value string instruments and bows easier to sell and evaluate by structuring listings, qualifying them before publication, presenting localized trust signals, and capturing qualified buyer inquiries.
