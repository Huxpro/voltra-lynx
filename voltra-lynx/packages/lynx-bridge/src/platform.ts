// Platform Detection Utility — replaces `Platform.OS` from react-native

export type Platform = 'ios' | 'android';

/**
 * Detects the current platform.
 * In Lynx, platform info comes from `lynx.__globalProps.platform` or build-time defines.
 */
export function getPlatform(): Platform {
  // Try lynx.__globalProps (set by host app)
  if (typeof lynx !== 'undefined' && lynx.__globalProps?.platform) {
    return lynx.__globalProps.platform as Platform;
  }

  // Fallback to build-time define (configured in rspeedy/rsbuild)
  if (typeof __PLATFORM__ !== 'undefined') {
    return __PLATFORM__ as Platform;
  }

  // Default fallback
  return 'ios';
}

export function isIOS(): boolean {
  return getPlatform() === 'ios';
}

export function isAndroid(): boolean {
  return getPlatform() === 'android';
}

/**
 * Asserts that the code is running on iOS.
 * Matches original behavior from ios-client/src/utils/assertRunningOnApple.ts:
 * logs error and returns false if on wrong platform.
 */
export function assertRunningOnIOS(): boolean {
  if (!isIOS()) {
    console.error(
      '[Voltra] This API is only supported on iOS. Current platform:',
      getPlatform()
    );
    return false;
  }
  return true;
}

// Ambient type declarations for Lynx globals
declare const lynx: {
  __globalProps: Record<string, any> | null;
} | undefined;

declare const __PLATFORM__: string | undefined;
