// Lynx-specific platform assertion — replaces react-native Platform.OS check
import { assertRunningOnIOS } from '@voltra-lynx/bridge'

export const assertRunningOnApple = assertRunningOnIOS
