# Voltra Lynx Port — Architecture & Constraints

## Goal

Port Voltra to work as a LynxJS library, enabling Lynx applications to use iOS Live Activities, Dynamic Island, Widgets, and Android Widgets/Notifications.

## Fundamental Constraint

Voltra renders to **out-of-process OS UI surfaces** (WidgetKit, ActivityKit, Glance). These surfaces ONLY accept SwiftUI / Jetpack Compose Glance. LynxJS cannot render to these surfaces directly. Therefore:

- The rendering pipeline (JSX → JSON → native SwiftUI/Glance) stays exactly the same
- Only the **bridge layer** (how JS talks to native code) changes from Expo → Lynx NativeModules

---

## Architectural Principles

### P1: Never Modify Layer 0 (Pure JS Packages)

`@use-voltra/core`, `@use-voltra/ios`, `@use-voltra/android`, `@use-voltra/server` are framework-agnostic. They depend only on `react` (for JSX types) and `react-is`. They work in Lynx as-is via npm dependency. **NEVER copy, fork, or modify these.**

### P2: Vendor Business Logic, Replace Only Bridge Files

The `-client` packages (`ios-client`, `android-client`) contain two kinds of code:
1. **Business logic** (hooks, API functions) — framework-agnostic, only calls `VoltraModule` methods
2. **Bridge files** (4 files total) — framework-specific

Strategy: Copy the business logic files verbatim. Write new bridge files for Lynx. When upstream updates, diff and merge.

### P3: The Adapter Pattern Absorbs All Differences

Create a single adapter layer that translates between:
- Expo's Promise-returning native modules → Lynx's callback-based NativeModules
- Expo's EventEmitter → Lynx's GlobalEventEmitter
- React Native's `Platform.OS` → build-time constants

All business logic code sees the SAME interface regardless of host framework.

### P4: Native Code Follows Mechanical Translation

Expo Module → Lynx Module conversion is formulaic:
- Each method signature maps predictably
- Implementation bodies are copied verbatim from existing Voltra native code
- Only the registration/dispatch boilerplate changes

### P5: Verify End-to-End Before Moving On

Each feature must be verified by:
1. TypeScript compilation passes
2. The JSON payload produced matches the original (snapshot test)
3. Native module receives correct arguments (integration test or manual verify)

---

## Layer Model

```
Layer 0: Pure JS (100% shared via npm — NEVER modify)
├── @use-voltra/core         — renderer, payload, types
├── @use-voltra/ios          — iOS components, render functions
├── @use-voltra/android      — Android components, render functions
└── @use-voltra/server       — server-side rendering

Layer 1: Business Logic (~95% shared — vendor, don't modify)
├── live-activity/api.ts     — useLiveActivity, startLiveActivity, etc.
├── widgets/widget-api.ts    — updateWidget, scheduleWidget, etc.
├── ongoing-notification/    — Android ongoing notifications
├── preload.ts               — image preloading
└── helpers.ts               — utility functions
※ These files ONLY call VoltraModule methods + use React hooks

Layer 2: Bridge Adapter (NEW — Lynx-specific, ~200 LOC total)
├── VoltraModule.ts          — Promise wrapper around Lynx NativeModule
├── events.ts                — GlobalEventEmitter → addListener adapter
└── platform.ts              — Platform detection

Layer 3: Native Module Registration (NEW — mechanical translation)
├── iOS: VoltraLynxModule.swift    — conforms to LynxModule protocol
└── Android: VoltraLynxModule.kt   — extends LynxModule class
※ Method bodies reuse existing Voltra native code

Layer 4: Native Rendering (100% shared — from original project)
├── iOS: SwiftUI widget/activity rendering
└── Android: Glance widget rendering
```

---

## Bridge Translation Rules

### JS Side

| Expo Pattern | Lynx Equivalent |
|---|---|
| `import { requireNativeModule } from 'expo'` | Remove — use global `NativeModules` |
| `requireNativeModule<T>('VoltraModule')` | `createModuleAdapter<T>(NativeModules.VoltraModule)` |
| `module.method(args): Promise<T>` | `new Promise(resolve => raw.method(args, resolve))` |
| `module.syncMethod(args): T` | `raw.syncMethod(args)` (if supported) or cached state |
| `module.addListener(event, cb)` | `GlobalEventEmitter.addListener('voltra:' + event, cb)` |
| `requireNativeView('VoltraModule')` | Lynx Custom Element `<voltra-preview>` |
| `Platform.OS` from `react-native` | Build constant `__PLATFORM__` or `lynx.__globalProps.platform` |
| `import { View } from 'react-native'` | `<view>` element (Lynx built-in) |

### Native Side (iOS)

