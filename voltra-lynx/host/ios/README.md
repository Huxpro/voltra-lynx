# LynxVoltra — iOS Host App

The iOS reference host for the Voltra Lynx port. Embeds the Lynx engine
(`pod 'Lynx', '3.7.0'`), registers `VoltraLynxModule`, and loads a Lynx JS
bundle that exercises every Voltra capability — Live Activities, Dynamic Island,
home-screen Widgets, in-app `<voltra-preview>` Custom Elements.

---

## One-shot AI build prompt

Paste this into Claude Code, Cursor, or any coding agent. The agent should be
able to take a fresh clone all the way to a Live Activity rendered on the
iOS Simulator without further input.

> Build and launch the Voltra Lynx iOS demo on a booted iOS Simulator.
>
> Repo: `<repo root>`. iOS host: `voltra-lynx/host/ios/LynxVoltra/`.
> JS bundle source: `voltra-lynx/packages/example-app/`.
>
> Prerequisites are documented in `voltra-lynx/host/ios/README.md` §Prerequisites.
> Follow the steps in §Rebuild from clean exactly in order. After
> `xcrun simctl launch …`, screenshot the home screen with
> `xcrun simctl io <sim_id> screenshot ./lynx-app-launch.png` and report the
> file path. If any step fails, do not skip ahead — diagnose and fix the
> specific error, then resume from that step. The dev server must remain
> running in the background for the Lynx bundle to load; do not kill it.
>
> Final acceptance: the simulator shows the Voltra demo navigation screen
> (not a white screen, not a red error screen), with at least one tap producing
> a real Live Activity in the Dynamic Island.

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| macOS | 14+ | — |
| Xcode | 16.0+ | App Store |
| iOS Simulator | iOS 17+ runtime (for Live Activities) | Xcode Settings → Platforms |
| Homebrew | latest | https://brew.sh |
| `xcodegen` | 2.40+ | `brew install xcodegen` |
| CocoaPods | 1.15+ | `brew install cocoapods` (or `gem install cocoapods`) |
| Node.js | 20+ | `brew install node` |
| pnpm | 9+ | `npm i -g pnpm` |

**Booted simulator required.** Boot one before building:

```bash
xcrun simctl list devices booted              # check
xcrun simctl boot "iPhone 17 Pro"             # boot one (name from `simctl list devices`)
open -a Simulator                              # show the window
```

Capture the device UDID — every `simctl` command below uses it:

```bash
SIM_ID=$(xcrun simctl list devices booted | grep -oE '\([A-F0-9-]{36}\)' | tr -d '()' | head -1)
echo "$SIM_ID"
```

---

## Rebuild from clean

Run these from the repository root. Each command is independent and idempotent
unless noted.

### Step 1 — Install JS dependencies

```bash
cd voltra-lynx
pnpm install
```

`pnpm-workspace.yaml` covers `packages/*`, so this installs every workspace
(bridge, ios-client, android-client, example-app) in one shot.

### Step 2 — Start the Lynx dev server (background)

```bash
cd voltra-lynx/packages/example-app
pnpm dev &                # rspeedy dev, serves at http://localhost:3000
```

Verify it's up:

```bash
curl -sI http://localhost:3000/main.lynx.bundle | head -1
# HTTP/1.1 200 OK
```

The bundle URL is hard-coded in `ViewController.swift` — leave the server
running for the lifetime of the simulator session.

### Step 3 — Regenerate the Xcode project

```bash
cd voltra-lynx/host/ios/LynxVoltra
rm -rf LynxVoltra.xcodeproj LynxVoltra.xcworkspace Pods Podfile.lock build
xcodegen generate         # reads project.yml, writes LynxVoltra.xcodeproj
```

The repo deliberately does not check in the `.xcodeproj` — every build starts
from `project.yml`. This keeps the diff surface tiny and the Widget Extension
embedding deterministic.

### Step 4 — Install Pods

```bash
pod install               # ~2-5 min first run, downloads Lynx + PrimJS
```

This produces `LynxVoltra.xcworkspace` — **always open that, never
`LynxVoltra.xcodeproj` directly.** Building the bare project skips Pods.

### Step 5 — Build for the simulator

```bash
xcodebuild \
  -workspace LynxVoltra.xcworkspace \
  -scheme LynxVoltra \
  -configuration Debug \
  -sdk iphonesimulator \
  -derivedDataPath ./build \
  -destination "platform=iOS Simulator,id=$SIM_ID" \
  build
```

On success the .app lands at:

```
./build/Build/Products/Debug-iphonesimulator/LynxVoltra.app
```

### Step 6 — Install + launch

