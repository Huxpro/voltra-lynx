# API Surface & Project Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate 3 packages into `@use-voltra/lynx` with subpath exports, clean up dead files/gitignore, and wire the example-app through the proper SDK instead of raw NativeModules.

**Architecture:** Merge `lynx-bridge`, `lynx-ios-client`, `lynx-android-client` into a single `packages/lynx/` package with `exports` for `./bridge`, `./ios-client`, `./android-client`. Update example-app to import from `@use-voltra/lynx/ios-client`. Remove dead code and fix .gitignore.

**Tech Stack:** TypeScript, pnpm workspaces, Rspeedy (Rsbuild), Lynx NativeModules

**Spec:** `docs/superpowers/specs/2026-04-23-api-surface-cleanup-design.md`

---

## File Structure

### New package: `packages/lynx/`

```
packages/lynx/
├── package.json
├── tsconfig.json
├── src/
│   ├── bridge/
│   │   ├── index.ts              ← from lynx-bridge/src/index.ts
│   │   ├── module-adapter.ts     ← from lynx-bridge/src/module-adapter.ts
│   │   ├── event-adapter.ts      ← from lynx-bridge/src/event-adapter.ts
│   │   ├── platform.ts           ← from lynx-bridge/src/platform.ts
│   │   ├── types.ts              ← from lynx-bridge/src/types.ts
│   │   └── env.d.ts              ← from lynx-bridge/src/env.d.ts
│   │
│   ├── ios-client/
│   │   ├── index.ts              ← from lynx-ios-client/src/index.ts
│   │   ├── VoltraModule.ts       ← from lynx-ios-client/src/VoltraModule.ts (update import)
│   │   ├── events.ts             ← from lynx-ios-client/src/events.ts (update import)
│   │   ├── helpers.ts            ← from lynx-ios-client/src/helpers.ts
│   │   ├── logger.ts             ← from lynx-ios-client/src/logger.ts
│   │   ├── types.ts              ← from lynx-ios-client/src/types.ts (update import)
│   │   ├── preload.ts            ← from lynx-ios-client/src/preload.ts
│   │   ├── env.d.ts              ← from lynx-ios-client/src/env.d.ts
│   │   ├── live-activity/
│   │   │   └── api.ts            ← from lynx-ios-client/src/live-activity/api.ts
│   │   ├── widgets/
│   │   │   ├── widget-api.ts     ← from lynx-ios-client/src/widgets/widget-api.ts
│   │   │   └── server-credentials.ts ← from lynx-ios-client/src/widgets/server-credentials.ts
│   │   └── utils/
│   │       ├── index.ts          ← from lynx-ios-client/src/utils/index.ts
│   │       ├── assertRunningOnApple.ts ← from lynx-ios-client/src/utils/assertRunningOnApple.ts (update import)
│   │       └── useUpdateOnHMR.ts ← from lynx-ios-client/src/utils/useUpdateOnHMR.ts
│   │
│   └── android-client/
│       ├── index.ts              ← from lynx-android-client/src/index.ts
│       ├── VoltraModule.ts       ← from lynx-android-client/src/VoltraModule.ts (update import)
│       ├── events.ts             ← from lynx-android-client/src/events.ts (update import)
│       ├── types.ts              ← from lynx-android-client/src/types.ts (update import)
│       ├── preload.ts            ← from lynx-android-client/src/preload.ts
│       ├── env.d.ts              ← from lynx-android-client/src/env.d.ts
│       ├── live-update/
│       │   ├── api.ts            ← from lynx-android-client/src/live-update/api.ts
│       │   └── types.ts          ← from lynx-android-client/src/live-update/types.ts
│       ├── ongoing-notification/
│       │   └── api.ts            ← from lynx-android-client/src/ongoing-notification/api.ts
│       ├── widgets/
│       │   ├── api.ts            ← from lynx-android-client/src/widgets/api.ts
│       │   └── server-credentials.ts ← from lynx-android-client/src/widgets/server-credentials.ts
│       └── utils/
│           ├── index.ts          ← from lynx-android-client/src/utils/index.ts
│           └── useUpdateOnHMR.ts ← from lynx-android-client/src/utils/useUpdateOnHMR.ts
```

