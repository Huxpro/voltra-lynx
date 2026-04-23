import { useState, useCallback } from '@lynx-js/react';
import { VoltraModule } from '@use-voltra/lynx/ios-client';
import { makeLiquidGlassPayload } from '../../voltra-payload';

export function LiquidGlassActivity() {
  const [activityId, setActivityId] = useState<string | null>(null);
  const [status, setStatus] = useState('Not started');
  const isActive = activityId !== null;

  const start = useCallback(() => {
    'background only';
    const payload = makeLiquidGlassPayload();
    VoltraModule.startLiveActivity(payload, { activityName: 'liquid-glass', deepLinkUrl: '/voltraui/glass' }).then((id) => {
      setActivityId(id);
      setStatus('Active (id: ' + id.substring(0, 8) + '...)');
    }).catch((e: any) => {
      setStatus('Error: ' + (e?.message || String(e)));
    });
  }, []);

  const update = useCallback(() => {
    'background only';
    if (!activityId) return;
    const payload = makeLiquidGlassPayload();
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
        Liquid Glass Live Activity
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        iOS 26 glass container effect with activityBackgroundTint set to 'clear'. Uses Voltra.GlassContainer and glassEffect for the frosted-glass look on the lock screen.
      </text>

      {/* Activity preview */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        alignItems: 'center',
      }}>
        <view style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 24,
          padding: 20,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.2)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <text style={{ color: '#F8FAFC', fontSize: 20, fontWeight: '700' }}>Voltra</text>
          <text style={{ color: '#FF0000', fontSize: 24, marginLeft: 8, marginRight: 8 }}>*</text>
          <text style={{ color: '#F8FAFC', fontSize: 20, fontWeight: '700' }}>liquid glass</text>
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
