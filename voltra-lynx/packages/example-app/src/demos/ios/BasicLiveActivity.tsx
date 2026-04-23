import { useState, useCallback } from '@lynx-js/react';
import { VoltraModule } from '@use-voltra/lynx/ios-client';
import { makeBasicLiveActivityPayload } from '../../voltra-payload';

export function BasicLiveActivityDemo() {
  const [activityId, setActivityId] = useState<string | null>(null);
  const [status, setStatus] = useState('Not started');
  const isActive = activityId !== null;

  const start = useCallback(() => {
    'background only';
    const payload = makeBasicLiveActivityPayload();
    VoltraModule.startLiveActivity(payload, { activityName: 'basic-demo' }).then((id) => {
      setActivityId(id);
      setStatus('Active (id: ' + id.substring(0, 8) + '...)');
    }).catch((e: any) => {
      setStatus('Error: ' + (e?.message || String(e)));
    });
  }, []);

  const update = useCallback(() => {
    'background only';
    if (!activityId) return;
    const payload = makeBasicLiveActivityPayload();
    VoltraModule.updateLiveActivity(activityId, payload).then(() => {
      setStatus('Updated');
    }).catch(() => {});
  }, [activityId]);

  const end = useCallback(() => {
    'background only';
    if (!activityId) return;
    VoltraModule.endLiveActivity(activityId, { dismissalPolicy: { type: 'immediate' } }).then(() => {
      setActivityId(null);
      setStatus('Ended');
    }).catch(() => {});
  }, [activityId]);

  return (
    <view style={{ padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
        Basic Live Activity
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Calls VoltraModule directly. Start → check lock screen.
      </text>

      {/* Activity preview */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <text style={{ fontSize: 24, marginRight: 12 }}>🎯</text>
        <view>
          <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Live Activity
          </text>
          <text style={{ color: '#aaa', fontSize: 14 }}>
            {isActive ? 'Running...' : 'Not started'}
          </text>
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