### Files to delete

- `packages/lynx-bridge/` — merged into `packages/lynx/src/bridge/`
- `packages/lynx-ios-client/` — merged into `packages/lynx/src/ios-client/`
- `packages/lynx-android-client/` — merged into `packages/lynx/src/android-client/`
- `packages/lynx-native-ios/` — stale; real code in host app
- `packages/lynx-native-android/` — speculative; no host app
- `voltra-lynx/host/ios/setup.sh` — abandoned flow
- `voltra-lynx/host/ios/Podfile.minimal` — internal SDK refs
- `tasks/` — Ralph artifacts

### Files to modify

- `voltra-lynx/.gitignore` — add Pods, xcodeproj, xcworkspace, tasks
- `voltra-lynx/tsconfig.json` — update references
- `voltra-lynx/packages/example-app/package.json` — add `@use-voltra/lynx` dep
- `voltra-lynx/packages/example-app/src/App.tsx` — use SDK imports
- All 14 demo files with `NativeModules` calls — use SDK imports

---

## Task 1: Create `packages/lynx/` with bridge subpath

**Files:**
- Create: `voltra-lynx/packages/lynx/package.json`
- Create: `voltra-lynx/packages/lynx/tsconfig.json`
- Move: `voltra-lynx/packages/lynx-bridge/src/*` → `voltra-lynx/packages/lynx/src/bridge/`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@use-voltra/lynx",
  "version": "0.0.1",
  "private": true,
  "description": "Voltra for LynxJS — bridge adapter + client APIs",
  "exports": {
    "./bridge": {
      "types": "./dist/bridge/index.d.ts",
      "import": "./dist/bridge/index.js"
    },
    "./ios-client": {
      "types": "./dist/ios-client/index.d.ts",
      "import": "./dist/ios-client/index.js"
    },
    "./android-client": {
      "types": "./dist/android-client/index.d.ts",
      "import": "./dist/android-client/index.js"
    }
  },
  "scripts": {
    "build": "tsc --build",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@use-voltra/ios": "^1.4.0",
    "@use-voltra/android": "^1.4.0"
  },
  "peerDependencies": {
    "react": ">=18"
  },
  "devDependencies": {
    "typescript": "~5.8.0"
  }
}
```

Write to `voltra-lynx/packages/lynx/package.json`.

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "bundler",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "jsx": "react-jsx",
    "lib": ["ES2020"],
    "isolatedModules": true,
    "composite": true
  },
  "include": ["src"]
}
```

Write to `voltra-lynx/packages/lynx/tsconfig.json`.

- [ ] **Step 3: Move bridge source files**

```bash
cd /Users/bytedance/github/voltra/voltra-lynx
mkdir -p packages/lynx/src/bridge
cp packages/lynx-bridge/src/index.ts packages/lynx/src/bridge/
cp packages/lynx-bridge/src/module-adapter.ts packages/lynx/src/bridge/
cp packages/lynx-bridge/src/event-adapter.ts packages/lynx/src/bridge/
cp packages/lynx-bridge/src/platform.ts packages/lynx/src/bridge/
cp packages/lynx-bridge/src/types.ts packages/lynx/src/bridge/
cp packages/lynx-bridge/src/env.d.ts packages/lynx/src/bridge/
```

No import path changes needed — bridge files only import from each other via relative paths (e.g., `'./types.js'`, `'./module-adapter.js'`), which remain valid.

- [ ] **Step 4: Verify bridge compiles**

```bash
cd /Users/bytedance/github/voltra/voltra-lynx/packages/lynx
npx tsc --noEmit --project tsconfig.json 2>&1 | head -20
```

Expected: compiles clean (or only errors from ios-client/android-client not yet added).

- [ ] **Step 5: Commit**

```bash
cd /Users/bytedance/github/voltra
git add voltra-lynx/packages/lynx/
git commit -m "refactor: create @use-voltra/lynx package with bridge subpath"
```

