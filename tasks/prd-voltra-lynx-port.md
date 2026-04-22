# PRD: Voltra Lynx Port

## Introduction

Port the Voltra library from React Native/Expo to LynxJS, enabling Lynx applications to build iOS Live Activities, Dynamic Island layouts, Widgets, and Android Widgets/Ongoing Notifications using the same JSX-based API. The port maximizes code reuse via an adapter pattern — only the thin bridge layer (JS↔Native communication) is rewritten; the rendering pipeline and business logic remain identical.

## Goals

- Enable LynxJS apps to use Voltra's full feature set (Live Activities, Widgets, Notifications)
- Maximize code reuse: Layer 0 (core/ios/android/server) shared as npm dependencies with zero modifications
- Create a minimal bridge adapter (~200 LOC) that translates Expo patterns to Lynx NativeModule patterns
- Reproduce the complete example app as a Lynx demo, verifying feature parity
- Each story is independently verifiable with clear pass/fail criteria

## Architecture Reference

See [LYNX_PORT.md](../LYNX_PORT.md) for:
- Layer model (0-4)
- Bridge translation rules
- Verification checklist
- File structure

---

## Phase 1: Project Foundation

### US-001: Monorepo Scaffolding

**Description:** As a developer, I need the project structure set up so I can start building packages.

**Acceptance Criteria:**
- [ ] Create `voltra-lynx/` directory (or use a subdirectory/branch in this repo)
- [ ] `package.json` with workspace config pointing to `packages/*`
- [ ] `tsconfig.json` base config with strict mode, ESM
- [ ] `packages/` directory exists with placeholder READMEs
- [ ] `pnpm install` runs without errors
- [ ] TypeScript `tsc --noEmit` passes on empty project

---

### US-002: Verify Layer 0 Packages Import in Lynx Context

**Description:** As a developer, I need to confirm that `@use-voltra/core`, `@use-voltra/ios`, and `@use-voltra/android` can be imported and used in a Lynx/Rspeedy build context without errors.

**Acceptance Criteria:**
- [ ] Add `@use-voltra/core`, `@use-voltra/ios`, `@use-voltra/android` as dependencies
- [ ] Create a test file that imports `renderVoltraVariantToJson` from `@use-voltra/ios`
- [ ] Create a test file that imports `renderAndroidWidgetToJson` from `@use-voltra/android`
- [ ] TypeScript compilation passes with these imports
- [ ] Rspeedy build (`pnpm build`) succeeds producing a bundle
- [ ] No `react-native` or `expo` imports leak into the bundle

---

### US-003: Rspeedy Example App Shell

**Description:** As a developer, I need a minimal Lynx app that boots and renders a screen so I can test integration.

**Acceptance Criteria:**
- [ ] `packages/example-app/` with `rspeedy.config.ts`
- [ ] `src/App.tsx` renders a `<view><text>Voltra Lynx Demo</text></view>`
- [ ] `pnpm dev` starts dev server and produces a scannable QR code
- [ ] App renders in LynxExample simulator/device without crash
- [ ] Navigation structure: tabs for "iOS Activities", "Android Widgets", "Testing"

---

## Phase 2: Bridge Adapter Package

### US-004: Bridge Type Definitions

**Description:** As a developer, I need TypeScript interfaces for the Voltra NativeModule so the adapter and native code have a shared contract.

**Acceptance Criteria:**
- [ ] Create `packages/lynx-bridge/src/types.ts`
- [ ] Define `VoltraIOSModuleSpec` interface matching all methods from original `ios-client/src/VoltraModule.ts`
- [ ] Define `VoltraAndroidModuleSpec` interface matching all methods from original `android-client/src/VoltraModule.ts`
- [ ] Define `EventSubscription` type: `{ remove: () => void }`
- [ ] Define `VoltraEventMap` type (all event names and payloads)
- [ ] `tsc --noEmit` passes

---

### US-005: Module Adapter (Promise Wrapper)

**Description:** As a developer, I need a function that wraps Lynx's callback-based NativeModule into a Promise-based interface matching what the business logic expects.

