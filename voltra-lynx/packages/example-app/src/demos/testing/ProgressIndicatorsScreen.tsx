import { useState, useCallback, useEffect } from '@lynx-js/react';
import { Voltra, renderVoltraVariantToJson } from '@use-voltra/ios';

type ProgressType = 'linear' | 'circular';
type ProgressMode = 'determinate' | 'timer' | 'indeterminate';

export function ProgressIndicatorsScreen() {
  const [type, setType] = useState<ProgressType>('linear');
  const [mode, setMode] = useState<ProgressMode>('determinate');
  const [progressValue, setProgressValue] = useState(65);
  const [durationSec, setDurationSec] = useState(60);
  const [timerState, setTimerState] = useState<{ startAtMs?: number; endAtMs?: number }>({
    startAtMs: Date.now(),
    endAtMs: Date.now() + 60000,
  });

  // Styling state
  const [trackColor, setTrackColor] = useState('#333344');
  const [progressColor, setProgressColor] = useState('#007AFF');
  const [cornerRadius, setCornerRadius] = useState(4);
  const [height, setHeight] = useState(8);
  const [lineWidth, setLineWidth] = useState(6);
  const [useThumb, setUseThumb] = useState(false);
  const [countDown, setCountDown] = useState(false);

  // Handle unsupported modes
  useEffect(() => {
    if (type === 'circular' && mode === 'timer') {
      setMode('determinate');
    }
    if (type === 'linear' && mode === 'indeterminate') {
      setMode('determinate');
    }
  }, [type, mode]);

  const resetTimer = useCallback(() => {
    const duration = durationSec * 1000;
    const now = Date.now();
    setTimerState({ startAtMs: now, endAtMs: now + duration });
  }, [durationSec]);

  const buildPreviewJson = useCallback(() => {
    const commonProps: any = {
      label: (
        <Voltra.Text style={{ color: '#aaa', fontSize: 12 }}>
          {type === 'linear' ? 'Linear' : 'Circular'} Progress
        </Voltra.Text>
      ),
      currentValueLabel:
        mode === 'determinate' ? (
          <Voltra.Text style={{ color: '#fff', fontSize: 12 }}>{progressValue}%</Voltra.Text>
        ) : mode === 'timer' ? (
          <Voltra.Timer endAtMs={timerState.endAtMs} style={{ fontSize: 12, color: '#FFB800' } as any} />
        ) : null,
      trackColor,
      progressColor,
    };

    const modeProps =
      mode === 'determinate'
        ? { value: progressValue, maximumValue: 100 }
        : mode === 'timer'
        ? { startAtMs: timerState.startAtMs, endAtMs: timerState.endAtMs, countDown }
        : {};

    const widget = (
      <Voltra.ZStack style={{ flex: 1, backgroundColor: '#1a1a2e', padding: 16 }}>
        <Voltra.VStack style={{ flex: 1 }} spacing={12} alignment={type === 'circular' ? 'center' : undefined}>
          {type === 'linear' ? (
            <Voltra.LinearProgressView
              {...commonProps}
              {...modeProps}
              cornerRadius={cornerRadius}
              height={height}
              thumb={useThumb ? <Voltra.Symbol name="circle.fill" size={height * 2} tintColor="#fff" /> : undefined}
            />
          ) : (
            <Voltra.CircularProgressView
              {...commonProps}
              {...modeProps}
              lineWidth={lineWidth}
              style={{ width: 80, height: 80 }}
            />
          )}
        </Voltra.VStack>
      </Voltra.ZStack>
    );

    try {
      return JSON.stringify(renderVoltraVariantToJson(widget), null, 2);
    } catch {
      return '{ "error": "Failed to render" }';
    }
  }, [type, mode, progressValue, timerState, trackColor, progressColor, cornerRadius, height, lineWidth, useThumb, countDown]);

  const previewJson = buildPreviewJson();

  const cycleDuration = useCallback(() => {
    if (durationSec === 30) setDurationSec(60);
    else if (durationSec === 60) setDurationSec(120);
    else if (durationSec === 120) setDurationSec(300);
    else setDurationSec(30);
  }, [durationSec]);

  return (
    <scroll-view scroll-y style={{ flex: 1 } as any}>
      <view style={{ padding: 16 }}>
        <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
          Progress Indicators
        </text>
        <text style={{ color: '#666', marginBottom: 16, fontSize: 13 }}>
          LinearProgressView and CircularProgressView with label/styling support.
        </text>

        {/* Live Preview (Voltra JSON) */}
        <view style={{
          backgroundColor: '#1c1c1e',
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
        }}>
          <text style={{ color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
            Live Preview (JSON)
          </text>
          <text style={{ color: '#8E8E93', fontSize: 11, fontFamily: 'monospace' }}>
            {previewJson.length > 600 ? previewJson.slice(0, 600) + '...' : previewJson}
          </text>
        </view>

        {mode === 'timer' && (
          <view
            bindtap={resetTimer}
            style={{
              backgroundColor: '#007AFF',
              padding: 12,
              borderRadius: 10,
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Reset / Start Timer</text>
          </view>
        )}

        {/* Base Configuration */}
        <view style={{
          backgroundColor: '#1c1c1e',
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
        }}>
          <text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
            Base Configuration
          </text>

          {/* Type */}
          <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <text style={{ color: '#fff', fontSize: 14 }}>Type</text>
            <view style={{ flexDirection: 'row', gap: 8 }}>
              <view
                bindtap={() => setType('linear')}
                style={{
                  paddingLeft: 12, paddingRight: 12,
                  paddingTop: 6, paddingBottom: 6,
                  backgroundColor: type === 'linear' ? '#007AFF' : '#333',
                  borderRadius: 6,
                }}
              >
                <text style={{ color: '#fff', fontSize: 13 }}>Linear</text>
              </view>
              <view
                bindtap={() => setType('circular')}
                style={{
                  paddingLeft: 12, paddingRight: 12,
                  paddingTop: 6, paddingBottom: 6,
                  backgroundColor: type === 'circular' ? '#007AFF' : '#333',
                  borderRadius: 6,
                }}
              >
                <text style={{ color: '#fff', fontSize: 13 }}>Circular</text>
              </view>
            </view>
          </view>

          {/* Mode */}
          <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <text style={{ color: '#fff', fontSize: 14 }}>Mode</text>
            <view style={{ flexDirection: 'row', gap: 8 }}>
              <view
                bindtap={() => setMode('determinate')}
                style={{
                  paddingLeft: 10, paddingRight: 10,
                  paddingTop: 6, paddingBottom: 6,
                  backgroundColor: mode === 'determinate' ? '#007AFF' : '#333',
                  borderRadius: 6,
                }}
              >
                <text style={{ color: '#fff', fontSize: 12 }}>Determinate</text>
              </view>
              <view
                bindtap={() => { if (type !== 'circular') setMode('timer'); }}
                style={{
                  paddingLeft: 10, paddingRight: 10,
                  paddingTop: 6, paddingBottom: 6,
                  backgroundColor: mode === 'timer' ? '#007AFF' : '#333',
                  borderRadius: 6,
                  opacity: type === 'circular' ? 0.4 : 1,
                }}
              >
                <text style={{ color: '#fff', fontSize: 12 }}>Timer</text>
              </view>
              <view
                bindtap={() => { if (type !== 'linear') setMode('indeterminate'); }}
                style={{
                  paddingLeft: 10, paddingRight: 10,
                  paddingTop: 6, paddingBottom: 6,
                  backgroundColor: mode === 'indeterminate' ? '#007AFF' : '#333',
                  borderRadius: 6,
                  opacity: type === 'linear' ? 0.4 : 1,
                }}
              >
                <text style={{ color: '#fff', fontSize: 12 }}>Indeterminate</text>
              </view>
            </view>
          </view>

          {/* Progress value (determinate only) */}
          {mode === 'determinate' && (
            <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <text style={{ color: '#fff', fontSize: 14 }}>Progress: {progressValue}%</text>
              <view style={{ flexDirection: 'row', gap: 8 }}>
                <view
                  bindtap={() => setProgressValue(Math.max(0, progressValue - 10))}
                  style={{
                    paddingLeft: 12, paddingRight: 12,
                    paddingTop: 6, paddingBottom: 6,
                    backgroundColor: '#333',
                    borderRadius: 6,
                  }}
                >
                  <text style={{ color: '#fff', fontSize: 13 }}>-10</text>
                </view>
                <view
                  bindtap={() => setProgressValue(Math.min(100, progressValue + 10))}
                  style={{
                    paddingLeft: 12, paddingRight: 12,
                    paddingTop: 6, paddingBottom: 6,
                    backgroundColor: '#333',
                    borderRadius: 6,
                  }}
                >
                  <text style={{ color: '#fff', fontSize: 13 }}>+10</text>
                </view>
              </view>
            </view>
          )}

          {/* Timer config */}
          {mode === 'timer' && (
            <view>
              <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <text style={{ color: '#fff', fontSize: 14 }}>Duration: {durationSec}s</text>
                <view
                  bindtap={cycleDuration}
                  style={{
                    paddingLeft: 12, paddingRight: 12,
                    paddingTop: 6, paddingBottom: 6,
                    backgroundColor: '#333',
                    borderRadius: 6,
                  }}
                >
                  <text style={{ color: '#fff', fontSize: 13 }}>Cycle</text>
                </view>
              </view>
              <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <text style={{ color: '#fff', fontSize: 14 }}>Count Down</text>
                <view
                  bindtap={() => setCountDown(!countDown)}
                  style={{
                    paddingLeft: 12, paddingRight: 12,
                    paddingTop: 6, paddingBottom: 6,
                    backgroundColor: countDown ? '#007AFF' : '#333',
                    borderRadius: 6,
                  }}
                >
                  <text style={{ color: '#fff', fontSize: 13 }}>{countDown ? 'ON' : 'OFF'}</text>
                </view>
              </view>
              <text style={{ color: '#FFB800', fontSize: 11, marginBottom: 8 }}>
                Note: Custom styling is ignored for Timers to support realtime updates.
              </text>
            </view>
          )}
        </view>

        {/* Styling Configuration */}
        <view style={{
          backgroundColor: '#1c1c1e',
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
        }}>
          <text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
            Styling Configuration
          </text>

          {/* Track Color */}
          <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <text style={{ color: '#fff', fontSize: 14 }}>Track Color</text>
            <view style={{ flexDirection: 'row', gap: 6 }}>
              {['#333344', '#444', '#1a1a2e'].map((c) => (
                <view
                  key={c}
                  bindtap={() => setTrackColor(c)}
                  style={{
                    width: 28, height: 28,
                    backgroundColor: c,
                    borderRadius: 6,
                    borderWidth: trackColor === c ? 2 : 0,
                    borderColor: '#007AFF',
                  }}
                />
              ))}
            </view>
          </view>

          {/* Progress Color */}
          <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <text style={{ color: '#fff', fontSize: 14 }}>Progress Color</text>
            <view style={{ flexDirection: 'row', gap: 6 }}>
              {['#007AFF', '#34C759', '#FF9500', '#FF3B30'].map((c) => (
                <view
                  key={c}
                  bindtap={() => setProgressColor(c)}
                  style={{
                    width: 28, height: 28,
                    backgroundColor: c,
                    borderRadius: 6,
                    borderWidth: progressColor === c ? 2 : 0,
                    borderColor: '#fff',
                  }}
                />
              ))}
            </view>
          </view>

          {/* Linear-specific styling */}
          {type === 'linear' && (
            <view>
              <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <text style={{ color: '#fff', fontSize: 14 }}>Height: {height}</text>
                <view style={{ flexDirection: 'row', gap: 8 }}>
                  {[4, 8, 16].map((h) => (
                    <view
                      key={`h-${h}`}
                      bindtap={() => setHeight(h)}
                      style={{
                        paddingLeft: 10, paddingRight: 10,
                        paddingTop: 6, paddingBottom: 6,
                        backgroundColor: height === h ? '#007AFF' : '#333',
                        borderRadius: 6,
                      }}
                    >
                      <text style={{ color: '#fff', fontSize: 12 }}>
                        {h === 4 ? 'Small' : h === 8 ? 'Medium' : 'Large'}
                      </text>
                    </view>
                  ))}
                </view>
              </view>

              <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <text style={{ color: '#fff', fontSize: 14 }}>Corner Radius: {cornerRadius}</text>
                <view style={{ flexDirection: 'row', gap: 8 }}>
                  {[0, 4, 20].map((r) => (
                    <view
                      key={`r-${r}`}
                      bindtap={() => setCornerRadius(r)}
                      style={{
                        paddingLeft: 10, paddingRight: 10,
                        paddingTop: 6, paddingBottom: 6,
                        backgroundColor: cornerRadius === r ? '#007AFF' : '#333',
                        borderRadius: 6,
                      }}
                    >
                      <text style={{ color: '#fff', fontSize: 12 }}>
                        {r === 0 ? 'None' : r === 4 ? 'Small' : 'Full'}
                      </text>
                    </view>
                  ))}
                </view>
              </view>

              <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <text style={{ color: '#fff', fontSize: 14 }}>Custom Thumb</text>
                <view
                  bindtap={() => setUseThumb(!useThumb)}
                  style={{
                    paddingLeft: 12, paddingRight: 12,
                    paddingTop: 6, paddingBottom: 6,
                    backgroundColor: useThumb ? '#007AFF' : '#333',
                    borderRadius: 6,
                  }}
                >
                  <text style={{ color: '#fff', fontSize: 13 }}>{useThumb ? 'ON' : 'OFF'}</text>
                </view>
              </view>
            </view>
          )}

          {/* Circular-specific styling */}
          {type === 'circular' && (
            <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <text style={{ color: '#fff', fontSize: 14 }}>Line Width: {lineWidth}</text>
              <view style={{ flexDirection: 'row', gap: 8 }}>
                {[2, 6, 12].map((w) => (
                  <view
                    key={`w-${w}`}
                    bindtap={() => setLineWidth(w)}
                    style={{
                      paddingLeft: 12, paddingRight: 12,
                      paddingTop: 6, paddingBottom: 6,
                      backgroundColor: lineWidth === w ? '#007AFF' : '#333',
                      borderRadius: 6,
                    }}
                  >
                    <text style={{ color: '#fff', fontSize: 13 }}>{w}</text>
                  </view>
                ))}
              </view>
            </view>
          )}
        </view>
      </view>
    </scroll-view>
  );
}
