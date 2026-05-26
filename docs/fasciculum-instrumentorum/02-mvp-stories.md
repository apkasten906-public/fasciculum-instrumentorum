# MVP Stories — High-Value Instrument and Bow Marketplace Prototype

## Product thesis

This prototype is not a generic marketplace. It is a trust-centered lead generation prototype for high-value string instruments and bows.

For the MVP, the platform trust claim is:

```text
The platform actively structures and qualifies listings before publication.
```

Selected MVP value stream:

```text
Seller/dealer creates a listing for an instrument or bow
-> Platform structures and qualifies the listing
-> Buyer can understand why the listing is trustworthy
-> Buyer submits a qualified inquiry
-> Seller and admin can see the inquiry
```

## Project language

All stories, acceptance criteria, implementation notes, issue descriptions, and project documentation are written in English. The product UI must support English and German in the MVP.

## One-week prototype success path

```text
Seller creates listing
-> Seller submits listing for review
-> Admin publishes or requests changes
-> Seller can see requested changes
-> Buyer views localized trust panel
-> Buyer submits qualified inquiry
-> Seller/admin sees inquiry
```

## Core listing scope

The MVP supports high-value string instruments and bows.

Initial listing item types:

```text
violin
viola
cello
bow
```

Bows are first-class listing items, not accessories. The product, data model, filters, seed data, localized labels, and buyer inquiry flow must treat bows as part of the core marketplace scope.

Use `listingItemType` as the stable internal domain concept. Avoid using `instrumentType` in a way that excludes bows.

Deferred listing item types:

```text
double_bass
cases
accessories
sheet_music
services
```

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

## Future vision: dealer and workshop discovery while traveling

The long-term platform vision includes helping musicians discover trusted dealers and workshops wherever they are traveling. This may later become a map-based experience similar to travel booking platforms, where dealers and workshops are listed geographically and shown as pins on a map.

This is not part of the one-week prototype. Do not implement map UI, geolocation search, latitude/longitude fields, map pins, or appointment scheduling in the MVP. Capture this direction only in the future epic.

---

## Priority guide

### Must

```text
0.1 Locale-aware routing
0.2 Externalized UI copy
0.3 Localized domain values
0.4 Language switcher
0.6 Locale-aware price and date formatting
1.1 Lightweight seller/dealer profile
1.2 Create listing for instrument or bow
1.3 Add listing photos
1.4 Capture documents and certificates
1.5 Submit listing for review
2.1 Documentation completeness score
2.2 Trust panel
2.3 Admin review list
2.4 Review submitted listing
2.5 Keep unpublished listings hidden
2.6 Seller sees requested changes
3.1 Public marketplace
3.3 Listing detail page
4.1 Submit buyer inquiry
4.2 Capture buyer primary intent
4.3 Seller sees inquiries
4.4 Admin sees all inquiries in a simple internal view
5.1 Seed data
```

### Should

```text
0.5 Multilingual listing text structure
2.7 Seller resubmits after requested changes
3.2 Filter by listing item type and price
5.2 Demo role switcher
```

### Could

```text
6.1 Future dealer/workshop discovery notes
```

---

# Epic 0: Internationalization as a Foundation

## Story 0.1 - Provide locale-aware routing

**As** an international user  
**I want** to open the platform in English or German  
**So that** I can use the marketplace in my preferred language.

### Acceptance criteria

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
  Given I open a marketplace route with an unsupported locale
  When the route is loaded
  Then I am redirected to /en/marketplace
```

### Notes

The MVP only needs `en` and `de`, but the implementation must not be hard-wired to exactly two locales.

---

## Story 0.2 - Externalize visible UI copy

**As** a developer  
**I want** visible UI copy to be loaded from locale files or an i18n mechanism  
**So that** additional languages can be added without rewriting UI components.

### Acceptance criteria

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

---

## Story 0.3 - Localize domain values

**As** a buyer  
**I want** listing item types, document types, seller types, buyer intents, and listing statuses to be displayed in my language  
**So that** the platform remains understandable across markets.

### Acceptance criteria

```gherkin
Feature: Localized domain values

Scenario: Bow listing item type is displayed in English
  Given a listing has listingItemType "bow"
  And my locale is English
  When I open the detail page
  Then I see "Bow"

