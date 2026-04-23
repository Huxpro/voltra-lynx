// Module Adapter — wraps Lynx's callback-based NativeModule into Promise-based interface
import type {
  EventSubscription,
  VoltraIOSModuleSpec,
  VoltraAndroidModuleSpec,
  StartVoltraOptions,
  UpdateVoltraOptions,
  EndVoltraOptions,
  PreloadImageOptions,
  UpdateWidgetOptions,
  WidgetServerCredentials,
  StartAndroidOngoingNotificationOptions,
  UpdateAndroidOngoingNotificationOptions,
} from './types';

/**
 * Raw Lynx NativeModule interface — all async methods take a callback as last param.
 * Sync methods return values directly.
 */
type RawCallbackModule = {
  [method: string]: (...args: any[]) => any;
};

/**
 * Wraps a callback-based native method into a Promise-returning one.
 * Lynx NativeModules use: method(arg1, arg2, ..., callback) where callback(result) is called on completion.
 */
function wrapAsync<T>(
  raw: RawCallbackModule,
  method: string
): (...args: any[]) => Promise<T> {
  return (...args: any[]) =>
    new Promise<T>((resolve) => {
      raw[method]!(...args, resolve);
    });
}

/**
 * Creates an iOS module adapter that conforms to VoltraIOSModuleSpec.
 * Translates Lynx's callback-based NativeModule to Promise-based interface.
 */
export function createIOSModuleAdapter(
  raw: RawCallbackModule
): VoltraIOSModuleSpec {
  return {
    // Async methods — wrap callback → Promise
    startLiveActivity(jsonString: string, options?: StartVoltraOptions) {
      return wrapAsync<string>(raw, 'startLiveActivity')(jsonString, options);
    },
    updateLiveActivity(
      activityId: string,
      jsonString: string,
      options?: UpdateVoltraOptions
    ) {
      return wrapAsync<void>(raw, 'updateLiveActivity')(
        activityId,
        jsonString,
        options
      );
    },
    endLiveActivity(activityId: string, options?: EndVoltraOptions) {
      return wrapAsync<void>(raw, 'endLiveActivity')(activityId, options);
    },
    endAllLiveActivities() {
      return wrapAsync<void>(raw, 'endAllLiveActivities')();
    },
    getLatestVoltraActivityId() {
      return wrapAsync<string | null>(raw, 'getLatestVoltraActivityId')();
    },
    listVoltraActivityIds() {
      return wrapAsync<string[]>(raw, 'listVoltraActivityIds')();
    },
    reloadLiveActivities(activityNames?: string[] | null) {
      return wrapAsync<void>(raw, 'reloadLiveActivities')(activityNames);
    },
    preloadImages(images: PreloadImageOptions[]) {
      return wrapAsync<any>(raw, 'preloadImages')(images);
    },
    clearPreloadedImages(keys?: string[] | null) {
      return wrapAsync<void>(raw, 'clearPreloadedImages')(keys);
    },
    updateWidget(
      widgetId: string,
      jsonString: string,
      options?: UpdateWidgetOptions
    ) {
      return wrapAsync<void>(raw, 'updateWidget')(
        widgetId,
        jsonString,
        options
      );
    },
    scheduleWidget(widgetId: string, timelineJson: string) {
      return wrapAsync<void>(raw, 'scheduleWidget')(widgetId, timelineJson);
    },
    reloadWidgets(widgetIds?: string[] | null) {
      return wrapAsync<void>(raw, 'reloadWidgets')(widgetIds);
    },
    clearWidget(widgetId: string) {
      return wrapAsync<void>(raw, 'clearWidget')(widgetId);
    },
    clearAllWidgets() {
      return wrapAsync<void>(raw, 'clearAllWidgets')();
    },
    getActiveWidgets<T = any>() {
      return wrapAsync<T[]>(raw, 'getActiveWidgets')();
    },
    setWidgetServerCredentials(credentials: WidgetServerCredentials) {
      return wrapAsync<void>(raw, 'setWidgetServerCredentials')(credentials);
    },
    clearWidgetServerCredentials() {
      return wrapAsync<void>(raw, 'clearWidgetServerCredentials')();
    },

    // Sync methods — delegate directly
    isLiveActivityActive(activityName: string): boolean {
      return raw['isLiveActivityActive']!(activityName);
    },
    isHeadless(): boolean {
      return raw['isHeadless']!();
    },

    // Event listener — delegate directly
    addListener(
      event: string,
      listener: (event: any) => void
    ): EventSubscription {
      return raw['addListener']!(event, listener);
    },
  };
}

/**
 * Creates an Android module adapter that conforms to VoltraAndroidModuleSpec.
 * Translates Lynx's callback-based NativeModule to Promise-based interface.
 */