**Acceptance Criteria:**
- [ ] Create `packages/lynx-bridge/src/module-adapter.ts`
- [ ] `createIOSModuleAdapter()` returns object conforming to `VoltraIOSModuleSpec`
- [ ] Each async method wraps `NativeModules.VoltraModule.method(args, callback)` → `Promise<T>`
- [ ] Each sync method delegates directly: `raw.isLiveActivityActive(name)` → `boolean`
- [ ] `createAndroidModuleAdapter()` returns object conforming to `VoltraAndroidModuleSpec`
- [ ] Unit test: mock `NativeModules.VoltraModule`, verify adapter calls with correct args and resolves Promise on callback
- [ ] `tsc --noEmit` passes

---

### US-006: Event Adapter (GlobalEventEmitter)

**Description:** As a developer, I need an event subscription adapter so business logic can use `addListener(event, cb)` without knowing about Lynx's GlobalEventEmitter.

**Acceptance Criteria:**
- [ ] Create `packages/lynx-bridge/src/event-adapter.ts`
- [ ] `createEventAdapter()` returns `{ addListener(event, cb): EventSubscription }`
- [ ] Maps event name: `"stateChange"` → `GlobalEventEmitter.addListener("voltra:stateChange", cb)`
- [ ] Returns `{ remove: () => void }` that calls `subscription.remove()`
- [ ] Unit test: mock GlobalEventEmitter, verify subscription lifecycle
- [ ] `tsc --noEmit` passes

---

### US-007: Platform Detection Utility

**Description:** As a developer, I need a platform detection utility replacing `Platform.OS` from react-native.

**Acceptance Criteria:**
- [ ] Create `packages/lynx-bridge/src/platform.ts`
- [ ] Export `getPlatform(): 'ios' | 'android'` using build-time define or `lynx.__globalProps`
- [ ] Export `isIOS(): boolean` and `isAndroid(): boolean` helpers
- [ ] Export `assertRunningOnIOS(): boolean` matching original behavior (logs error + returns false if wrong platform)
- [ ] `tsc --noEmit` passes

---

### US-008: Bridge Package Index & Build

**Description:** As a developer, I need the bridge package properly exported and buildable.

**Acceptance Criteria:**
- [ ] `packages/lynx-bridge/package.json` with name `@voltra-lynx/bridge`
- [ ] `src/index.ts` exports: `createIOSModuleAdapter`, `createAndroidModuleAdapter`, `createEventAdapter`, platform utils, all types
- [ ] Package builds to ESM output
- [ ] `tsc --noEmit` passes
- [ ] Can be imported from sibling packages

---

## Phase 3: iOS Client Package (Vendored Business Logic)

### US-009: Lynx iOS Client — VoltraModule + Events

**Description:** As a developer, I need the Lynx-specific VoltraModule and events files that replace the Expo originals.

**Acceptance Criteria:**
- [ ] Create `packages/lynx-ios-client/src/VoltraModule.ts` — imports `createIOSModuleAdapter` from `@voltra-lynx/bridge`, exports the adapter instance
- [ ] Create `packages/lynx-ios-client/src/events.ts` — uses event adapter, exports `addVoltraListener` with same signature as original
- [ ] Create `packages/lynx-ios-client/src/utils/assertRunningOnApple.ts` — uses bridge platform utils
- [ ] Interfaces are type-compatible with original `ios-client` exports
- [ ] `tsc --noEmit` passes

---

### US-010: Lynx iOS Client — Vendor Business Logic

**Description:** As a developer, I need the business logic files from `ios-client` copied into the Lynx package with only import path adjustments.

**Acceptance Criteria:**
- [ ] Copy `live-activity/api.ts` from `ios-client/src/` → adjust imports to local `VoltraModule` and `events`
- [ ] Copy `widgets/widget-api.ts` → adjust imports
- [ ] Copy `widgets/server-credentials.ts` → adjust imports
- [ ] Copy `preload.ts` → adjust imports
- [ ] Copy `helpers.ts` → adjust imports
- [ ] **Verify:** diff each file against original — ONLY import paths should differ, zero logic changes
- [ ] Create `src/index.ts` re-exporting all public APIs
- [ ] `tsc --noEmit` passes
- [ ] Package exports match original `@use-voltra/ios-client` public API surface

---

### US-011: Lynx Android Client — VoltraModule + Events + Business Logic

**Description:** Same as US-009/010 but for Android.

**Acceptance Criteria:**
- [ ] Create `packages/lynx-android-client/src/VoltraModule.ts` using `createAndroidModuleAdapter`
- [ ] Create `packages/lynx-android-client/src/events.ts` using event adapter
- [ ] Vendor business logic files from `android-client/src/`:
  - `live-update/api.ts`
  - `ongoing-notification/api.ts`
  - `widgets/api.ts`
  - `widgets/server-credentials.ts`
  - `preload.ts`
