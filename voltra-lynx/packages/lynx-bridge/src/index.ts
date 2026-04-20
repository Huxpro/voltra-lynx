// @voltra-lynx/bridge — Adapter layer for Lynx NativeModule
// Translates between Expo module patterns and Lynx NativeModule patterns

export { createIOSModuleAdapter, createAndroidModuleAdapter } from './module-adapter';
export { createEventAdapter } from './event-adapter';
export type { LynxGlobalEventEmitter, VoltraEventAdapter } from './event-adapter';
export { getPlatform, isIOS, isAndroid, assertRunningOnIOS } from './platform';
export type { Platform } from './platform';

// Re-export all types
export type {
  EventSubscription,
  PreloadImageOptions,
  PreloadImageFailure,
  PreloadImagesResult,
  UpdateWidgetOptions,
  WidgetServerCredentials,
  StartVoltraOptions,
  UpdateVoltraOptions,
  EndVoltraOptions,
  VoltraIOSModuleSpec,
  AndroidOngoingNotificationFallbackBehavior,
  StartAndroidOngoingNotificationOptions,
  UpdateAndroidOngoingNotificationOptions,
  VoltraAndroidModuleSpec,
  BasicVoltraEvent,
  VoltraActivityState,
  VoltraActivityTokenReceivedEvent,
  VoltraActivityPushToStartTokenReceivedEvent,
  VoltraActivityUpdateEvent,
  VoltraInteractionEvent,
  VoltraEventMap,
} from './types';
