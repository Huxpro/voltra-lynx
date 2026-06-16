# PRD: Convert Lynx Testing Ground Screens to Live VoltraPreview

## Introduction

The Lynx Voltra demo app now has a working `<voltra-preview>` Custom Element (US-050) that renders Voltra SwiftUI content inline. The StylingScreen has been converted as proof-of-concept. This PRD covers converting the remaining 9 testing ground screens from JSON text output to live SwiftUI previews, and adding a `VoltraWidgetPreview` component for widget-family-sized previews.

The goal is exact content parity with the RN Expo example app — same Voltra JSX trees, same titles/descriptions, same preview dimensions — while using Lynx-appropriate controls where `<input>` is available.

## Goals

- Replace JSON text output with live `<VoltraPreview>` / `<VoltraWidgetPreview>` in all 9 remaining testing ground screens
- Match the RN Expo app's Voltra JSX content exactly (component trees, props, styles, text)
- Port interactive controls using Lynx `<input>` element where applicable
- Remove debug logging from VoltraPreviewHostView.swift
- Each screen is a separate commit for clean review

## User Stories

### US-051: Add VoltraWidgetPreview Component

**Description:** As a developer, I want a `VoltraWidgetPreview` component that renders Voltra content at exact widget family dimensions so that widget previews match real home screen sizes.

**Acceptance Criteria:**
- [ ] `VoltraWidgetPreview.tsx` component wraps `VoltraPreview` with preset widget family dimensions
- [ ] Supports all families: systemSmall (170×170), systemMedium (364×170), systemLarge (364×382), systemExtraLarge (364×768), accessoryCircular (76×76), accessoryRectangular (172×76), accessoryInline (172×40)
- [ ] Accepts `family` prop (required) and `children` (Voltra JSX)
- [ ] Exported from `components/index.ts`
- [ ] Typecheck passes

### US-052: Convert Components Catalog Screen

**Description:** As a user, I want to see live SwiftUI previews of all 18 Voltra components so I can visually verify each component renders correctly.

**Acceptance Criteria:**
- [ ] All 18 component examples render via `<VoltraPreview>` instead of JSON text
- [ ] Voltra JSX matches RN version exactly (Button, Text, VStack, HStack, ZStack, Spacer, Divider, Image, Label, Toggle, Progress, Gauge, Timer, Symbol, GroupBox, LinearGradient, Glass, Mask)
- [ ] Titles and descriptions match RN version
- [ ] Preview heights match RN version (80–200pt per component)
- [ ] Optional: Show JSON toggle retained
- [ ] Typecheck passes

### US-053: Convert Positioning Screen

**Description:** As a user, I want to see live SwiftUI previews of all 7 positioning examples so I can visually verify static, relative, and absolute positioning.

**Acceptance Criteria:**
- [ ] All 7 positioning examples render via `<VoltraPreview>` instead of launching Live Activities
- [ ] Voltra JSX matches RN PositioningExamples.tsx exactly (Static, RelativeBasic, RelativeNegative, AbsoluteBasic, AbsoluteCorners, ZIndex, BadgeOverlay)
- [ ] Preview heights match RN version (120–200pt)
- [ ] Titles and descriptions match RN version
- [ ] Typecheck passes

### US-054: Convert Chart Playground Screen

**Description:** As a user, I want to see live SwiftUI chart previews so I can visually verify all chart mark types render correctly.

**Acceptance Criteria:**
- [ ] All 10+ chart examples render via `<VoltraPreview>` at 220pt height
- [ ] Chart types match RN version: BarMark, BarMark multi-series, LineMark, AreaMark, PointMark, RuleMark, SectorMark (pie), SectorMark (donut), Combo (bar+line), Hidden Axes
- [ ] "Randomize All" and per-chart "Randomize" buttons work
- [ ] Randomized data updates the live preview
- [ ] Typecheck passes

### US-055: Convert Flex Playground Screen

**Description:** As a user, I want to see a live SwiftUI preview of the flex layout so I can experiment with flexbox properties and see results in real-time.

**Acceptance Criteria:**
- [ ] Main flex preview renders via `<VoltraPreview>` at 300pt height
- [ ] Text align preview renders via `<VoltraPreview>` at 200pt height
- [ ] Voltra JSX matches RN version (3 colored items in a Voltra.View container)
- [ ] Interactive controls: flexDirection, alignItems, justifyContent cycle buttons; gap/padding steppers
- [ ] Changing controls updates the live preview
- [ ] Typecheck passes

### US-056: Convert Gradient Playground Screen

**Description:** As a user, I want to see live SwiftUI gradient previews so I can experiment with gradient types, angles, and colors.

**Acceptance Criteria:**
- [ ] Main gradient preview renders via `<VoltraPreview>` at 220pt height
- [ ] 3 additional fixed examples render via `<VoltraPreview>` at 80pt height each (color stops, RGBA, solid color)
- [ ] Voltra JSX matches RN version
- [ ] Interactive controls: type cycle, angle/direction, color presets, borderRadius stepper
- [ ] Changing controls updates the live preview
- [ ] Typecheck passes

### US-057: Convert Timer Screen

**Description:** As a user, I want to see a live SwiftUI timer preview so I can verify timer component behavior with different configurations.

