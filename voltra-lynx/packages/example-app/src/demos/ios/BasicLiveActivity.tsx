import { useState } from '@lynx-js/react';

// In a real integration, these would import from @voltra-lynx/ios-client
// For now, use mock implementations until native module is connected
const mockUseLiveActivity = () => {
  const [isActive, setIsActive] = useState(false);
  return {
    isActive,
    start: async () => { setIsActive(true); },
    update: async () => {},
    end: async () => { setIsActive(false); },
  };
};

export function BasicLiveActivityDemo() {
  const { isActive, start, update, end } = mockUseLiveActivity();

  return (
    <view style={{ flex: 1, padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Basic Live Activity
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Demonstrates the simplest Live Activity with Start/Update/Stop lifecycle.
      </text>

      {/* Activity preview */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
      }}>
        <view style={{ flexDirection: 'row', alignItems: 'center' }}>
          <text style={{ fontSize: 24, marginRight: 12 }}>🎯</text>
          <view style={{ flex: 1 }}>
            <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
              Live Activity
            </text>
            <text style={{ color: '#aaa', fontSize: 14 }}>
              {isActive ? 'Running...' : 'Not started'}
            </text>
          </view>
        </view>
      </view>

      {/* Controls */}
      <view style={{ gap: 12 }}>
        <view
          bindtap={() => start()}
          style={{
            backgroundColor: isActive ? '#ccc' : '#007AFF',
            padding: 14,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Start Activity
          </text>
        </view>

        <view
          bindtap={() => update()}
          style={{
            backgroundColor: isActive ? '#34C759' : '#ccc',
            padding: 14,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Update Activity
          </text>
        </view>

        <view
          bindtap={() => end()}
          style={{
            backgroundColor: isActive ? '#FF3B30' : '#ccc',
            padding: 14,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Stop Activity
          </text>
        </view>
      </view>

      <text style={{ marginTop: 16, color: '#666', fontSize: 13 }}>
        Status: {isActive ? '🟢 Active' : '⚪ Inactive'}
      </text>
    </view>
  );
}
