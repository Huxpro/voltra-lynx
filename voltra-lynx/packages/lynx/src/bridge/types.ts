// Bridge type definitions — shared contract between JS adapter and native code
// These mirror the original Voltra module specs but are framework-agnostic

// ─── Shared Types ───────────────────────────────────────────────────────────

export type EventSubscription = {
  remove: () => void;
};

export type PreloadImageOptions = {
  url: string;
  key: string;
  method?: 'GET' | 'POST' | 'PUT';
  headers?: Record<string, string>;
};

export type PreloadImageFailure = {
  key: string;
  error: string;
};

export type PreloadImagesResult = {
  succeeded: string[];
  failed: PreloadImageFailure[];
};

export type UpdateWidgetOptions = {
  deepLinkUrl?: string;
};

export type WidgetServerCredentials = {
  token: string;
  headers?: Record<string, string>;
};

// ─── iOS Module Spec ────────────────────────────────────────────────────────

export type StartVoltraOptions = {
  target?: string;
  deepLinkUrl?: string;
  activityName?: string;
  staleDate?: number;
  relevanceScore?: number;
  channelId?: string;
};

export type UpdateVoltraOptions = {
  staleDate?: number;
  relevanceScore?: number;
};

export type EndVoltraOptions = {
  dismissalPolicy?: {
    type: 'immediate' | 'after';
    date?: number;
  };
};

export interface VoltraIOSModuleSpec {
  startLiveActivity(
    jsonString: string,
    options?: StartVoltraOptions
  ): Promise<string>;
  updateLiveActivity(
    activityId: string,
    jsonString: string,
    options?: UpdateVoltraOptions
  ): Promise<void>;
  endLiveActivity(
    activityId: string,
    options?: EndVoltraOptions
  ): Promise<void>;
  endAllLiveActivities(): Promise<void>;
  getLatestVoltraActivityId(): Promise<string | null>;
  listVoltraActivityIds(): Promise<string[]>;
  isLiveActivityActive(activityName: string): boolean;
  isHeadless(): boolean;
  preloadImages(images: PreloadImageOptions[]): Promise<PreloadImagesResult>;
  reloadLiveActivities(activityNames?: string[] | null): Promise<void>;
  clearPreloadedImages(keys?: string[] | null): Promise<void>;
  updateWidget(
    widgetId: string,
    jsonString: string,
    options?: UpdateWidgetOptions
  ): Promise<void>;
  scheduleWidget(widgetId: string, timelineJson: string): Promise<void>;
  reloadWidgets(widgetIds?: string[] | null): Promise<void>;
  clearWidget(widgetId: string): Promise<void>;
  clearAllWidgets(): Promise<void>;
  getActiveWidgets<T = any>(): Promise<T[]>;
  setWidgetServerCredentials(
    credentials: WidgetServerCredentials
  ): Promise<void>;
  clearWidgetServerCredentials(): Promise<void>;
  addListener(
    event: string,
    listener: (event: any) => void
  ): EventSubscription;
}

// ─── Android Module Spec ────────────────────────────────────────────────────

export type AndroidOngoingNotificationFallbackBehavior = 'standard' | 'error';

export type StartAndroidOngoingNotificationOptions = {
  notificationId?: string;
  channelId: string;
  smallIcon?: string;
  deepLinkUrl?: string;
  requestPromotedOngoing?: boolean;
  fallbackBehavior?: AndroidOngoingNotificationFallbackBehavior;
};

export type UpdateAndroidOngoingNotificationOptions = Omit<
  Partial<StartAndroidOngoingNotificationOptions>,
  'notificationId'
>;

