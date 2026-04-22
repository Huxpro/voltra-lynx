import { useState, useCallback } from '@lynx-js/react';
import { Voltra, renderVoltraVariantToJson } from '@use-voltra/ios';

type TimerMode = 'timer' | 'stopwatch';
type Direction = 'up' | 'down';
type TextStyle = 'timer' | 'relative';

export function TimerScreen() {
  const [mode, setMode] = useState<TimerMode>('timer');
  const [direction, setDirection] = useState<Direction>('down');
  const [textStyle, setTextStyle] = useState<TextStyle>('timer');
  const [showHours, setShowHours] = useState(false);
  const [durationSec, setDurationSec] = useState(300); // 5 minutes default

  const [timerState, setTimerState] = useState<{
    startAtMs?: number;
    endAtMs?: number;
    durationMs?: number;
  }>({
    endAtMs: Date.now() + 300000,
  });

  const resetTimer = useCallback(() => {
    const duration = durationSec * 1000;
    const now = Date.now();

    if (mode === 'stopwatch') {
      setTimerState({
        startAtMs: now,
        endAtMs: undefined,
        durationMs: undefined,
      });
      setDirection('up');
    } else {
      setTimerState({
        startAtMs: now,
        endAtMs: now + duration,
        durationMs: duration,
      });
    }
  }, [mode, durationSec]);

  const toggleMode = useCallback(() => {
    setMode((prev: TimerMode) => (prev === 'timer' ? 'stopwatch' : 'timer'));
  }, []);

  const toggleDirection = useCallback(() => {
    setDirection((prev: Direction) => (prev === 'down' ? 'up' : 'down'));
  }, []);

  const toggleTextStyle = useCallback(() => {
    setTextStyle((prev: TextStyle) => (prev === 'timer' ? 'relative' : 'timer'));
  }, []);

  const toggleShowHours = useCallback(() => {
    setShowHours((prev: boolean) => !prev);
  }, []);

  const increaseDuration = useCallback(() => {
    setDurationSec((prev: number) => Math.min(prev + 60, 3600));
  }, []);

  const decreaseDuration = useCallback(() => {
    setDurationSec((prev: number) => Math.max(prev - 60, 60));
  }, []);

  // Generate the Voltra Timer JSON
  const getTimerJson = () => {
    try {
      return JSON.stringify(
        renderVoltraVariantToJson(
          <Voltra.ZStack style={{ flex: 1, backgroundColor: '#1a1a2e', padding: 16 } as any}>
            <Voltra.VStack spacing={8} alignment="center">
              <Voltra.Text style={{ color: '#aaa', fontSize: 14 } as any}>Voltra Timer</Voltra.Text>
              <Voltra.Timer
                style={{
                  color: '#ffffff',
                  fontSize: 24,
                  fontWeight: 'bold',
                } as any}
                startAtMs={timerState.startAtMs}
                endAtMs={timerState.endAtMs}
                durationMs={timerState.durationMs}
                direction={mode === 'stopwatch' ? 'up' : direction}
                textStyle={textStyle}
                showHours={showHours}
              />
            </Voltra.VStack>
          </Voltra.ZStack>
        ),
        null,
        2
      );
    } catch { return '(render error)'; }
  };

  return (
    <scroll-view style={{ flex: 1 } as any} scroll-y>
      <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 }}>
        <text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 } as any}>
          Timer Testing
        </text>
        <text style={{ fontSize: 14, color: '#CBD5F5', marginBottom: 24 } as any}>
          Test the Voltra Timer component behaviors, including native text updates for Live Activities.
        </text>

        {/* Timer Preview Card */}
        <view style={{ backgroundColor: '#1E293B', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' } as any}>
          <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 } as any}>Live Preview</text>

          {/* Timer display area */}
          <view style={{
            backgroundColor: '#1a1a2e',
            borderRadius: 16,
            padding: 24,
            alignItems: 'center',
            marginBottom: 16,
          } as any}>
            <text style={{ color: '#aaa', fontSize: 14, marginBottom: 8 } as any}>Voltra Timer</text>
            <text style={{ color: '#ffffff', fontSize: 32, fontWeight: 'bold', fontFamily: 'monospace' } as any}>
              {mode === 'stopwatch' ? '00:00' : formatDuration(durationSec)}
            </text>
            <text style={{ color: '#666', fontSize: 12, marginTop: 8 } as any}>
              Mode: {mode} | Direction: {mode === 'stopwatch' ? 'up' : direction}
            </text>
          </view>

          {/* Reset button */}
          <view
            bindtap={resetTimer}
            style={{
              backgroundColor: '#3B82F6',
              padding: 14,
              borderRadius: 10,
              alignItems: 'center',
            } as any}
          >
            <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' } as any}>Reset / Start Timer</text>
          </view>
        </view>

        {/* Configuration Card */}
        <view style={{ backgroundColor: '#1E293B', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' } as any}>
          <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 16 } as any}>Configuration</text>

          {/* Mode */}
          <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <text style={{ color: '#fff', fontSize: 16 } as any}>Mode</text>
            <view style={{ flexDirection: 'row', gap: 8 }}>
              <view
                bindtap={() => setMode('timer')}
                style={{
                  paddingLeft: 12, paddingRight: 12,
                  paddingTop: 6, paddingBottom: 6,
                  backgroundColor: mode === 'timer' ? '#3B82F6' : '#334155',
                  borderRadius: 6,
                }}
              >
                <text style={{ color: mode === 'timer' ? '#fff' : '#94A3B8', fontSize: 13 } as any}>Timer</text>
              </view>
              <view
                bindtap={() => setMode('stopwatch')}
                style={{
                  paddingLeft: 12, paddingRight: 12,
                  paddingTop: 6, paddingBottom: 6,
                  backgroundColor: mode === 'stopwatch' ? '#3B82F6' : '#334155',
                  borderRadius: 6,
                }}
              >
                <text style={{ color: mode === 'stopwatch' ? '#fff' : '#94A3B8', fontSize: 13 } as any}>Stopwatch</text>
              </view>
            </view>
          </view>

          {/* Direction (only shown for timer mode) */}
          {mode === 'timer' && (
            <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <text style={{ color: '#fff', fontSize: 16 } as any}>Direction</text>
              <view style={{ flexDirection: 'row', gap: 8 }}>
                <view
                  bindtap={() => setDirection('down')}
                  style={{
                    paddingLeft: 12, paddingRight: 12,
                    paddingTop: 6, paddingBottom: 6,
                    backgroundColor: direction === 'down' ? '#3B82F6' : '#334155',
                    borderRadius: 6,
                  }}
                >
                  <text style={{ color: direction === 'down' ? '#fff' : '#94A3B8', fontSize: 13 } as any}>Down</text>
                </view>
                <view
                  bindtap={() => setDirection('up')}
                  style={{
                    paddingLeft: 12, paddingRight: 12,
                    paddingTop: 6, paddingBottom: 6,
                    backgroundColor: direction === 'up' ? '#3B82F6' : '#334155',
                    borderRadius: 6,
                  }}
                >
                  <text style={{ color: direction === 'up' ? '#fff' : '#94A3B8', fontSize: 13 } as any}>Up</text>
                </view>
              </view>
            </view>
          )}

          {/* Duration (only shown for timer mode) */}
          {mode === 'timer' && (
            <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <text style={{ color: '#fff', fontSize: 16 } as any}>Duration: {durationSec}s</text>
              <view style={{ flexDirection: 'row', gap: 8 }}>
                <view
                  bindtap={decreaseDuration}
                  style={{ paddingLeft: 14, paddingRight: 14, paddingTop: 6, paddingBottom: 6, backgroundColor: '#334155', borderRadius: 6 }}
                >
                  <text style={{ color: '#fff', fontSize: 13, fontWeight: '600' } as any}>-60s</text>
                </view>
                <view
                  bindtap={increaseDuration}
                  style={{ paddingLeft: 14, paddingRight: 14, paddingTop: 6, paddingBottom: 6, backgroundColor: '#334155', borderRadius: 6 }}
                >
                  <text style={{ color: '#fff', fontSize: 13, fontWeight: '600' } as any}>+60s</text>
                </view>
              </view>
            </view>
          )}

          {/* Text Style */}
          <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <text style={{ color: '#fff', fontSize: 16 } as any}>Style</text>
            <view style={{ flexDirection: 'row', gap: 8 }}>
              <view
                bindtap={() => setTextStyle('timer')}
                style={{
                  paddingLeft: 12, paddingRight: 12,
                  paddingTop: 6, paddingBottom: 6,
                  backgroundColor: textStyle === 'timer' ? '#3B82F6' : '#334155',
                  borderRadius: 6,
                }}
              >
                <text style={{ color: textStyle === 'timer' ? '#fff' : '#94A3B8', fontSize: 13 } as any}>Timer</text>
              </view>
              <view
                bindtap={() => setTextStyle('relative')}
                style={{
                  paddingLeft: 12, paddingRight: 12,
                  paddingTop: 6, paddingBottom: 6,
                  backgroundColor: textStyle === 'relative' ? '#3B82F6' : '#334155',
                  borderRadius: 6,
                }}
              >
                <text style={{ color: textStyle === 'relative' ? '#fff' : '#94A3B8', fontSize: 13 } as any}>Relative</text>
              </view>
            </view>
          </view>

          {/* Show Hours */}
          <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <text style={{ color: '#fff', fontSize: 16 } as any}>Show Hours</text>
            <view style={{ flexDirection: 'row', gap: 8 }}>
              <view
                bindtap={() => setShowHours(false)}
                style={{
                  paddingLeft: 12, paddingRight: 12,
                  paddingTop: 6, paddingBottom: 6,
                  backgroundColor: !showHours ? '#3B82F6' : '#334155',
                  borderRadius: 6,
                }}
              >
                <text style={{ color: !showHours ? '#fff' : '#94A3B8', fontSize: 13 } as any}>Off</text>
              </view>
              <view
                bindtap={() => setShowHours(true)}
                style={{
                  paddingLeft: 12, paddingRight: 12,
                  paddingTop: 6, paddingBottom: 6,
                  backgroundColor: showHours ? '#3B82F6' : '#334155',
                  borderRadius: 6,
                }}
              >
                <text style={{ color: showHours ? '#fff' : '#94A3B8', fontSize: 13 } as any}>On</text>
              </view>
            </view>
          </view>
        </view>

        {/* JSON Output */}
        <view style={{ backgroundColor: '#1E293B', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#334155' } as any}>
          <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 } as any}>Voltra Timer JSON</text>
          <text style={{ fontSize: 12, color: '#94A3B8', marginBottom: 12 } as any}>
            renderVoltraVariantToJson output
          </text>

          <view style={{ backgroundColor: '#0F172A', borderRadius: 8, padding: 10 }}>
            <text style={{
              fontSize: 10,
              fontFamily: 'monospace',
              color: '#4ADE80',
              lineHeight: 14,
            } as any}>
              {getTimerJson()}
            </text>
          </view>
        </view>
      </view>
    </scroll-view>
  );
}

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