- [ ] Only import paths differ from original — zero logic changes
- [ ] `tsc --noEmit` passes
- [ ] Package exports match original `@use-voltra/android-client` public API surface

---

## Phase 4: Native Module Implementation (iOS)

### US-012: iOS NativeModule Skeleton

**Description:** As a developer, I need the iOS native module registered with Lynx runtime, with method stubs that log calls.

**Acceptance Criteria:**
- [ ] Create `packages/lynx-native-ios/VoltraLynxModule.swift`
- [ ] Class conforms to `LynxModule` protocol
- [ ] `static var name` returns `"VoltraModule"`
- [ ] `static var methodLookup` maps all method names to selectors
- [ ] All methods exist as stubs (log args, call callback with placeholder)
- [ ] Module registers in Lynx initialization code
- [ ] App compiles and doesn't crash when module is called from JS
- [ ] Console shows log output when `startLiveActivity` is called from JS

---

### US-013: iOS NativeModule — Live Activity Methods

**Description:** As a developer, I need the Live Activity native methods implemented by reusing existing Voltra Swift code.

**Acceptance Criteria:**
- [ ] `startLiveActivity(jsonString, optionsJson, callback)` — parses JSON, creates ActivityKit activity, calls callback with activity ID
- [ ] `updateLiveActivity(activityId, jsonString, optionsJson, callback)` — updates existing activity
- [ ] `endLiveActivity(activityId, optionsJson, callback)` — ends activity with dismissal policy
- [ ] `endAllLiveActivities(callback)` — ends all Voltra activities
- [ ] `isLiveActivityActive(activityName)` → returns boolean synchronously (or via callback)
- [ ] Reuses existing `VoltraPayloadParser` and SwiftUI rendering from original Voltra
- [ ] **Verify:** Start a live activity from Lynx JS, see it appear on iOS lock screen

---

### US-014: iOS NativeModule — Widget Methods

**Description:** As a developer, I need widget management methods working.

**Acceptance Criteria:**
- [ ] `updateWidget(widgetId, jsonString, optionsJson, callback)` — updates widget timeline
- [ ] `scheduleWidget(widgetId, timelineJson, callback)` — schedules future updates
- [ ] `reloadWidgets(widgetIdsJson, callback)` — reloads specified widgets
- [ ] `clearWidget(widgetId, callback)` — clears widget content
- [ ] `clearAllWidgets(callback)`
- [ ] `getActiveWidgets(callback)` — returns JSON array of active widget info
- [ ] Reuses existing WidgetCenter integration from original Voltra
- [ ] **Verify:** Call `updateWidget` from Lynx JS, see widget update on home screen

---

### US-015: iOS NativeModule — Events

**Description:** As a developer, I need native events flowing from iOS to Lynx JS.

**Acceptance Criteria:**
- [ ] Activity token events: when push token is received, call `lynxContext.sendGlobalEvent("voltra:activityTokenReceived", data)`
- [ ] State change events: when activity state changes, send `"voltra:stateChange"` event
- [ ] Interaction events: when user taps widget/activity button, send `"voltra:interaction"` event
- [ ] **Verify:** Start live activity → observe token event in JS console
- [ ] **Verify:** End live activity → observe stateChange event with "ended" state

---

### US-016: iOS NativeModule — Image Preloading & Utilities

**Description:** As a developer, I need image preloading and utility methods.

**Acceptance Criteria:**
- [ ] `preloadImages(imagesJson, callback)` — downloads images to App Group, returns success/failure per image
- [ ] `clearPreloadedImages(keysJson, callback)` — removes cached images
- [ ] `reloadLiveActivities(activityNamesJson, callback)` — force reloads
- [ ] `setWidgetServerCredentials(credentialsJson, callback)` — stores auth credentials
- [ ] `clearWidgetServerCredentials(callback)`
- [ ] `isHeadless()` — returns boolean
- [ ] **Verify:** Preload an image URL, then use it in a widget — image renders

---

## Phase 5: Native Module Implementation (Android)

### US-017: Android NativeModule Skeleton

**Description:** Same as US-012 but for Android.

