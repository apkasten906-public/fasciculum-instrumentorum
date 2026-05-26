# Decision Record: Internationalization from Day 1

## Decision

The platform will be built as internationalizable from the first MVP. The prototype supports English and German first.

The project language is English. Product UI copy is localized.

## Rationale

High-value string instruments and bows belong to an international market. Buyers, sellers, dealers, workshops, collectors, and musicians operate across language boundaries. If multilingual support is added later, the team will likely need to rework routes, UI copy, validation, domain values, filters, seed data, and seller-generated listing text.

Internationalization is therefore a foundational architecture decision, not a later feature.

## MVP languages

```text
en: English
de: German
```

## Later target languages

```text
fr: French
es: Spanish
pt: Portuguese
it: Italian
zh: Mandarin / Simplified Chinese
ja: Japanese
ko: Korean
ru: Russian
```

Italian should be considered early because it is historically and professionally relevant to string-instrument making, even though the first prototype only supports English and German.

## Architecture rules

- New UI components must not contain hard-coded visible text.
- Locale-prefixed routes are preferred: `/en/...`, `/de/...`.
- Internal domain values remain language-neutral and stable.
- Labels for domain values are localized at display time.
- Trust signals are calculated as stable codes and displayed with localized labels.
- Seller-generated free text stores its source locale.
- The data model allows later translated versions of listing free text.
- Validation messages are localized.
- Dates, numbers, and currencies are formatted according to the active locale.
- Tests should avoid brittle exact string assertions for formatted currency unless the formatting library and locale configuration are explicitly standardized.

## Examples

```text
Internal code: listingItemType = violin
/de display: Violine
/en display: Violin
```

```text
Internal code: listingItemType = bow
/de display: Bogen
/en display: Bow
```

```text
Internal code: trustSignal = certificate_present
/de display: Zertifikat vorhanden
/en display: Certificate available
```

```text
Internal price state: priceMode = price_on_request
/de display: Preis auf Anfrage
/en display: Price on request
```

## Non-goals for the MVP

- No automatic translation of all seller-generated free text.
- No full translation management workflow.
- No multilingual SEO strategy.
- No complete support for all later target languages.
- No professional legal translation of terms, contracts, or warranty text.

## Demo effect

The demo should show that the platform is not local-only. A seller may create a listing with German source text while a buyer uses English UI and still understands structured data, trust signals, price state, and the inquiry form.
