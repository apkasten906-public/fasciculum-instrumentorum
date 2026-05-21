# MVP Stories — High-Value Instrument Marketplace Prototype

## Product thesis

This prototype is not a generic marketplace. It is a trust-centered lead generation prototype for high-value string instruments.

Selected MVP value stream:

```text
Seller/dealer brings an instrument onto the platform
→ Platform structures and qualifies the listing
→ Buyer can understand why the listing is trustworthy
→ Buyer submits a qualified inquiry
```

## Project language

All stories, acceptance criteria, implementation notes, and issue descriptions are written in English. The product UI must support English and German in the MVP.

---

## Epic 0: Internationalization as a Foundation

### Story 0.1 — Provide locale-aware routing

**As** an international user  
**I want** to open the platform in English or German  
**So that** I can use the marketplace in my preferred language.

#### Acceptance criteria

```gherkin
Feature: Locale-aware routing

Scenario: User opens the German marketplace route
  Given the platform supports English and German
  When I open /de/marketplace
  Then I see the marketplace with German UI text

Scenario: User opens the English marketplace route
  Given the platform supports English and German
  When I open /en/marketplace
  Then I see the marketplace with English UI text

Scenario: Unsupported locale is used
  Given I open a route with an unsupported locale
  When the route is loaded
  Then I am redirected to the default locale
  Or I see a clear localized error page
```

#### Notes

The MVP only needs `en` and `de`, but the implementation must not be hard-wired to exactly two locales.

---

### Story 0.2 — Externalize visible UI copy

**As** a developer  
**I want** visible UI copy to be loaded from locale files or an i18n mechanism  
**So that** additional languages can be added without rewriting UI components.

#### Acceptance criteria

```gherkin
Feature: Externalized UI copy

Scenario: UI shows German copy
  Given my locale is German
  When I open the marketplace
  Then I see German navigation, buttons, form labels, and status messages

Scenario: UI shows English copy
  Given my locale is English
  When I open the marketplace
  Then I see English navigation, buttons, form labels, and status messages

Scenario: New visible text is added
  Given a new MVP component is built
  When it contains visible text
  Then that text is not hard-coded directly in the component
  And entries exist for English and German
```

#### Notes

This story is a cross-cutting rule for all other MVP stories.

---

### Story 0.3 — Localize domain values

**As** a buyer  
**I want** instrument types, document types, seller types, buyer intents, and listing statuses to be displayed in my language  
**So that** the platform remains understandable across markets.

#### Acceptance criteria

```gherkin
Feature: Localized domain values

Scenario: Instrument type is displayed in German
  Given a listing has instrumentType "violin"
  And my locale is German
  When I open the detail page
  Then I see "Violine"

Scenario: Instrument type is displayed in English
  Given a listing has instrumentType "violin"
  And my locale is English
  When I open the detail page
  Then I see "Violin"

Scenario: Internal codes remain stable
  Given a listing has instrumentType "violin"
  When I switch between German and English
  Then the stored value remains "violin"
  And only the displayed label changes
```

#### Notes

Stable internal codes are more important than localized database values. UI labels should be localized at display time.

---

### Story 0.4 — Provide a language switcher

**As** a user  
**I want** to switch between English and German  
**So that** I can view the same flow in another language.

#### Acceptance criteria

```gherkin
Feature: Language switcher

Scenario: User switches from German to English
  Given I am on /de/marketplace
  When I select English
  Then I am taken to /en/marketplace
  And the UI is shown in English

Scenario: User switches language on a detail page
  Given I am on /de/marketplace/listing-123
  When I select English
  Then I am taken to /en/marketplace/listing-123
  And I see the same listing with English UI text
```

---

### Story 0.5 — Prepare multilingual listing structure

**As** a platform operator  
**I want** listing free text to support later translations  
**So that** instruments can become internationally discoverable and understandable.

#### Acceptance criteria

```gherkin
Feature: Multilingual listing structure

Scenario: Listing has a source locale
  Given a seller creates a listing in German
  When the listing is saved
  Then sourceLocale is saved as "de"

Scenario: Translation is not yet available
  Given a German listing has no English free-text translation
  When a buyer opens the English detail page
  Then the buyer sees English UI text
  And structured fields and trust signals are localized in English
  And free text may be shown in its original language with a clear note

Scenario: Translation is available
  Given a listing has an English translation for title and description
  When a buyer opens the English detail page
  Then the buyer sees the translated listing free text
```

#### Notes

The MVP does not need automatic translation of seller-generated free text. The important part is preparing the data structure.

---

## Epic 1: Seller/Dealer Brings an Instrument onto the Platform

### Story 1.1 — Display lightweight seller profile

