import { useState, useEffect } from '@lynx-js/react';

const cardinalDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

function getCardinal(degrees: number): string {
  const index = Math.round(degrees / 45) % 8;
  return cardinalDirections[index];
}

export function CompassActivity() {
  const [heading, setHeading] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setHeading((h) => (h + 3 + Math.random() * 4) % 360);
    }, 200);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const cardinal = getCardinal(heading);
  const displayDegrees = Math.round(heading);

  return (
    <view style={{ flex: 1, padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Compass Activity
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Live Activity displaying compass heading with simulated rotation.
      </text>

      {/* Compass card */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        alignItems: 'center',
      }}>
        {/* Compass ring */}
        <view style={{
          width: 200,
          height: 200,
          borderRadius: 100,
          borderWidth: 3,
          borderColor: '#333',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}>
          {/* Cardinal labels */}
          <view style={{ position: 'absolute', top: 12 }}>
            <text style={{ color: heading >= 350 || heading < 10 ? '#FF3B30' : '#888', fontSize: 16, fontWeight: 'bold' }}>N</text>
          </view>
          <view style={{ position: 'absolute', bottom: 12 }}>
            <text style={{ color: heading >= 170 && heading < 190 ? '#007AFF' : '#888', fontSize: 16 }}>S</text>
          </view>
          <view style={{ position: 'absolute', right: 12 }}>
            <text style={{ color: heading >= 80 && heading < 100 ? '#007AFF' : '#888', fontSize: 16 }}>E</text>
          </view>
          <view style={{ position: 'absolute', left: 12 }}>
            <text style={{ color: heading >= 260 && heading < 280 ? '#007AFF' : '#888', fontSize: 16 }}>W</text>
          </view>

          {/* Center display */}
          <view style={{ alignItems: 'center' }}>
            <text style={{ color: '#fff', fontSize: 42, fontWeight: 'bold' }}>
              {displayDegrees}°
            </text>
            <text style={{ color: '#007AFF', fontSize: 20, fontWeight: '600', marginTop: 4 }}>
              {cardinal}
            </text>
          </view>
        </view>

        {/* Heading bar */}
        <view style={{
          width: '100%',
          height: 4,
          backgroundColor: '#333',
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <view style={{
            width: `${(heading / 360) * 100}%`,
            height: 4,
            backgroundColor: '#007AFF',
            borderRadius: 2,
          }} />
        </view>
        <text style={{ color: '#666', fontSize: 12, marginTop: 8 }}>
          {displayDegrees}° / 360°
        </text>
      </view>

      {/* Controls */}
      <view
        bindtap={() => setIsSimulating(!isSimulating)}
        style={{
          backgroundColor: isSimulating ? '#FF9500' : '#007AFF',
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
          {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
        </text>
      </view>

      <view
        bindtap={() => setHeading(0)}
        style={{
          backgroundColor: '#333',
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
          Reset to North
        </text>
      </view>
    </view>
  );
}
