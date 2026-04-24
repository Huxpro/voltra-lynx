import { useState, useCallback } from '@lynx-js/react';
import { Voltra } from '@use-voltra/ios';
import { VoltraWidgetPreview } from '../../components/VoltraWidgetPreview';

type TimerMode = 'timer' | 'stopwatch';
type Direction = 'up' | 'down';
type TextStyle = 'timer' | 'relative';

export function TimerScreen() {
  const [mode, setMode] = useState<TimerMode>('timer');
  const [direction, setDirection] = useState<Direction>('down');
  const [textStyle, setTextStyle] = useState<TextStyle>('timer');
  const [showHours, setShowHours] = useState(false);
  const [durationSec, setDurationSec] = useState('300'); // 5 minutes default
  const [templateJson] = useState(JSON.stringify({
    running: 'Time remaining: {time}',
    completed: 'Timer finished!',
  }, null, 2));

  const [timerState, setTimerState] = useState<{
    startAtMs?: number;
    endAtMs?: number;
    durationMs?: number;
  }>({
    endAtMs: Date.now() + 300000,
  });

  const resetTimer = useCallback(() => {
    const duration = (parseInt(durationSec) || 0) * 1000;
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

  return (
    <scroll-view style={{ linearWeight: 1 } as any} scroll-orientation="vertical">
      <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 }}>
        <text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: 8,
          } as any}
        >
          Timer Testing
        </text>
        <text
          style={{ fontSize: 14, color: '#CBD5F5', marginBottom: 24 } as any}
        >
          Test the Voltra Timer component behaviors, including native text
          updates for Live Activities.
        </text>

        {/* ── Live Preview Card ─────────────────────────────────── */}
        <view
          style={{
            backgroundColor: '#0F172A',
            borderRadius: '20px',
            padding: 18,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: 'rgba(148, 163, 184, 0.12)',
          } as any}
        >
          <text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: 12,
            } as any}
          >
            Live Preview
          </text>

          <view
            style={{
              backgroundColor: '#1E293B',
              borderRadius: '12px',
              overflow: 'hidden',
              alignItems: 'center',
              marginBottom: 16,
            } as any}
          >
            <VoltraWidgetPreview family="systemMedium" id="timer-preview">
              <Voltra.ZStack style={{ flex: 1, backgroundColor: '#1a1a2e', padding: 16 }}>
                <Voltra.VStack spacing={8} alignment="center">
                  <Voltra.Text style={{ color: '#aaa', fontSize: 14 }}>Voltra Timer</Voltra.Text>
                  <Voltra.Timer
                    style={{
                      color: '#ffffff',
                      fontSize: 24,
                      fontWeight: 'bold',
                    }}
                    startAtMs={timerState.startAtMs}
                    endAtMs={timerState.endAtMs}
                    durationMs={timerState.durationMs}
                    direction={mode === 'stopwatch' ? 'up' : direction}
                    textStyle={textStyle}
                    showHours={showHours}
                    textTemplates={templateJson}
                  />
                </Voltra.VStack>
              </Voltra.ZStack>
            </VoltraWidgetPreview>
          </view>

          {/* Reset button */}
          <view
            bindtap={resetTimer}
            style={{
              backgroundColor: '#3B82F6',
              padding: 14,
              borderRadius: '10px',
              alignItems: 'center',
            } as any}
          >
            <text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold',
              } as any}
            >
              Reset / Start Timer
            </text>
          </view>
        </view>

        {/* ── Configuration Card ────────────────────────────────── */}
        <view
          style={{
            backgroundColor: '#0F172A',
            borderRadius: '20px',
            padding: 18,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: 'rgba(148, 163, 184, 0.12)',
          } as any}
        >
          <text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: 16,
            } as any}
          >
            Configuration
          </text>

          {/* Mode */}
          <view
            style={{
              display: 'linear',
              linearDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <text
              style={{ color: '#fff', fontSize: 16, linearWeight: 1 } as any}
            >
              Mode
            </text>
            <view
              style={{ display: 'linear', linearDirection: 'row', gap: 8 }}
            >
              <view
                bindtap={() => setMode('timer')}
                style={{
                  paddingLeft: 12,
                  paddingRight: 12,
                  paddingTop: 6,
                  paddingBottom: 6,
                  backgroundColor: mode === 'timer' ? '#3B82F6' : '#334155',
                  borderRadius: '6px',
                }}
              >
                <text
                  style={{
                    color: mode === 'timer' ? '#fff' : '#94A3B8',
                    fontSize: 13,
                  } as any}
                >
                  Timer
                </text>
              </view>
              <view
                bindtap={() => setMode('stopwatch')}
                style={{
                  paddingLeft: 12,
                  paddingRight: 12,
                  paddingTop: 6,
                  paddingBottom: 6,
                  backgroundColor: mode === 'stopwatch' ? '#3B82F6' : '#334155',
                  borderRadius: '6px',
                }}
              >
                <text
                  style={{
                    color: mode === 'stopwatch' ? '#fff' : '#94A3B8',
                    fontSize: 13,
                  } as any}
                >
                  Stopwatch
                </text>
              </view>
            </view>
          </view>

          {/* Direction (only for timer mode) */}
          {mode === 'timer' && (
            <view
              style={{
                display: 'linear',
                linearDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <text
                style={{ color: '#fff', fontSize: 16, linearWeight: 1 } as any}
              >
                Direction
              </text>
              <view
                style={{ display: 'linear', linearDirection: 'row', gap: 8 }}
              >
                <view
                  bindtap={() => setDirection('down')}
                  style={{
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 6,
                    paddingBottom: 6,
                    backgroundColor: direction === 'down' ? '#3B82F6' : '#334155',
                    borderRadius: '6px',
                  }}
                >
                  <text
                    style={{
                      color: direction === 'down' ? '#fff' : '#94A3B8',
                      fontSize: 13,
                    } as any}
                  >
                    Down
                  </text>
                </view>
                <view
                  bindtap={() => setDirection('up')}
                  style={{
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 6,
                    paddingBottom: 6,
                    backgroundColor: direction === 'up' ? '#3B82F6' : '#334155',
                    borderRadius: '6px',
                  }}
                >
                  <text
                    style={{
                      color: direction === 'up' ? '#fff' : '#94A3B8',
                      fontSize: 13,
                    } as any}
                  >
                    Up
                  </text>
                </view>
              </view>
            </view>
          )}

          {/* Duration input (only for timer mode) */}
          {mode === 'timer' && (
            <view
              style={{
                display: 'linear',
                linearDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <text
                style={{ color: '#fff', fontSize: 16, linearWeight: 1 } as any}
              >
                Duration (seconds)
              </text>
              <view style={{ display: 'linear', linearDirection: 'row', alignItems: 'center' } as any}>
                <view
                  bindtap={() => setDurationSec(String(Math.max(60, (parseInt(durationSec) || 300) - 60)))}
                  style={{ backgroundColor: '#334155', paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 6, borderRadius: '6px', marginRight: 8 } as any}
                >
                  <text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>-60s</text>
                </view>
                <text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600', width: 50, textAlign: 'center' } as any}>
                  {durationSec || '300'}
                </text>
                <view
                  bindtap={() => setDurationSec(String(Math.min(3600, (parseInt(durationSec) || 300) + 60)))}
                  style={{ backgroundColor: '#334155', paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 6, borderRadius: '6px', marginLeft: 8 } as any}
                >
                  <text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>+60s</text>
                </view>
              </view>
            </view>
          )}

          {/* Text Style */}
          <view
            style={{
              display: 'linear',
              linearDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <text
              style={{ color: '#fff', fontSize: 16, linearWeight: 1 } as any}
            >
              Style
            </text>
            <view
              style={{ display: 'linear', linearDirection: 'row', gap: 8 }}
            >
              <view
                bindtap={() => setTextStyle('timer')}
                style={{
                  paddingLeft: 12,
                  paddingRight: 12,
                  paddingTop: 6,
                  paddingBottom: 6,
                  backgroundColor: textStyle === 'timer' ? '#3B82F6' : '#334155',
                  borderRadius: '6px',
                }}
              >
                <text
                  style={{
                    color: textStyle === 'timer' ? '#fff' : '#94A3B8',
                    fontSize: 13,
                  } as any}
                >
                  Timer
                </text>
              </view>
              <view
                bindtap={() => setTextStyle('relative')}
                style={{
                  paddingLeft: 12,
                  paddingRight: 12,
                  paddingTop: 6,
                  paddingBottom: 6,
                  backgroundColor: textStyle === 'relative' ? '#3B82F6' : '#334155',
                  borderRadius: '6px',
                }}
              >
                <text
                  style={{
                    color: textStyle === 'relative' ? '#fff' : '#94A3B8',
                    fontSize: 13,
                  } as any}
                >
                  Relative
                </text>
              </view>
            </view>
          </view>

          {/* Show Hours */}
          <view
            style={{
              display: 'linear',
              linearDirection: 'row',
              alignItems: 'center',
            }}
          >
            <text
              style={{ color: '#fff', fontSize: 16, linearWeight: 1 } as any}
            >
              Show Hours
            </text>
            <view
              style={{ display: 'linear', linearDirection: 'row', gap: 8 }}
            >
              <view
                bindtap={() => setShowHours(false)}
                style={{
                  paddingLeft: 12,
                  paddingRight: 12,
                  paddingTop: 6,
                  paddingBottom: 6,
                  backgroundColor: !showHours ? '#3B82F6' : '#334155',
                  borderRadius: '6px',
                }}
              >
                <text
                  style={{
                    color: !showHours ? '#fff' : '#94A3B8',
                    fontSize: 13,
                  } as any}
                >
                  Off
                </text>
              </view>
              <view
                bindtap={() => setShowHours(true)}
                style={{
                  paddingLeft: 12,
                  paddingRight: 12,
                  paddingTop: 6,
                  paddingBottom: 6,
                  backgroundColor: showHours ? '#3B82F6' : '#334155',
                  borderRadius: '6px',
                }}
              >
                <text
                  style={{
                    color: showHours ? '#fff' : '#94A3B8',
                    fontSize: 13,
                  } as any}
                >
                  On
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  );
}
