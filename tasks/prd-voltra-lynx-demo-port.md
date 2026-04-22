# PRD: High-Fidelity Port of All Voltra Demo Screens to LynxVoltra

## Introduction

Port every demo screen from the original Voltra example app (`/example/`) to the LynxVoltra app (`voltra-lynx/packages/example-app/`), achieving high fidelity in both:
1. **Voltra payload** — the Dynamic Island / Lock Screen / Widget rendering must be identical
2. **In-app control UI** — the Lynx screen (buttons, lists, toggles) must match the original RN app's look and functionality

We've proven the approach works: `react` is aliased to `@lynx-js/react`, so `<Voltra.VStack>` JSX works in Lynx files. Basic Live Activity and Music Player are done as reference implementations.

## Goals

- Port all 8 iOS Live Activity demos with exact Voltra payload parity
- Port all Testing Ground screens with full interactivity
- Set up Xcode asset catalog for image assets used by demos
- Match the original app's visual design (card styling, color scheme, button variants)
- Every story independently buildable and testable on iOS Simulator

## Reference Implementation

**Existing patterns to follow:**
- `src/voltra-payload.tsx` — Voltra JSX payload helpers (add new functions here)
- `src/demos/ios/BasicLiveActivity.tsx` — reference for NativeModule calls + Lynx UI
- `src/demos/ios/MusicPlayerActivity.tsx` — reference for stateful updates + song list

**Key patterns:**
- Voltra JSX: `import { Voltra, renderLiveActivityToString } from '@use-voltra/ios'`
- NativeModule: `NativeModules.VoltraModule.startLiveActivity(payload, options, callback)`
- Lynx hooks: `import { useState, useCallback } from '@lynx-js/react'`
- Lynx elements: `<view>`, `<text>`, `<scroll-view>` with `bindtap`, `display: 'flex'`

---

## Phase 1: Shared Components & Assets

### US-001: Xcode Asset Catalog Setup

**Description:** As a developer, I need image assets available to the Widget Extension so demos using `Voltra.Image` render correctly.

**Acceptance Criteria:**
- [ ] Copy image assets from original `example/assets/` to LynxVoltra Xcode project
- [ ] Add assets to both main app and VoltraWidgetExtension targets (shared App Group or asset catalog)
- [ ] Assets include: `voltra-icon`, `voltra-light`, and any other assets referenced by demos
- [ ] Verify: Music Player demo shows album art in Dynamic Island instead of blank
- [ ] Build succeeds, install on Simulator

---

### US-002: Shared Lynx UI Components (Button, Card)

**Description:** As a developer, I need reusable Lynx UI components matching the original app's design system.

