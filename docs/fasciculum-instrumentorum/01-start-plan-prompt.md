# Project Start / Planning Prompt — High-Value Instrument Marketplace MVP

## Project context

We are building a prototype for a web platform that supports the buying and selling of high-value musical instruments. The initial focus is on string instruments, especially violins, violas, cellos, and later bows.

The platform must not be a simple classifieds site. The core thesis is:

> High-value instruments do not need another simple listing page. They need a structured, trustworthy listing profile that creates qualified buyer inquiries.

The prototype should be demonstrable within one week. It must intentionally avoid real payments, escrow, legally binding transactions, and production-grade appraisal workflows in the first MVP.

## Project language decision

The working language for this project is **English**.

All planning documents, stories, prompts, technical notes, issue descriptions, acceptance criteria, domain language, and implementation guidance should be written in English unless explicitly requested otherwise.

The product itself must support multiple user interface languages, but the project documentation and development coordination language is English.

## Critical architectural decision: internationalization from day 1

The platform must be internationalizable from the first MVP. Multilingual support is not a later UI polish task. It is a core architecture decision.

The MVP starts with:

```text
Primary MVP locales:
- English: en
- German: de
```

The architecture should allow later expansion without major rework to additional target languages, such as:

```text
Possible later target locales:
- French: fr
- Spanish: es
- Portuguese: pt
- Italian: it
- Mandarin / Simplified Chinese: zh
- Japanese: ja
- Korean: ko
- Russian: ru
```

Italian should be considered early because of its strong relevance to historical string instruments, violin making, provenance, and specialist terminology.

### Internationalization principles

- Do not hard-code visible UI text in components.
- Navigation text, buttons, labels, validation messages, status messages, trust signals, form hints, and empty states must use locale files or the existing i18n mechanism.
- The MVP must be demonstrable in at least English and German.
- Prefer locale-prefixed routes such as `/en/...` and `/de/...`.
- Include a simple language switcher.
- Prepare locale-aware formatting for dates, numbers, and currencies.
- Store domain values as stable internal codes and localize their display labels.
- Seller-generated free text does not need automatic translation in the MVP, but the data model should support later translations.
- English should be treated as the canonical language for developer-facing keys, documentation, and issue/story writing.

### Product consequence

The prototype should show that the platform is designed for an international high-value instrument market:

```text
/en/marketplace
→ English marketplace

/de/marketplace
→ German marketplace
```

A German-speaking seller may create an instrument listing. An English-speaking buyer should still understand the structured data, trust signals, and inquiry flow in English. Free-text seller descriptions may remain in the original language for the MVP if the UI and taxonomic terms are localized.

## Strategic starting point

Existing comparison and inspiration sources:

- Tarisio: auction house, private sales, expertise, provenance, instrument database, trust.
- McNeela Music: e-commerce shop, clear product categories, retail UX.
- Blue Danube Violins: local specialist shop / workshop, consulting, consignment, trust through reputation.
- Facebook Marketplace: current informal workaround with reach and simplicity, but weak specialist structure and weak trust signals.

The prototype should combine the simplicity of a marketplace, the specialist knowledge of a violin dealer, and the trust model of an auction house.

## Selected MVP value stream

The first value stream to prototype is:

```text
Seller/dealer brings an instrument onto the platform
→ Platform structures and qualifies the listing
→ Buyer can understand why the listing is trustworthy
→ Buyer submits a qualified inquiry
```

Out of scope for the first MVP:

- Payment processing
- Escrow
- Shipping insurance
- Auctions
- Legally binding purchase contracts
- Full expert appraisal workflows
- Complex price valuation
- Live chat
- Automatic professional translation of all seller-generated free text

## Prototype goal

The prototype should demonstrate:

1. A seller or dealer creates an instrument listing.
2. The platform guides the seller through structured entry of instrument details, condition, photos, certificates, and provenance.
3. The listing receives a documentation and trust status.
4. Buyers see not just a listing, but a structured trust overview.
5. Buyers submit a qualified inquiry.
6. Sellers or platform operators see the inquiry in a dashboard.
7. Users can switch between English and German without breaking the platform logic.

## Technical frame

The project will be bootstrapped in the existing Next/Node Base App.

Work pragmatically and prototype-first. Use existing authentication, roles, database, and API layers if they are already available and not blocking progress. If they slow down the prototype, use seed data, mock APIs, or lightweight persistence.

Prefer:

- Next.js UI for buyer, seller, and admin flows.
- Node/API layer for listings, seller profiles, trust signals, and inquiries.
- Seed data for 8–12 high-value example instruments.
- Simple role logic: Buyer, Seller, Admin.
- If needed, a demo role switcher instead of full authentication.
- Clear, self-documenting names.
- TypeScript with explicit return types if this is the project standard.
- BDD-style acceptance criteria as implementation guidance.
- Internationalization from the first vertical slice.
- Use the base app's existing i18n standard if available; otherwise introduce a lightweight Next-compatible locale file structure for the prototype.

## MVP pages

Routes should be locale-aware. The exact implementation can follow the base app's routing conventions, but the logical routes should support locale prefixes.