---

## Task 2: Move ios-client into packages/lynx

**Files:**
- Move: `voltra-lynx/packages/lynx-ios-client/src/*` → `voltra-lynx/packages/lynx/src/ios-client/`
- Modify: import paths in files that reference bridge

- [ ] **Step 1: Copy ios-client source files**

```bash
cd /Users/bytedance/github/voltra/voltra-lynx
mkdir -p packages/lynx/src/ios-client/live-activity
mkdir -p packages/lynx/src/ios-client/widgets
mkdir -p packages/lynx/src/ios-client/utils

# Root files
cp packages/lynx-ios-client/src/index.ts packages/lynx/src/ios-client/
cp packages/lynx-ios-client/src/VoltraModule.ts packages/lynx/src/ios-client/
cp packages/lynx-ios-client/src/events.ts packages/lynx/src/ios-client/
cp packages/lynx-ios-client/src/helpers.ts packages/lynx/src/ios-client/
cp packages/lynx-ios-client/src/logger.ts packages/lynx/src/ios-client/
cp packages/lynx-ios-client/src/types.ts packages/lynx/src/ios-client/
cp packages/lynx-ios-client/src/preload.ts packages/lynx/src/ios-client/
cp packages/lynx-ios-client/src/env.d.ts packages/lynx/src/ios-client/

# Subdirectories
cp packages/lynx-ios-client/src/live-activity/api.ts packages/lynx/src/ios-client/live-activity/
cp packages/lynx-ios-client/src/widgets/widget-api.ts packages/lynx/src/ios-client/widgets/
cp packages/lynx-ios-client/src/widgets/server-credentials.ts packages/lynx/src/ios-client/widgets/
cp packages/lynx-ios-client/src/utils/index.ts packages/lynx/src/ios-client/utils/
cp packages/lynx-ios-client/src/utils/assertRunningOnApple.ts packages/lynx/src/ios-client/utils/
cp packages/lynx-ios-client/src/utils/useUpdateOnHMR.ts packages/lynx/src/ios-client/utils/
```

- [ ] **Step 2: Update bridge import paths**

The ios-client files that import from `@voltra-lynx/bridge` must now import from the sibling `../bridge/` directory. Files to update:

**`packages/lynx/src/ios-client/VoltraModule.ts`** — change:
```ts
import { createIOSModuleAdapter } from '@voltra-lynx/bridge';
import type { VoltraIOSModuleSpec } from '@voltra-lynx/bridge';
```
to:
```ts
import { createIOSModuleAdapter } from '../bridge/index.js';
import type { VoltraIOSModuleSpec } from '../bridge/index.js';
```

**`packages/lynx/src/ios-client/events.ts`** — change:
```ts
import { createEventAdapter, assertRunningOnIOS } from '@voltra-lynx/bridge';
import type { ... } from '@voltra-lynx/bridge';
```
to:
```ts
import { createEventAdapter, assertRunningOnIOS } from '../bridge/index.js';
import type { ... } from '../bridge/index.js';
```

**`packages/lynx/src/ios-client/types.ts`** — change:
```ts
} from '@voltra-lynx/bridge'
```
to:
```ts
} from '../bridge/index.js'
```

**`packages/lynx/src/ios-client/utils/assertRunningOnApple.ts`** — change:
```ts
import { assertRunningOnIOS } from '@voltra-lynx/bridge'
```
to:
```ts
import { assertRunningOnIOS } from '../../bridge/index.js'
```

Use `sed` or manual edit for each file. The exact old strings to search for are `'@voltra-lynx/bridge'` or `"@voltra-lynx/bridge"`.

- [ ] **Step 3: Verify compilation**

```bash
cd /Users/bytedance/github/voltra/voltra-lynx/packages/lynx
npx tsc --noEmit 2>&1 | head -30
```

Expected: compiles clean.

- [ ] **Step 4: Commit**