Scenario: Bow listing item type is displayed in German
  Given a listing has listingItemType "bow"
  And my locale is German
  When I open the detail page
  Then I see "Bogen"

Scenario: Internal codes remain stable
  Given a listing has listingItemType "bow"
  When I switch between German and English
  Then the stored value remains "bow"
  And only the displayed label changes
```

---

## Story 0.4 - Provide a language switcher

**As** a user  
**I want** to switch between English and German  
**So that** I can inspect the same listing in either MVP language.

### Acceptance criteria

```gherkin
Feature: Language switcher

Scenario: User switches from English to German
  Given I am on /en/marketplace
  When I choose German
  Then I am taken to /de/marketplace
  And the same marketplace content is shown with German UI labels

Scenario: User switches language on a listing detail page
  Given I am on an English listing detail page
  When I choose German
  Then I remain on the same listing detail page
  And the route uses /de/
```

---

## Story 0.5 - Prepare multilingual listing text structure

**As** a platform owner  
**I want** seller-generated listing text to record its source locale  
**So that** the platform can support translations later without corrupting original seller text.

### Acceptance criteria

```gherkin
Feature: Multilingual listing text structure

Scenario: Seller creates a listing in German
  Given my active locale is German
  When I create a listing with title and description
  Then the listing stores sourceLocale "de"
  And the original title and description are preserved

Scenario: Translation is not available
  Given a listing was created in German
  And no English translation exists
  When I open the listing in English
  Then I see the original seller text
  And I see a clear indication that the seller text is shown in its original language if needed
```

### Priority

Should. This is architecturally important, but the demo can use seed content if time is short.

---

## Story 0.6 - Format prices and dates by locale

**As** a buyer  
**I want** prices and dates to be formatted consistently for the active locale  
**So that** listings feel credible and understandable internationally.

### Acceptance criteria

```gherkin
Feature: Locale-aware formatting

Scenario: Asking price is shown in English locale
  Given a listing has priceMode "asking_price"
  And priceAmount 18000
  And priceCurrency "EUR"
  When I open the listing in English
  Then the listing price is displayed according to the English locale
  And the displayed currency remains EUR

Scenario: Asking price is shown in German locale
  Given a listing has priceMode "asking_price"
  And priceAmount 18000
  And priceCurrency "EUR"
  When I open the listing in German
  Then the listing price is displayed according to the German locale
  And the displayed currency remains EUR

Scenario: Price on request is shown in English
  Given a listing has priceMode "price_on_request"
  And my locale is English
  When I open the listing detail page
  Then I see the localized price label "Price on request"
  And no numeric price amount is shown

Scenario: Price on request is shown in German
  Given a listing has priceMode "price_on_request"
  And my locale is German
  When I open the listing detail page
  Then I see the localized price label "Preis auf Anfrage"
  And no numeric price amount is shown
```

### Notes

Avoid brittle tests that assert exact punctuation or spacing of formatted currency strings unless the implementation standardizes one formatting library and locale configuration.

---

# Epic 1: Seller/Dealer Brings a Listing onto the Platform

## Story 1.1 - Show a lightweight seller/dealer profile

**As** a buyer  
**I want** to see who offers a listing  
**So that** I can assess basic trust and context.

### Acceptance criteria

```gherkin
Feature: Lightweight seller profile

Scenario: Buyer sees seller information
  Given a published listing has a seller profile
  When I open the listing detail page
  Then I see the seller display name
  And I see the seller type
  And I see the seller city and country
  And I see the seller verification status

Scenario: Seller is not verified
  Given a seller profile is not verified
  When I open the listing detail page
  Then I see a clear localized unverified status
```

### Notes

For the one-week prototype, keep this profile intentionally small:

```text
displayName
sellerType
city
country
verificationStatus
description
```

Do not add map-ready fields such as latitude, longitude, dealer pins, or geolocation search in the MVP.

---

## Story 1.2 - Create a listing for an instrument or bow

**As** a seller or dealer  
**I want** to create a structured listing for a string instrument or bow  
**So that** the platform can produce a high-quality listing profile.

### Acceptance criteria

```gherkin
Feature: Create listing

Scenario: Seller creates a new bow listing
  Given I am in the seller area
  When I create a new listing
  And I choose listingItemType "bow"
  And I enter title, origin, year label, price state, and condition summary
  Then the listing is saved as a draft
  And I see it in my listing overview
  And the listing source locale is stored

