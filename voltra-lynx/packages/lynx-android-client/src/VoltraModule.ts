// Lynx-specific VoltraModule — replaces Expo's requireNativeModule
import { createAndroidModuleAdapter } from '@voltra-lynx/bridge';
import type { VoltraAndroidModuleSpec } from '@voltra-lynx/bridge';

declare const NativeModules: {
  VoltraModule: Record<string, (...args: any[]) => any>;
};

const VoltraModule: VoltraAndroidModuleSpec = createAndroidModuleAdapter(
  NativeModules.VoltraModule
);

export default VoltraModule;