```bash
APP=./build/Build/Products/Debug-iphonesimulator/LynxVoltra.app
xcrun simctl install  "$SIM_ID" "$APP"
xcrun simctl launch   "$SIM_ID" com.voltra.lynx.demo
```

The app boots, fetches `main.lynx.bundle` from the dev server, and renders
the demo navigation screen.

### Step 7 — Verify

```bash
xcrun simctl io "$SIM_ID" screenshot ./lynx-app-launch.png
open ./lynx-app-launch.png
```

You should see the **Voltra** navigation screen (single-page list of demos:
Basic, Flight Tracker, Music Player, Workout Tracker, Weather Widget, …).
Tap any demo → the SwiftUI Live Activity appears in the Dynamic Island.

---

## What's in this directory

```
host/ios/
├── README.md                       ← this file
└── LynxVoltra/
    ├── project.yml                 ← xcodegen spec (the source of truth)
    ├── Podfile                     ← Lynx 3.7.0 + PrimJS 3.7.0
    ├── LynxVoltra/
    │   ├── AppDelegate.swift       ← LynxEnv setup + module registration
    │   ├── ViewController.swift    ← LynxView, loads bundle from localhost:3000
    │   ├── DemoLynxProvider.swift  ← fallback bundle provider
    │   ├── Info.plist              ← NSSupportsLiveActivities, font registration
    │   ├── LynxVoltra.entitlements ← App Groups for widget data sharing
    │   ├── VoltraWidgetExtension.entitlements
    │   ├── Assets.xcassets/        ← shared with widget extension
    │   ├── Fonts/                  ← Merriweather (required by demos)
    │   └── Voltra/                 ← VoltraLynxModule.swift + the entire
    │                                  upstream SwiftUI rendering engine
    │                                  (shared subspec, vendored unchanged)
    └── (Pods/, *.xcodeproj/, *.xcworkspace/, build/ — all gitignored)
```

The `Voltra/` subdirectory is the byte-identical copy of the upstream Voltra
iOS native code — 10,000+ lines of SwiftUI, ActivityKit, WidgetKit, payload
parsing, image preloading. See [LYNX_PORT.md](../../../LYNX_PORT.md) §Layer 4
for the architecture.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `xcodegen: command not found` | Not installed | `brew install xcodegen` |
| `pod install` hangs on "Updating spec repo" | Stale CocoaPods CDN cache | `pod repo update`, retry |
| Build error: `LynxServiceAPI.h not found` | `inhibit_all_warnings!` masked an earlier failure | Check the Podfile `post_install` hook still sets `HEADER_SEARCH_PATHS` for `LynxServiceAPI` |
| App launches but shows blank white screen | Dev server not running, or bundle URL unreachable from sim | Confirm `curl http://localhost:3000/main.lynx.bundle` returns 200 |
| App launches but shows red Lynx error overlay | JS bundle compiled with an error | Read the overlay (or `xcrun simctl spawn $SIM_ID log stream --predicate 'subsystem == "com.voltra.lynx.demo"'`); fix in `packages/example-app/src/` and rspeedy will hot-reload |
| `LynxVoltra.app` is empty (no Info.plist) | xcodebuild silently exited 0 with no warnings about scheme not found | Re-run `pod install` and rebuild — usually a stale `derivedDataPath` issue |
| Live Activity doesn't appear in Dynamic Island | Simulator runtime < iOS 16.2, or `NSSupportsLiveActivities` missing | Boot a 17+ simulator; verify `Info.plist` |
| Tap on demo crashes with "Activity not authorized" | First-run permission prompt was dismissed | Settings → Voltra Lynx Demo → Allow Live Activities |

For deeper Lynx-side issues, see [LYNX_PORT.md](../../../LYNX_PORT.md)
§"Lynx CSS Gotchas" and §"LynxModule Protocol (Swift)".

---

## What `xcodegen` does for us

We don't commit the `.xcodeproj`. Instead, `project.yml` is the source of
truth:

- Two targets: `LynxVoltra` (the app) and `VoltraWidgetExtension` (the
  Live Activity / widget extension), with the latter embedded into the former.
- `SWIFT_OBJC_BRIDGING_HEADER`, code-sign entitlements, INFOPLIST paths, and
  per-target deployment targets are all declarative.
- `SWIFT_ACTIVE_COMPILATION_CONDITIONS: WIDGET_EXTENSION` is set on the
  extension target so the shared Voltra Swift code can `#if WIDGET_EXTENSION`
  on a few platform-only APIs.

This means **regenerating after a `project.yml` edit is one command**, and
the diff is auditable. Changes to the project structure can't sneak in via
a 50KB `project.pbxproj` blob.