Scenario: Seller creates a price-on-request listing
  Given I am in the listing form
  When I choose priceMode "price_on_request"
  Then priceAmount is not required
  And the listing can be saved as a draft

Scenario: Required fields are missing
  Given I am in the listing form
  When I try to save without title or listing item type
  Then I see localized validation errors
  And the listing is not submitted for review
```

### Notes

The first prototype may store data locally, through a mock API, or in the existing application database.

---

## Story 1.3 - Add listing photos

**As** a seller  
**I want** to add photos to a listing  
**So that** buyers can better assess condition and quality.

### Acceptance criteria

```gherkin
Feature: Listing photos

Scenario: Seller adds photos
  Given a listing exists as a draft
  When I add multiple photo URLs or demo images
  Then the photos are shown in the listing preview
  And the photos appear on the public detail page after publication

Scenario: No photos are present
  Given a listing has no photos
  When the documentation score is calculated
  Then missing photos are represented as a trust warning
  And the warning is localized
```

### Notes

Static demo images or seeded image URLs are acceptable.

---

## Story 1.4 - Capture documents and certificates

**As** a seller  
**I want** to capture certificate, appraisal, repair-history, and provenance metadata  
**So that** the listing is easier to evaluate professionally.

### Acceptance criteria

```gherkin
Feature: Listing documents

Scenario: Seller records a certificate
  Given I edit a listing
  When I add a document of type "certificate" with title, issuer, and issue date
  Then the document appears in the documentation overview
  And the trust panel can show a localized certificate-present signal

Scenario: Document is not publicly visible
  Given a document is marked as not publicly visible
  When a buyer opens the listing detail page
  Then the buyer sees that supporting documentation exists
  And the buyer does not see confidential document details
```

### Notes

The prototype does not need to store real document files. Metadata is enough.

---

## Story 1.5 - Submit listing for review

**As** a seller  
**I want** to submit a prepared listing for platform review  
**So that** the platform can qualify it before publication.

### Acceptance criteria

```gherkin
Feature: Submit listing for review

Scenario: Seller submits a listing
  Given a listing is saved as a draft
  And minimum required information is present
  When I submit the listing for review
  Then the listing receives status "submitted"
  And it appears in the admin review list

Scenario: Minimum information is missing
  Given a listing has no condition summary
  When I try to submit the listing for review
  Then I see a localized warning with missing information
  And the listing remains in draft status
```

---

# Epic 2: Platform Structures and Qualifies the Listing

## Story 2.1 - Calculate documentation completeness score

**As** a platform operator  
**I want** to calculate a documentation completeness score  
**So that** listing quality is visible at a glance.

### Acceptance criteria

```gherkin
Feature: Documentation completeness score

Scenario: Listing has many trust-building details
  Given a listing has seller profile, photos, condition summary, certificate, and provenance summary
  When the score is calculated
  Then the listing receives a high documentation completeness score
  And the score is shown on the detail page

Scenario: Listing has limited details
  Given a listing has only title, price state, and one photo
  When the score is calculated
  Then the listing receives a low documentation completeness score
  And missing information is displayed as localized warnings
```

### Example scoring rules

```text
+15 seller profile present
+15 certificate metadata present
+15 at least 5 photos present
+15 condition summary present
+15 provenance summary present
+10 clear price state present
+10 viewing or trial option present
+5 repair-history metadata present
```

### Notes

The score measures documentation completeness only. It must not claim authenticity, valuation accuracy, legal verification, or expert approval.

---

## Story 2.2 - Show trust panel

**As** a buyer  
**I want** to see trust signals at a glance  
**So that** I can assess whether a listing deserves further inquiry.

### Acceptance criteria

```gherkin
Feature: Trust panel

Scenario: Buyer sees trust signals in English
  Given a published listing has calculated trust signals
  And my locale is English
  When I open the detail page
  Then I see the documentation completeness score
  And I see present signals with positive markers
  And I see missing or partial signals as warnings

Scenario: Buyer sees trust signals in German
  Given a published listing has calculated trust signals
  And my locale is German
  When I open the detail page
  Then I see the documentation completeness score
  And I see present signals with localized labels
  And I see missing or partial signals with localized labels
