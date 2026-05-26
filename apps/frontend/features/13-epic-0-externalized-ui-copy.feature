Feature: Epic 0 externalized UI copy
  As a developer
  I want visible UI copy to be loaded from locale files
  So that additional languages can be added without rewriting UI components

  @ready @frontend @epic0 @i18n @impl_epic0_story_0_2
  Scenario: UI shows German copy
    Given my locale is German
    When I open the marketplace
    Then I see German navigation, buttons, form labels, and status messages

  @ready @frontend @epic0 @i18n @impl_epic0_story_0_2
  Scenario: UI shows English copy
    Given my locale is English
    When I open the marketplace
    Then I see English navigation, buttons, form labels, and status messages

  @ready @frontend @epic0 @i18n @impl_epic0_story_0_2
  Scenario: New visible text is added
    Given a new MVP component is built
    When it contains visible text
    Then that text is not hard-coded directly in the component
    And entries exist for English and German
