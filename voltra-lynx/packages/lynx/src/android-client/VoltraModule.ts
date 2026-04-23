// Lynx-specific VoltraModule — replaces Expo's requireNativeModule
import { createAndroidModuleAdapter } from '../bridge/index.js';
import type { VoltraAndroidModuleSpec } from '../bridge/index.js';

declare const NativeModules: {
  VoltraModule: Record<string, (...args: any[]) => any>;
};

const VoltraModule: VoltraAndroidModuleSpec = createAndroidModuleAdapter(
  NativeModules.VoltraModule
);

export default VoltraModule;
