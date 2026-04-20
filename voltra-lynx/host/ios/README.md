# LynxVoltra Host App (iOS)

## Quick Setup

```bash
# 1. Run setup script (copies & patches LynxExample from template-assembler)
./setup.sh

# 2. Install pods
cd LynxVoltra
pod install

# 3. Open in Xcode
open LynxVoltra.xcworkspace

# 4. Start the Voltra Lynx dev server (in another terminal)
cd ../../packages/example-app
pnpm dev

# 5. Build & Run on iOS Simulator (Xcode)
```

## What the setup script does

1. Copies `~/byted/template-assembler/Example/darwin/ios/lynx_example/` → `./LynxVoltra/`
2. Renames all references from LynxExample → LynxVoltra
3. Adds `VoltraLynxModule.swift` and `VoltraLynxModuleRegistration.swift`
4. Patches `LynxInitProcessor.m` to register the Voltra module
5. Creates `VoltraLaunchConfig.h` with default bundle URL

## Minimal Podfile

If the full Podfile has too many deps, replace it with `Podfile.minimal` which only
includes the core Lynx engine + basic elements (no video, effects, maps, etc.).

## Connecting to Rspeedy dev server

The Rspeedy dev server (`pnpm dev`) serves the bundle at:
```
http://localhost:3000/main.lynx.bundle
```

In the app, change the launch URL in `DemoViewController` or `AppDelegate` to this URL.
Alternatively, use the DevTool QR code scanning feature built into LynxExample.

## Architecture

```
LynxVoltra (iOS host)
    ↓ registers
VoltraLynxModule.swift
    ↓ delegates to
VoltraModuleImpl (shared Voltra native code)
    ↓ uses
ActivityKit / WidgetKit / SwiftUI

JS side:
Rspeedy bundle → ReactLynx → NativeModules.VoltraModule → VoltraLynxModule
```
