# Voltra Lynx — Android Host App

The Android reference host for the Voltra Lynx port. Embeds the Lynx engine,
registers `VoltraLynxModule.kt`, and loads the same JS bundle the iOS host
loads — but rendered through Jetpack Compose Glance for widgets and Compose
notifications for live updates.

The bridge layer is shared with iOS — see `../../packages/lynx/src/bridge/`.

---

## One-shot AI build prompt

> Build and install the Voltra Lynx Android demo on a connected device or emulator.
>
> Working tree: `voltra-lynx/host/android/`. JS bundle source:
> `voltra-lynx/packages/example-app/`.
>
> Read `voltra-lynx/host/android/README.md` §Rebuild from clean. Start the
> Lynx dev server (`pnpm dev` in `packages/example-app`) BEFORE
> `./gradlew installDebug` — `LynxView` loads
> `http://10.0.2.2:3000/main.lynx.bundle` from the emulator (host loopback)
> at runtime. Use `adb reverse tcp:3000 tcp:3000` if testing on a physical
> device.
>
> Acceptance: `adb shell am start -n com.voltra.lynx.demo/.SplashActivity`
> followed by `adb exec-out screencap -p > android-app-launch.png` showing
> a non-blank Voltra demo screen.

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Android Studio | Hedgehog (2023.1) or newer | https://developer.android.com/studio |
| Android SDK | API 26 minimum (Glance), API 35 target | via Android Studio SDK Manager |
| JDK | 17 | `brew install --cask temurin` |
| Node.js | 20+ | `brew install node` |
| pnpm | 9+ | `npm i -g pnpm` |
| `adb` | latest | bundled with Android Studio |

A running emulator (API 26+ for Glance widgets) or a connected device with
USB debugging enabled.

```bash
# create local.properties if missing — points Gradle at your SDK
echo "sdk.dir=$HOME/Library/Android/sdk" > local.properties
```

---

## Rebuild from clean

### Step 1 — Install JS deps & start dev server

```bash
cd voltra-lynx
pnpm install
( cd packages/example-app && pnpm dev ) &     # serves http://localhost:3000
```

For an emulator the bundle URL is `http://10.0.2.2:3000/main.lynx.bundle`
(`10.0.2.2` is the emulator's loopback to your Mac). For a physical device:

```bash
adb reverse tcp:3000 tcp:3000
```

### Step 2 — Build + install

```bash
cd voltra-lynx/host/android
./gradlew :app:installDebug
```

First build downloads Gradle 8.x + the Android Gradle Plugin + Lynx SDK
artifacts. Expect 3–10 minutes the first time, sub-30s incrementally.

### Step 3 — Launch + verify

```bash
adb shell am start -n com.voltra.lynx.demo/.SplashActivity
adb exec-out screencap -p > /tmp/android-app-launch.png
open /tmp/android-app-launch.png    # or `xdg-open` on Linux
```

You should see the Voltra demo navigation. Tap Material Colors Widget or
Chart Widget to drop a Glance widget onto the home screen.

---

## What's in this directory

```
host/android/
├── README.md                       ← this file
├── settings.gradle.kts             ← includes :app and :voltra modules
├── build.gradle.kts                ← root plugin versions
├── gradle/libs.versions.toml       ← version catalog
├── app/                            ← demo application
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── res/                    ← launcher icons, splash, theme
│       └── java/com/voltra/lynx/demo/
│           ├── VoltraApplication.kt    ← LynxEnv init + module registration
│           ├── SplashActivity.kt       ← LynxView host
│           └── BuiltinTemplateProvider.kt
└── voltra/                         ← library module — vendored upstream code
    └── src/main/java/voltra/
        ├── VoltraLynxModule.kt         ← Layer 3 — Lynx NativeModule (NEW, 558 LoC)
        ├── widget/                     ← Layer 4 — Glance widget rendering
        ├── glance/                     ← RemoteViews generator + style utils
        ├── notification/               ← live updates + ongoing notifications
        ├── styling/                    ← style parsers and converters
        ├── parsing/                    ← payload parser + decompressor
        ├── models/                     ← payload structures
        └── events/                     ← event bus
```

The `voltra/` Gradle module is a near-byte-identical copy of the upstream
Voltra Android native code (~9,500 LoC across Glance renderers, payload
parsing, image preloading), plus one new file: `VoltraLynxModule.kt`, the
Layer 3 bridge that exposes everything to the Lynx JS runtime.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `SDK location not found` | `local.properties` missing | `echo "sdk.dir=$HOME/Library/Android/sdk" > local.properties` |
| `Failed to install … INSTALL_FAILED_USER_RESTRICTED` | Physical device blocked USB install | Enable "Install via USB" in Developer Options |
| App opens to blank screen | Dev server not reachable from emulator | Verify `http://10.0.2.2:3000/main.lynx.bundle` works in emulator's browser |
| Glance widget renders gray box | App Widget host not yet rebound | Re-add the widget from the launcher's widget picker |
| `compileSdk = 36` warning | Edge SDK | Either install API 36 platform via SDK Manager, or downgrade to `compileSdk = 35` in `app/build.gradle.kts` |

For Lynx-side issues, see [LYNX_PORT.md](../../../LYNX_PORT.md) §"Lynx CSS
Gotchas" and the native module method inventory in `prd-voltra-lynx-android.md`.

---

## Status

This Android port was executed by Ralph Loop following
[`tasks/prd-voltra-lynx-android.md`](../../../tasks/prd-voltra-lynx-android.md).
The JS bridge layer (Layer 2) was already complete from the iOS port, so
Ralph's contribution is the host app scaffold + `VoltraLynxModule.kt` +
end-to-end demo verification.
