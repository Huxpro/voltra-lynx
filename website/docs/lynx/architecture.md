# Architecture

Voltra for Lynx is a port. This page explains the layer model that made
the port cheap, the translation tables that mechanically convert Expo
patterns to Lynx ones, and the key insight that unlocked 100% reuse of
the upstream JSX components.

## The five layers

```
Layer 0: Pure JS (100% shared via npm — NEVER modify)
├── @use-voltra/core         — renderer, payload, types
├── @use-voltra/ios          — iOS components, render functions
├── @use-voltra/android      — Android components, render functions
└── @use-voltra/server       — server-side rendering

Layer 1: Business Logic (~95% shared — vendored, don't modify)
├── live-activity/api.ts     — useLiveActivity, startLiveActivity, etc.
├── widgets/widget-api.ts    — updateWidget, scheduleWidget, etc.
├── ongoing-notification/    — Android ongoing notifications
├── preload.ts               — image preloading
└── helpers.ts               — utility functions
※ These files ONLY call VoltraModule methods + use React hooks

Layer 2: Bridge Adapter (NEW — Lynx-specific, ~660 LOC total)
├── module-adapter.ts        — Promise wrapper around Lynx NativeModule
├── event-adapter.ts         — GlobalEventEmitter → addListener adapter
└── platform.ts              — Platform detection

Layer 3: Native Module Registration (NEW — mechanical translation, ~790 LOC)
├── iOS: VoltraLynxModule.swift    — conforms to LynxModule protocol
└── Android: VoltraLynxModule.kt   — extends LynxModule class
※ Method bodies delegate to existing Voltra native code

Layer 4: Native Rendering (100% shared — from original project)
├── iOS: SwiftUI widget/activity rendering
└── Android: Glance widget rendering
```

The seam is between Layers 2 and 3 — JS-side and native-side adapters
that absorb every Expo↔Lynx ABI difference. Everything above and below
those two layers ships unchanged.

## Code reuse table

| Layer | What | Original (RN) | Lynx Port | Reuse |
|---|---|---:|---:|---|
| L0 | Pure JS — core, ios, android, server | 5,734 | 0 (npm) | 100% |
| L0/1 | Voltra umbrella — renderer, payload | 4,452 | 0 (npm) | 100% |
| L1 | Client business logic — hooks, widget-api | 1,616 | 1,241 (vendored) | ~95% |
| **L2** | **Bridge adapter (NEW)** | 0 | **662** | NEW |
| **L3** | **Native module registration (NEW)** | 919 | **788** | rewrite |
| L4 | SwiftUI + Glance rendering | 19,776 | 19,783 | 100% |
| **TOTAL** | | **32,497** | 1,440 NEW + 21,024 reused | **95.6%** |

## The React Alias breakthrough

Rspeedy's `pluginReactLynx` aliases `react → @lynx-js/react` at build
time. This means upstream Voltra's components — `VStack`, `Text`,
`Symbol`, `Image`, `Button`, `Chart`, etc., which only use
`createElement` and hooks — get Lynx's `createElement` when bundled
through Rspeedy, producing an element tree identical in shape to what
React DOM or React Native would produce.

`renderLiveActivityToString()` walks that element tree and serializes
nodes to JSON. The element tree shape is the same regardless of which
`createElement` produced it. So the JSON payload is identical between
runtimes, and the native renderer cannot distinguish a payload built in
React Native from one built in Lynx.

**Any React library that only uses `createElement` and hooks (not DOM)
works in Lynx via this alias.** It's the same mechanism that makes
`@tanstack/react-query` work in Lynx.

## Translation tables

### JS side

| Expo Pattern | Lynx Equivalent |
|---|---|
| `import { requireNativeModule } from 'expo'` | Remove — use global `NativeModules` |
| `requireNativeModule<T>('VoltraModule')` | `createIOSModuleAdapter(NativeModules.VoltraModule)` |
| `module.method(args): Promise<T>` | `new Promise(resolve => raw.method(args, resolve))` |
| `module.addListener(event, cb)` | `GlobalEventEmitter.addListener('voltra:' + event, cb)` |
| `Platform.OS` from `react-native` | Build constant `__PLATFORM__` |
| `import { View } from 'react-native'` | `<view>` (Lynx built-in) |

### Native side — iOS

| Expo Module (Swift) | Lynx Module (Swift) |
|---|---|
| `class VoltraModule: Module` | `class VoltraLynxModule: NSObject, LynxModule` |
| `Name("VoltraModule")` | `static var name: String { "VoltraModule" }` |
| `AsyncFunction("foo") { ... }` | `@objc func foo(_ args: …, callback: @escaping (T) -> Void)` |
| `Events("eventName")` + `sendEvent()` | `lynxContext.sendGlobalEvent("voltra:eventName", …)` |
| Return value | Call callback with value |

### Native side — Android

| Expo Module (Kotlin) | Lynx Module (Kotlin) |
|---|---|
| `class VoltraModule : Module()` | `class VoltraLynxModule(ctx: Context) : LynxModule(ctx)` |
| `AsyncFunction("foo") { ... }` | `@LynxMethod fun foo(args…, callback: Callback)` |
| `sendEvent("name", data)` | `lynxContext.sendGlobalEvent("voltra:name", data)` |

## Before / after

### TypeScript — module loading

**Before (Expo):**
```ts
import { requireNativeModule } from 'expo'
const VoltraModule =
  requireNativeModule<VoltraIOSModuleSpec>('VoltraModule')
```

**After (Lynx):**
```ts
import { createIOSModuleAdapter } from '@use-voltra/lynx/bridge'
declare const NativeModules: {
  VoltraModule: Record<string, (...a: any[]) => any>
}
const VoltraModule: VoltraIOSModuleSpec =
  createIOSModuleAdapter(NativeModules.VoltraModule)
```

### Swift — method declaration

**Before (Expo Module DSL):**
```swift
AsyncFunction("startLiveActivity") {
  (jsonString: String, options: StartVoltraOptions?) async throws -> String in
  return try await self.impl.startLiveActivity(
    jsonString: jsonString, options: options
  )
}
```

**After (LynxModule):**
```swift
@objc func startLiveActivity(
  _ jsonString: NSString,
  options: NSDictionary?,
  callback: LynxCallbackBlock?
) {
  let opts = StartVoltraOptions(from: options)
  Task {
    do {
      let id = try await impl.startLiveActivity(
        jsonString: jsonString as String, options: opts
      )
      callback?(id as NSString)
    } catch {
      callback?("ERROR:\(error.localizedDescription)" as NSString)
    }
  }
}
```

## Architectural principles

These are encoded as `P1..P5` in
[`LYNX_PORT.md`](https://github.com/Huxpro/voltra-lynx/blob/main/LYNX_PORT.md)
and every agent working on the port reads them first:

1. **Never modify Layer 0 packages.** They're shared via npm.
2. **Vendor business logic, replace only bridge files.** Diff against upstream
   when it changes.
3. **The Adapter Pattern absorbs all differences.** Business logic sees the
   same interface regardless of host framework.
4. **Native code follows mechanical translation.** Each method signature maps
   predictably. Implementation bodies are byte-identical.
5. **Verify end-to-end before moving on.** Compile-pass is not enough —
   payload must match, native module must receive correct args, demo must
   render.
