# LynxVoltra · iOS Host App

The iOS reference host for the Voltra Lynx port. Embeds the Lynx engine
(`pod 'Lynx', '3.7.0'`), registers `VoltraLynxModule`, and loads a Lynx JS
bundle that exercises every Voltra capability: Live Activities, Dynamic
Island, home-screen Widgets, in-app `<voltra-preview>` Custom Elements.

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
> file path. If any step fails, do not skip ahead. Diagnose and fix the
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
| macOS | 14+ | n/a |
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

Capture the device UDID; every `simctl` command below uses it:

```bash
SIM_ID=$(xcrun simctl list devices booted | grep -oE '\([A-F0-9-]{36}\)' | tr -d '()' | head -1)
echo "$SIM_ID"
```

---

## Rebuild from clean

Run these from the repository root. Each command is independent and idempotent
unless noted.

### Step 1. Install JS dependencies

```bash
cd voltra-lynx
pnpm install
```

`pnpm-workspace.yaml` covers `packages/*`, so this installs every workspace
(bridge, ios-client, android-client, example-app) in one shot.

### Step 2. Start the Lynx dev server (background)

```bash
cd voltra-lynx/packages/example-app
pnpm dev &                # rspeedy dev, serves at http://localhost:3000
```

Verify it's up:

```bash
curl -sI http://localhost:3000/main.lynx.bundle | head -1
# HTTP/1.1 200 OK
```

The bundle URL is hard-coded in `ViewController.swift`. Leave the server
running for the lifetime of the simulator session.

### Step 3. Regenerate the Xcode project

```bash
cd voltra-lynx/host/ios/LynxVoltra
rm -rf LynxVoltra.xcodeproj LynxVoltra.xcworkspace Pods Podfile.lock build
xcodegen generate         # reads project.yml, writes LynxVoltra.xcodeproj
```

The repo deliberately does not check in the `.xcodeproj`; every build starts
from `project.yml`. This keeps the diff surface tiny and the Widget Extension
embedding deterministic.

### Step 4. Install Pods

```bash
pod install               # ~2-5 min first run, downloads Lynx + PrimJS
```

This produces `LynxVoltra.xcworkspace`. **Always open that, never
`LynxVoltra.xcodeproj` directly.** Building the bare project skips Pods.

### Step 5. Build for the simulator

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

### Step 6. Install + launch

```bash
APP=./build/Build/Products/Debug-iphonesimulator/LynxVoltra.app
xcrun simctl install  "$SIM_ID" "$APP"
xcrun simctl launch   "$SIM_ID" com.voltra.lynx.demo
```

The app boots, fetches `main.lynx.bundle` from the dev server, and renders
the demo navigation screen.

### Step 7. Verify

```bash
xcrun simctl io "$SIM_ID" screenshot ./lynx-app-launch.png
open ./lynx-app-launch.png
```

You should see the **Voltra** navigation screen (single-page list of demos:
Basic, Flight Tracker, Music Player, Workout Tracker, Weather Widget, …).
Tap any demo to make the SwiftUI Live Activity appear in the Dynamic Island.

---

## Install on a physical iPhone (Release / embedded bundle)

The Simulator SOP above keeps the JS bundle on a dev server. For a real
device demo (installed once, runs offline, no Mac needed afterwards) use
a Release build. `ViewController.swift` flips automatically:

```swift
private static let templateURL: String = {
  #if DEBUG
    return "http://localhost:3000/main.lynx.bundle"  // Simulator/dev
  #else
    return "main.lynx"                                // Release/embedded
  #endif
}()
```

…and the `project.yml` declares a pre-build script that, only when
`CONFIGURATION = Release`, runs `pnpm build` in `packages/example-app/`
and copies `dist/main.lynx.bundle` into the .app's resources.

### One-shot AI build prompt (device)

> Build and install the Voltra Lynx iOS demo on a connected, paired iPhone
> in Release configuration so the .app is self-contained.
>
> Working tree: `voltra-lynx/host/ios/LynxVoltra/`. Bundle ID
> `com.voltra.lynx.demo`, widget extension `…demo.widget`. Signing is
> configured automatically via `DEVELOPMENT_TEAM` in `project.yml`. Change
> that team ID to yours before running.
>
> Steps: (1) confirm the iPhone shows up in `xcrun devicectl list devices`
> as `available`; if not, walk the user through the §Phone setup checklist
> (Developer Mode + Trust + cable). (2) regen project from clean per
> §Rebuild from clean steps 3 and 4 (xcodegen, pod install). (3) run the
> §Device build xcodebuild command. (4) install via `xcrun devicectl device
> install app …` if it works, OR fall back to opening the workspace in
> Xcode and asking the user to Cmd+R with the device selected. (5) verify
> the app launches and shows the Voltra home screen (no dev server running).
>
> First device launch requires Trust on the phone: Settings → General →
> VPN & Device Management → trust the developer cert. Walk the user
> through this if needed.