export function createAndroidModuleAdapter(
  raw: RawCallbackModule
): VoltraAndroidModuleSpec {
  return {
    // Async methods
    startAndroidLiveUpdate(
      payload: string,
      options: { updateName?: string; channelId?: string }
    ) {
      return wrapAsync<string>(raw, 'startAndroidLiveUpdate')(payload, options);
    },
    updateAndroidLiveUpdate(notificationId: string, payload: string) {
      return wrapAsync<void>(raw, 'updateAndroidLiveUpdate')(
        notificationId,
        payload
      );
    },
    stopAndroidLiveUpdate(notificationId: string) {
      return wrapAsync<void>(raw, 'stopAndroidLiveUpdate')(notificationId);
    },
    endAllAndroidLiveUpdates() {
      return wrapAsync<void>(raw, 'endAllAndroidLiveUpdates')();
    },
    startAndroidOngoingNotification(
      payload: string,
      options: StartAndroidOngoingNotificationOptions
    ) {
      return wrapAsync<any>(raw, 'startAndroidOngoingNotification')(
        payload,
        options
      );
    },
    upsertAndroidOngoingNotification(
      payload: string,
      options: StartAndroidOngoingNotificationOptions
    ) {
      return wrapAsync<any>(raw, 'upsertAndroidOngoingNotification')(
        payload,
        options
      );
    },
    updateAndroidOngoingNotification(
      notificationId: string,
      payload: string,
      options?: UpdateAndroidOngoingNotificationOptions
    ) {
      return wrapAsync<any>(raw, 'updateAndroidOngoingNotification')(
        notificationId,
        payload,
        options
      );
    },
    stopAndroidOngoingNotification(notificationId: string) {
      return wrapAsync<any>(raw, 'stopAndroidOngoingNotification')(
        notificationId
      );
    },
    endAllAndroidOngoingNotifications() {
      return wrapAsync<void>(raw, 'endAllAndroidOngoingNotifications')();
    },
    openAndroidNotificationSettings() {
      return wrapAsync<void>(raw, 'openAndroidNotificationSettings')();
    },
    updateAndroidWidget(
      widgetId: string,
      jsonString: string,
      options?: { deepLinkUrl?: string }
    ) {
      return wrapAsync<void>(raw, 'updateAndroidWidget')(
        widgetId,
        jsonString,
        options
      );
    },
    reloadAndroidWidgets(widgetIds?: string[] | null) {
      return wrapAsync<void>(raw, 'reloadAndroidWidgets')(widgetIds);
    },
    clearAndroidWidget(widgetId: string) {
      return wrapAsync<void>(raw, 'clearAndroidWidget')(widgetId);
    },
    clearAllAndroidWidgets() {
      return wrapAsync<void>(raw, 'clearAllAndroidWidgets')();
    },
    requestPinGlanceAppWidget(
      widgetId: string,
      options?: { previewWidth?: number; previewHeight?: number }
    ) {
      return wrapAsync<boolean>(raw, 'requestPinGlanceAppWidget')(
        widgetId,
        options
      );
    },
    preloadImages(images: PreloadImageOptions[]) {
      return wrapAsync<any>(raw, 'preloadImages')(images);
    },
    clearPreloadedImages(keys?: string[] | null) {
      return wrapAsync<void>(raw, 'clearPreloadedImages')(keys);
    },
    setWidgetServerCredentials(credentials: WidgetServerCredentials) {
      return wrapAsync<void>(raw, 'setWidgetServerCredentials')(credentials);
    },
    clearWidgetServerCredentials() {
      return wrapAsync<void>(raw, 'clearWidgetServerCredentials')();
    },
    getActiveWidgets<T = any>() {
      return wrapAsync<T[]>(raw, 'getActiveWidgets')();
    },

    // Sync methods
    isAndroidLiveUpdateActive(updateName: string): boolean {
      return raw['isAndroidLiveUpdateActive']!(updateName);
    },
    isAndroidOngoingNotificationActive(notificationId: string): boolean {
      return raw['isAndroidOngoingNotificationActive']!(notificationId);
    },
    getAndroidOngoingNotificationStatus(notificationId: string) {
      return raw['getAndroidOngoingNotificationStatus']!(notificationId);
    },
    canPostPromotedAndroidNotifications(): boolean {
      return raw['canPostPromotedAndroidNotifications']!();
    },
    getAndroidOngoingNotificationCapabilities() {
      return raw['getAndroidOngoingNotificationCapabilities']!();
    },

    // Event listener
    addListener(
      event: string,
      listener: (event: any) => void
    ): EventSubscription {
      return raw['addListener']!(event, listener);
    },
  };
}
