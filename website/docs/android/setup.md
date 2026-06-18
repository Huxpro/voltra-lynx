# Android Setup

Voltra renders Widgets and Live Updates through Jetpack Compose Glance,
so you need an Android host app that embeds the Lynx SDK and registers
Voltra's native module. The fastest path is the
[**reference host**](https://github.com/Huxpro/voltra-lynx/tree/main/voltra-lynx/host/android)
— a working Gradle project with the module + Glance widget receiver
already wired up.

## One-shot AI build prompt

> Build and install the Voltra Lynx Android demo on a connected device
> or emulator.
>
> Working tree: `voltra-lynx/host/android/`. JS bundle source:
> `voltra-lynx/packages/example-app/`.
>
> Read `voltra-lynx/host/android/README.md` §Rebuild from clean. Start
> the Lynx dev server (`pnpm dev` in `packages/example-app`) BEFORE
> `./gradlew installDebug` — `LynxView` loads
> `http://10.0.2.2:3000/main.lynx.bundle` from the emulator (host
> loopback) at runtime. Use `adb reverse tcp:3000 tcp:3000` if testing
> on a physical device.
>
> Acceptance: `adb shell am start -n com.voltra.lynx.demo/.SplashActivity`
> followed by `adb exec-out screencap -p > /tmp/android-app-launch.png`
> showing a non-blank Voltra demo screen.

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Android Studio | Hedgehog (2023.1) or newer | https://developer.android.com/studio |
| Android SDK | API 26 minimum (Glance), API 35 target | via Android Studio SDK Manager |
| JDK | 17 | `brew install --cask temurin` |
| Node.js | 20+ | `brew install node` |
| pnpm | 9+ | `npm i -g pnpm` |
| `adb` | latest | bundled with Android Studio |

A running emulator (API 26+ for Glance widgets) or a connected device
with USB debugging enabled.

```bash
# create local.properties if missing — points Gradle at your SDK
echo "sdk.dir=$HOME/Library/Android/sdk" > local.properties
```

## Build + install

```bash
cd voltra-lynx
pnpm install
( cd packages/example-app && pnpm dev ) &     # serves http://localhost:3000

# For an emulator, no extra step is needed — `10.0.2.2` is the loopback.
# For a physical device, forward the port over USB:
adb reverse tcp:3000 tcp:3000

cd host/android
./gradlew :app:installDebug
adb shell am start -n com.voltra.lynx.demo/.SplashActivity
```

First build downloads Gradle 8.x + the Android Gradle Plugin + Lynx SDK
artifacts. Expect 3–10 minutes the first time, sub-30s incrementally.

## Verify

```bash
adb exec-out screencap -p > /tmp/android-app-launch.png
open /tmp/android-app-launch.png    # or xdg-open on Linux
```

You should see the Voltra demo navigation. Tap *Material Colors Widget*
or *Chart Widget* to drop a Glance widget onto the home screen.

## What's in the host

```
host/android/
├── settings.gradle.kts             ← includes :app and :voltra modules
├── build.gradle.kts                ← root plugin versions
├── gradle/libs.versions.toml       ← version catalog
├── app/                            ← demo application
│   └── src/main/
│       └── java/com/voltra/lynx/demo/
│           ├── VoltraApplication.kt    ← LynxEnv init + module registration
│           ├── SplashActivity.kt       ← LynxView host
│           └── BuiltinTemplateProvider.kt
└── voltra/                         ← library module — vendored upstream code
    └── src/main/java/voltra/
        ├── VoltraLynxModule.kt         ← Layer 3 (NEW, 558 LoC)
        ├── widget/                     ← Layer 4 — Glance rendering
        ├── glance/                     ← RemoteViews generator + style utils
        ├── notification/               ← live updates + ongoing notifications
        ├── styling/                    ← style parsers and converters
        └── parsing/                    ← payload parser + decompressor
```

`VoltraLynxModule.kt` is 558 LoC of new code exposing 28
`@LynxMethod`-annotated methods. Everything else under `voltra/` is
byte-identical to the upstream Voltra Android native code.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `SDK location not found` | `local.properties` missing | `echo "sdk.dir=$HOME/Library/Android/sdk" > local.properties` |
| App opens to blank screen | Dev server not reachable from emulator | Verify `http://10.0.2.2:3000/main.lynx.bundle` works in emulator's browser |
| Glance widget renders gray box | App Widget host not yet rebound | Re-add the widget from the launcher's widget picker |
| `compileSdk = 36` warning | Edge SDK | Install API 36 platform, or downgrade to `compileSdk = 35` in `app/build.gradle.kts` |
