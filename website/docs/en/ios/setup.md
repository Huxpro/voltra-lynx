# iOS Setup

Voltra renders into native iOS Live Activities and Widgets, so you need
an iOS host app that embeds the Lynx SDK and registers Voltra's native
module. The fastest path is to use the
[**reference host**](https://github.com/Huxpro/voltra-lynx/tree/main/voltra-lynx/host/ios)
in the repo. It's a working Xcode project (xcodegen + CocoaPods) with
the module + Widget Extension already wired up.

This page covers two flows:

- **Simulator** with hot reload (Debug build, dev server)
- **Physical iPhone** with an embedded JS bundle (Release build, offline)

## One-shot AI build prompt (simulator)

Drop this into Claude Code, Cursor, or any coding agent. It takes a
fresh clone all the way to a Live Activity rendered on the Simulator.

> Build and launch the Voltra Lynx iOS demo on a booted iOS Simulator.
>
> Repo: `<repo root>`. iOS host: `voltra-lynx/host/ios/LynxVoltra/`.
> JS bundle source: `voltra-lynx/packages/example-app/`.
>
> Prerequisites are documented in `voltra-lynx/host/ios/README.md`
> §Prerequisites. Follow the steps in §Rebuild from clean exactly in
> order. After `xcrun simctl launch …`, screenshot the home screen
> with `xcrun simctl io <sim_id> screenshot ./lynx-app-launch.png`
> and report the file path. The dev server must remain running in the
> background; do not kill it.
>
> Acceptance: the simulator shows the Voltra demo navigation screen
> (not a white screen, not a red error screen), with at least one tap
> producing a real Live Activity in the Dynamic Island.

## Simulator: 7 steps from a clean checkout

```bash
# 1. JS deps for the whole monorepo
cd voltra-lynx && pnpm install

# 2. Start the Lynx dev server in the background
( cd packages/example-app && pnpm dev ) &
curl -sI http://localhost:3000/main.lynx.bundle | head -1   # HTTP/1.1 200

# 3. Regenerate the Xcode project from project.yml
cd host/ios/LynxVoltra
rm -rf LynxVoltra.xcodeproj LynxVoltra.xcworkspace Pods Podfile.lock build
xcodegen generate

# 4. Install Pods (Lynx 3.7.0 + PrimJS 3.7.0)
pod install

# 5. Build for the simulator
SIM_ID=$(xcrun simctl list devices booted | grep -oE '\([A-F0-9-]{36}\)' | tr -d '()' | head -1)
xcodebuild \
  -workspace LynxVoltra.xcworkspace \
  -scheme LynxVoltra \
  -configuration Debug \
  -sdk iphonesimulator \
  -derivedDataPath ./build \
  -destination "platform=iOS Simulator,id=$SIM_ID" \
  build

# 6. Install + launch
APP=./build/Build/Products/Debug-iphonesimulator/LynxVoltra.app
xcrun simctl install "$SIM_ID" "$APP"
xcrun simctl launch  "$SIM_ID" com.voltra.lynx.demo

# 7. Verify
xcrun simctl io "$SIM_ID" screenshot ./lynx-app-launch.png
open ./lynx-app-launch.png
```

The Voltra navigation screen renders: a single-page list of demos (Basic,
Flight Tracker, Music Player, Workout Tracker, Weather Widget, …). Tap
any demo and the SwiftUI Live Activity appears in the Dynamic Island.

## Physical iPhone: Release / embedded bundle

For a real-device demo that runs offline (no dev server, no Mac needed
after install), use a Release build. `ViewController.swift` flips
automatically:

```swift
private static let templateURL: String = {
  #if DEBUG
    return "http://localhost:3000/main.lynx.bundle"  // Simulator/dev
  #else
    return "main.lynx"                                // Release/embedded
  #endif
}()
```

…and `project.yml` declares a pre-build script that, only when
`CONFIGURATION = Release`, runs `pnpm build` in `packages/example-app/`
and copies `dist/main.lynx.bundle` into the .app's resources.

### Phone setup checklist

| Required | How |
|---|---|
| Developer Mode | Settings → Privacy & Security → Developer Mode → ON, reboot |
| Trust this Mac | Plug in cable; tap "Trust" on the phone; enter passcode |
| iPhone unlocked + connected | Lock screen disables device coordination |
| Apple Developer team ID | Xcode → Settings → Accounts. The repo defaults to `ZBB74974C5`; change `DEVELOPMENT_TEAM` in `project.yml` to yours |

```bash
xcrun devicectl list devices
# Look for State = "connected" or "available". If "unavailable", re-plug.
```

### Device build

```bash
cd voltra-lynx/host/ios/LynxVoltra
rm -rf build   # IMPORTANT: clean only build/, keep Pods/

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

:::warning
If you've just built for the simulator, the `iphoneos` build will fail
with `'Lynx/LynxConfig.h' file not found` unless you `rm -rf build/`
first. The Swift bridging-header scanner caches simulator-arch header
maps that collide with the device arch.
:::

### Install on the device

```bash
DEVICE_UDID=$(xcrun devicectl list devices --filter-state connected \
              | grep -oE '[A-F0-9-]{36}' | head -1)
APP=./build/Build/Products/Release-iphoneos/LynxVoltra.app

xcrun devicectl device install app --device "$DEVICE_UDID" "$APP"
xcrun devicectl device process launch --device "$DEVICE_UDID" \
       com.voltra.lynx.demo
```

If `devicectl` reports
`CoreDeviceService was unable to locate a device matching the requested
device identifier`, that's CoreDevice being flaky, typically because
the device runs an iOS version newer than Xcode's bundled DeviceSupport
files (eg. Xcode 26.0 with an iPhone on iOS 26.4.2). Fall back to Xcode
UI:

```bash
open voltra-lynx/host/ios/LynxVoltra/LynxVoltra.xcworkspace
```

In the toolbar select your iPhone, set Edit Scheme → Run → Build
Configuration to **Release**, then Cmd+R. Xcode downloads missing
DeviceSupport on-demand, code-signs, installs, launches.

### Trust the developer cert on first launch

iOS refuses to run an app signed by an unrecognized developer cert
until you trust it once:

> Settings → General → VPN & Device Management →
> **Apple Development: huxpro@gmail.com** → Trust

After that, the app shows on the home screen as **LynxVoltra**. Open
it: the embedded `main.lynx.bundle` loads from `Bundle.main` via
`DemoLynxProvider`. No dev server needed.

### Live Activities / Widgets on a free account

With a **free** Apple Developer account, Live Activities and Home Screen
Widgets work but the provisioning profile expires after **7 days**.
Rebuild + reinstall once a week. With a paid Apple Developer Program
account, signing is permanent.

App Group `group.com.voltra.lynx.demo` (used to share widget data
between the app and its extension) is auto-provisioned by Xcode when
both targets sign with the same team.
