import { useState, useEffect } from '@lynx-js/react';

export function ProgressIndicatorsScreen() {
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 1));
    }, 50);

    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <view style={{ flex: 1, padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Progress Indicators
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Various progress bar styles and configurations.
      </text>

      {/* Standard progress bar */}
      <view style={{ marginBottom: 24 }}>
        <text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Standard ({progress}%)</text>
        <view style={{ height: 8, backgroundColor: '#e5e5e5', borderRadius: 4 }}>
          <view style={{
            width: `${progress}%`,
            height: 8,
            backgroundColor: '#007AFF',
            borderRadius: 4,
          }} />
        </view>
      </view>

      {/* Thin progress bar */}
      <view style={{ marginBottom: 24 }}>
        <text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Thin</text>
        <view style={{ height: 3, backgroundColor: '#e5e5e5', borderRadius: 2 }}>
          <view style={{
            width: `${progress}%`,
            height: 3,
            backgroundColor: '#34C759',
            borderRadius: 2,
          }} />
        </view>
      </view>

      {/* Thick progress bar */}
      <view style={{ marginBottom: 24 }}>
        <text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Thick</text>
        <view style={{ height: 16, backgroundColor: '#e5e5e5', borderRadius: 8 }}>
          <view style={{
            width: `${progress}%`,
            height: 16,
            backgroundColor: '#FF9500',
            borderRadius: 8,
          }} />
        </view>
      </view>

      {/* Segmented progress */}
      <view style={{ marginBottom: 24 }}>
        <text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Segmented (5 steps)</text>
        <view style={{ flexDirection: 'row', gap: 4 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <view
              key={`seg-${i}`}
              style={{
                flex: 1,
                height: 8,
                backgroundColor: progress >= (i + 1) * 20 ? '#5856D6' : '#e5e5e5',
                borderRadius: 4,
              }}
            />
          ))}
        </view>
      </view>

      {/* Gradient-like progress (multi-color stops) */}
      <view style={{ marginBottom: 24 }}>
        <text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Multi-color</text>
        <view style={{ height: 8, backgroundColor: '#e5e5e5', borderRadius: 4, flexDirection: 'row', overflow: 'hidden' }}>
          <view style={{
            width: `${Math.min(progress, 33)}%`,
            height: 8,
            backgroundColor: '#FF3B30',
          }} />
          <view style={{
            width: `${Math.max(0, Math.min(progress - 33, 34))}%`,
            height: 8,
            backgroundColor: '#FF9500',
          }} />
          <view style={{
            width: `${Math.max(0, progress - 67)}%`,
            height: 8,
            backgroundColor: '#34C759',
          }} />
        </view>
      </view>

      {/* Circular-like indicator (simplified) */}
      <view style={{ marginBottom: 24 }}>
        <text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Circular (text)</text>
        <view style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          borderWidth: 6,
          borderColor: '#e5e5e5',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <text style={{ fontSize: 18, fontWeight: 'bold', color: '#007AFF' }}>
            {progress}%
          </text>
        </view>
      </view>

      {/* Toggle animation */}
      <view
        bindtap={() => setIsAnimating(!isAnimating)}
        style={{
          backgroundColor: isAnimating ? '#FF3B30' : '#34C759',
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
          {isAnimating ? 'Pause Animation' : 'Resume Animation'}
        </text>
      </view>
    </view>
  );
}