```bash
cd /Users/bytedance/github/voltra
git add voltra-lynx/packages/lynx/src/ios-client/
git commit -m "refactor: move ios-client into @use-voltra/lynx package"
```

---

## Task 3: Move android-client into packages/lynx

**Files:**
- Move: `voltra-lynx/packages/lynx-android-client/src/*` → `voltra-lynx/packages/lynx/src/android-client/`
- Modify: import paths referencing bridge

- [ ] **Step 1: Copy android-client source files**

```bash
cd /Users/bytedance/github/voltra/voltra-lynx
mkdir -p packages/lynx/src/android-client/live-update
mkdir -p packages/lynx/src/android-client/ongoing-notification
mkdir -p packages/lynx/src/android-client/widgets
mkdir -p packages/lynx/src/android-client/utils

cp packages/lynx-android-client/src/index.ts packages/lynx/src/android-client/
cp packages/lynx-android-client/src/VoltraModule.ts packages/lynx/src/android-client/
cp packages/lynx-android-client/src/events.ts packages/lynx/src/android-client/
cp packages/lynx-android-client/src/types.ts packages/lynx/src/android-client/
cp packages/lynx-android-client/src/preload.ts packages/lynx/src/android-client/
cp packages/lynx-android-client/src/env.d.ts packages/lynx/src/android-client/

cp packages/lynx-android-client/src/live-update/api.ts packages/lynx/src/android-client/live-update/
cp packages/lynx-android-client/src/live-update/types.ts packages/lynx/src/android-client/live-update/
cp packages/lynx-android-client/src/ongoing-notification/api.ts packages/lynx/src/android-client/ongoing-notification/
cp packages/lynx-android-client/src/widgets/api.ts packages/lynx/src/android-client/widgets/
cp packages/lynx-android-client/src/widgets/server-credentials.ts packages/lynx/src/android-client/widgets/
cp packages/lynx-android-client/src/utils/index.ts packages/lynx/src/android-client/utils/
cp packages/lynx-android-client/src/utils/useUpdateOnHMR.ts packages/lynx/src/android-client/utils/
```

- [ ] **Step 2: Update bridge import paths**

Same pattern as ios-client. Replace all `'@voltra-lynx/bridge'` with `'../bridge/index.js'` in:

- `packages/lynx/src/android-client/VoltraModule.ts`
- `packages/lynx/src/android-client/events.ts`
- `packages/lynx/src/android-client/types.ts`

- [ ] **Step 3: Verify compilation**

```bash
cd /Users/bytedance/github/voltra/voltra-lynx/packages/lynx
npx tsc --noEmit 2>&1 | head -30
```

Expected: compiles clean.

- [ ] **Step 4: Commit**

```bash
cd /Users/bytedance/github/voltra
git add voltra-lynx/packages/lynx/src/android-client/
git commit -m "refactor: move android-client into @use-voltra/lynx package"
```

---

## Task 4: Delete old packages and dead files

**Files to delete:**
- `voltra-lynx/packages/lynx-bridge/`
- `voltra-lynx/packages/lynx-ios-client/`
- `voltra-lynx/packages/lynx-android-client/`
- `voltra-lynx/packages/lynx-native-ios/`
- `voltra-lynx/packages/lynx-native-android/`
- `voltra-lynx/host/ios/setup.sh`
- `voltra-lynx/host/ios/Podfile.minimal`
- `tasks/`

- [ ] **Step 1: Remove old packages**

```bash
cd /Users/bytedance/github/voltra
git rm -rf voltra-lynx/packages/lynx-bridge
git rm -rf voltra-lynx/packages/lynx-ios-client
git rm -rf voltra-lynx/packages/lynx-android-client
git rm -rf voltra-lynx/packages/lynx-native-ios
git rm -rf voltra-lynx/packages/lynx-native-android
```

- [ ] **Step 2: Remove stale scaffolding**

```bash
cd /Users/bytedance/github/voltra
git rm voltra-lynx/host/ios/setup.sh
git rm voltra-lynx/host/ios/Podfile.minimal
```

- [ ] **Step 3: Remove Ralph artifacts**

