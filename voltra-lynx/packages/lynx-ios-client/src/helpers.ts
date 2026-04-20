import { isIOS, getPlatform } from '@voltra-lynx/bridge'

import VoltraModule from './VoltraModule.js'

export function isGlassSupported(): boolean {
  if (!isIOS()) return false
  // In Lynx, OS version detection may require native module call.
  // For now, assume iOS 26+ support if on iOS (matches original logic pattern)
  return false
}

export function isHeadless(): boolean {
  if (!isIOS()) return false
  return VoltraModule.isHeadless?.() ?? false
}
