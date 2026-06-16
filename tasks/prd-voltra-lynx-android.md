# PRD: Voltra Lynx Port — Android Widget, Live Update & Ongoing Notification Support

## Introduction

The Voltra Lynx port currently only has an iOS host app (`voltra-lynx/host/ios/`). The JavaScript bridge layer for Android is already complete (`voltra-lynx/packages/lynx/src/android-client/`), but the native Kotlin module and Android host app are missing.

This PRD covers adding full Android support: a Sparkling-scaffolded host app, a Kotlin `VoltraLynxModule` that wraps existing Voltra native rendering code as a Lynx NativeModule, and end-to-end verification with all existing Android example demos.

The rendering pipeline (JSX → JSON → native Glance/Notification) stays unchanged. Only the bridge from Lynx NativeModules to native code is new.

## Goals

- Create an Android host app using [Sparkling](https://nicklynx.github.io/nicklynx/) that can load and run the Voltra Lynx example app
- Implement `VoltraLynxModule.kt` covering all 3 Android features: Widgets, Live Updates, Ongoing Notifications (~28 native methods)
- Achieve full parity with the iOS host in terms of feature coverage and example demos
- Add Android build verification and Kotlin lint/format to CI (matching existing iOS CI jobs)

## Non-Goals (Out of Scope)

- Modifying Layer 0 packages (`@use-voltra/core`, `@use-voltra/android`) — these are shared via npm
- Modifying the vendored JS business logic in `android-client/` — the bridge adapter already works
- Android Wear OS or Android Auto surfaces
- Production signing, release builds, or Play Store distribution
- Server-driven widget infrastructure (server package changes)
- Writing new Android demo screens beyond what already exists in `example-app/src/demos/android/`

## Architecture Context

Refer to [LYNX_PORT.md](../LYNX_PORT.md) for full architecture. Summary of what already exists:

| Layer | Status | Location |
|-------|--------|----------|
| Layer 0: Pure JS (components, renderer) | Shared via npm | `packages/android/` |
| Layer 1: Business logic (hooks, API) | Vendored | `voltra-lynx/packages/lynx/src/android-client/` |
| Layer 2: Bridge adapter | Done | `voltra-lynx/packages/lynx/src/bridge/` |
| Layer 3: Native module (Kotlin) | **NOT STARTED** | `voltra-lynx/host/android/` |
| Host app | **NOT STARTED** | `voltra-lynx/host/android/` |

### Native Module Method Inventory

The Kotlin `VoltraLynxModule` must implement these methods (derived from `android-client/VoltraModule.ts`):

**Widgets (7):**
`updateAndroidWidget`, `reloadAndroidWidgets`, `clearAndroidWidget`, `clearAllAndroidWidgets`, `requestPinGlanceAppWidget`, `getActiveWidgets`, `setWidgetServerCredentials`, `clearWidgetServerCredentials`

**Live Updates (5):**
`startAndroidLiveUpdate`, `updateAndroidLiveUpdate`, `stopAndroidLiveUpdate`, `isAndroidLiveUpdateActive` (sync), `endAllAndroidLiveUpdates`

**Ongoing Notifications (11):**
`startAndroidOngoingNotification`, `upsertAndroidOngoingNotification`, `updateAndroidOngoingNotification`, `stopAndroidOngoingNotification`, `isAndroidOngoingNotificationActive` (sync), `getAndroidOngoingNotificationStatus` (sync), `endAllAndroidOngoingNotifications`, `canPostPromotedAndroidNotifications` (sync), `getAndroidOngoingNotificationCapabilities` (sync), `openAndroidNotificationSettings`

**Shared (3):**
`preloadImages`, `clearPreloadedImages`, `addListener` (event emitter)

---

## User Stories

### Phase 1: Android Host App Scaffold

#### US-001: Scaffold Android Host App with Sparkling

**Description:** As a developer, I want an Android host app created via Sparkling so that we have a standard Lynx Android project to build on.

**Acceptance Criteria:**
- [ ] Run Sparkling to generate Android project at `voltra-lynx/host/android/`
- [ ] Project uses Lynx SDK 3.7.0 (matching iOS host's `pod 'Lynx', '3.7.0'`)
- [ ] Minimum SDK: API 26 (Android 8.0, required by Glance)
- [ ] Target SDK: API 35 (latest stable)
- [ ] Project builds successfully with `./gradlew assembleDebug`

#### US-002: Configure Bundle Loading and LynxView

**Description:** As a developer, I want the Android host app to load Lynx bundles from the dev server so that I can iterate on the example app.

**Acceptance Criteria:**
- [ ] LynxView is configured in the main Activity
- [ ] Loads bundle from `http://localhost:3000/main.lynx.bundle` (matching iOS)
- [ ] Fallback to local `.bundle` file in assets (matching iOS `DemoLynxProvider`)
- [ ] Screen size and font scale are configured
- [ ] App launches on emulator and shows LynxView content

#### US-003: Register Empty VoltraLynxModule Shell

**Description:** As a developer, I want a skeleton `VoltraLynxModule.kt` registered in the host app so that JS can discover and call the native module.

**Acceptance Criteria:**
- [ ] `VoltraLynxModule.kt` created, conforming to Lynx's module protocol
- [ ] Module name is `"VoltraModule"` (matching iOS and the JS bridge's expectation)
- [ ] Module registered in the host app's Lynx config (analogous to iOS `config.register(VoltraLynxModule.self)`)
- [ ] All methods defined as stubs (log + return empty/error callback)
- [ ] JS code can call `NativeModules.VoltraModule` and get the stub responses
- [ ] `./gradlew assembleDebug` passes

---

### Phase 2: Widget Support

#### US-004: Glance Widget Rendering Pipeline

**Description:** As a developer, I want the Kotlin module to parse Voltra JSON payloads and render them as Glance `@Composable` widgets so that home screen widgets work.

**Acceptance Criteria:**
- [ ] JSON payload parser: deserializes the `{ v, variants, s, e }` format from `@use-voltra/android`
- [ ] Component registry maps Voltra component IDs (0-20) to Glance composables
- [ ] Layout components render: Box, Column, Row, LazyColumn, LazyVerticalGrid, Spacer
- [ ] Text and media components render: Text, Image, TitleBar
- [ ] Button components render: FilledButton, OutlineButton, Button, CircleIconButton, SquareIconButton
- [ ] Indicator components render: LinearProgressIndicator, CircularProgressIndicator
- [ ] Input components render: Switch, CheckBox, RadioButton
- [ ] Chart component renders via Canvas bitmap
- [ ] Style system parses and applies styles from the `s` (styles) array
- [ ] Size-variant selection works (picks variant matching widget dimensions)

**Technical Notes:**
- Reuse existing Voltra Kotlin rendering code from the Expo module (`example/android` after `expo prebuild`)
- The Lynx module delegates to the same rendering code, only the module registration differs
- Glance has restricted composable set — verify all 21 components map to valid Glance primitives

#### US-005: Widget CRUD Methods

**Description:** As a developer, I want the widget management methods implemented so that JS can create, update, and clear home screen widgets.

**Acceptance Criteria:**
- [ ] `updateAndroidWidget(widgetId, jsonString, options, callback)` — renders JSON to Glance widget, stores in SharedPreferences, triggers widget update
- [ ] `reloadAndroidWidgets(widgetIds, callback)` — triggers re-render for specified widget IDs (or all if null)
- [ ] `clearAndroidWidget(widgetId, callback)` — removes widget data, shows empty state
- [ ] `clearAllAndroidWidgets(callback)` — clears all widget data
- [ ] `getActiveWidgets(callback)` — returns list of currently placed widgets with metadata
- [ ] Each method correctly invokes callback with result or error
- [ ] Deep link URL from options is passed through to widget click handlers

#### US-006: Widget Pin & Server Credentials

**Description:** As a developer, I want widget pinning and server credential APIs so that the full widget feature set is available.

**Acceptance Criteria:**
- [ ] `requestPinGlanceAppWidget(widgetId, options, callback)` — uses Android's `AppWidgetManager.requestPinAppWidget()`, returns boolean success
- [ ] Preview options (width/height) are applied when available
- [ ] `setWidgetServerCredentials(credentials, callback)` — stores token and headers in EncryptedSharedPreferences
- [ ] `clearWidgetServerCredentials(callback)` — removes stored credentials
- [ ] Credentials are accessible from the GlanceWidget's background worker for server-driven updates

---

### Phase 3: Live Update Support

#### US-007: Notification Channel Setup

**Description:** As a developer, I want notification channels configured so that Live Updates and Ongoing Notifications can post to the system.

**Acceptance Criteria:**
- [ ] Default notification channel created on module init (Android 8.0+ requirement)
- [ ] Channel ID configurable via options
- [ ] Channel supports heads-up display for live update notifications
- [ ] Notification permission request helper works on Android 13+ (POST_NOTIFICATIONS)

#### US-008: Live Update Methods

**Description:** As a developer, I want the live update notification methods implemented so that JS can start, update, and stop notification-style live updates.

**Acceptance Criteria:**
- [ ] `startAndroidLiveUpdate(payload, options, callback)` — creates notification from collapsed/expanded variants, returns notification ID
- [ ] `updateAndroidLiveUpdate(notificationId, payload, callback)` — updates existing notification content
- [ ] `stopAndroidLiveUpdate(notificationId, callback)` — dismisses notification
- [ ] `isAndroidLiveUpdateActive(updateName)` — synchronous check, returns boolean
- [ ] `endAllAndroidLiveUpdates(callback)` — dismisses all live update notifications
- [ ] Notifications render collapsed and expanded views from the JSON payload
- [ ] `smallIcon` and `channelId` options are respected

---

### Phase 4: Ongoing Notification Support

#### US-009: Ongoing Notification CRUD

**Description:** As a developer, I want ongoing notification management so that JS can control persistent foreground notifications.

**Acceptance Criteria:**
- [ ] `startAndroidOngoingNotification(payload, options, callback)` — starts ongoing notification, returns `{ ok, notificationId, action }`
- [ ] `upsertAndroidOngoingNotification(payload, options, callback)` — starts or updates, returns `{ ok, notificationId, action }`
- [ ] `updateAndroidOngoingNotification(notificationId, payload, options, callback)` — updates content, returns `{ ok, notificationId, action, reason }`
- [ ] `stopAndroidOngoingNotification(notificationId, callback)` — stops notification, returns `{ ok, notificationId, action }`
- [ ] `endAllAndroidOngoingNotifications(callback)` — stops all ongoing notifications
- [ ] Supports both `Progress` and `BigText` notification types
- [ ] Progress notifications render segments and points
- [ ] Deep link URLs and action icons are wired up

#### US-010: Notification Capabilities & Permissions

**Description:** As a developer, I want notification capability queries and permission management so that the app can adapt to device capabilities.

**Acceptance Criteria:**
- [ ] `isAndroidOngoingNotificationActive(notificationId)` — sync, returns boolean
- [ ] `getAndroidOngoingNotificationStatus(notificationId)` — sync, returns `{ isActive, isDismissed, isPromoted, hasPromotableCharacteristics }`
- [ ] `getAndroidOngoingNotificationCapabilities()` — sync, returns `{ apiLevel, notificationsEnabled, supportsPromotedNotifications, canPostPromotedNotifications, canRequestPromotedOngoing }`
- [ ] `canPostPromotedAndroidNotifications()` — sync, returns boolean
- [ ] `openAndroidNotificationSettings(callback)` — opens system notification settings for the app

---

### Phase 5: Shared Utilities

#### US-011: Image Preloading

**Description:** As a developer, I want image preloading support so that widget and notification images load reliably.

**Acceptance Criteria:**
- [ ] `preloadImages(images, callback)` — downloads images to local cache, returns `{ succeeded: string[], failed: Array<{ key, error }> }`
- [ ] Supports URL, key, HTTP method, and custom headers
- [ ] `clearPreloadedImages(keys, callback)` — clears specified keys (or all if null)
- [ ] Preloaded images are accessible from Glance widget rendering context

#### US-012: Event System (Native → JS)

**Description:** As a developer, I want native events delivered to JS so that the app can react to widget interactions and notification actions.

**Acceptance Criteria:**
- [ ] Native module emits events via Lynx's `GlobalEventEmitter`
- [ ] Events use `voltra:` prefix (matching the JS event adapter convention)
- [ ] Widget interaction events (tap, deep link) are delivered
- [ ] Notification action events (tap, dismiss) are delivered
- [ ] `addListener` / `removeListener` lifecycle is handled (no leaks on module destroy)

---

### Phase 6: Example Verification

Each existing Android demo must be verified end-to-end on a real device or emulator. The demo UI screens already exist in `voltra-lynx/packages/example-app/src/demos/android/`; verification means the native module calls actually work.

#### US-013: Verify VoltraWidgetLogo Demo

**Description:** As a developer, I want the VoltraWidgetLogo demo to render a real widget on the Android home screen so that the basic widget pipeline is proven.

**Acceptance Criteria:**
- [ ] Demo screen loads in the Lynx host app on Android emulator
- [ ] Tapping "Update Widget" triggers `updateAndroidWidget` and the home screen widget updates
- [ ] Widget shows the Voltra logo with update count and timestamp
- [ ] Widget pin request works (adds widget to home screen)

#### US-014: Verify ChartWidgets Demo

**Description:** As a developer, I want chart widgets to render correctly so that Canvas-based bitmap rendering is verified.

**Acceptance Criteria:**
- [ ] Chart widget renders on home screen with correct data visualization
- [ ] Bar, Line, Area, and other chart types render via Canvas bitmap
- [ ] Widget updates when chart data changes from the demo screen

#### US-015: Verify MaterialColorsWidget Demo

**Description:** As a developer, I want the Material Colors widget to render so that dynamic color / Material You theming is verified.

**Acceptance Criteria:**
- [ ] Widget renders with Material You dynamic colors on supported devices (Android 12+)
- [ ] Falls back to static colors on older devices
- [ ] Color swatches display correctly in widget layout

#### US-016: Verify InteractiveTodosWidget Demo

**Description:** As a developer, I want the Interactive Todos widget to work so that widget interaction handling (CheckBox, deep links) is verified.

**Acceptance Criteria:**
- [ ] Todo items render with checkboxes in the widget
- [ ] Checkbox interactions trigger events back to JS
- [ ] Widget updates reflect todo state changes
- [ ] Deep link actions open the app to the correct screen

#### US-017: Verify OngoingNotificationDemo

**Description:** As a developer, I want the Ongoing Notification demo to work so that the full notification pipeline is verified.

**Acceptance Criteria:**
- [ ] Tapping "Start" creates a foreground ongoing notification
- [ ] Progress bar updates in real-time as the demo timer ticks
- [ ] "Pause" and "Resume" correctly control the notification state
- [ ] "Stop" dismisses the notification
- [ ] Notification actions (if any) trigger events back to JS

---

### Phase 7: CI Integration

#### US-018: Android Host App Build in CI

**Description:** As a developer, I want the Android host app build verified in CI so that regressions are caught automatically.

**Acceptance Criteria:**
- [ ] New GitHub Actions job: `[Android] Lynx Host Build`
- [ ] Runs on `ubuntu-latest` with Java 17 + Gradle setup (matching existing `native-kotlin-test` job)
- [ ] Runs `./gradlew assembleDebug` in `voltra-lynx/host/android/`
- [ ] Triggers on push to `main` and pull requests to `main`
- [ ] Job appears in the CI concurrency group

#### US-019: Kotlin Lint/Format for Lynx Android Code

**Description:** As a developer, I want Kotlin formatting enforced for the Lynx Android host so that code style is consistent.

**Acceptance Criteria:**
- [ ] Existing `ktlint` CI job's scope includes `voltra-lynx/host/android/` source files
- [ ] `.editorconfig` or ktlint config covers the new Kotlin files
- [ ] `npm run format:kotlin:check` includes the Lynx Android code
- [ ] No formatting violations in the initial codebase

---

## Functional Requirements

- FR-1: Android host app scaffolded via Sparkling, targeting Lynx SDK 3.7.0, minSdk 26
- FR-2: `VoltraLynxModule.kt` registers as `"VoltraModule"` and exposes all 28 methods to JS
- FR-3: Glance widget rendering parses Voltra JSON payloads and renders all 21 Android component types
- FR-4: Live Update notifications support collapsed/expanded views from JSON payloads
- FR-5: Ongoing notifications support Progress and BigText types with actions
- FR-6: Synchronous methods (`isAndroidLiveUpdateActive`, `getAndroidOngoingNotificationCapabilities`, etc.) return values directly without callbacks
- FR-7: Events from native (widget taps, notification actions) are delivered to JS via `GlobalEventEmitter` with `voltra:` prefix
- FR-8: Image preloading caches images accessible from both the app process and Glance widget process
- FR-9: Widget server credentials stored in EncryptedSharedPreferences
- FR-10: All 5 existing Android demo screens work end-to-end on device/emulator
- FR-11: CI verifies Android host app builds and Kotlin formatting

## Technical Considerations

- **Reuse existing native code:** The original Voltra project has production Kotlin code for Glance rendering, notification building, and image preloading (accessible via `expo prebuild` in `example/android`). The Lynx module should delegate to this same code — only the module registration boilerplate changes (P4 from LYNX_PORT.md).
- **Glance process model:** Glance widgets run in a `GlanceAppWidgetReceiver` process. SharedPreferences (for payloads) and file storage (for preloaded images) must be accessible across processes.
- **Callback convention:** Lynx NativeModules use callback-based APIs. The JS bridge adapter (`module-adapter.ts`) already wraps these as Promises. Kotlin methods must accept a `Callback` parameter and invoke it with the result.
- **Sync methods:** Methods like `isAndroidLiveUpdateActive` are synchronous on the JS side. These should be implemented as `@LynxMethod(isSync = true)` (or equivalent in Lynx's Android SDK).
- **Sparkling template:** Use [Sparkling](https://nicklynx.github.io/nicklynx/) to generate the initial project. This ensures correct Lynx SDK integration, ProGuard rules, and build configuration.

## Success Metrics

- All 5 Android demo screens render and function end-to-end on an Android emulator (API 33+)
- `./gradlew assembleDebug` completes successfully in CI
- No new Kotlin lint violations
- Native module method count matches the JS bridge expectation (28 methods)
- Widget update latency is under 500ms from JS call to home screen render

## Open Questions

1. **Glance version:** Should we target Glance 1.0 (stable) or 1.1 (alpha with more features)? Recommendation: match whatever the original Voltra Expo module uses.
2. **Widget preview in LynxView:** iOS has a `VoltraWidgetPreview` custom element that renders a widget preview inside LynxView. Should we build an equivalent `VoltraAndroidWidgetPreview` for the Android host? If yes, this needs a separate story.
3. **App Group equivalent:** iOS uses App Groups for widget ↔ app data sharing. Android uses SharedPreferences across processes. Need to verify the Sparkling template's default `android:process` configuration supports this.
4. **Brotli compression:** iOS host includes Brotli decompression for payloads. Does the Android side need the same, or does Voltra's Android rendering path handle uncompressed payloads?
