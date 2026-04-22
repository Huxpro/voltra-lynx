import { useState, useCallback } from '@lynx-js/react';
import { makeDeepLinksPayload } from '../../voltra-payload';

declare const NativeModules: {
  VoltraModule: {
    startLiveActivity: (json: string, options: any, callback: (id: any) => void) => void;
    updateLiveActivity: (id: string, json: string, options: any, callback: (r: any) => void) => void;
    endLiveActivity: (id: string, options: any, callback: (r: any) => void) => void;
  };
};

export function DeepLinksActivity() {
  const [activityId, setActivityId] = useState<string | null>(null);
  const [status, setStatus] = useState('Not started');
  const isActive = activityId !== null;

  const start = useCallback(() => {
    'background only';
    if (typeof NativeModules === 'undefined') {
      setStatus('Error: NativeModules is undefined');
      return;
    }
    if (!NativeModules.VoltraModule) {
      setStatus('Error: VoltraModule not found');
      return;
    }

    const payload = makeDeepLinksPayload();
    try {
      NativeModules.VoltraModule.startLiveActivity(
        payload,
        { activityName: 'deep-links', deepLinkUrl: '/voltraui/deep-links' },
        (id: any) => {
          const result = String(id);
          if (result.startsWith('ERROR:')) {
            setStatus('Native error: ' + result.substring(6));
          } else if (id && id !== null && result !== 'null') {
            setActivityId(result);
            setStatus('Active (id: ' + result.substring(0, 8) + '...)');
          } else {
            setStatus('Callback returned null');
          }
        }
      );
    } catch (e: any) {
      setStatus('Catch: ' + (e?.message || String(e)));
    }
  }, []);

  const update = useCallback(() => {
    'background only';
    if (!activityId) return;
    const payload = makeDeepLinksPayload();
    NativeModules.VoltraModule.updateLiveActivity(
      activityId, payload, {},
      () => { setStatus('Updated at ' + new Date().toLocaleTimeString()); }
    );
  }, [activityId]);

  const end = useCallback(() => {
    'background only';
    if (!activityId) return;
    NativeModules.VoltraModule.endLiveActivity(
      activityId, { dismissalPolicy: { type: 'immediate' } },
      () => {
        setActivityId(null);
        setStatus('Ended');
      }
    );
  }, [activityId]);

  return (
    <view style={{ padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
        Deep Links Live Activity
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Live Activity with tappable Link components that open deep link URLs (myapp://orders/123, /settings). Uses a blue keyline tint on the Dynamic Island.
      </text>

      {/* Activity preview */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
      }}>
        <view style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <view style={{
            backgroundColor: '#F59E0B',
            width: 28, height: 28, borderRadius: 6,
            alignItems: 'center', justifyContent: 'center', marginRight: 10,
          }}>
            <text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>B</text>
          </view>
          <view>
            <text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Order #123</text>
            <text style={{ color: '#94A3B8', fontSize: 11 }}>Tap to view details</text>
          </view>
        </view>
        <view style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <view style={{
            backgroundColor: '#8B5CF6',
            width: 28, height: 28, borderRadius: 6,
            alignItems: 'center', justifyContent: 'center', marginRight: 10,
          }}>
            <text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>S</text>
          </view>
          <view>
            <text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Settings</text>
            <text style={{ color: '#94A3B8', fontSize: 11 }}>Manage preferences</text>
          </view>
        </view>
      </view>

      {/* Controls */}
      <view
        bindtap={start}
        style={{
          backgroundColor: isActive ? '#ccc' : '#007AFF',
          padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 8,
        }}
      >
        <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Start Activity</text>
      </view>

      <view
        bindtap={update}
        style={{
          backgroundColor: isActive ? '#34C759' : '#ccc',
          padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 8,
        }}
      >
        <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Update Activity</text>
      </view>

      <view
        bindtap={end}
        style={{
          backgroundColor: isActive ? '#FF3B30' : '#ccc',
          padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 8,
        }}
      >
        <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Stop Activity</text>
      </view>

      <text style={{ marginTop: 12, color: '#666', fontSize: 13 }}>
        Status: {status}
      </text>
    </view>
  );
}
