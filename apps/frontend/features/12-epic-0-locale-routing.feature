Feature: Epic 0 locale-aware routing
  As an international user
  I want to open the marketplace in English or German
  So that I can use the platform in my preferred language

  @ready @frontend @epic0 @i18n @impl_epic0_story_0_1
  Scenario: User opens the German marketplace route
    Given the platform supports English and German
    When I open the marketplace route "/de/marketplace"
    Then the route renders in locale "de"
    And I see the marketplace with German UI text

  @ready @frontend @epic0 @i18n @impl_epic0_story_0_1
  Scenario: User opens the English marketplace route
    Given the platform supports English and German
    When I open the marketplace route "/en/marketplace"
    Then the route renders in locale "en"
    And I see the marketplace with English UI text

  @ready @frontend @epic0 @i18n @impl_epic0_story_0_1
  Scenario: Unsupported locale is used
    Given I open a marketplace route with an unsupported locale
    When the route is loaded
    Then I am redirected to "/en/marketplace"
