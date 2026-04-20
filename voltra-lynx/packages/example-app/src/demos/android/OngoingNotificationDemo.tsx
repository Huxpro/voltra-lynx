import { useState, useEffect } from '@lynx-js/react';

type NotificationState = 'idle' | 'active' | 'paused';

export function OngoingNotificationDemo() {
  const [state, setState] = useState<NotificationState>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [title, setTitle] = useState('File Upload');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (state !== 'active') return;

    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
      setProgress((p) => {
        if (p >= 100) {
          setState('idle');
          return 0;
        }
        return p + 2;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [state]);

  const start = () => {
    setState('active');
    setElapsedSeconds(0);
    setProgress(0);
  };

  const pause = () => {
    setState('paused');
  };

  const resume = () => {
    setState('active');
  };

  const stop = () => {
    setState('idle');
    setElapsedSeconds(0);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <view style={{ flex: 1, padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Ongoing Notification
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Android ongoing notification with start/update/stop controls.
      </text>

      {/* Notification preview */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        opacity: state === 'idle' ? 0.5 : 1,
      }}>
        {/* Notification header */}
        <view style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 }}>
          <view style={{
            width: 20,
            height: 20,
            backgroundColor: '#6C63FF',
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>V</text>
          </view>
          <text style={{ color: '#aaa', fontSize: 12 }}>Voltra</text>
          <text style={{ color: '#666', fontSize: 12 }}>- {formatTime(elapsedSeconds)}</text>
        </view>

        {/* Notification content */}
        <text style={{ color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 4 }}>
          {title}
        </text>
        <text style={{ color: '#aaa', fontSize: 13, marginBottom: 12 }}>
          {state === 'idle' ? 'Not running' : state === 'paused' ? 'Paused' : `${progress}% complete`}
        </text>

        {/* Progress bar */}
        <view style={{
          height: 4,
          backgroundColor: '#333',
          borderRadius: 2,
          marginBottom: 12,
        }}>
          <view style={{
            width: `${progress}%`,
            height: 4,
            backgroundColor: state === 'paused' ? '#FF9500' : '#007AFF',
            borderRadius: 2,
          }} />
        </view>

        {/* Action buttons */}
        <view style={{ flexDirection: 'row', gap: 16 }}>
          <text style={{ color: '#007AFF', fontSize: 13, fontWeight: '600' }}>CANCEL</text>
          <text style={{ color: '#007AFF', fontSize: 13, fontWeight: '600' }}>
            {state === 'paused' ? 'RESUME' : 'PAUSE'}
          </text>
        </view>
      </view>

      {/* Controls */}
      <view style={{ gap: 12 }}>
        {state === 'idle' && (
          <view
            bindtap={start}
            style={{
              backgroundColor: '#34C759',
              padding: 14,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Start Notification
            </text>
          </view>
        )}

        {state === 'active' && (
          <view
            bindtap={pause}
            style={{
              backgroundColor: '#FF9500',
              padding: 14,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Pause
            </text>
          </view>
        )}

        {state === 'paused' && (
          <view
            bindtap={resume}
            style={{
              backgroundColor: '#34C759',
              padding: 14,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Resume
            </text>
          </view>
        )}

        {state !== 'idle' && (
          <view
            bindtap={stop}
            style={{
              backgroundColor: '#FF3B30',
              padding: 14,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Stop Notification
            </text>
          </view>
        )}
      </view>

      <text style={{ marginTop: 16, color: '#666', fontSize: 13 }}>
        State: {state} | Progress: {progress}%
      </text>

      <text style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
        On Android, ongoing notifications use startForeground() with FOREGROUND_SERVICE permission.
      </text>
    </view>
  );
}