| Expo Module (Swift) | Lynx Module (Swift) |
|---|---|
| `class VoltraModule: Module` | `class VoltraLynxModule: NSObject, LynxModule` |
| `Name("VoltraModule")` | `static var name: String { "VoltraModule" }` |
| `Function("foo") { args -> T in ... }` | `func foo(_ args: ..., callback: @escaping (T) -> Void)` |
| `AsyncFunction("bar") { ... }` | Same as above (all async in Lynx) |
| `Events("eventName")` + `sendEvent()` | `lynxContext.sendGlobalEvent("voltra:eventName", ...)` |
| Return value | Call callback with value |
| `static var methodLookup` | Map method names to selectors |

### Native Side (Android)

| Expo Module (Kotlin) | Lynx Module (Kotlin) |
|---|---|
| `class VoltraModule : Module()` | `class VoltraLynxModule(ctx: Context) : LynxModule(ctx)` |
| `Name("VoltraModule")` | Registration: `LynxEnv.inst().registerModule("VoltraModule", ...)` |
| `Function("foo") { ... }` | `@LynxMethod fun foo(args..., callback: Callback)` |
| `sendEvent("name", data)` | `lynxContext.sendGlobalEvent("voltra:name", data)` |

---

## File Structure (Target)

```
voltra-lynx/                          ← New project root
├── CLAUDE.md
├── LYNX_PORT.md                      ← This file
├── package.json                      ← Monorepo root
├── packages/
│   ├── lynx-bridge/                  ← Layer 2: Adapter
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── module-adapter.ts     ← Promise<>callback wrapper
│   │       ├── event-adapter.ts      ← GlobalEventEmitter wrapper
│   │       ├── platform.ts           ← Platform detection
│   │       └── types.ts             ← VoltraModuleSpec interfaces
│   │
│   ├── lynx-ios-client/              ← Layer 1+2: iOS client for Lynx
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── VoltraModule.ts       ← NEW (uses lynx-bridge)
│   │       ├── events.ts            ← NEW (uses lynx-bridge)
│   │       ├── platform.ts          ← NEW
│   │       ├── live-activity/
│   │       │   └── api.ts           ← VENDORED from ios-client (unchanged)
│   │       ├── widgets/
│   │       │   ├── widget-api.ts    ← VENDORED from ios-client (unchanged)
│   │       │   └── server-credentials.ts ← VENDORED
│   │       ├── preload.ts           ← VENDORED
│   │       └── helpers.ts           ← VENDORED
│   │
│   ├── lynx-android-client/          ← Layer 1+2: Android client for Lynx
│   │   └── (same pattern as ios)
│   │
│   ├── lynx-native-ios/              ← Layer 3: iOS NativeModule
│   │   ├── VoltraLynxModule.swift
│   │   └── (reuses Layer 4 rendering from original Voltra)
│   │
│   ├── lynx-native-android/          ← Layer 3: Android NativeModule
│   │   ├── VoltraLynxModule.kt
│   │   └── (reuses Layer 4 rendering from original Voltra)
│   │
│   └── example-app/                   ← Lynx demo application
│       ├── rspeedy.config.ts
│       └── src/
│           └── App.tsx
│
└── native/                            ← Shared native rendering (from upstream)
    ├── ios/                           ← SwiftUI rendering (git subtree/copy)
    └── android/                       ← Glance rendering (git subtree/copy)
```

---

## Lynx NativeModule Specifics

### Type Mapping (JS → Native)

| TypeScript | iOS (ObjC) | Android (Java/Kotlin) |
|---|---|---|
| `string` | `NSString` | `String` |
| `number` | `double` / `NSNumber` | `double` / `Number` |
| `boolean` | `BOOL` | `boolean` |
| `object` | `NSDictionary` | `ReadableMap` |
| `array` | `NSArray` | `ReadableArray` |
| `(T) => void` (callback) | `void (^)(id)` block | `Callback` |
| `null` / `undefined` | `nil` | `null` |

### Constraints

- NativeModules are **background-thread only** in Lynx (fine — Voltra APIs are async)
- No built-in Promise support — use callback as last parameter
- Event emission uses `sendGlobalEvent` from native, `GlobalEventEmitter` in JS
- Synchronous return values may require platform-specific handling (iOS supports it, Android may not)

---

## Verification Checklist (Per Feature)

Before marking any feature complete:

- [ ] TypeScript compiles with no errors
- [ ] The rendered JSON payload matches original Voltra output (diff test)
- [ ] The Lynx NativeModule method signatures match the adapter's expectations
- [ ] Integration test: call from Lynx JS → verify native receives correct args
- [ ] If UI component: renders correctly in LynxExample app

---

## What NOT To Do

1. **DO NOT** modify `@use-voltra/core`, `ios`, `android`, or `server` packages
2. **DO NOT** add LynxJS-specific logic to vendored business logic files
3. **DO NOT** use `requireNativeModule` or any Expo API in Lynx code
4. **DO NOT** implement Custom Elements (VoltraView) until core APIs work
5. **DO NOT** skip payload verification — the 4KB limit is a hard iOS constraint
