// Unit test for module adapter
import { createIOSModuleAdapter, createAndroidModuleAdapter } from '../module-adapter';

// Mock raw NativeModule (callback-based)
function createMockRawModule() {
  return {
    startLiveActivity: (json: string, options: any, callback: (result: string) => void) => {
      callback('activity-id-123');
    },
    isLiveActivityActive: (name: string) => true,
    isHeadless: () => false,
    addListener: (event: string, listener: (e: any) => void) => ({ remove: () => {} }),
    endAllLiveActivities: (callback: () => void) => callback(),
    getLatestVoltraActivityId: (callback: (id: string | null) => void) => callback('latest-id'),
    listVoltraActivityIds: (callback: (ids: string[]) => void) => callback(['id1', 'id2']),
    // Android methods
    startAndroidLiveUpdate: (payload: string, options: any, callback: (id: string) => void) => {
      callback('notif-id-456');
    },
    isAndroidLiveUpdateActive: (name: string) => false,
    isAndroidOngoingNotificationActive: (id: string) => true,
    getAndroidOngoingNotificationStatus: (id: string) => ({
      isActive: true,
      isDismissed: false,
    }),
    canPostPromotedAndroidNotifications: () => true,
    getAndroidOngoingNotificationCapabilities: () => ({
      apiLevel: 34,
      notificationsEnabled: true,
      supportsPromotedNotifications: true,
      canPostPromotedNotifications: true,
      canRequestPromotedOngoing: true,
    }),
  };
}

async function runTests() {
  const raw = createMockRawModule();

  // Test iOS adapter
  const ios = createIOSModuleAdapter(raw as any);

  // Async method test
  const activityId = await ios.startLiveActivity('{"test":true}', { activityName: 'test' });
  console.assert(activityId === 'activity-id-123', 'startLiveActivity should resolve with id');

  // Sync method test
  const isActive = ios.isLiveActivityActive('test');
  console.assert(isActive === true, 'isLiveActivityActive should return true');

  const isHeadless = ios.isHeadless();
  console.assert(isHeadless === false, 'isHeadless should return false');

  // Test Android adapter
  const android = createAndroidModuleAdapter(raw as any);

  const notifId = await android.startAndroidLiveUpdate('{}', { channelId: 'ch1' });
  console.assert(notifId === 'notif-id-456', 'startAndroidLiveUpdate should resolve with id');

  const androidActive = android.isAndroidLiveUpdateActive('test');
  console.assert(androidActive === false, 'isAndroidLiveUpdateActive should return false');

  const caps = android.getAndroidOngoingNotificationCapabilities();
  console.assert(caps.apiLevel === 34, 'capabilities should return correct apiLevel');

  console.log('All module-adapter tests passed!');
}

runTests().catch(console.error);