**As** a buyer  
**I want** to see who is offering an instrument  
**So that** I can assess trust in the listing.

#### Acceptance criteria

```gherkin
Feature: Display seller profile

Scenario: Buyer sees basic seller information
  Given a published instrument has a seller profile
  When I open the instrument detail page
  Then I see the seller display name
  And I see the seller type localized in my language
  And I see the location
  And I see the verification status localized in my language

Scenario: Seller is not verified in German
  Given a seller profile is not verified
  When I open the instrument detail page in German
  Then I see a clear note "Noch nicht verifiziert"

Scenario: Seller is not verified in English
  Given a seller profile is not verified
  When I open the instrument detail page in English
  Then I see a clear note "Not yet verified"
```

#### Notes

For the prototype, a lightweight seller profile with name, type, location, description, and verification status is enough.

---

### Story 1.2 — Create an instrument listing

**As** a seller or dealer  
**I want** to create an instrument listing in a structured form  
**So that** the platform can turn it into a high-quality listing profile.

#### Acceptance criteria

```gherkin
Feature: Create instrument listing

Scenario: Seller creates a new instrument
  Given I am in the seller area
  When I enter instrument type, title, origin, year, price, and condition
  Then the instrument is saved as a draft
  And I see it in my listing overview
  And the source locale of the listing is saved

Scenario: Required fields are missing
  Given I am in the instrument form
  When I try to save without title or instrument type
  Then I see clear validation messages in my UI language
  And the instrument is not submitted as a complete listing
```

#### Notes

The first prototype may persist data locally, through a mock API, or in the existing database.

---

### Story 1.3 — Add instrument photos

**As** a seller  
**I want** to add photos to an instrument  
**So that** buyers can better understand condition and quality.

#### Acceptance criteria

```gherkin
Feature: Add instrument photos

Scenario: Seller adds photos
  Given an instrument exists as a draft
  When I add multiple photo URLs or sample images
  Then the photos are shown in the listing
  And the photos appear on the public detail page after publication

Scenario: No photos exist
  Given a listing has no photos
  When the documentation score is calculated
  Then the absence of photos is shown as a warning signal
  And the warning signal is localized in the UI language
```

#### Notes

Static sample images or seeded image URLs are acceptable for the first demo.

---

### Story 1.4 — Capture documents and certificates

**As** a seller  
**I want** to record certificates, appraisals, and provenance information  
**So that** the instrument can be assessed with better specialist context.

#### Acceptance criteria

```gherkin
Feature: Capture documents

Scenario: Seller records a certificate
  Given I am editing an instrument
  When I add a document of type "certificate" with title, issuer, and date
  Then the document appears in the documentation overview
  And the trust panel shows "Certificate available" in English

Scenario: Certificate is shown in German
  Given a listing has a certificate
  When I open the detail page in German
  Then the trust panel shows "Zertifikat vorhanden"

Scenario: Document should not be publicly visible
  Given a document is marked as not public
  When a buyer opens the detail page
  Then the buyer only sees that a document exists
  And the buyer does not see confidential document details
```

#### Notes

The prototype does not need to store real document files. Metadata is enough.

---

### Story 1.5 — Submit listing for review

**As** a seller  
**I want** to submit a prepared listing for review  
**So that** the platform can qualify it before publication.

#### Acceptance criteria

```gherkin
Feature: Submit listing for review

Scenario: Seller submits a listing
  Given an instrument is saved as a draft
  And the minimum required data exists
  When I submit the listing
  Then the listing receives status "submitted"
  And it appears in the admin review list

Scenario: Minimum data is missing
  Given an instrument has no condition description
  When I try to submit the listing
  Then I see a warning about missing data in my UI language
  And the listing remains in draft status
```

---

## Epic 2: Platform Structures and Qualifies the Listing

### Story 2.1 — Calculate documentation score

**As** a platform operator  
**I want** to calculate a documentation score  
**So that** listing quality is visible at a glance.

#### Acceptance criteria

```gherkin
Feature: Documentation score

Scenario: Listing has many trust-building details
  Given a listing has seller profile, photos, condition, certificate, and provenance information
  When the score is calculated
  Then the listing receives a high documentation score
  And the score is displayed on the detail page

Scenario: Listing has only limited details
  Given a listing has only title, price, and one photo
  When the score is calculated
  Then the listing receives a low documentation score
  And missing information is shown as warning signals
  And the warning signals are localized
```

#### Example scoring rules

```text
+15 seller profile complete
+15 certificate available
+15 at least 5 photos available
+15 condition description available
+15 provenance information available
+10 asking price stated
+10 viewing or trial possible
+5 repair history available
```

---

### Story 2.2 — Display trust panel