**Acceptance Criteria:**
- [ ] Create `src/components/Button.tsx` — variants: primary (#8232FF), secondary, ghost; disabled state
- [ ] Create `src/components/Card.tsx` — dark background (#0F172A), rounded borders, Card.Title + Card.Text subcomponents
- [ ] Create `src/components/StatusPill.tsx` — "Active" (green) / "Idle" (gray) pill badges
- [ ] Match original app's color scheme and spacing
- [ ] `tsc --noEmit` passes
- [ ] Rspeedy build succeeds

---

## Phase 2: Remaining Live Activity Demos

### US-003: Flight Tracker Live Activity

**Description:** Port the Flight Tracker demo with all Dynamic Island layouts.

**Reference:** `example/screens/live-activities/FlightLiveActivity.tsx` + `example/components/live-activities/FlightLiveActivityUI.tsx`

**Acceptance Criteria:**
- [ ] Add `makeFlightPayload()` to `voltra-payload.tsx` with all regions:
  - Lock Screen: full flight card (departure EWR → arrival FLL, times, gate, status)
  - Island Expanded: leading (departure), trailing (arrival), bottom (flight details)
  - Island Compact: leading (departure code), trailing (arrival code)
  - Minimal: airplane symbol
- [ ] Voltra components: VStack, HStack, Symbol, Text, Spacer
- [ ] Yellow keyline tint via `island.keylineTint`
- [ ] Demo screen: flight info display, start/update/stop controls, status badge (on-time/delayed)
- [ ] Update cycles through flight states (boarding → in-flight → landing → arrived)
- [ ] Verify on Simulator: all Dynamic Island layouts render correctly

---

### US-004: Workout Tracker Live Activity

**Description:** Port the Workout Tracker with heart rate zones and gradient progress.

**Reference:** `example/screens/live-activities/WorkoutLiveActivity.tsx` + `example/components/live-activities/WorkoutLiveActivityUI.tsx`

**Acceptance Criteria:**
- [ ] Add `makeWorkoutPayload()` to `voltra-payload.tsx`:
  - Lock Screen: heart rate, distance, pace, elapsed Timer component
  - Gradient progress bar with Mask + LinearGradient (5-zone HR coloring)
  - Zone labels: Warm Up / Fat Burn / Cardio / Peak / Red Line
- [ ] Voltra components: VStack, HStack, ZStack, Timer, Symbol, Text, LinearGradient, Mask
- [ ] Demo screen: start/stop workout, simulated HR updates (80-180 BPM), distance incrementing ~5m/sec
- [ ] Timer using `Voltra.Timer` component with `countUp` mode
- [ ] 1-second update interval via `setTimeout` / `setInterval`
- [ ] Verify on Simulator: heart rate + gradient update in real-time on lock screen

---

### US-005: Compass Live Activity

**Description:** Port the Compass demo with rotating heading indicator.

**Reference:** `example/screens/live-activities/CompassLiveActivity.tsx` + `example/components/live-activities/CompassLiveActivityUI.tsx`

**Acceptance Criteria:**
- [ ] Add `makeCompassPayload(heading)` to `voltra-payload.tsx`:
  - Lock Screen: compass arrow (rotated Symbol) + heading degrees + cardinal direction
  - Island Expanded: leading (heading text), trailing (cardinal), bottom (compass)
  - Island Compact: leading (symbol), trailing (heading)
  - Minimal: compass symbol
- [ ] Voltra components: HStack, VStack, Symbol, Text, ZStack
- [ ] Rotated arrow via CSS transform on Symbol
- [ ] Demo screen: simulated heading cycling 0-359° (no magnetometer in Lynx)
- [ ] Cardinal direction computed from heading (N/NE/E/SE/S/SW/W/NW)
- [ ] 1-second update interval
- [ ] Verify on Simulator: heading rotates, arrow spins

---

### US-006: Deep Links Live Activity

**Description:** Port the Deep Links demo with Link components.

**Reference:** `example/screens/live-activities/DeepLinksLiveActivity.tsx` + `example/components/live-activities/DeepLinksLiveActivityUI.tsx`

**Acceptance Criteria:**
- [ ] Add `makeDeepLinksPayload()` to `voltra-payload.tsx`:
  - Lock Screen: HStack with Link components, each with deepLinkUrl
  - Links: `myapp://orders/123`, `/settings`
  - Blue keyline tint
- [ ] Voltra components: HStack, VStack, Link, Symbol, Text, Spacer
- [ ] `Link` component with `deepLinkUrl` prop
- [ ] Demo screen: shows configured deep link URLs, start/stop controls
- [ ] `deepLinkUrl` option passed to `startLiveActivity` options
- [ ] Verify on Simulator: activity renders with link indicators

---

### US-007: Liquid Glass Live Activity

**Description:** Port the Liquid Glass demo (iOS 26+ glass morphism).

**Reference:** `example/screens/live-activities/LiquidGlassLiveActivity.tsx` + `example/components/live-activities/LiquidGlassLiveActivityUI.tsx`

**Acceptance Criteria:**
- [ ] Add `makeLiquidGlassPayload()` to `voltra-payload.tsx`:
  - Island Expanded center: GlassContainer with glass effect
  - Lock Screen with `activityBackgroundTint: 'clear'`
- [ ] Voltra components: VStack, HStack, GlassContainer, Symbol, Text
- [ ] `glassEffect` style property on GlassContainer
- [ ] Demo screen: start/stop, glass effect description
- [ ] Verify on Simulator: Dynamic Island shows glass morphism effect (if iOS 26 Simulator)

---

### US-008: Supplemental Families Live Activity

**Description:** Port the Supplemental Families demo (watchOS/CarPlay).

**Reference:** `example/screens/live-activities/SupplementalFamiliesLiveActivity.tsx` + `example/components/live-activities/SupplementalFamiliesUI.tsx`

**Acceptance Criteria:**
- [ ] Add `makeSupplementalPayload()` to `voltra-payload.tsx`:
  - Lock Screen: VStack with icon + text
  - `supplementalActivityFamilies.small`: simplified layout
  - Island Compact leading/trailing, Minimal
- [ ] Voltra components: VStack, Text, Symbol
- [ ] Demo screen: explains supplemental families concept, start/stop
- [ ] Verify on Simulator: renders correctly

---

## Phase 3: Testing Ground Screens

### US-009: Components Catalog Screen

**Description:** Port the component showcase with live previews.

**Reference:** `example/screens/testing-grounds/components/ComponentsScreen.tsx`

**Acceptance Criteria:**
- [ ] Port all 19 component examples: Button, Text, VStack, HStack, ZStack, Spacer, Divider, Image, Label, Toggle, LinearProgressView, CircularProgressView, Gauge, Timer, Symbol, GroupBox, LinearGradient, GlassContainer, Mask
- [ ] Each component shows a Voltra JSX preview card (dark background) with the rendered payload
- [ ] Scrollable list with component names
- [ ] `tsc --noEmit` passes

---

### US-010: Styling Examples Screen

**Description:** Port the styling showcase with all CSS property demos.

**Reference:** `example/screens/testing-grounds/styling/StylingScreen.tsx`

**Acceptance Criteria:**
- [ ] Port all 11 styling examples: padding (uniform + individual), margins, text colors, background colors, borders (radius/width/color), shadows, typography (fontSize/fontWeight/letterSpacing), opacity
- [ ] Each example shows styled Voltra component in preview card
- [ ] Match original layout and labels

---

### US-011: Flex Layout Playground

**Description:** Port the interactive flex playground with live controls.

**Reference:** `example/screens/testing-grounds/flex-playground/FlexPlaygroundScreen.tsx`

**Acceptance Criteria:**
- [ ] Interactive controls for: flexDirection (column/row), alignItems, justifyContent, gap, containerPadding
- [ ] Live preview with 3 colored boxes responding to flex changes
- [ ] Cycling button controls (tap to switch between options)
- [ ] Uses Voltra.View component with flex properties
- [ ] Real-time preview updates on control change

---

### US-012: Timer Testing Screen

**Description:** Port timer testing with countdown/stopwatch modes.

**Reference:** `example/screens/testing-grounds/timer/TimerTestingScreen.tsx`

**Acceptance Criteria:**
- [ ] Timer modes: countdown, stopwatch (countUp)
- [ ] Direction toggle: up/down
- [ ] Text style: timer/relative
- [ ] Show hours toggle
- [ ] Custom duration input
- [ ] Live preview using Voltra.Timer component

---

### US-013: Progress Indicators Screen

**Description:** Port progress testing with linear/circular variants.

**Reference:** `example/screens/testing-grounds/progress/ProgressTestingScreen.tsx`

**Acceptance Criteria:**
- [ ] LinearProgressView and CircularProgressView
- [ ] Modes: determinate (percentage), timer (countdown), indeterminate
- [ ] Color customization: trackColor, progressColor
- [ ] Interactive slider for progress value
- [ ] Countdown toggle for timer mode

---

### US-014: Chart Playground Screen

**Description:** Port the chart playground with multiple chart types.

**Reference:** `example/screens/testing-grounds/chart-playground/ChartPlaygroundScreen.tsx`

**Acceptance Criteria:**
- [ ] Chart types: BarMark, LineMark, AreaMark, PointMark, RuleMark, SectorMark
- [ ] Randomizable data with animated transitions
- [ ] Axis visibility controls
- [ ] Multi-series bar charts
- [ ] Month-based x-axis data

---

### US-015: Gradient Playground Screen

**Description:** Port gradient playground with direction/angle controls.

**Reference:** `example/screens/testing-grounds/gradient-playground/GradientPlaygroundScreen.tsx`

**Acceptance Criteria:**
- [ ] Gradient types: linear direction presets (to right/bottom/etc.), angle control (0-180°)
- [ ] Color presets: Sunset, Ocean, Purple, Tri-color
- [ ] Border radius adjustment
- [ ] Live preview of CSS gradient string

---

### US-016: Positioning Examples Screen

**Description:** Port positioning demos (static/relative/absolute).

**Reference:** `example/screens/testing-grounds/positioning/PositioningScreen.tsx`

**Acceptance Criteria:**
- [ ] 7 positioning examples: static, relative offset, absolute center-based
- [ ] Corner positioning, z-index layering, badge overlays
- [ ] Red dot markers for absolute coordinate reference
- [ ] Clear labels for each mode

---

### US-017: Image Preloading Screen

**Description:** Port image preloading test with live download status.

**Reference:** `example/screens/testing-grounds/ImagePreloadingScreen.tsx`

**Acceptance Criteria:**
- [ ] Calls `NativeModules.VoltraModule.preloadImages` with random picsum.photos URLs
- [ ] Shows download status (succeeded/failed per image)
- [ ] Clear preloaded images button
- [ ] Workflow: start activity → preload → reload to display

---

### US-018: Image Fallback Screen

**Description:** Port image fallback examples.

**Reference:** `example/screens/testing-grounds/ImageFallbackScreen.tsx`

**Acceptance Criteria:**
- [ ] 6 fallback scenarios: background color, multiple colors, transparent, combined, custom fallback component, mixed
- [ ] Style-based backgroundColor fallback
- [ ] Custom fallback with Symbol component

---

### US-019: Widget Scheduling Screen

**Description:** Port widget timeline scheduling demo.

**Reference:** `example/screens/testing-grounds/WidgetSchedulingScreen.tsx`

**Acceptance Criteria:**
- [ ] Calls `NativeModules.VoltraModule.scheduleWidget` with future dates
- [ ] 3 scheduled entries with different backgrounds and text
- [ ] Configurable timing (minutes from now)

---

### US-020: Weather Widget Testing Screen

**Description:** Port weather widget demo with multiple families.

**Reference:** `example/screens/testing-grounds/weather/WeatherTestingScreen.tsx`

**Acceptance Criteria:**
- [ ] Widget families: systemSmall, systemMedium, systemLarge
- [ ] Weather conditions: Sunny/Cloudy/Rainy with appropriate icons
- [ ] Gradient backgrounds per condition
- [ ] Calls `NativeModules.VoltraModule.updateWidget`
- [ ] Random weather generation

---

## Phase 4: Navigation & Polish

### US-021: Live Activities Hub Screen

**Description:** Match the original Live Activities hub with active/idle status per demo.

**Acceptance Criteria:**
- [ ] List of all 8 Live Activity demos with status pills (Active/Idle)
- [ ] Tap to navigate into demo
- [ ] "End All Activities" button
- [ ] Match original card-based layout with dark theme

---

### US-022: Testing Grounds Hub Screen

**Description:** Match the original Testing Grounds hub navigation.

**Acceptance Criteria:**
- [ ] List of all testing ground screens with descriptions
- [ ] Grouped by category (Components, Layout, Charts, etc.)
- [ ] Match original layout

---

### US-023: Visual Polish Pass

**Description:** Final pass to match the original app's visual identity.

**Acceptance Criteria:**
- [ ] Color scheme: purple primary (#8232FF), dark cards (#0F172A), gray text (#94A3B8)
- [ ] Typography: consistent font sizes and weights across all screens
- [ ] Spacing: consistent padding/margins matching original
- [ ] Tab bar styling matches original
- [ ] Back navigation styling consistent

---

## Functional Requirements

- FR-1: All Voltra payloads generated via `renderLiveActivityToString()` using `<Voltra.*>` JSX
- FR-2: All NativeModule calls use `NativeModules.VoltraModule.*` with callback pattern
- FR-3: Payload helpers centralized in `voltra-payload.tsx`
- FR-4: Demo screens in `src/demos/ios/` (Live Activities) and `src/demos/testing/` (Testing Grounds)
- FR-5: Every demo must `tsc --noEmit` pass and `rspeedy build` succeed
- FR-6: Every demo must be navigable from the main tab screen
- FR-7: Image assets must be available to both main app and Widget Extension

## Non-Goals

- Android host app or Android widget demos (iOS only for this PRD)
- Push notification integration (APNs channel updates)
- Server-driven widget content (requires backend)
- Custom font loading in Lynx (SF Symbols only for now)
- VoltraView / VoltraWidgetPreview custom elements (stretch goals)

## Technical Considerations

- `react` alias to `@lynx-js/react` enables Voltra JSX in Lynx files
- `Voltra.Timer` component requires correct `Date` handling for countdown
- `Voltra.Image` with `assetName` requires assets in Widget Extension's asset catalog
- Heart rate zone gradient uses `Voltra.Mask` + `Voltra.LinearGradient` — test on Simulator
- Chart components (`BarMark`, `LineMark`, etc.) compile to SwiftUI Charts — requires iOS 16+
- Liquid Glass (`GlassContainer`) requires iOS 26+ for full effect

## Success Metrics

- All 8 Live Activity demos show correct content in Dynamic Island on Simulator
- All Testing Ground screens render with interactive controls
- Side-by-side comparison with original Voltra app shows visual parity
- Zero `tsc` errors, zero runtime crashes

## Open Questions

- Should we add a side-by-side comparison mode to verify visual parity?
- How to handle Magnetometer sensor for Compass (use simulated data vs. Lynx sensor API)?
- Do we need VoltraWidgetPreview inline rendering for Testing Grounds, or just NativeModule calls?