**Acceptance Criteria:**
- [ ] Create `packages/lynx-native-android/VoltraLynxModule.kt`
- [ ] Class extends `LynxModule`
- [ ] All methods annotated with `@LynxMethod`
- [ ] Module registered via `LynxEnv.inst().registerModule("VoltraModule", ...)`
- [ ] App compiles, module callable from Lynx JS
- [ ] Console logs show method invocations

---

### US-018: Android NativeModule — Widget Methods

**Description:** As a developer, I need Android widget methods working.

**Acceptance Criteria:**
- [ ] `updateAndroidWidget(widgetId, jsonString, optionsJson, callback)` — updates Glance widget
- [ ] `reloadAndroidWidgets(widgetIdsJson, callback)`
- [ ] `clearAndroidWidget(widgetId, callback)`
- [ ] `clearAllAndroidWidgets(callback)`
- [ ] `requestPinGlanceAppWidget(widgetId, optionsJson, callback)` — triggers pin dialog
- [ ] Reuses existing Glance rendering from original Voltra
- [ ] **Verify:** Call `updateAndroidWidget` from Lynx JS, see widget update

---

### US-019: Android NativeModule — Live Update & Ongoing Notification Methods

**Description:** As a developer, I need Android Live Update and Ongoing Notification methods.

**Acceptance Criteria:**
- [ ] Live Update: `startAndroidLiveUpdate`, `updateAndroidLiveUpdate`, `stopAndroidLiveUpdate`, `isAndroidLiveUpdateActive`, `endAllAndroidLiveUpdates`
- [ ] Ongoing Notification: `startAndroidOngoingNotification`, `upsertAndroidOngoingNotification`, `updateAndroidOngoingNotification`, `stopAndroidOngoingNotification`
- [ ] Status queries: `isAndroidOngoingNotificationActive`, `getAndroidOngoingNotificationStatus`, `getAndroidOngoingNotificationCapabilities`
- [ ] Utility: `canPostPromotedAndroidNotifications`, `openAndroidNotificationSettings`
- [ ] **Verify:** Start an ongoing notification from Lynx JS, see it in notification shade

---

### US-020: Android NativeModule — Events & Utilities

**Description:** As a developer, I need Android events and utility methods.

**Acceptance Criteria:**
- [ ] Events sent via `lynxContext.sendGlobalEvent("voltra:eventName", data)`
- [ ] Image preloading: `preloadImages`, `clearPreloadedImages`
- [ ] Server credentials: `setWidgetServerCredentials`, `clearWidgetServerCredentials`
- [ ] `getActiveWidgets(callback)` — returns widget info array
- [ ] **Verify:** Widget interaction → event received in JS

---

## Phase 6: Example App — Core Screens

### US-021: Example App Navigation Structure

**Description:** As a developer, I need the demo app shell matching the original's navigation structure.

**Acceptance Criteria:**
- [ ] Tab-based navigation: "Live Activities" | "Android Widgets" | "Testing"
- [ ] Platform-aware default tab (iOS → Live Activities, Android → Widgets)
- [ ] Each tab renders a scrollable list of demo entries
- [ ] Tapping an entry navigates to the demo screen
- [ ] Back navigation works
- [ ] App renders without errors in LynxExample

---

### US-022: Basic Live Activity Demo

**Description:** As a developer, I need the simplest Live Activity demo working end-to-end as proof of concept.

**Acceptance Criteria:**
- [ ] Screen with "Start" / "Update" / "Stop" buttons
- [ ] Renders `BasicLiveActivityUI` component (VStack with icon + title + subtitle)
- [ ] Pressing "Start" calls `startLiveActivity()` → activity appears on lock screen
- [ ] Pressing "Update" calls `updateLiveActivity()` → content changes
- [ ] Pressing "Stop" calls `stopLiveActivity()` → activity dismissed
- [ ] Activity state tracked via `useLiveActivity` hook
- [ ] Button states reflect `isActive`
- [ ] **This is the critical proof-of-concept: full JS → bridge → native → OS roundtrip**

---

### US-023: Music Player Live Activity Demo

**Description:** Clone the music player demo with interaction handling.

**Acceptance Criteria:**
- [ ] Renders music player UI with album art, song title, artist
- [ ] Dynamic Island compact: leading/trailing icons
- [ ] Dynamic Island expanded: full player controls
- [ ] Lock screen: full player with prev/play-pause/next buttons
- [ ] Button interactions route back to JS via events
- [ ] JS updates activity state (next song, play/pause toggle)
- [ ] Song list cycles correctly
- [ ] **Verify:** Tap "next" on lock screen → song title changes