```

---

## Story 2.3 - Show admin review list

**As** a platform operator  
**I want** to review submitted listings  
**So that** listings are not published without platform qualification.

### Acceptance criteria

```gherkin
Feature: Admin review list

Scenario: Admin sees submitted listings
  Given there are listings with status "submitted"
  When I open the admin review page
  Then I see a list of submitted listings
  And I see title, seller, listing item type, score, and submission date
  And statuses and listing item types are localized

Scenario: No listings are submitted
  Given there are no submitted listings
  When I open the admin review page
  Then I see a localized empty-state explanation
```

---

## Story 2.4 - Review submitted listing

**As** an admin  
**I want** to publish a reviewed listing or request changes  
**So that** only sufficiently prepared listings appear publicly.

### Acceptance criteria

```gherkin
Feature: Review submitted listing

Scenario: Admin publishes a listing
  Given a listing has status "submitted"
  When I mark the listing as reviewed and publish it
  Then the listing receives status "published"
  And it appears in the public marketplace

Scenario: Admin requests changes
  Given a listing has status "submitted"
  When I request changes with a review note
  Then the listing receives status "changes_requested"
  And the review note is stored
```

---

## Story 2.5 - Keep unpublished listings hidden

**As** a platform operator  
**I want** draft, submitted, and changes-requested listings to remain hidden from public buyers  
**So that** buyers only see listings that have passed the platform review step.

### Acceptance criteria

```gherkin
Feature: Public visibility rules

Scenario: Draft listing is hidden
  Given a listing has status "draft"
  When a buyer opens the marketplace
  Then the listing is not shown

Scenario: Submitted listing is hidden
  Given a listing has status "submitted"
  When a buyer opens the marketplace
  Then the listing is not shown

Scenario: Changes-requested listing is hidden
  Given a listing has status "changes_requested"
  When a buyer opens the marketplace
  Then the listing is not shown
```

---

## Story 2.6 - Seller sees requested changes

**As** a seller  
**I want** to see why my submitted listing needs changes  
**So that** I understand what must be improved before publication.

### Acceptance criteria

```gherkin
Feature: Seller sees requested changes

Scenario: Seller sees change request status
  Given my listing has status "changes_requested"
  When I open my seller listing dashboard
  Then I see that changes are required
  And I see the admin review note or requested-change summary

Scenario: Changes-requested listing is not public
  Given my listing has status "changes_requested"
  When a buyer opens the marketplace
  Then the listing is not shown
```

### Notes

This is Must because the review loop depends on it. Full resubmission UX can remain lightweight or be handled by Story 2.7.

---

## Story 2.7 - Seller resubmits after requested changes

**As** a seller  
**I want** to update and resubmit a listing after changes are requested  
**So that** the admin can review it again.

### Acceptance criteria

```gherkin
Feature: Resubmit listing after requested changes

Scenario: Seller resubmits listing
  Given my listing has status "changes_requested"
  When I update the requested information and resubmit
  Then the listing receives status "submitted"
  And it appears in the admin review list again
```

### Priority

Should. This can be simplified during the prototype if the demo only needs to show the requested-changes state.

---

# Epic 3: Buyer Finds Listings and Builds Trust

## Story 3.1 - Show public marketplace

**As** a buyer  
**I want** to browse published listings  
**So that** I can discover relevant instruments and bows.

### Acceptance criteria

```gherkin
Feature: Public marketplace

Scenario: Buyer sees published listings in English
  Given there are published listings
  When I open /en/marketplace
  Then I see listing cards with title, listing item type, price state, location, and photo
  And I see documentation score or trust status
  And UI labels are English

Scenario: Buyer sees published listings in German
  Given there are published listings
  When I open /de/marketplace
  Then I see listing cards with localized labels
  And I see documentation score or trust status
  And UI labels are German

Scenario: Unpublished listings are hidden
  Given there is a listing in draft status
  When I open the marketplace
  Then that listing is not displayed
```

---

## Story 3.2 - Filter by listing item type and price

**As** a buyer  
**I want** to filter listings by item type and numeric price range  
**So that** I can find relevant published listings faster.

### Acceptance criteria

```gherkin
Feature: Marketplace filters

