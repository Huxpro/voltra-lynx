import { useState } from '@lynx-js/react';

export function VoltraWidgetLogo() {
  const [lastUpdated, setLastUpdated] = useState<string>('Never');
  const [updateCount, setUpdateCount] = useState(0);

  const handleUpdate = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setLastUpdated(timeStr);
    setUpdateCount((c) => c + 1);
  };

  return (
    <view style={{ flex: 1, padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Voltra Widget Logo
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Simple logo widget demo with manual update trigger.
      </text>

      {/* Widget preview */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        alignItems: 'center',
      }}>
        {/* Logo placeholder */}
        <view style={{
          width: 100,
          height: 100,
          backgroundColor: '#6C63FF',
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}>
          <text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>V</text>
        </view>

        <text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
          Voltra
        </text>
        <text style={{ color: '#aaa', fontSize: 13 }}>
          Cross-platform Widgets
        </text>

        {/* Update info */}
        <view style={{
          marginTop: 16,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: '#333',
          width: '100%',
          alignItems: 'center',
        }}>
          <text style={{ color: '#666', fontSize: 11 }}>Last updated: {lastUpdated}</text>
          <text style={{ color: '#666', fontSize: 11, marginTop: 2 }}>Updates: {updateCount}</text>
        </view>
      </view>

      {/* Update button */}
      <view
        bindtap={handleUpdate}
        style={{
          backgroundColor: '#6C63FF',
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
          Update Widget
        </text>
      </view>

      <text style={{ color: '#999', fontSize: 12 }}>
        On Android, widget updates are triggered via AppWidgetManager.updateAppWidget().
        This demo simulates the update cycle.
      </text>
    </view>
  );
}
