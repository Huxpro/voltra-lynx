import { useState, useCallback, useEffect } from '@lynx-js/react';
import { Voltra } from '@use-voltra/ios';
import { VoltraWidgetPreview } from '../../components/VoltraWidgetPreview';

type ProgressType = 'linear' | 'circular';
type ProgressMode = 'determinate' | 'timer' | 'indeterminate';

// Reusable inline button for toggle groups
function ToggleButton({ label, active, onTap, disabled }: {
  label: string;
  active: boolean;
  onTap: () => void;
  disabled?: boolean;
}) {
  return (
    <view
      bindtap={disabled ? undefined : onTap}
      style={{
        paddingLeft: 12, paddingRight: 12,
        paddingTop: 6, paddingBottom: 6,
        backgroundColor: active ? '#007AFF' : '#333',
        borderRadius: '6px',
        opacity: disabled ? 0.4 : 1,
        marginLeft: 8,
      }}
    >
      <text style={{ color: '#fff', fontSize: 13 }}>{label}</text>
    </view>
  );
}

export function ProgressIndicatorsScreen() {
  const [type, setType] = useState<ProgressType>('linear');
  const [mode, setMode] = useState<ProgressMode>('determinate');
  const [progressValue, setProgressValue] = useState(65);
  const [durationSec, setDurationSec] = useState('60');
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
    const duration = (parseInt(durationSec) || 0) * 1000;
    const now = Date.now();
    setTimerState({ startAtMs: now, endAtMs: now + duration });
  }, [durationSec]);

  const renderProgressWidget = () => {
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

    return (
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
  };

  return (
    <scroll-view style={{ linearWeight: 1 } as any} scroll-orientation="vertical">
      <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 }}>
        <text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF' } as any}>
          Progress Testing
        </text>
        <text style={{ fontSize: 14, color: '#CBD5F5', marginBottom: 24 } as any}>
          Test VoltraLinearProgressView and VoltraCircularProgressView with new label and styling support.
        </text>

        {/* 1. Live Preview */}
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
          <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 10 } as any}>
            Live Preview
          </text>
          <view style={{ alignItems: 'center' }}>
            <VoltraWidgetPreview family="systemMedium">
              {renderProgressWidget()}
            </VoltraWidgetPreview>
          </view>
          {mode === 'timer' && (
            <view
              bindtap={resetTimer}
              style={{
                backgroundColor: '#007AFF',
                padding: 12,
                borderRadius: '10px',
                alignItems: 'center',
                marginTop: 16,
              } as any}
            >
              <text style={{ color: '#fff', fontSize: 14, fontWeight: '600' } as any}>Reset / Start Timer</text>
            </view>
          )}
        </view>

        {/* 2. Base Configuration */}
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
          <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 } as any}>
            Base Configuration
          </text>

          {/* Type */}
          <view style={{ display: 'linear', linearDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <text style={{ color: '#fff', fontSize: 14 }}>Type</text>
            <view style={{ display: 'linear', linearDirection: 'row' }}>
              <ToggleButton label="Linear" active={type === 'linear'} onTap={() => setType('linear')} />
              <ToggleButton label="Circular" active={type === 'circular'} onTap={() => setType('circular')} />
            </view>
          </view>

          {/* Mode */}
          <view style={{ display: 'linear', linearDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <text style={{ color: '#fff', fontSize: 14 }}>Mode</text>
            <view style={{ display: 'linear', linearDirection: 'row' }}>
              <ToggleButton label="Determinate" active={mode === 'determinate'} onTap={() => setMode('determinate')} />
              <ToggleButton label="Timer" active={mode === 'timer'} onTap={() => setMode('timer')} disabled={type === 'circular'} />
              <ToggleButton label="Indeterminate" active={mode === 'indeterminate'} onTap={() => setMode('indeterminate')} disabled={type === 'linear'} />
            </view>
          </view>

          {/* Progress value (determinate only) */}
          {mode === 'determinate' && (
            <view style={{ display: 'linear', linearDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <text style={{ color: '#fff', fontSize: 14 }}>Progress: {progressValue}%</text>
              <view style={{ display: 'linear', linearDirection: 'row' }}>
                <ToggleButton label="-10" active={false} onTap={() => setProgressValue(Math.max(0, progressValue - 10))} />
                <ToggleButton label="+10" active={false} onTap={() => setProgressValue(Math.min(100, progressValue + 10))} />
              </view>
            </view>
          )}

          {/* Timer config */}
          {mode === 'timer' && (
            <view>
              <view style={{ display: 'linear', linearDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <text style={{ color: '#fff', fontSize: 14 }}>Duration (seconds)</text>
                <view style={{ display: 'linear', linearDirection: 'row', alignItems: 'center' } as any}>
                  <view
                    bindtap={() => setDurationSec(String(Math.max(10, (parseInt(durationSec) || 30) - 10)))}
                    style={{ backgroundColor: '#334155', paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, borderRadius: '6px', marginRight: 6 } as any}
                  >
                    <text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>-10</text>
                  </view>
                  <text style={{ color: '#fff', fontSize: 14, fontWeight: '600', width: 40, textAlign: 'center' } as any}>
                    {durationSec || '30'}
                  </text>
                  <view
                    bindtap={() => setDurationSec(String(Math.min(300, (parseInt(durationSec) || 30) + 10)))}
                    style={{ backgroundColor: '#334155', paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, borderRadius: '6px', marginLeft: 6 } as any}
                  >
                    <text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>+10</text>
                  </view>
                </view>
              </view>
              <view style={{ display: 'linear', linearDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <text style={{ color: '#fff', fontSize: 14 }}>Count Down</text>
                <ToggleButton label={countDown ? 'ON' : 'OFF'} active={countDown} onTap={() => setCountDown(!countDown)} />
              </view>
              <text style={{ color: '#FFB800', fontSize: 11, marginBottom: 8 }}>
                Note: Custom styling is ignored for Timers to support realtime updates.
              </text>
            </view>
          )}
        </view>

        {/* 3. Styling Configuration */}
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
          <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 } as any}>
            Styling Configuration
          </text>

          {/* Track Color */}
          <view style={{ display: 'linear', linearDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <text style={{ color: '#fff', fontSize: 14 }}>Track Color</text>
            <view style={{ display: 'linear', linearDirection: 'row', alignItems: 'center' } as any}>
              {['#334155', '#1E293B', '#4B5563'].map((c) => (
                <view
                  key={c}
                  bindtap={() => setTrackColor(c)}
                  style={{
                    width: 28, height: 28, borderRadius: '14px', backgroundColor: c, marginLeft: 6,
                    borderWidth: trackColor === c ? 2 : 0, borderColor: '#fff',
                  } as any}
                />
              ))}
            </view>
          </view>

          {/* Progress Color */}
          <view style={{ display: 'linear', linearDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <text style={{ color: '#fff', fontSize: 14 }}>Progress Color</text>
            <view style={{ display: 'linear', linearDirection: 'row', alignItems: 'center' } as any}>
              {['#8232FF', '#00D1FF', '#10B981', '#F59E0B'].map((c) => (
                <view
                  key={c}
                  bindtap={() => setProgressColor(c)}
                  style={{
                    width: 28, height: 28, borderRadius: '14px', backgroundColor: c, marginLeft: 6,
                    borderWidth: progressColor === c ? 2 : 0, borderColor: '#fff',
                  } as any}
                />
              ))}
            </view>
          </view>

          {/* Linear-specific styling */}
          {type === 'linear' && (
            <view>
              {/* Height */}
              <view style={{ display: 'linear', linearDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <text style={{ color: '#fff', fontSize: 14 }}>Height: {height}</text>
                <view style={{ display: 'linear', linearDirection: 'row' }}>
                  <ToggleButton label="Small" active={height === 4} onTap={() => setHeight(4)} />
                  <ToggleButton label="Medium" active={height === 8} onTap={() => setHeight(8)} />
                  <ToggleButton label="Large" active={height === 16} onTap={() => setHeight(16)} />
                </view>
              </view>

              {/* Corner Radius */}
              <view style={{ display: 'linear', linearDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <text style={{ color: '#fff', fontSize: 14 }}>Corner Radius: {cornerRadius}</text>
                <view style={{ display: 'linear', linearDirection: 'row' }}>
                  <ToggleButton label="None" active={cornerRadius === 0} onTap={() => setCornerRadius(0)} />
                  <ToggleButton label="Small" active={cornerRadius === 4} onTap={() => setCornerRadius(4)} />
                  <ToggleButton label="Full" active={cornerRadius === 20} onTap={() => setCornerRadius(20)} />
                </view>
              </view>

              {/* Custom Thumb */}
              <view style={{ display: 'linear', linearDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <text style={{ color: '#fff', fontSize: 14 }}>Custom Thumb</text>
                <ToggleButton label={useThumb ? 'ON' : 'OFF'} active={useThumb} onTap={() => setUseThumb(!useThumb)} />
              </view>
            </view>
          )}

          {/* Circular-specific styling */}
          {type === 'circular' && (
            <view style={{ display: 'linear', linearDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <text style={{ color: '#fff', fontSize: 14 }}>Line Width: {lineWidth}</text>
              <view style={{ display: 'linear', linearDirection: 'row' }}>
                <ToggleButton label="2" active={lineWidth === 2} onTap={() => setLineWidth(2)} />
                <ToggleButton label="6" active={lineWidth === 6} onTap={() => setLineWidth(6)} />
                <ToggleButton label="12" active={lineWidth === 12} onTap={() => setLineWidth(12)} />
              </view>
            </view>
          )}
        </view>
      </view>
    </scroll-view>
  );
}
