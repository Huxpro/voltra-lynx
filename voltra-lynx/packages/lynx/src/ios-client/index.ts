// @voltra-lynx/ios-client — iOS client APIs for Lynx

// Bridge files (Lynx-specific)
export { default as VoltraModule } from './VoltraModule.js'
export type { StartVoltraOptions, UpdateVoltraOptions, EndVoltraOptions } from './VoltraModule.js'
export { addVoltraListener } from './events.js'
export type {
  BasicVoltraEvent,
  VoltraActivityState,
  VoltraActivityTokenReceivedEvent,
  VoltraActivityPushToStartTokenReceivedEvent,
  VoltraActivityUpdateEvent,
  VoltraInteractionEvent,
  VoltraEventMap,
} from './events.js'
export { assertRunningOnApple } from './utils/assertRunningOnApple.js'

// Vendored business logic
export {
  useLiveActivity,
  startLiveActivity,
  updateLiveActivity,
  stopLiveActivity,
  isLiveActivityActive,
  endAllLiveActivities,
} from './live-activity/api.js'
export type {
  SharedLiveActivityOptions,
  StartLiveActivityOptions,
  UpdateLiveActivityOptions,
  EndLiveActivityOptions,
  UseLiveActivityOptions,
  UseLiveActivityResult,
} from './live-activity/api.js'

export {
  updateWidget,
  reloadWidgets,
  clearWidget,
  clearAllWidgets,
  scheduleWidget,
  getActiveWidgets,
} from './widgets/widget-api.js'
export type { UpdateWidgetOptions, ScheduledWidgetEntry, WidgetInfo } from './widgets/widget-api.js'

export { setWidgetServerCredentials, clearWidgetServerCredentials } from './widgets/server-credentials.js'
export type { WidgetServerCredentials } from './widgets/server-credentials.js'

export { preloadImages, reloadLiveActivities, clearPreloadedImages } from './preload.js'
export type { PreloadImageOptions, PreloadImagesResult } from './preload.js'

export { isGlassSupported, isHeadless } from './helpers.js'