---

### US-024: Flight Tracker Live Activity Demo

**Description:** Clone the flight tracker with multiple Dynamic Island layouts.

**Acceptance Criteria:**
- [ ] Flight info: departure/arrival airports, times, gate, status
- [ ] Dynamic Island minimal: airplane icon
- [ ] Dynamic Island compact leading: departure code, trailing: arrival code
- [ ] Dynamic Island expanded: full flight details with leading/trailing/bottom regions
- [ ] Lock screen: complete flight card with symbols
- [ ] Yellow keyline tint
- [ ] **Verify:** All Dynamic Island layouts render correctly

---

### US-025: Workout Tracker Live Activity Demo

**Description:** Clone the workout tracker with real-time updates.

**Acceptance Criteria:**
- [ ] Displays: heart rate, distance, pace, elapsed time
- [ ] Timer component shows live elapsed time
- [ ] Heart rate simulated with 1-second updates
- [ ] Distance increments ~5m/sec
- [ ] Pace calculated from time and distance
- [ ] Start/stop workout controls
- [ ] **Verify:** Start workout → values update in real-time on lock screen

---

### US-026: Compass Live Activity Demo

**Description:** Clone the compass demo (can use mock data if no magnetometer in Lynx).

**Acceptance Criteria:**
- [ ] Compass heading display (degrees + cardinal direction)
- [ ] Rotating compass arrow visual
- [ ] Dynamic Island layouts: compact with icon, expanded with compass
- [ ] Lock screen: full compass visualization
- [ ] If no magnetometer API: use simulated heading data cycling through 0-359
- [ ] 1-second update interval
- [ ] **Verify:** Heading value changes, compass arrow rotates

---

### US-027: Deep Links Live Activity Demo

**Description:** Clone the deep links demo.

**Acceptance Criteria:**
- [ ] Activity with link/button components
- [ ] Deep link URL configured
- [ ] Tapping activity opens deep link target
- [ ] Blue keyline tint
- [ ] **Verify:** Tap activity → app opens to correct screen

---

### US-028: Liquid Glass Live Activity Demo

**Description:** Clone the liquid glass visual demo.

**Acceptance Criteria:**
- [ ] GlassContainer with glass effect styling
- [ ] Dynamic Island only (no lock screen)
- [ ] Compact: colored heart symbols
- [ ] Expanded center: custom glass UI
- [ ] **Verify:** Dynamic Island shows glass morphism effect

---

### US-029: Supplemental Families Demo (iOS 18+)

**Description:** Clone the supplemental families demo.

**Acceptance Criteria:**
- [ ] Lock screen main layout
- [ ] Small family layout (Watch/CarPlay optimized)
- [ ] Compact/minimal Dynamic Island fallback
- [ ] Green keyline tint
- [ ] **Verify:** Multiple supplemental family variants render

---

## Phase 7: Example App — iOS Widgets

### US-030: Weather Widget Demo

**Description:** Clone the weather widget with multiple families.

**Acceptance Criteria:**
- [ ] Weather widget renders across: systemSmall, systemMedium, systemLarge
- [ ] 3 conditions: sunny, cloudy, rainy
- [ ] Update/reload/schedule buttons work
- [ ] Widget content changes on update
- [ ] **Verify:** Widget appears on home screen, updates work

---

### US-031: Portfolio Widget Demo

**Description:** Clone the portfolio widget with chart.

**Acceptance Criteria:**
- [ ] Portfolio value display
- [ ] Chart rendering (line chart with data points)
- [ ] Server-driven update support (15min interval)
- [ ] **Verify:** Widget shows chart, server update changes content

---

## Phase 8: Example App — Android Widgets

### US-032: Android Voltra Widget (Logo)

**Description:** Clone the basic Android logo widget.

**Acceptance Criteria:**
- [ ] Simple logo/branding widget
- [ ] Pin widget from app
- [ ] Initial state rendering
- [ ] **Verify:** Widget pinned to home screen, renders correctly

---

### US-033: Android Chart Widgets

**Description:** Clone the chart widget demos.

**Acceptance Criteria:**
- [ ] Bar chart: weekly activity data with reference rule
- [ ] Line chart: multi-series (Revenue vs Expenses)
- [ ] Area chart: stacked platform traffic
- [ ] Pie/Donut chart: framework usage breakdown
- [ ] Multiple widget sizes: mediumWide, mediumSquare, large, extraLarge
- [ ] **Verify:** Each chart type renders in correct widget size