export interface VoltraAndroidModuleSpec {
  startAndroidLiveUpdate(
    payload: string,
    options: { updateName?: string; channelId?: string }
  ): Promise<string>;
  updateAndroidLiveUpdate(
    notificationId: string,
    payload: string
  ): Promise<void>;
  stopAndroidLiveUpdate(notificationId: string): Promise<void>;
  isAndroidLiveUpdateActive(updateName: string): boolean;
  endAllAndroidLiveUpdates(): Promise<void>;
  startAndroidOngoingNotification(
    payload: string,
    options: StartAndroidOngoingNotificationOptions
  ): Promise<{
    ok: boolean;
    notificationId: string;
    action?: 'started';
    reason?: 'already_exists';
  }>;
  upsertAndroidOngoingNotification(
    payload: string,
    options: StartAndroidOngoingNotificationOptions
  ): Promise<{
    ok: boolean;
    notificationId: string;
    action?: 'started' | 'updated';
    reason?: 'already_exists' | 'dismissed';
  }>;
  updateAndroidOngoingNotification(
    notificationId: string,
    payload: string,
    options?: UpdateAndroidOngoingNotificationOptions
  ): Promise<{
    ok: boolean;
    notificationId: string;
    action?: 'updated';
    reason?: 'dismissed' | 'not_found';
  }>;
  stopAndroidOngoingNotification(notificationId: string): Promise<{
    ok: boolean;
    notificationId: string;
    action?: 'stopped';
    reason?: 'not_found';
  }>;
  isAndroidOngoingNotificationActive(notificationId: string): boolean;
  getAndroidOngoingNotificationStatus(notificationId: string): {
    isActive: boolean;
    isDismissed: boolean;
    isPromoted?: boolean;
    hasPromotableCharacteristics?: boolean;
  };
  endAllAndroidOngoingNotifications(): Promise<void>;
  canPostPromotedAndroidNotifications(): boolean;
  getAndroidOngoingNotificationCapabilities(): {
    apiLevel: number;
    notificationsEnabled: boolean;
    supportsPromotedNotifications: boolean;
    canPostPromotedNotifications: boolean;
    canRequestPromotedOngoing: boolean;
  };
  openAndroidNotificationSettings(): Promise<void>;
  updateAndroidWidget(
    widgetId: string,
    jsonString: string,
    options?: { deepLinkUrl?: string }
  ): Promise<void>;
  reloadAndroidWidgets(widgetIds?: string[] | null): Promise<void>;
  clearAndroidWidget(widgetId: string): Promise<void>;
  clearAllAndroidWidgets(): Promise<void>;
  requestPinGlanceAppWidget(
    widgetId: string,
    options?: { previewWidth?: number; previewHeight?: number }
  ): Promise<boolean>;
  preloadImages(images: PreloadImageOptions[]): Promise<PreloadImagesResult>;
  clearPreloadedImages(keys?: string[] | null): Promise<void>;
  setWidgetServerCredentials(
    credentials: WidgetServerCredentials
  ): Promise<void>;
  clearWidgetServerCredentials(): Promise<void>;
  getActiveWidgets<T = any>(): Promise<T[]>;
  addListener(
    event: string,
    listener: (event: any) => void
  ): EventSubscription;
}

// ─── Event Types ────────────────────────────────────────────────────────────

export type BasicVoltraEvent = {
  source: string;
  timestamp: number;
};

export type VoltraActivityState =
  | 'active'
  | 'dismissed'
  | 'pending'
  | 'stale'
  | 'ended'
  | string;

export type VoltraActivityTokenReceivedEvent = BasicVoltraEvent & {
  type: 'activityTokenReceived';
  activityName: string;
  pushToken: string;
};

export type VoltraActivityPushToStartTokenReceivedEvent = BasicVoltraEvent & {
  type: 'activityPushToStartTokenReceived';
  pushToStartToken: string;
};

export type VoltraActivityUpdateEvent = BasicVoltraEvent & {
  type: 'stateChange';
  activityName: string;
  activityState: VoltraActivityState;
};

export type VoltraInteractionEvent = BasicVoltraEvent & {
  type: 'interaction';
  identifier: string;
  payload: string;
};

export type VoltraEventMap = {
  activityTokenReceived: VoltraActivityTokenReceivedEvent;
  activityPushToStartTokenReceived: VoltraActivityPushToStartTokenReceivedEvent;
  stateChange: VoltraActivityUpdateEvent;
  interaction: VoltraInteractionEvent;
};