```text
/[locale]/marketplace
→ Public instrument catalogue

/[locale]/marketplace/[listingId]
→ Instrument detail page with trust panel and inquiry form

/[locale]/seller/listings
→ Seller sees their own instruments

/[locale]/seller/listings/new
→ Create-instrument wizard

/[locale]/seller/inquiries
→ Seller sees buyer inquiries

/[locale]/admin/review
→ Platform reviews submitted listings

/[locale]/admin/review/[listingId]
→ Review detail page with checklist, score, and status change
```

## Minimal domain models

```text
SellerProfile
- id
- displayName
- sellerType: dealer | workshop | private | institution
- location
- verifiedStatus: unverified | pending | verified
- description

InstrumentListing
- id
- sellerId
- instrumentType: violin | viola | cello | bow
- title
- makerName
- attributedTo
- originCountry
- originCity
- yearLabel
- yearApproximation
- priceAmount
- priceCurrency
- conditionSummary
- provenanceSummary
- status: draft | submitted | reviewed | published
- documentationScore
- sourceLocale: en | de | fr | es | pt | it | zh | ja | ko | ru
- createdAt
- updatedAt

InstrumentListingTranslation
- id
- listingId
- locale
- title
- conditionSummary
- provenanceSummary
- publicDescription
- translationStatus: source | draft | reviewed | machine_translated | human_reviewed

InstrumentPhoto
- id
- listingId
- url
- caption
- captionLocale
- sortOrder

InstrumentDocument
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
- intent: viewing | trial | price_question | certificate_question | purchase_interest | other
- preferredLocale: en | de | fr | es | pt | it | zh | ja | ko | ru
- budgetRange
- message
- status: new | contacted | closed
- createdAt
```

`TrustSignal` may either be stored or calculated from listing, document, and seller data. Trust signal labels should not be stored as free text. Use stable codes and localize their display labels.

Example:

```text
trustSignalCode: certificate_present
/en display: Certificate available
/de display: Zertifikat vorhanden
```

## Documentation and trust logic

The prototype should show a trust panel, for example:

```text
This instrument is 82% documented
✓ Seller profile complete
✓ Certificate available
✓ 8 photos available
✓ Condition description available
⚠ Provenance only partially documented
⚠ No independent price appraisal recorded
```

German display example:

```text
Dieses Instrument ist zu 82 % dokumentiert
✓ Verkäuferprofil vollständig
✓ Zertifikat vorhanden
✓ 8 Fotos vorhanden
✓ Zustandsbeschreibung vorhanden
⚠ Provenienz nur teilweise dokumentiert
⚠ Keine unabhängige Preisbewertung hinterlegt
```

Example trust signals:

- Seller profile complete
- Seller verified
- Certificate available
- Appraisal available
- Provenance documented
- Repair history available
- Multiple high-quality photos available
- Condition description available
- Viewing available
- Trial possible
- Asking price stated

## Demo storyline

Do not start the demo technically. Start with the market problem:

```text
Today, high-value instruments often move through informal networks or even Facebook Marketplace. That is simple, but weak on trust, documentation, and qualified inquiries.

This prototype shows how a high-value instrument can be not merely listed, but structured, documented, and presented with trust signals.

It also shows from day 1 that high-value instruments are traded internationally: the same structured data, trust signals, and buyer inquiries work in English and German.
```

Demo flow:

1. A seller creates a violin listing in German.
2. The seller adds photos, certificate information, condition, and provenance.
3. The platform calculates documentation level and trust signals.
4. The admin sees submitted listings and can set review status.
5. A buyer opens the marketplace in English.
6. The buyer sees localized UI, localized trust signals, and structured data.
7. The buyer understands why the listing is trustworthy.
8. The buyer submits a qualified inquiry in English.
9. The seller or admin sees the lead in the dashboard.

## Priorities

### Must-have

- Locale structure for English and German
- No hard-coded UI copy in new MVP components
- English/German language switcher
- Catalogue with example instruments
- Instrument detail page
- Lightweight seller profile
- Create-instrument wizard
- Documentation / trust checklist
- Documentation score
- Buyer inquiry form
- Seller/Admin inquiry dashboard

### Should-have

- Filters by instrument type, price, origin, and documentation level
- Listing status: Draft, Submitted, Reviewed, Published
- Seed data for 8–12 example instruments
- Demo role switcher: Buyer, Seller, Admin
- Localized labels for instrument types, seller types, document types, buyer intents, and status values
- Locale-aware price, date, and number formatting

### Could-have

- Watchlist
- Comparison view
- Email mock for inquiries
- Document upload mock
- Polished badge components
- First translation structure for seller-generated free text
- Admin warning when an English translation is missing

### Won't-have in the prototype

- Payment
- Escrow
- Shipping insurance
- Auction logic
- Live chat
- Legally binding purchase completion
- Real expert verification
- Automatic professional translation of all content
- Full support for more than English and German

## Expected working style

Work in small vertical slices. Each story should combine UI, API/data model, and acceptance criteria where possible.

Prioritize demonstrable value over technical completeness.

Keep the code clean, but avoid overengineering.

Use seed data when real integrations would slow down the prototype.

Internationalization must not be treated as final polish. Every visible MVP component should work directly in English and German.

Document clearly what is demo functionality and what must later be productionized.