---

### US-034: Android Material Colors Widget

**Description:** Clone the Material dynamic colors demo.

**Acceptance Criteria:**
- [ ] Widget uses device's Material You theme colors
- [ ] Compares client-side vs server-side rendering
- [ ] Real-time render timestamps
- [ ] Multiple widget sizes
- [ ] **Verify:** Widget colors match device theme

---

### US-035: Android Interactive Todos Widget

**Description:** Clone the interactive todos widget.

**Acceptance Criteria:**
- [ ] Checkboxes, switches, buttons
- [ ] Interaction events route to app
- [ ] State updates reflected in widget
- [ ] **Verify:** Tap checkbox → state toggles

---

### US-036: Android Ongoing Notification Demo

**Description:** Clone the ongoing notification demo.

**Acceptance Criteria:**
- [ ] Start/update/upsert/stop operations
- [ ] Progress bar display
- [ ] Real-time timer
- [ ] Promotion capability detection
- [ ] Channel management
- [ ] **Verify:** Notification appears in shade, progress updates

---

## Phase 9: Example App — Testing Grounds

### US-037: Timer Testing Screen

**Description:** Clone timer component testing.

**Acceptance Criteria:**
- [ ] Timer modes: countdown, stopwatch
- [ ] Direction: up/down
- [ ] Text styles: timer, relative
- [ ] Custom templates
- [ ] Live preview with controls
- [ ] **Verify:** Timer displays and counts correctly

---

### US-038: Progress Indicators Testing Screen

**Description:** Clone progress indicator testing.

**Acceptance Criteria:**
- [ ] Linear and circular progress types
- [ ] Determinate (value), timer (time-based), indeterminate (animated) modes
- [ ] Styling: track color, progress color, corner radius
- [ ] Thumb indicator option
- [ ] Interactive controls
- [ ] **Verify:** Progress bar renders and animates

---

### US-039: Styling Testing Screen

**Description:** Clone styling playground.

**Acceptance Criteria:**
- [ ] Padding, margins, colors, borders, shadows
- [ ] Typography: fontSize, fontWeight, fontFamily, letterSpacing
- [ ] Background colors and opacity
- [ ] Border styling variants
- [ ] **Verify:** All style properties render correctly

---

### US-040: Flex Playground Testing Screen

**Description:** Clone the flex layout playground.

**Acceptance Criteria:**
- [ ] Interactive flexDirection (row/column)
- [ ] alignItems control
- [ ] justifyContent control
- [ ] Spacing and padding adjustment
- [ ] Live visual feedback
- [ ] **Verify:** Layout changes in real-time

---

### US-041: Chart Playground Testing Screen

**Description:** Clone the chart playground.

**Acceptance Criteria:**
- [ ] All mark types: Bar, Line, Area, Point, Rule, Sector
- [ ] Randomize data button
- [ ] Interactive chart building
- [ ] Live preview
- [ ] **Verify:** Charts render with correct data

---

### US-042: Gradient Playground Testing Screen

**Description:** Clone the gradient playground.

**Acceptance Criteria:**
- [ ] Linear, radial, conic gradient types
- [ ] Direction/angle controls
- [ ] Color presets and custom colors
- [ ] Stop positions
- [ ] borderRadius clipping
- [ ] Real-time preview
- [ ] **Verify:** Gradients render correctly

---

### US-043: Positioning Testing Screen

**Description:** Clone the positioning examples.

**Acceptance Criteria:**
- [ ] Static, relative, absolute positioning
- [ ] Z-index layering
- [ ] Visual coordinate examples
- [ ] **Verify:** Elements positioned correctly

---

### US-044: Components Catalog Testing Screen

**Description:** Clone the component catalog.

**Acceptance Criteria:**
- [ ] Every Voltra component has a live example
- [ ] Button, Text, VStack, HStack, ZStack, Image, Symbol, Spacer
- [ ] Interactive rendering
- [ ] **Verify:** All components render without errors

---

### US-045: Image Preloading Testing Screen

**Description:** Clone image preloading test.

**Acceptance Criteria:**
- [ ] Download images to cache
- [ ] Verify rendering in widgets/activities
- [ ] Cache clear functionality
- [ ] **Verify:** Preloaded images appear in widgets

