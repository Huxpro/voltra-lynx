import { useState, useCallback } from '@lynx-js/react';
import { VoltraModule } from '@use-voltra/lynx/ios-client';
import { makeSupplementalPayload } from '../../voltra-payload';

export function SupplementalFamiliesDemo() {
  const [activityId, setActivityId] = useState<string | null>(null);
  const [status, setStatus] = useState('Not started');
  const isActive = activityId !== null;

  const start = useCallback(() => {
    'background only';
    const payload = makeSupplementalPayload();
    VoltraModule.startLiveActivity(payload, { activityName: 'supplemental-families-demo', deepLinkUrl: '/voltraui/supplemental-families-demo' }).then((id) => {
      setActivityId(id);
      setStatus('Active (id: ' + id.substring(0, 8) + '...)');
    }).catch((e: any) => {
      setStatus('Error: ' + (e?.message || String(e)));
    });
  }, []);

  const update = useCallback(() => {
    'background only';
    if (!activityId) return;
    const payload = makeSupplementalPayload();
    VoltraModule.updateLiveActivity(activityId, payload).then(() => {
      setStatus('Updated at ' + new Date().toLocaleTimeString());
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
        Supplemental Families
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Live Activity with supplementalActivityFamilies.small for watchOS Smart Stack and CarPlay. Shows a simplified "Watch" view alongside the lock screen and Dynamic Island regions.
      </text>

      {/* Activity preview - lock screen */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
      }}>
        <text style={{ color: '#94A3B8', fontSize: 11, marginBottom: 6 }}>Lock Screen</text>
        <text style={{ color: '#F0F9FF', fontSize: 24, fontWeight: '700' }}>Lock Screen</text>
      </view>

      {/* Activity preview - supplemental small */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
      }}>
        <text style={{ color: '#94A3B8', fontSize: 11, marginBottom: 6 }}>Supplemental Small (watchOS)</text>
        <text style={{ color: '#3B82F6', fontSize: 16, fontWeight: '700' }}>Watch</text>
        <text style={{ color: '#94A3B8', fontSize: 11, marginTop: 2 }}>watchOS / CarPlay</text>
      </view>

      {/* Activity preview - island compact */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <text style={{ color: '#94A3B8', fontSize: 11 }}>Compact:</text>
        <text style={{ color: '#10B981', fontSize: 14, fontWeight: '700' }}>L</text>
        <text style={{ color: '#666', fontSize: 12 }}>---</text>
        <text style={{ color: '#10B981', fontSize: 14, fontWeight: '700' }}>R</text>
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