```bash
cd /Users/bytedance/github/voltra
git rm -rf tasks/
```

- [ ] **Step 4: Update root tsconfig references**

Edit `voltra-lynx/tsconfig.json` — replace:
```json
  "references": [
    { "path": "packages/lynx-bridge" },
    { "path": "packages/lynx-ios-client" },
    { "path": "packages/lynx-android-client" }
  ]
```
with:
```json
  "references": [
    { "path": "packages/lynx" }
  ]
```

- [ ] **Step 5: Commit**

```bash
cd /Users/bytedance/github/voltra
git add -A voltra-lynx/tsconfig.json
git commit -m "refactor: remove old packages, dead files, and Ralph artifacts"
```

---

## Task 5: Update .gitignore and remove tracked generated files

**Files:**
- Modify: `voltra-lynx/.gitignore`
- Remove from tracking: Pods/, .xcodeproj/, .xcworkspace/

- [ ] **Step 1: Update .gitignore**

Replace the contents of `voltra-lynx/.gitignore` with:

```gitignore
node_modules/
dist/
*.tsbuildinfo

# CocoaPods (regenerate with: cd host/ios/LynxVoltra && pod install)
host/ios/LynxVoltra/Pods/

# Xcode generated (regenerate with: cd host/ios/LynxVoltra && xcodegen generate && pod install)
host/ios/LynxVoltra/LynxVoltra.xcodeproj/
host/ios/LynxVoltra/LynxVoltra.xcworkspace/
host/ios/LynxVoltra/DerivedData/

# macOS
.DS_Store
```

- [ ] **Step 2: Remove Pods from git tracking**

```bash
cd /Users/bytedance/github/voltra
git rm -r --cached voltra-lynx/host/ios/LynxVoltra/Pods/
```

This removes 2,516 files from tracking without deleting them from disk.

- [ ] **Step 3: Remove generated Xcode files from git tracking**

```bash
cd /Users/bytedance/github/voltra
git rm -r --cached voltra-lynx/host/ios/LynxVoltra/LynxVoltra.xcodeproj/
git rm -r --cached voltra-lynx/host/ios/LynxVoltra/LynxVoltra.xcworkspace/
```

- [ ] **Step 4: Remove host/ios/README.md**

The README references the abandoned setup.sh flow. Remove it:

```bash
git rm voltra-lynx/host/ios/README.md
```

- [ ] **Step 5: Commit**

```bash
cd /Users/bytedance/github/voltra
git add voltra-lynx/.gitignore
git commit -m "chore: gitignore Pods + generated Xcode files, remove from tracking

Removes 2,516 Pods files and generated .xcodeproj/.xcworkspace.
Regenerate with: cd host/ios/LynxVoltra && xcodegen generate && pod install"
```

---

## Task 6: Wire example-app to `@use-voltra/lynx/ios-client`

**Files:**
- Modify: `voltra-lynx/packages/example-app/package.json`
- Modify: `voltra-lynx/packages/example-app/src/App.tsx`

- [ ] **Step 1: Add dependency to example-app**

Edit `voltra-lynx/packages/example-app/package.json` — add to `dependencies`:

```json
"@use-voltra/lynx": "workspace:*"
```

- [ ] **Step 2: Install dependencies**

```bash
cd /Users/bytedance/github/voltra/voltra-lynx
pnpm install
```

- [ ] **Step 3: Refactor App.tsx**

In `voltra-lynx/packages/example-app/src/App.tsx`:

Remove the `declare const NativeModules` block (lines 30-37) and add import:

```ts
import {
  startLiveActivity,
  updateLiveActivity,
  stopLiveActivity,
  endAllLiveActivities,
} from '@use-voltra/lynx/ios-client'
```

Replace all callback-based `NativeModules.VoltraModule.*` calls with async versions:

- `NativeModules.VoltraModule.endLiveActivity(activityId, { dismissalPolicy: { type: 'immediate' } }, () => {...})` →
  `stopLiveActivity(activityId, { dismissalPolicy: { type: 'immediate' } }).then(() => {...})`

