// Lynx-specific VoltraModule — replaces Expo's requireNativeModule
import { createIOSModuleAdapter } from '@voltra-lynx/bridge';
import type { VoltraIOSModuleSpec } from '@voltra-lynx/bridge';

// In Lynx, NativeModules is available globally on the background thread
declare const NativeModules: {
  VoltraModule: Record<string, (...args: any[]) => any>;
};

const VoltraModule: VoltraIOSModuleSpec = createIOSModuleAdapter(
  NativeModules.VoltraModule
);

export default VoltraModule;

// Re-export option types for business logic to use
export type { StartVoltraOptions, UpdateVoltraOptions, EndVoltraOptions } from '@voltra-lynx/bridge';
