import { useState, useCallback } from '@lynx-js/react';

// Lynx NativeModules global (available on background thread)
declare const NativeModules: {
  VoltraModule: {
    startLiveActivity: (json: string, options: any, callback: (id: any) => void) => void;
    updateLiveActivity: (id: string, json: string, options: any, callback: (r: any) => void) => void;
    endLiveActivity: (id: string, options: any, callback: (r: any) => void) => void;
    isLiveActivityActive: (name: string, callback: (r: any) => void) => void;
  };
};

// A minimal Voltra JSON payload for a basic Live Activity
// This is what renderLiveActivityToString() would produce
function makeBasicPayload(title: string, subtitle: string) {
  'background only';
  return JSON.stringify({
    v: 1,
    expanded: {
      t: 'VStack',
      p: { alignment: 'center', spacing: 8 },
      c: [
        { t: 'Symbol', p: { name: 'target', color: '#FF3B30' } },
        { t: 'Text', p: { content: title, style: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' } } },
        { t: 'Text', p: { content: subtitle, style: { fontSize: 14, color: '#AAAAAA' } } },
      ],
    },
    compactLeading: { t: 'Symbol', p: { name: 'target', color: '#FF3B30' } },
    compactTrailing: { t: 'Text', p: { content: title, style: { fontSize: 12, color: '#FFFFFF' } } },
  });
}

export function BasicLiveActivityDemo() {
  const [activityId, setActivityId] = useState<string | null>(null);
  const [status, setStatus] = useState('Not started');
  const isActive = activityId !== null;

  const start = useCallback(() => {
    'background only';
    const payload = makeBasicPayload('Live Activity', 'Running...');
    try {
      NativeModules.VoltraModule.startLiveActivity(
        payload,
        { activityName: 'basic-demo' },
        (id: any) => {
          if (id && id !== null) {
            setActivityId(String(id));
            setStatus('Active (id: ' + String(id).substring(0, 8) + '...)');
          } else {
            setStatus('Failed to start');
          }
        }
      );
    } catch (e) {
      setStatus('Error: ' + String(e));
    }
  }, []);

  const update = useCallback(() => {
    'background only';
    if (!activityId) return;
    const payload = makeBasicPayload('Updated!', 'Content changed at ' + new Date().toLocaleTimeString());
    NativeModules.VoltraModule.updateLiveActivity(
      activityId, payload, {},
      () => { setStatus('Updated'); }
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
        Basic Live Activity
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Calls NativeModules.VoltraModule directly. Start → check lock screen.
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