Scenario: Buyer filters by listing item type
  Given published listings include violins, cellos, and bows
  When I select listing item type "bow"
  Then I only see bow listings

Scenario: Buyer filters by numeric price range
  Given published listings include asking-price listings with different prices
  When I select a numeric price range
  Then I only see asking-price listings within that range

Scenario: Price-on-request listing is excluded from numeric price filter
  Given a published listing has priceMode "price_on_request"
  When I apply a numeric price range filter
  Then the price-on-request listing is not included in the numeric filter results
```

### Priority

Should. The marketplace can be demoed without filters if time is short.

---

## Story 3.3 - Show listing detail page

**As** a buyer  
**I want** to open a detailed page for a listing  
**So that** I can review item details, condition, origin, seller context, and trust signals.

### Acceptance criteria

```gherkin
Feature: Listing detail page

Scenario: Buyer opens a published listing
  Given a listing is published
  When I open the detail page
  Then I see title, listing item type, price state, origin, year label, and condition summary
  And I see photos
  And I see seller information
  And I see the trust panel
  And I see an option to submit an inquiry
```

---

# Epic 4: Buyer Submits a Qualified Inquiry

## Story 4.1 - Submit buyer inquiry

**As** a buyer  
**I want** to submit a qualified inquiry about a listing  
**So that** the seller and platform operator can understand my interest.

### Acceptance criteria

```gherkin
Feature: Buyer inquiry

Scenario: Buyer submits complete inquiry
  Given I am on a published listing detail page
  When I enter name, email, buyer type, intent, budget range, and message
  And I confirm that my inquiry details may be shared with the responsible seller
  And I submit the inquiry
  Then the inquiry is saved
  And I see a localized confirmation
  And the inquiry appears in the seller inquiry view
  And the inquiry appears in a simple admin inquiry view

Scenario: Required fields are missing
  Given I am in the inquiry form
  When I submit without an email address
  Then I see a localized validation error
  And the inquiry is not saved
```

### Notes

Admin visibility can be a simple internal list/detail view. It does not need to be a polished analytics dashboard in week one.

---

## Story 4.2 - Capture buyer primary intent

**As** a seller  
**I want** to know the buyer's primary reason for contacting me  
**So that** I can prioritize and respond appropriately.

### Acceptance criteria

```gherkin
Feature: Buyer primary intent

Scenario: Buyer selects one required primary intent
  Given I submit an inquiry
  When I choose "trial" as my primary intent
  Then the primary intent is stored with the inquiry
  And the intent label is localized in seller and admin inquiry views

Scenario: Buyer submits without an intent
  Given I am in the inquiry form
  When I submit without choosing an intent
  Then I see a localized validation error
  And the inquiry is not saved
```

### Notes

Multi-intent inquiry support is deferred. The one-week prototype stores one required primary intent.

---

## Story 4.3 - Seller sees inquiries

**As** a seller  
**I want** to see inquiries for my listings  
**So that** I can follow up with qualified interested buyers.

### Acceptance criteria

```gherkin
Feature: Seller inquiry view

Scenario: Seller opens inquiry view
  Given there are inquiries for my listings
  When I open my seller inquiry view
  Then I see buyer name, listing title, intent, budget range, message, and status

Scenario: Inquiry is new
  Given an inquiry was just created
  When I open the seller inquiry view
  Then the inquiry has status "new"
```

---

## Story 4.4 - Admin sees all inquiries in a simple internal view

**As** an admin  
**I want** to see all buyer inquiries in a simple internal view  
**So that** the platform can understand lead quality and support the marketplace flow.

### Acceptance criteria

```gherkin
Feature: Admin inquiry view

Scenario: Admin sees all inquiries
  Given buyer inquiries exist across multiple listings
  When I open the admin inquiry view
  Then I see all inquiries
  And I see buyer name, listing title, seller, intent, budget range, message, and status

Scenario: No inquiries exist
  Given no buyer inquiries exist
  When I open the admin inquiry view
  Then I see a localized empty-state explanation
```

### Notes

This is Must because Story 4.1 requires admin visibility. Keep it simple; a table or card list is enough.

---

# Epic 5: Demo and Seed Data

## Story 5.1 - Provide seed data for the full trust flow

**As** a demo presenter  
**I want** realistic seed listings across the listing lifecycle  
**So that** the prototype can demonstrate seller creation, platform review, publication, and buyer inquiry.

### Acceptance criteria

```gherkin
Feature: Seed data