- `NativeModules.VoltraModule.startLiveActivity(payload, { activityName: def.activityName }, (id: any) => {...})` →
  `startLiveActivity(payload, { activityName: def.activityName }).then((id) => {...}).catch(() => {})`

  Note: `startLiveActivity` in the vendored API takes `(variants, options)` where variants is a `LiveActivityVariants` object. But our current App.tsx passes a pre-rendered JSON string. The vendored `startLiveActivity` calls `renderLiveActivityToString(variants)` internally.

  **Important:** Check whether the current App.tsx passes raw JSON strings or variant objects. If raw JSON strings, we need to use `VoltraModule` directly (the low-level bridge) rather than the high-level `startLiveActivity` function which expects JSX variants. Read the actual App.tsx call pattern to determine the right approach.

- `NativeModules.VoltraModule.endAllLiveActivities(() => {})` →
  `endAllLiveActivities()`

- `NativeModules.VoltraModule.updateLiveActivity(activityId, payload, {}, () => {})` →
  `updateLiveActivity(activityId, payload)` — same caveat about raw JSON vs variants.

- [ ] **Step 4: Verify build**

```bash
cd /Users/bytedance/github/voltra/voltra-lynx/packages/example-app
pnpm build 2>&1 | tail -20
```

Expected: builds successfully.

- [ ] **Step 5: Commit**

```bash
cd /Users/bytedance/github/voltra
git add voltra-lynx/packages/example-app/package.json voltra-lynx/packages/example-app/src/App.tsx voltra-lynx/pnpm-lock.yaml
git commit -m "refactor: wire App.tsx to @use-voltra/lynx/ios-client SDK"
```

---

## Task 7: Refactor iOS demo files to use SDK

**Files:**
- Modify: all files in `voltra-lynx/packages/example-app/src/demos/ios/` that use `NativeModules`

Target files (each contains `declare const NativeModules` + callback calls):
- `BasicLiveActivity.tsx`
- `MusicPlayerActivity.tsx`
- `FlightTrackerActivity.tsx`
- `LiquidGlassActivity.tsx`
- `SupplementalFamiliesDemo.tsx`
- `DeepLinksActivity.tsx`
- `CompassActivity.tsx`
- `WorkoutTrackerActivity.tsx`
- `WeatherWidgetDemo.tsx`
- `PortfolioWidgetDemo.tsx`

- [ ] **Step 1: For each file, apply the same transformation as App.tsx**

In each file:

1. Remove the `declare const NativeModules` block
2. Add appropriate imports from `@use-voltra/lynx/ios-client`
3. Replace callback-based calls with Promise-based calls

The import will depend on which methods the file uses. Common patterns:

**For Live Activity demos:**
```ts
import { startLiveActivity, updateLiveActivity, stopLiveActivity } from '@use-voltra/lynx/ios-client'
```

**For Widget demos:**
```ts
import { updateWidget, reloadWidgets, scheduleWidget } from '@use-voltra/lynx/ios-client'
```

**Same caveat from Task 6 applies:** If demos pass pre-rendered JSON strings rather than variant objects, use `VoltraModule` from `@use-voltra/lynx/ios-client` directly instead of the high-level functions.

- [ ] **Step 2: Verify build**

```bash
cd /Users/bytedance/github/voltra/voltra-lynx/packages/example-app
pnpm build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
cd /Users/bytedance/github/voltra
git add voltra-lynx/packages/example-app/src/demos/ios/
git commit -m "refactor: wire iOS demo screens to @use-voltra/lynx/ios-client SDK"
```

---

## Task 8: Refactor Testing demo files to use SDK

**Files:**
- Modify: testing demo files that use `NativeModules`:
  - `WeatherWidgetScreen.tsx`
  - `WidgetSchedulingScreen.tsx`
  - `ImagePreloadingScreen.tsx`
  - `ImageFallbackScreen.tsx`
  - `PositioningScreen.tsx`

- [ ] **Step 1: Apply same transformation pattern**

