# voltra-lynx — Voltra for LynxJS

A port of [Voltra](https://github.com/callstackincubator/voltra) — the React JSX
library for iOS Live Activities, Dynamic Island, and Android Widgets — to
[LynxJS](https://lynxjs.org/).

The fundamental constraint: Live Activities and Widgets render in out-of-process
OS extensions that only accept SwiftUI / Compose Glance. The JS framework's job
is to produce a JSON payload; native code turns that payload into pixels. So
**the rendering engine doesn't care which JS runtime fed it the JSON** — and
this port reuses ~96% of the upstream codebase by reducing every Expo↔Lynx
ABI difference to a single ~660-LoC bridge adapter.

See [LYNX_PORT.md](../LYNX_PORT.md) for the full architecture, layer model,
and translation rules.

---

## One-shot AI build prompt

Paste this into Claude Code, Cursor, or any coding agent. The agent should
take a fresh clone all the way to a Voltra demo rendered on the iOS Simulator.

> Build and launch the Voltra Lynx demo on a booted iOS Simulator.
>
> Repo root: this directory's parent. Working tree: `voltra-lynx/`.
>
> Read `voltra-lynx/host/ios/README.md` for the exact iOS rebuild sequence and
> prerequisites. Follow that document's §Rebuild from clean steps in order.
> Do not skip the dev server step — `LynxView` fetches the JS bundle from
> `http://localhost:3000/main.lynx.bundle` at runtime.
>
> After `xcrun simctl launch` succeeds, take a screenshot to
> `./lynx-app-launch.png` and report the path. Acceptance: a non-blank,
> non-error UI showing the Voltra demo navigation.
>
> If a step fails, diagnose using the §Troubleshooting table in the iOS
> README before improvising. The Lynx CSS gotchas and LynxModule Swift
> protocol notes in `LYNX_PORT.md` cover the most common runtime issues.

---

## Repository layout

```
voltra-lynx/
├── README.md                      ← you are here
├── package.json                   ← monorepo root (typescript + tsc --build)
├── pnpm-workspace.yaml
│
├── packages/
│   ├── lynx/                      ← @use-voltra/lynx — single umbrella package
│   │   └── src/
│   │       ├── bridge/            ← Layer 2 · adapter (~660 LoC, the seam)
│   │       │   ├── module-adapter.ts   ← Promise⇄callback wrapper
│   │       │   ├── event-adapter.ts    ← GlobalEventEmitter shim
│   │       │   ├── platform.ts         ← iOS/Android detection
│   │       │   └── types.ts            ← module spec interfaces
│   │       ├── ios-client/        ← Layer 1 · iOS client (vendored from upstream)
│   │       └── android-client/    ← Layer 1 · Android client (vendored)
│   │
│   ├── lynx-bridge/               ← (legacy intermediate package, kept for compat)
│   ├── lynx-ios-client/
│   ├── lynx-android-client/
│   │
│   └── example-app/               ← the Lynx JS app the host loads
│       ├── rspeedy.config.ts
│       └── src/
│           ├── App.tsx
│           ├── demos/
│           │   ├── ios/           ← 10 Live Activity / widget demos
│           │   ├── android/       ← 5 Glance / notification demos
│           │   └── testing/       ← 14 Testing Grounds screens
│           └── components/        ← <voltra-preview>, <voltra-widget-preview>
│
└── host/
    ├── ios/
    │   ├── README.md              ← iOS rebuild SOP — start here for iOS
    │   └── LynxVoltra/
    │       ├── project.yml        ← xcodegen spec (regenerates .xcodeproj)
    │       ├── Podfile            ← Lynx 3.7.0 + PrimJS 3.7.0
    │       └── LynxVoltra/        ← Swift sources + Voltra/ (vendored)
    │
    └── android/
        ├── README.md              ← Android rebuild SOP
        └── app/, voltra/          ← Gradle modules
```

---

## Quick start

### iOS

See [`host/ios/README.md`](host/ios/README.md). Five minutes from scratch:

```bash
# in this directory:
pnpm install
( cd packages/example-app && pnpm dev ) &        # JS bundle server
cd host/ios/LynxVoltra
xcodegen generate && pod install
xcodebuild -workspace LynxVoltra.xcworkspace -scheme LynxVoltra \
  -configuration Debug -sdk iphonesimulator -derivedDataPath ./build \
  -destination "platform=iOS Simulator,id=$(xcrun simctl list devices booted | grep -oE '\([A-F0-9-]{36}\)' | tr -d '()' | head -1)" \
  build
xcrun simctl install booted ./build/Build/Products/Debug-iphonesimulator/LynxVoltra.app
xcrun simctl launch booted com.voltra.lynx.demo
```

### Android

See [`host/android/README.md`](host/android/README.md).

```bash
# JS bundle source is the same example app:
pnpm install
( cd packages/example-app && pnpm dev ) &
cd host/android
./gradlew :app:installDebug
adb shell am start -n com.voltra.lynx.demo/.SplashActivity
```

---

## What got built vs what got reused

The headline number is **95.6%** — that fraction of the codebase came in
unchanged from the upstream React Native library. The 1,440 LoC that *is*
new in this directory is the adapter that lets the rest work.

| Layer | What | Original (RN) | Lynx Port | Reuse |
|---|---|---:|---:|---|
| L0 | Pure JS — `@use-voltra/core, /ios, /android, /server` | 5,734 | 0 (npm) | 100% |
| L0/1 | Voltra umbrella — renderer, JSX, payload | 4,452 | 0 (npm) | 100% |
| L1 | Client business logic — hooks, widget-api, live-activity | 1,616 | 1,241 (vendored) | ~95% |
| **L2** | **Bridge adapter (NEW)** | 0 | **662** | NEW |
| **L3** | **Native module registration (NEW)** | 919 | **788** | rewrite |
| L4 | SwiftUI + Glance rendering engine | 19,776 | 19,783 | 100% |
| **TOTAL** | | **32,497** | 1,440 NEW + 21,024 reused | **95.6%** |

The deck `presentation/` (not in this repo) walks through each layer with
before/after code snippets.

---

## Development workflow

1. **Edit JS** in `packages/example-app/src/` — `rspeedy dev` hot-reloads
   into the running app.
2. **Edit bridge / client** in `packages/lynx/src/` — run `pnpm build` from
   the root to recompile, then refresh the bundle.
3. **Edit Swift / Kotlin** in `host/ios/LynxVoltra/Voltra/` or
   `host/android/voltra/` — rebuild the native host. Native edits are rare
   because Layer 4 is vendored unchanged from upstream.
4. **Test on simulator** — both hosts boot in <30s. The dev server stays up
   across rebuilds.

---

## Key references

- [`LYNX_PORT.md`](../LYNX_PORT.md) — Architecture, layer model, translation
  tables, Lynx CSS gotchas, LynxModule Swift protocol notes.
- [`tasks/prd-voltra-lynx-android.md`](../tasks/prd-voltra-lynx-android.md) —
  Android port PRD (~28 user stories, executed via Ralph Loop).
- [`tasks/prd-lynx-voltra-preview-screens.md`](../tasks/prd-lynx-voltra-preview-screens.md)
  — `<voltra-preview>` Custom Element conversion PRD.
- Upstream: https://github.com/callstackincubator/voltra
- This fork: https://github.com/Huxpro/voltra-lynx

---

## License

MIT, matching upstream Voltra.