Scenario: Demo data supports the full trust flow
  Given the application is started locally
  When demo data is loaded
  Then there are sample listings for violins, violas, cellos, and bows
  And at least one listing has status "draft"
  And at least one listing has status "submitted"
  And at least one listing has status "changes_requested"
  And several listings have status "published"

Scenario: Public marketplace shows only published seed listings
  Given demo data includes listings in multiple statuses
  When I open the marketplace
  Then I only see listings with status "published"

Scenario: Sample listing has strong documentation
  Given a published seed listing is marked as strongly documented
  When I open its detail page
  Then I see multiple positive trust signals
  And the documentation completeness score is high

Scenario: Seed data supports English and German UI
  Given demo data includes listings in multiple statuses
  When I switch between English and German
  Then the same listings remain available
  And structured labels, statuses, item types, price states, and trust signals are localized
```

### Example seed listings

```text
1. German violin, circa 1890, asking price EUR 18,000, certificate metadata present, status published
2. Modern Viennese master violin, 2021, asking price EUR 24,000, reviewed workshop profile, status published
3. French cello bow, circa 1930, asking price EUR 9,500, provenance partially documented, status submitted
4. Viola from Mittenwald, circa 1920, asking price EUR 14,000, repair-history metadata present, status published
5. High-quality student violin, asking price EUR 3,800, limited documentation, status draft
6. Violin attributed to an Italian maker, circa 1880, price on request, appraisal pending, status changes_requested
7. Modern cello, 2018, asking price EUR 21,000, trial available, status published
8. Baroque bow replica, asking price EUR 2,400, workshop documentation present, status published
```

### Notes

Seed data must support the seller/admin qualification loop first, not only the public buyer marketplace. Public marketplace views must filter out unpublished listings.

---

## Story 5.2 - Provide demo role switcher

**As** a demo presenter  
**I want** to switch quickly between buyer, seller, and admin views  
**So that** I can show the value stream without login friction.

### Acceptance criteria

```gherkin
Feature: Demo role switcher

Scenario: Demo user switches to seller
  Given I am using the prototype
  When I choose the role "Seller"
  Then I see seller functions

Scenario: Demo user switches to admin
  Given I am using the prototype
  When I choose the role "Admin"
  Then I see review functions
```

### Notes

If real auth in the base app is already stable and fast to use, this story can be skipped.

---

# Epic 6: Future Dealer and Workshop Discovery

## Story 6.1 - Capture future dealer/workshop discovery notes

**As** a platform strategist  
**I want** to document the future dealer and workshop discovery value stream  
**So that** the MVP does not accidentally overbuild it while still preserving the larger vision.

### Future value stream

```text
Traveling musician searches by city or current location
-> Platform shows trusted dealers and workshops nearby
-> Musician filters by specialties, languages, and current inventory
-> Musician opens dealer/workshop profile
-> Musician requests appointment or makes an inquiry
```

### Future capabilities

```text
dealer/workshop map pins
geolocation search
search by travel destination
specialties: violins, violas, cellos, bows, restoration, appraisals
languages spoken
appointment availability
nearby listings
verified dealer/workshop badges
```

### MVP boundary

None of these capabilities are part of the one-week prototype. The MVP may show seller city and country only. Do not implement map UI, geolocation search, latitude/longitude fields, map pins, or appointment scheduling.

---

## Recommended implementation order

```text
1. Locale routing and translation mechanism
2. Domain types, price model, and lifecycle-aware seed data
3. Seller create-listing flow
4. Seller submit for review
5. Admin review with publish and request-changes states
6. Seller requested-changes visibility
7. Public marketplace
8. Listing detail page with trust panel
9. Buyer inquiry form
10. Seller and admin inquiry views
11. Filter and UI polish if time allows
12. Demo role switcher if needed
```

## Non-goals for this MVP

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
```

## Demo success criterion

The prototype is successful if viewers understand this within ten minutes:

> This platform is not Facebook Marketplace for violins. It makes high-value string instruments and bows easier to sell and evaluate by structuring listings, qualifying them before publication, presenting localized trust signals, and capturing qualified buyer inquiries.