For each file, remove `declare const NativeModules`, add SDK imports, replace callbacks with Promises.

**For widget screens:**
```ts
import { updateWidget, reloadWidgets, scheduleWidget, clearWidget } from '@use-voltra/lynx/ios-client'
```

**For image screens:**
```ts
import { preloadImages, clearPreloadedImages } from '@use-voltra/lynx/ios-client'
```

**For screens that use startLiveActivity for previews:**
```ts
import { startLiveActivity } from '@use-voltra/lynx/ios-client'
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/bytedance/github/voltra/voltra-lynx/packages/example-app
pnpm build 2>&1 | tail -20
```

- [ ] **Step 3: Verify no remaining NativeModules references**

```bash
grep -rn "NativeModules" voltra-lynx/packages/example-app/src/ --include='*.ts' --include='*.tsx'
```

Expected: no matches.

- [ ] **Step 4: Commit**

```bash
cd /Users/bytedance/github/voltra
git add voltra-lynx/packages/example-app/src/demos/testing/
git commit -m "refactor: wire Testing demo screens to @use-voltra/lynx/ios-client SDK"
```

---

## Task 9: Remove stale package READMEs

**Files to delete (auto-generated thin READMEs with no useful content):**
- `voltra-lynx/packages/example-app/README.md`

(The old package READMEs for lynx-bridge, lynx-ios-client, lynx-android-client, lynx-native-ios, lynx-native-android were already removed in Task 4.)

- [ ] **Step 1: Remove and commit**

```bash
cd /Users/bytedance/github/voltra
git rm voltra-lynx/packages/example-app/README.md
git commit -m "chore: remove auto-generated READMEs"
```

---

## Task 10: Final verification

- [ ] **Step 1: Full typecheck**

```bash
cd /Users/bytedance/github/voltra/voltra-lynx
pnpm typecheck 2>&1 | tail -20
```

- [ ] **Step 2: Full build**

```bash
cd /Users/bytedance/github/voltra/voltra-lynx
pnpm build 2>&1 | tail -20
```

- [ ] **Step 3: Example-app build**

```bash
cd /Users/bytedance/github/voltra/voltra-lynx/packages/example-app
pnpm build 2>&1 | tail -20
```

- [ ] **Step 4: Verify git is clean**

```bash
cd /Users/bytedance/github/voltra
git status
git diff --stat upstream/main..HEAD | tail -5
```

The diff should be dramatically smaller (no Pods, no generated Xcode files, no old packages).

- [ ] **Step 5: Verify no NativeModules references remain in example-app**

```bash
grep -rn "NativeModules\|declare const NativeModules" voltra-lynx/packages/example-app/src/ --include='*.ts' --include='*.tsx'
```

Expected: no matches.

- [ ] **Step 6: Verify package structure**

```bash
ls voltra-lynx/packages/
```

Expected: `example-app/` and `lynx/` only.

---

## Important Note: Raw JSON vs Variant Objects

Tasks 6-8 have a critical decision point. The current example-app constructs Voltra payloads in `voltra-payload.tsx` using `renderLiveActivityToString()` which returns a **JSON string**. This string is then passed to `NativeModules.VoltraModule.startLiveActivity(jsonString, options, callback)`.

The vendored `startLiveActivity()` from `@use-voltra/lynx/ios-client` expects **variant objects** (JSX), not pre-rendered JSON strings — it calls `renderLiveActivityToString()` internally.

Two approaches:
1. **Use high-level API**: Refactor demo files to pass variant JSX objects instead of pre-rendered strings. The high-level API renders internally. This is the cleanest approach but requires changing how `voltra-payload.tsx` helpers work — they'd return variant objects instead of strings.
2. **Use low-level VoltraModule**: Import `VoltraModule` from `@use-voltra/lynx/ios-client` and call its methods directly with the pre-rendered JSON string. This preserves the current call pattern.

**Recommendation:** Start with approach 2 (minimal change), then optionally refactor to approach 1 later. The agent implementing Tasks 6-8 should read the current code to decide.