**As** a buyer  
**I want** to see trust signals at a glance  
**So that** I can better assess the listing.

#### Acceptance criteria

```gherkin
Feature: Display trust panel

Scenario: Buyer sees trust signals in English
  Given a published listing has calculated trust signals
  And my locale is English
  When I open the detail page
  Then I see the documentation score
  And I see present trust signals with positive markers
  And I see missing or partial signals as warnings

Scenario: Buyer sees trust signals in German
  Given a published listing has calculated trust signals
  And my locale is German
  When I open the detail page
  Then I see the documentation score
  And I see present trust signals with positive markers
  And I see missing or partial signals as warnings

Scenario: Provenance is only partially documented
  Given a listing has a short provenance note but no supporting document
  When I open the detail page
  Then I see localized text for "Provenance partially documented"
```

---

### Story 2.3 — Display admin review list

**As** a platform operator  
**I want** to review submitted listings  
**So that** not every listing is published without qualification.

#### Acceptance criteria

```gherkin
Feature: Admin review list

Scenario: Admin sees submitted listings
  Given there are listings with status "submitted"
  When I open the admin review page
  Then I see a list of submitted listings
  And I see title, seller, instrument type, score, and submission date
  And status values and instrument types are displayed in my UI language

Scenario: No listings have been submitted
  Given there are no submitted listings
  When I open the admin review page
  Then I see an empty state with a clear localized explanation
```

---

### Story 2.4 — Publish reviewed listing

**As** an admin  
**I want** to publish a reviewed listing  
**So that** buyers can see it in the marketplace.

#### Acceptance criteria

```gherkin
Feature: Publish listing

Scenario: Admin publishes a listing
  Given a listing has status "submitted"
  When I mark the listing as reviewed and publish it
  Then the listing receives status "published"
  And it appears in the public marketplace

Scenario: Listing remains unpublished
  Given a listing has status "draft" or "submitted"
  When a buyer opens the marketplace
  Then the buyer does not see that listing in the public catalogue
```

---

## Epic 3: Buyer Finds Instruments and Understands Trust

### Story 3.1 — Display public marketplace

**As** a buyer  
**I want** to browse published instruments  
**So that** I can discover relevant offers.

#### Acceptance criteria

```gherkin
Feature: Display marketplace

Scenario: Buyer sees published instruments in English
  Given there are published listings
  When I open /en/marketplace
  Then I see cards with title, instrument type, price, location, and photo
  And I see the documentation score or trust status
  And UI labels are English

Scenario: Buyer sees published instruments in German
  Given there are published listings
  When I open /de/marketplace
  Then I see cards with title, instrument type, price, location, and photo
  And I see the documentation score or trust status
  And UI labels are German

Scenario: Unpublished listings are hidden
  Given there is a listing in draft status
  When I open the marketplace
  Then that listing is not displayed
```

---

### Story 3.2 — Filter by instrument type and price

**As** a buyer  
**I want** to filter instruments by type and price  
**So that** I can find relevant listings faster.

#### Acceptance criteria

```gherkin
Feature: Marketplace filters

Scenario: Buyer filters by instrument type in English
  Given published listings include violins and cellos
  When I select the filter "Violin"
  Then I only see violins

Scenario: Buyer filters by instrument type in German
  Given published listings include violins and cellos
  When I select the filter "Violine"
  Then I only see violins

Scenario: Buyer filters by price range
  Given published listings have different prices
  When I select a price range
  Then I only see listings within that range
```

#### Notes

Simple client-side or server-side filters are enough for the prototype. Internal filter values should remain stable codes.

---

### Story 3.3 — Display instrument detail page

**As** a buyer  
**I want** to open a detailed page for an instrument  
**So that** I can review offer details, condition, origin, and trust signals.

#### Acceptance criteria

```gherkin
Feature: Instrument detail page

Scenario: Buyer opens an instrument
  Given a listing is published
  When I open the detail page
  Then I see title, instrument type, price, origin, year, and condition description
  And I see photos
  And I see seller information
  And I see the trust panel
  And I see a way to submit an inquiry

Scenario: Buyer switches language on detail page
  Given I view a listing in German
  When I switch to English
  Then I remain on the same listing detail page
  And UI text, trust signals, and domain labels are displayed in English
```

---

## Epic 4: Buyer Submits a Qualified Inquiry

### Story 4.1 — Submit buyer inquiry

**As** a buyer  
**I want** to submit a qualified inquiry for an instrument  
**So that** the seller or platform operator can understand my level of interest.

#### Acceptance criteria