---

### US-046: Widget Scheduling Testing Screen

**Description:** Clone widget scheduling test.

**Acceptance Criteria:**
- [ ] Timeline scheduling with multiple states
- [ ] Automatic state transitions at configured times
- [ ] Timing configuration UI
- [ ] **Verify:** Widget state changes at scheduled time

---

### US-047: Server-Driven Widgets Testing Screen

**Description:** Clone server-driven widgets test.

**Acceptance Criteria:**
- [ ] Server credential configuration
- [ ] Remote widget update trigger
- [ ] Widget renders server-provided content
- [ ] Auth credentials stored/cleared correctly
- [ ] **Verify:** Widget updates from server without app interaction

---

## Phase 10: Custom Fonts & Image Fallback

### US-048: Custom Fonts Demo (Android)

**Description:** Clone custom fonts widget demo.

**Acceptance Criteria:**
- [ ] Pacifico (script font) renders in widget
- [ ] Press Start 2P (pixel font) renders in widget
- [ ] System font fallback works
- [ ] Font configuration in app config
- [ ] **Verify:** Each font renders correctly in widget

---

### US-049: Image Fallback Demo

**Description:** Clone image fallback testing.

**Acceptance Criteria:**
- [ ] Missing image shows backgroundColor fallback
- [ ] Various style properties on fallback
- [ ] Both iOS and Android
- [ ] **Verify:** Missing image shows colored placeholder, not crash

---

## Phase 11: Preview Components (Optional, Lower Priority)

### US-050: VoltraView Custom Element (iOS)

**Description:** Implement `<voltra-preview>` as a Lynx Custom Element for in-app preview rendering.

**Acceptance Criteria:**
- [ ] Register `LynxUI` subclass for `<voltra-preview>` tag
- [ ] Accepts `payload` and `viewId` attributes
- [ ] Renders SwiftUI content inline via HostingController
- [ ] Interaction events bubble up via GlobalEventEmitter
- [ ] **Verify:** `<voltra-preview>` renders live activity content inside Lynx app

---

### US-051: VoltraWidgetPreview Custom Element

**Description:** Implement widget preview for both platforms.

**Acceptance Criteria:**
- [ ] Renders widget content at specified size
- [ ] Supports widget family size constraints
- [ ] Both iOS and Android
- [ ] **Verify:** Preview matches actual widget appearance

---

## Functional Requirements

- FR-1: All Voltra public APIs available through `@voltra-lynx/ios-client` and `@voltra-lynx/android-client`
- FR-2: Rendered JSON payloads are byte-for-byte identical to original Voltra output (same renderer)
- FR-3: NativeModule methods accept same argument shapes as Expo originals (with callback adaptation)
- FR-4: Events are delivered with same payload structure as original
- FR-5: iOS Live Activity 4KB payload limit respected (uses same compression from `@use-voltra/core`)
- FR-6: Example app covers all features from original example app

## Non-Goals

- No modification to `@use-voltra/core`, `ios`, `android`, or `server` packages
- No support for Expo-specific features (config plugin, Fast Refresh HMR hook)
- No web target (Lynx web rendering not in scope)
- No HarmonyOS support in initial port (future follow-up)
- No backward compatibility with React Native — this is a clean Lynx implementation
- Preview components (US-050/051) are optional stretch goals

## Technical Considerations

- ReactLynx hooks (`useState`, `useEffect`, etc.) come from `@lynx-js/react` — Rspeedy aliases `react` to this automatically
- Lynx NativeModules are background-thread only — matches Voltra's async-first design
- `GlobalEventEmitter` is background-thread only — fine for all Voltra event patterns
- Payload compression (Brotli) runs in JS — no native dependency needed
- iOS Widget Extension setup must be done manually (no config plugin equivalent)

## Success Metrics

- All 8 Live Activity demos render identically to original
- All Android widget demos function correctly
- All testing ground screens work
- Zero modifications needed to Layer 0 packages
- Bridge adapter total LOC < 300 (excluding types)

## Open Questions

- Should we support `react-is` in Lynx's bundler? (Used by core renderer — needs verification in US-002)
- Does Lynx NativeModule support synchronous return values on Android? (May need cache-based workaround for `isLiveActivityActive`)
- Can we share the iOS Widget Extension target between Expo and Lynx builds? (Single Swift codebase for rendering)