### Phone setup checklist

| Required | How |
|---|---|
| Developer Mode | Settings → Privacy & Security → Developer Mode → ON, then reboot |
| Trust this Mac | Plug in cable; tap "Trust" when the phone prompts; enter passcode |
| iPhone unlocked + connected | Lock screen disables device-coordination |
| Apple Developer team ID | Get yours from Xcode → Settings → Accounts (10 chars). The repo defaults to `ZBB74974C5` (huxpro@gmail.com's personal team); change `DEVELOPMENT_TEAM` in `project.yml` to yours before building. |

Verify the phone is connected and trusted:

```bash
xcrun devicectl list devices
# Look for State = "available"; if it's "unavailable", re-plug + re-trust.
```

### Device build

```bash
cd voltra-lynx/host/ios/LynxVoltra

# Clean only the build dir (don't nuke Pods between SDKs; keep them)
rm -rf build

xcodebuild \
  -workspace LynxVoltra.xcworkspace \
  -scheme LynxVoltra \
  -configuration Release \
  -sdk iphoneos \
  -derivedDataPath ./build \
  -destination "generic/platform=iOS" \
  -allowProvisioningUpdates \
  build
```

⚠️ **If you've just built for the simulator, the `iphoneos` build will fail
with `'Lynx/LynxConfig.h' file not found` unless you `rm -rf build/` first.**
The Swift bridging-header scanner caches simulator-arch header maps that
collide with the device arch. Keep `Pods/` and `*.xcodeproj/`; only the
build artifacts need to be cleaned between SDK switches.

The .app lands at:

```
./build/Build/Products/Release-iphoneos/LynxVoltra.app
```

### Install on the device

Two paths; try the CLI first:

```bash
DEVICE_UDID=$(xcrun devicectl list devices --filter-state available \
              | grep -oE '[A-F0-9-]{36}' | head -1)
APP=./build/Build/Products/Release-iphoneos/LynxVoltra.app

xcrun devicectl device install app --device "$DEVICE_UDID" "$APP"
xcrun devicectl device process launch --device "$DEVICE_UDID" \
       com.voltra.lynx.demo
```

If `devicectl` reports
`CoreDeviceService was unable to locate a device matching the requested
device identifier`, that's CoreDevice being flaky (commonly happens when
the device runs an iOS version newer than Xcode's bundled DeviceSupport
files, eg. Xcode 26.0 with iPhone on iOS 26.4.2). Fall back to Xcode:

```bash
open voltra-lynx/host/ios/LynxVoltra/LynxVoltra.xcworkspace
```

In the Xcode toolbar select your iPhone as the run destination, set
Edit Scheme → Run → Build Configuration to **Release**, then Cmd+R.
Xcode will download missing DeviceSupport files on-demand, code-sign,
install, and launch, all in one click.

### First launch on the device

iOS will refuse to run an app signed by an unrecognized developer cert
until you trust it once:

**Settings → General → VPN & Device Management → "Apple Development:
huxpro@gmail.com" → Trust "Apple Development: …" → Enter passcode**

After that, the Voltra app shows on the home screen as **LynxVoltra**.
Open it: the embedded `main.lynx.bundle` loads from
`Bundle.main.path(forResource:"main.lynx", ofType:"bundle")` via
`DemoLynxProvider`. No dev server needed.

### Live Activity / Widget on a personal team

With a **free** Apple developer account (no $99/year), Live Activities
and Home Screen Widgets work but the provisioning profile expires after
**7 days**. You'll have to rebuild + reinstall once a week. With a paid
Apple Developer Program account, signing is permanent.

App Group `group.com.voltra.lynx.demo` (used to share widget data between
the app and its extension) is auto-provisioned by Xcode when both targets
sign with the same team.

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
    └── (Pods/, *.xcodeproj/, *.xcworkspace/, build/ all gitignored)
```

The `Voltra/` subdirectory is the byte-identical copy of the upstream Voltra
iOS native code: 10,000+ lines of SwiftUI, ActivityKit, WidgetKit, payload
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
| `LynxVoltra.app` is empty (no Info.plist) | xcodebuild silently exited 0 with no warnings about scheme not found | Re-run `pod install` and rebuild; usually a stale `derivedDataPath` issue |
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