```gherkin
Feature: Submit buyer inquiry

Scenario: Buyer sends complete inquiry
  Given I am on an instrument detail page
  When I enter name, email, buyer type, intent, budget range, and message
  And I submit the inquiry
  Then the inquiry is saved
  And I see a confirmation in my UI language
  And the inquiry appears in the seller or admin dashboard
  And the preferred language of the inquiry is saved

Scenario: Required fields are missing
  Given I am in the inquiry form
  When I submit without an email address
  Then I see a localized validation error
  And the inquiry is not saved
```

---

### Story 4.2 — Capture buyer intent

**As** a seller  
**I want** to know what the buyer specifically wants  
**So that** I can prioritize and respond appropriately.

#### Acceptance criteria

```gherkin
Feature: Capture buyer intent

Scenario: Buyer selects interest in English
  Given I submit an inquiry
  When I select "Trial" as my interest
  Then the internal intent code is saved
  And the seller dashboard can display it localized

Scenario: Buyer selects interest in German
  Given I submit an inquiry in German
  When I select "Probespiel" as my interest
  Then the internal intent code is saved
  And the seller dashboard can display it localized

Scenario: Buyer has multiple interests
  Given I submit an inquiry
  When I select "Viewing" and "Certificate question"
  Then both intents are displayed in the inquiry overview
```

---

### Story 4.3 — Seller sees inquiries

**As** a seller  
**I want** to see inquiries for my instruments  
**So that** I can continue working with qualified prospects.

#### Acceptance criteria

```gherkin
Feature: Seller sees inquiries

Scenario: Seller opens inquiry dashboard
  Given there are inquiries for my listings
  When I open my inquiry dashboard
  Then I see buyer name, instrument, intent, budget range, message, and status
  And I see the buyer's preferred language

Scenario: Inquiry is new
  Given an inquiry has just been created
  When I open the dashboard
  Then the inquiry has status "new"
```

---

## Epic 5: Demo and Seed Data

### Story 5.1 — Provide seed data for example instruments

**As** a demo presenter  
**I want** realistic example instruments  
**So that** the prototype can be presented convincingly.

#### Acceptance criteria

```gherkin
Feature: Seed data

Scenario: Demo data is loaded
  Given the application starts locally
  When I open the marketplace
  Then I see at least 8 example instruments
  And the instruments have different types, prices, origins, and trust scores

Scenario: Example instrument has strong documentation
  Given a seed listing is marked as well documented
  When I open its detail page
  Then I see multiple positive trust signals
  And the documentation score is high

Scenario: Seed data supports English and German
  Given the demo data is loaded
  When I switch between English and German
  Then the same listings remain available
  And structured labels and trust signals are localized
```

#### Example instruments

```text
1. German violin, ca. 1890, €18,000, certificate available
2. Modern Viennese master violin, 2021, €24,000, verified workshop profile
3. French cello bow, ca. 1930, €9,500, provenance partially documented
4. Viola from Mittenwald, ca. 1920, €14,000, repair history available
5. Higher-quality student violin, €3,800, limited documentation
6. Violin attributed to an Italian maker, ca. 1880, price on request, appraisal pending
7. Modern cello, 2018, €21,000, trial possible
8. Baroque bow replica, €2,400, workshop documentation available
```

---

### Story 5.2 — Provide demo role switcher

**As** a demo presenter  
**I want** to switch quickly between buyer, seller, and admin views  
**So that** I can show the value stream without login friction.

#### Acceptance criteria

```gherkin
Feature: Demo role switcher

Scenario: Demo user switches role to Seller
  Given I am using the prototype
  When I select role "Seller"
  Then I see seller functions

Scenario: Demo user switches role to Admin
  Given I am using the prototype
  When I select role "Admin"
  Then I see review functions

Scenario: Role and language are independent
  Given I use the platform in English
  When I switch to role "Admin"
  Then I remain in the English UI
```

#### Notes

If real authentication already works well in the base app, this story can be skipped or replaced later.

---

## Recommended Implementation Order

```text
1. Locale routing, locale files, and language switcher
2. Seed data and domain models with stable codes
3. Public marketplace in English and German
4. Instrument detail page with localized trust panel
5. Inquiry form and inquiry dashboard including preferred language
6. Seller wizard for instruments including sourceLocale
7. Admin review and status changes
8. Filters and UI polish
9. Demo role switcher if needed
```

## Non-goals for this MVP

```text
- No real payment processing
- No escrow
- No real document verification
- No automatic price appraisal
- No auctions
- No shipping or insurance logic
- No legally binding purchase flow
- No automatic translation of all seller-generated free text
- No production-grade translation management system
- No full support for more than English and German
```

## Demo success criterion

The prototype is successful if viewers understand within 10 minutes:

> This platform is not Facebook Marketplace for violins. It makes high-value instruments easier to trade by adding structured documentation, trust signals, internationalization, and qualified buyer inquiries.