**Acceptance Criteria:**
- [ ] Timer preview renders via `<VoltraWidgetPreview family="systemMedium">`
- [ ] Voltra JSX matches RN version (Voltra.Timer component with VStack wrapper)
- [ ] Interactive controls: mode (Timer/Stopwatch), direction (Down/Up), duration input via `<input>`, style (Timer/Relative), showHours toggle
- [ ] Duration uses Lynx `<input type="number">` instead of stepper
- [ ] Changing controls updates the live preview
- [ ] Typecheck passes

### US-058: Convert Progress Indicators Screen

**Description:** As a user, I want to see a live SwiftUI progress indicator preview so I can verify linear and circular progress components.

**Acceptance Criteria:**
- [ ] Progress preview renders via `<VoltraWidgetPreview family="systemMedium">`
- [ ] Voltra JSX matches RN version (LinearProgressView/CircularProgressView with labels)
- [ ] Interactive controls: type (Linear/Circular), mode (Determinate/Timer/Indeterminate), progress stepper, duration input via `<input>`, color inputs via `<input>`, height/cornerRadius/lineWidth selectors
- [ ] Color inputs use Lynx `<input>` for hex values
- [ ] Duration input uses Lynx `<input type="number">`
- [ ] Typecheck passes

### US-059: Convert Weather Widget Screen

**Description:** As a user, I want to see a live SwiftUI weather widget preview so I can test different weather conditions and widget families.

**Acceptance Criteria:**
- [ ] Weather widget preview renders via `<VoltraWidgetPreview>` with dynamic family selection
- [ ] Voltra JSX matches RN version (WeatherWidget component from IosWeatherWidget.tsx)
- [ ] Widget family selector with all 7 families
- [ ] Weather condition buttons (Sunny, Cloudy, Rainy)
- [ ] Quick actions: Random Weather, Custom Weather
- [ ] Schedule Timeline button calls `scheduleWidget()` via NativeModules
- [ ] `updateWidget()` and `reloadWidgets()` calls match RN version
- [ ] Auto-initialization on mount via useEffect (matching RN)
- [ ] Typecheck passes

### US-060: Convert Widget Scheduling Screen

**Description:** As a user, I want to see live SwiftUI previews of all 3 scheduled widget states so I can verify the timeline scheduling flow.

**Acceptance Criteria:**
- [ ] 3 widget state previews render via `<VoltraWidgetPreview family="systemMedium">`
- [ ] Voltra JSX matches RN version (3 states with distinct background colors and labels)
- [ ] State timing inputs use Lynx `<input type="number">` for minutes
- [ ] Schedule Timeline and Clear buttons call `scheduleWidget()` / `reloadWidgets()` via NativeModules
- [ ] Scheduled times display card matches RN version
- [ ] Typecheck passes

### US-061: Clean Up Debug Logging

**Description:** As a developer, I want debug logging removed from VoltraPreviewHostView.swift so the console isn't noisy in production.

**Acceptance Criteria:**
- [ ] All `NSLog("[VoltraPreview]...")` calls removed from VoltraPreviewHostView.swift
- [ ] Debug red background (`systemRed.withAlphaComponent(0.3)`) changed back to `.clear`
- [ ] Xcode build succeeds

## Functional Requirements

- FR-1: `VoltraWidgetPreview` component maps widget family names to exact pixel dimensions
- FR-2: All testing screens use `<VoltraPreview>` or `<VoltraWidgetPreview>` for Voltra JSX rendering — no JSON text output as primary display
- FR-3: Each screen's Voltra JSX trees must be identical to the RN Expo version (same components, props, styles, text content)
- FR-4: Preview heights must match the RN Expo `VoltraView` height values
- FR-5: Interactive controls (toggles, cycle buttons, steppers) update the live preview reactively
- FR-6: TextInput fields from RN are ported using Lynx `<input>` element where supported
- FR-7: Native API calls (`updateWidget`, `scheduleWidget`, `reloadWidgets`) use `NativeModules.VoltraModule` with callback pattern
- FR-8: Optional "Show JSON" toggle available on each example for debugging

## Non-Goals

- Not converting Android-specific screens (AndroidPreviewScreen, AndroidChartScreen, etc.)
- Not implementing Channel-Based Updates screen (iOS-only, requires additional native API work)
- Not implementing Active Widgets Card or Notifications Card (RN-specific UI features)
- Not porting the `VoltraView` `onInteraction` callback (interaction events are a stretch goal)
- Not implementing `textTemplates` JSON editor for Timer (Lynx lacks multiline text input)

## Technical Considerations

- `<voltra-preview>` Custom Element requires explicit height since it has no intrinsic content size — Lynx layout engine gives it 0 height otherwise
- `VoltraWidgetPreview` sets both width AND height, solving the sizing problem completely
- Lynx `<input>` element supports `type="number"` for numeric inputs (duration, minutes)
- Lynx `<input>` element supports `type="text"` for string inputs (hex colors)
- Voltra style props use numbers for `borderRadius` (not `'12px'` strings) — the Voltra renderer handles them, not Lynx CSS
- The `as any` cast is needed on Voltra style objects since they're React-typed, not Lynx-typed

## Success Metrics

- All 10 testing ground screens (including StylingScreen already done) render live SwiftUI previews
- Voltra JSX content is 1:1 with the RN Expo app for all examples
- TypeScript compilation passes (`tsc --noEmit` exit 0)
- Xcode build succeeds after debug cleanup

## Open Questions

- Should `VoltraWidgetPreview` be moved into the `@use-voltra/lynx` package (alongside VoltraPreview) or stay in the example app?
- Should we add intrinsic content size support to the Custom Element (via `sizeThatFits:`) to avoid needing explicit heights?
