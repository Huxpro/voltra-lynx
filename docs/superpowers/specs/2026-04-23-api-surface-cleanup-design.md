# voltra-lynx API Surface & Project Cleanup

## Context

voltra-lynx is a port of [Voltra](https://github.com/callstackincubator/voltra) from React Native/Expo to LynxJS. During rapid development, the example-app bypassed the designed SDK packages and called raw `NativeModules` directly with inline type declarations. Several dead files, Ralph automation artifacts, and the entire `Pods/` directory were committed. This spec defines the official API surface, cleans up the project, and wires the example-app through the proper SDK packages.

## API Surface

### Layer 0: Upstream packages (npm dependencies, never modify)

| Package | What it provides |
|---------|-----------------|
| `@use-voltra/core` | Renderer, payload compression, types |
| `@use-voltra/ios` | `Voltra.*` JSX components, `renderLiveActivityToString`, `renderWidgetToString` |
| `@use-voltra/android` | `VoltraAndroid.*` components, render functions |
| `@use-voltra/server` | Server-side rendering, widget update handlers |

These are pure JS — they depend only on `react` (for JSX types) and `react-is`. They work in Lynx as-is via the `react` → `@lynx-js/react` alias that `pluginReactLynx` provides.

### Layer 1+2: `@use-voltra/lynx` (vendored business logic + Lynx bridge)

A single package with subpath exports, replacing the 3 separate `@voltra-lynx/*` packages. Uses the upstream `@use-voltra` scope to signal ecosystem membership. (We don't own the npm scope yet — fine for `workspace:*` local dev; will need scope access if/when publishing.)

**Package structure:**

```
packages/lynx/
├── package.json          # name: "@use-voltra/lynx"
├── src/
│   ├── bridge/           # Layer 2: Lynx-specific adapter (~200 LOC)
│   │   ├── index.ts
│   │   ├── module-adapter.ts   — callback→Promise wrapping
│   │   ├── event-adapter.ts    — GlobalEventEmitter → Voltra events
│   │   ├── platform.ts         — getPlatform, isIOS, isAndroid
│   │   └── types.ts            — VoltraIOSModuleSpec, event types
│   │
│   ├── ios-client/       # Layer 1: vendored from @use-voltra/ios-client
│   │   ├── index.ts
│   │   ├── VoltraModule.ts     — BRIDGE: wraps NativeModules via adapter
│   │   ├── events.ts           — BRIDGE: GlobalEventEmitter wrapper
│   │   ├── helpers.ts          — BRIDGE: Lynx platform detection
│   │   ├── logger.ts           — vendored (unchanged)
│   │   ├── types.ts            — vendored (unchanged)
│   │   ├── preload.ts          — vendored (unchanged)
│   │   ├── live-activity/
│   │   │   └── api.ts          — vendored (unchanged)
│   │   ├── widgets/
│   │   │   ├── widget-api.ts   — vendored (unchanged)
│   │   │   └── server-credentials.ts — vendored (unchanged)
│   │   └── utils/
│   │       ├── index.ts
│   │       ├── assertRunningOnApple.ts — BRIDGE: Lynx platform guard
│   │       └── useUpdateOnHMR.ts      — vendored (unchanged)
│   │
│   └── android-client/   # Layer 1: vendored from @use-voltra/android-client
│       └── ...           # Same structure as ios-client (ready for future use)
```

**Subpath exports:**

```json
{
  "name": "@use-voltra/lynx",
  "exports": {
    "./bridge": "./dist/bridge/index.js",
    "./ios-client": "./dist/ios-client/index.js",
    "./android-client": "./dist/android-client/index.js"
  }
}
```

#### `@use-voltra/lynx/bridge`

Low-level adapter. Not imported by app developers directly.

**Exports:**
- `createIOSModuleAdapter(rawModule)` → Promise-based `VoltraIOSModuleSpec`
- `createAndroidModuleAdapter(rawModule)` → Promise-based `VoltraAndroidModuleSpec`
- `createEventAdapter(emitter)` → Voltra event subscription interface
- `getPlatform()`, `isIOS()`, `isAndroid()`, `assertRunningOnIOS()`
- Type definitions: `VoltraIOSModuleSpec`, `VoltraAndroidModuleSpec`, event types

#### `@use-voltra/lynx/ios-client`

Drop-in replacement for `@use-voltra/ios-client`. Same API surface, backed by the Lynx bridge.

**Public API (matches upstream):**
- Live Activity: `useLiveActivity`, `startLiveActivity`, `updateLiveActivity`, `stopLiveActivity`, `endAllLiveActivities`, `isLiveActivityActive`
- Widgets: `updateWidget`, `scheduleWidget`, `reloadWidgets`, `clearWidget`, `clearAllWidgets`, `getActiveWidgets`
- Server credentials: `setWidgetServerCredentials`, `clearWidgetServerCredentials`
- Images: `preloadImages`, `clearPreloadedImages`, `reloadLiveActivities`
- Helpers: `isGlassSupported`, `isHeadless`

**Not ported (blocked on Lynx custom element support):**
- `VoltraView` — requires Lynx UI subclass (stretch goal)
- `VoltraLiveActivityPreview`, `VoltraWidgetPreview` — depend on VoltraView

#### `@use-voltra/lynx/android-client`

Drop-in replacement for `@use-voltra/android-client`. Same structure as iOS. No Android host app exists yet, but the package is architecturally ready.

### Layer 3: Native modules (iOS host app)

Lives in `host/ios/LynxVoltra/LynxVoltra/Voltra/`:
- `app/VoltraLynxModule.swift` — conforms to `LynxModule`, dispatches to `VoltraModuleImpl`
- `app/VoltraModuleImpl.swift` — business logic (ActivityKit, WidgetKit calls)
- `shared/` — Voltra's SwiftUI rendering engine (copied from upstream)
- `ui/` — SwiftUI views for Live Activity and Widget rendering
- `target/` — Widget Extension entry point and bundle

### Example-app integration pattern

```ts
// Layer 0 — upstream rendering (unchanged)
import { Voltra, renderLiveActivityToString } from '@use-voltra/ios'
import { renderWidgetToString } from '@use-voltra/ios'

// Layer 1+2 — our SDK (replaces raw NativeModules calls)
import {
  startLiveActivity,
  updateLiveActivity,
  stopLiveActivity,
  endAllLiveActivities,
  updateWidget,
} from '@use-voltra/lynx/ios-client'

// Usage — Promise-based, typed, clean
const activityId = await startLiveActivity(variants, { activityName: 'basic' })
await updateLiveActivity(activityId, newVariants)
await stopLiveActivity(activityId, { dismissalPolicy: { type: 'immediate' } })
```

The example-app's `package.json` dependencies change from:

```json
{
  "@use-voltra/core": "^1.4.0",
  "@use-voltra/ios": "^1.4.0",
  "@use-voltra/android": "^1.4.0"
}
```

to:

```json
{
  "@use-voltra/core": "^1.4.0",
  "@use-voltra/ios": "^1.4.0",
  "@use-voltra/android": "^1.4.0",
  "@use-voltra/lynx": "workspace:*"
}
```

## Project cleanup

### Files to delete

| Path | Reason |
|------|--------|
| `packages/lynx-native-ios/` | Stale copy; real code is in `host/ios/.../Voltra/app/VoltraLynxModule.swift` |
| `packages/lynx-native-android/` | Speculative; no Android host app |
| `packages/lynx-bridge/` | Collapsed into `packages/lynx/src/bridge/` |
| `packages/lynx-ios-client/` | Collapsed into `packages/lynx/src/ios-client/` |
| `packages/lynx-android-client/` | Collapsed into `packages/lynx/src/android-client/` |
| `host/ios/setup.sh` | Abandoned template-assembler flow |
| `host/ios/Podfile.minimal` | References internal ByteDance SDK paths |
| `tasks/` | Ralph automation artifacts (PROGRESS.md, PROMPT.md, PRD files) |

### Files to remove from git tracking (add to .gitignore)

| Path | Reason |
|------|--------|
| `host/ios/LynxVoltra/Pods/` | 2,516 files; regenerated by `pod install` |
| `host/ios/LynxVoltra/LynxVoltra.xcodeproj/` | Generated by `xcodegen` from `project.yml` |
| `host/ios/LynxVoltra/LynxVoltra.xcworkspace/` | Generated by `pod install` |
| `host/ios/LynxVoltra/Pods/Manifest.lock` | Part of Pods |

### Files to keep

| Path | Reason |
|------|--------|
| `host/ios/LynxVoltra/Podfile` | Source of truth for CocoaPods deps |
| `host/ios/LynxVoltra/Podfile.lock` | Locks dependency versions |
| `host/ios/LynxVoltra/project.yml` | Source of truth for Xcode project (xcodegen) |
| `LYNX_PORT.md` | Architecture documentation |
| `CLAUDE.md` | Project instructions |

### .gitignore additions

Add to `voltra-lynx/.gitignore`:

```gitignore
# CocoaPods
host/ios/LynxVoltra/Pods/

# Xcode generated (use xcodegen + pod install to regenerate)
host/ios/LynxVoltra/LynxVoltra.xcodeproj/
host/ios/LynxVoltra/LynxVoltra.xcworkspace/
host/ios/LynxVoltra/DerivedData/

# Ralph artifacts
tasks/
```

### Host app setup instructions

After clone, developers regenerate Xcode project:

```bash
cd voltra-lynx/host/ios/LynxVoltra
xcodegen generate        # generates .xcodeproj from project.yml
pod install              # generates .xcworkspace + Pods/
open LynxVoltra.xcworkspace
```

## Example-app refactor

### Current state (broken)

Each demo file has inline `declare const NativeModules` with `any` types and raw callback calls:

```ts
declare const NativeModules: {
  VoltraModule: {
    startLiveActivity: (json: string, options: any, callback: (id: any) => void) => void
    // ...
  }
}

NativeModules.VoltraModule.startLiveActivity(payload, opts, (id: any) => {
  const result = String(id)
  if (id && !result.startsWith('ERROR:') && result !== 'null') { ... }
})
```

### Target state

```ts
import { startLiveActivity, stopLiveActivity } from '@use-voltra/lynx/ios-client'

const activityId = await startLiveActivity(variants, { activityName: 'basic' })
```

### Scope of refactor

1. **App.tsx** — replace all `NativeModules.VoltraModule.*` calls with `@use-voltra/lynx/ios-client` imports
2. **All demo files in `demos/ios/`** — same replacement
3. **All demo files in `demos/testing/`** that call native modules — same replacement
4. **voltra-payload.tsx** — keep as-is (already correctly uses `@use-voltra/ios`)
5. **Remove** all inline `declare const NativeModules` blocks
6. **Update package.json** — add `@use-voltra/lynx` workspace dependency

## Future work (not in this spec)

- **Upstream VoltraModule injection** ([#1](https://github.com/Huxpro/voltra-lynx/issues/1)) — eliminate vendoring
- **VoltraView / VoltraWidgetPreview** — requires Lynx custom element (LynxUI subclass)
- **Android host app** — build when needed
- **useLiveActivity hook** — currently demos use imperative API; hook requires proper Lynx HMR support
