import { useState, useEffect } from '@lynx-js/react';

export function WorkoutTrackerActivity() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [heartRate, setHeartRate] = useState(72);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
      setHeartRate(120 + Math.floor(Math.random() * 40));
      setDistance((d) => d + 0.002 + Math.random() * 0.003);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const pace = distance > 0 ? ((elapsedSeconds / 60) / distance).toFixed(1) : '0.0';

  const reset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setHeartRate(72);
    setDistance(0);
  };

  return (
    <view style={{ flex: 1, padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Workout Tracker Activity
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Live Activity with real-time workout metrics updating every second.
      </text>

      {/* Activity card */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
      }}>
        {/* Elapsed time */}
        <view style={{ alignItems: 'center', marginBottom: 20 }}>
          <text style={{ color: '#666', fontSize: 12 }}>ELAPSED TIME</text>
          <text style={{ color: '#fff', fontSize: 40, fontWeight: 'bold', fontFamily: 'monospace' }}>
            {formatTime(elapsedSeconds)}
          </text>
        </view>

        {/* Metrics grid */}
        <view style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          {/* Heart rate */}
          <view style={{ alignItems: 'center' }}>
            <text style={{ color: '#FF3B30', fontSize: 12 }}>BPM</text>
            <text style={{ color: '#FF3B30', fontSize: 28, fontWeight: 'bold' }}>
              {heartRate}
            </text>
            <text style={{ color: '#666', fontSize: 11 }}>Heart Rate</text>
          </view>

          {/* Distance */}
          <view style={{ alignItems: 'center' }}>
            <text style={{ color: '#34C759', fontSize: 12 }}>KM</text>
            <text style={{ color: '#34C759', fontSize: 28, fontWeight: 'bold' }}>
              {distance.toFixed(2)}
            </text>
            <text style={{ color: '#666', fontSize: 11 }}>Distance</text>
          </view>

          {/* Pace */}
          <view style={{ alignItems: 'center' }}>
            <text style={{ color: '#007AFF', fontSize: 12 }}>MIN/KM</text>
            <text style={{ color: '#007AFF', fontSize: 28, fontWeight: 'bold' }}>
              {pace}
            </text>
            <text style={{ color: '#666', fontSize: 11 }}>Pace</text>
          </view>
        </view>
      </view>

      {/* Controls */}
      <view style={{ flexDirection: 'row', gap: 12 }}>
        <view
          bindtap={() => setIsRunning(!isRunning)}
          style={{
            flex: 1,
            backgroundColor: isRunning ? '#FF9500' : '#34C759',
            padding: 14,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            {isRunning ? 'Pause' : 'Start'}
          </text>
        </view>

        <view
          bindtap={reset}
          style={{
            flex: 1,
            backgroundColor: '#FF3B30',
            padding: 14,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Reset
          </text>
        </view>
      </view>

      <text style={{ marginTop: 16, color: '#666', fontSize: 13 }}>
        Status: {isRunning ? 'Recording' : 'Stopped'}
      </text>
    </view>
  );
}
