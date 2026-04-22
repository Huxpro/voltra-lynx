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

// Component type IDs (from ComponentTypeID.swift)
const T = {
  TEXT: 0, BUTTON: 1, LABEL: 2, IMAGE: 3, SYMBOL: 4,
  TOGGLE: 5, LINEAR_PROGRESS: 6, CIRCULAR_PROGRESS: 7,
  GAUGE: 8, TIMER: 9, LINEAR_GRADIENT: 10,
  V_STACK: 11, H_STACK: 12, Z_STACK: 13,
  GROUP_BOX: 14, GLASS_CONTAINER: 15, SPACER: 16, DIVIDER: 17,
};

// Region JSON keys (from VoltraRegion.swift)
// ls, isl_exp_c, isl_exp_l, isl_exp_t, isl_exp_b, isl_cmp_l, isl_cmp_t, isl_min

function makeBasicPayload(title: string, subtitle: string) {
  'background only';
  return JSON.stringify({
    v: 1,
    // Lock screen
    ls: {
      t: T.V_STACK, p: { alignment: 'center', spacing: 8 },
      c: [
        { t: T.SYMBOL, p: { name: 'target', color: '#FF3B30' } },
        { t: T.TEXT, c: title, p: { fontSize: 16, fontWeight: 'bold', foregroundColor: '#FFFFFF' } },
        { t: T.TEXT, c: subtitle, p: { fontSize: 14, foregroundColor: '#AAAAAA' } },
      ],
    },
    // Dynamic Island compact
    isl_cmp_l: { t: T.SYMBOL, p: { name: 'target', color: '#FF3B30' } },
    isl_cmp_t: { t: T.TEXT, c: title, p: { fontSize: 12, foregroundColor: '#FFFFFF' } },
    // Dynamic Island expanded
    isl_exp_c: {
      t: T.V_STACK, p: { alignment: 'center', spacing: 4 },
      c: [
        { t: T.TEXT, c: title, p: { fontSize: 18, fontWeight: 'bold', foregroundColor: '#FFFFFF' } },
        { t: T.TEXT, c: subtitle, p: { fontSize: 14, foregroundColor: '#AAAAAA' } },
      ],
    },
    isl_exp_l: { t: T.SYMBOL, p: { name: 'target', color: '#FF3B30', fontSize: 24 } },
    // Minimal
    isl_min: { t: T.SYMBOL, p: { name: 'target', color: '#FF3B30' } },
  });
}

export function BasicLiveActivityDemo() {
  const [activityId, setActivityId] = useState<string | null>(null);
  const [status, setStatus] = useState('Not started');
  const isActive = activityId !== null;

  const start = useCallback(() => {
    'background only';
    // Debug: check if NativeModules exists
    if (typeof NativeModules === 'undefined') {
      setStatus('Error: NativeModules is undefined');
      return;
    }
    if (!NativeModules.VoltraModule) {
      setStatus('Error: NativeModules.VoltraModule not found. Available: ' + Object.keys(NativeModules).join(', '));
      return;
    }
    if (typeof NativeModules.VoltraModule.startLiveActivity !== 'function') {
      setStatus('Error: startLiveActivity is not a function. Type: ' + typeof NativeModules.VoltraModule.startLiveActivity);
      return;
    }

    const payload = makeBasicPayload('Live Activity', 'Running...');
    try {
      NativeModules.VoltraModule.startLiveActivity(
        payload,
        { activityName: 'basic-demo' },
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
