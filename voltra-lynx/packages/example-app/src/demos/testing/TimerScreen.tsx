import { useState, useEffect } from '@lynx-js/react';

export function TimerScreen() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <view style={{ flex: 1, padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Timer
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Simple timer with start, stop, and reset controls.
      </text>

      {/* Timer display */}
      <view style={{
        alignItems: 'center',
        marginBottom: 32,
        padding: 32,
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
      }}>
        <text style={{
          color: '#fff',
          fontSize: 48,
          fontWeight: 'bold',
          fontFamily: 'monospace',
        }}>
          {formatTime(seconds)}
        </text>
        <text style={{ color: '#666', fontSize: 13, marginTop: 8 }}>
          {isRunning ? 'Running' : seconds > 0 ? 'Paused' : 'Ready'}
        </text>
      </view>

      {/* Controls */}
      <view style={{ flexDirection: 'row', gap: 12 }}>
        {!isRunning ? (
          <view
            bindtap={start}
            style={{
              flex: 1,
              backgroundColor: '#34C759',
              padding: 14,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Start</text>
          </view>
        ) : (
          <view
            bindtap={stop}
            style={{
              flex: 1,
              backgroundColor: '#FF9500',
              padding: 14,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Stop</text>
          </view>
        )}

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
          <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Reset</text>
        </view>
      </view>

      {/* Laps (simple count) */}
      <view style={{ marginTop: 24 }}>
        <text style={{ color: '#666', fontSize: 13 }}>
          Total seconds elapsed: {seconds}
        </text>
      </view>
    </view>
  );
}
