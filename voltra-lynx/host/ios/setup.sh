#!/bin/bash
# Setup LynxVoltra iOS host app
# Copies LynxExample from template-assembler, strips unnecessary deps,
# adds Voltra native module, and configures to load our bundle.

set -e

TEMPLATE_DIR="$HOME/byted/template-assembler/Example/darwin/ios/lynx_example"
HOST_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET_DIR="$HOST_DIR/LynxVoltra"

if [ ! -d "$TEMPLATE_DIR" ]; then
  echo "ERROR: template-assembler not found at $TEMPLATE_DIR"
  exit 1
fi

echo "==> Copying LynxExample → LynxVoltra..."
rm -rf "$TARGET_DIR"
cp -R "$TEMPLATE_DIR" "$TARGET_DIR"

echo "==> Renaming project files..."
cd "$TARGET_DIR"

# Rename Xcode project
mv LynxExample.xcodeproj LynxVoltra.xcodeproj
mv LynxExample.xcworkspace LynxVoltra.xcworkspace 2>/dev/null || true

# Rename source directory
mv LynxExample LynxVoltra

# Rename in project.pbxproj
sed -i '' 's/LynxExample/LynxVoltra/g' LynxVoltra.xcodeproj/project.pbxproj
sed -i '' 's/LynxExample/LynxVoltra/g' LynxVoltra.xcworkspace/contents.xcworkspacedata 2>/dev/null || true

# Rename in Podfile
sed -i '' "s/target 'LynxExample'/target 'LynxVoltra'/g" Podfile
sed -i '' "s/'LynxExample'/'LynxVoltra'/g" Podfile
sed -i '' "s/LynxExample.xcodeproj/LynxVoltra.xcodeproj/g" Podfile

# Rename in Info.plist
sed -i '' 's/LynxExample/LynxVoltra/g' LynxVoltra/Info.plist

echo "==> Adding VoltraLynxModule..."
VOLTRA_NATIVE_SRC="$HOST_DIR/../../packages/lynx-native-ios"
cp "$VOLTRA_NATIVE_SRC/VoltraLynxModule.swift" "$TARGET_DIR/LynxVoltra/"
cp "$VOLTRA_NATIVE_SRC/VoltraLynxModuleRegistration.swift" "$TARGET_DIR/LynxVoltra/"

echo "==> Patching LynxInitProcessor to register VoltraModule..."
# Add Voltra module registration to installLynxJSModule
INIT_FILE="$TARGET_DIR/LynxVoltra/LynxInitProcessor.m"
if grep -q "VoltraLynxModule" "$INIT_FILE"; then
  echo "   (already patched)"
else
  sed -i '' '/\[\[LynxEnv sharedInstance\] prepareConfig:defaultConfig\];/i\
  // Register Voltra module\
  [defaultConfig registerModule:NSClassFromString(@"VoltraLynxModule")];
' "$INIT_FILE"
fi

echo "==> Creating default launch config for Voltra bundle..."
cat > "$TARGET_DIR/LynxVoltra/VoltraLaunchConfig.h" << 'EOF'
// Default Voltra bundle URL (Rspeedy dev server)
#define VOLTRA_BUNDLE_URL @"http://localhost:3000/main.lynx.bundle"
EOF

echo "==> Done!"
echo ""
echo "Next steps:"
echo "  1. cd $TARGET_DIR"
echo "  2. pod install  (may need COCOAPODS_LOCAL_SOURCE_REPO set)"
echo "  3. open LynxVoltra.xcworkspace"
echo "  4. In another terminal: cd voltra-lynx/packages/example-app && pnpm dev"
echo "  5. Build & run on Simulator"
echo ""
echo "To load the Voltra bundle, modify the initial URL in AppDelegate or"
echo "DemoViewController to use VOLTRA_BUNDLE_URL."
