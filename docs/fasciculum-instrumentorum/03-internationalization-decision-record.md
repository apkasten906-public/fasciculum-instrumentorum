# Decision Record: Internationalization from Day 1

## Status

Accepted for MVP planning.

## Decision

The platform will be built as internationalizable from the first MVP. The prototype initially supports English and German.

The project documentation and development coordination language is **English**.

## Rationale

High-value string instruments are traded in an international market. Buyers, sellers, dealers, workshops, collectors, institutions, and professional musicians do not operate in only one language area. If multilingual support is added later, it will create avoidable rework in routing, UI copy, validation messages, domain values, filters, listing descriptions, search, and documentation workflows.

Internationalization is therefore a foundational architecture concern, not a cosmetic feature.

## MVP locales

```text
en: English
de: German
```

## Later target locales

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

Italian should be considered early because of its relevance to historic instruments, violin making, provenance, and specialist terminology.

## Architecture rules

- New UI components must not contain hard-coded visible text.
- Prefer locale-prefixed routes such as `/en/...` and `/de/...`.
- Internal domain values must remain language-neutral and stable.
- Domain labels must be localized at display time.
- Trust signals must be calculated or stored as stable codes and localized at display time.
- Seller-generated free text must store a source locale.
- The data model must allow later translations of listing free text.
- Validation messages must be localized.
- Date, number, and currency formatting must be locale-aware.
- English is the canonical language for development documentation, story writing, prompt writing, and technical coordination.

## Examples

```text
Internal code: instrumentType = violin
/en display: Violin
/de display: Violine
```

```text
Internal code: trustSignal = certificate_present
/en display: Certificate available
/de display: Zertifikat vorhanden
```

```text
Internal code: listingStatus = submitted
/en display: Submitted for review
/de display: Zur Prüfung eingereicht
```

## MVP non-goals

- No automatic translation of all seller-generated free text.
- No full translation management system.
- No full multilingual SEO strategy.
- No full support for all later target locales.
- No professional legal translation of terms, contracts, guarantees, or policy documents.

## Demo effect

The demo should show that the platform is not designed as a purely local classifieds site. A seller may create a listing in German; a buyer may use the platform in English and still understand the structured data, trust signals, inquiry flow, and marketplace status.

## Consequences

This decision affects every MVP story. Any visible UI component must be built with English and German in mind. Any stable domain value should be represented internally by a code, not by display text. Any user-entered free text should have an identifiable source locale so later translation workflows can be added without data migration pain.
