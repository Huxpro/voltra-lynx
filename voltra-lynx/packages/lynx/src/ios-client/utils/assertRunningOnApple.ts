// Lynx-specific platform assertion — replaces react-native Platform.OS check
import { assertRunningOnIOS } from '../../bridge/index.js'

export const assertRunningOnApple = assertRunningOnIOS
