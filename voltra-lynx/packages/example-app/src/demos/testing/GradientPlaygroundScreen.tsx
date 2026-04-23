import { useState, useCallback } from '@lynx-js/react';
import { Voltra } from '@use-voltra/ios';
import { VoltraPreview } from '../../components/VoltraPreview';

type GradientType = 'linear' | 'radial' | 'conic';
type Direction = 'to right' | 'to bottom' | 'to bottom right' | 'to top right';

const GRADIENT_TYPES: GradientType[] = ['linear', 'radial', 'conic'];
const DIRECTIONS: Direction[] = ['to right', 'to bottom', 'to bottom right', 'to top right'];
const DIRECTION_LABELS: Record<Direction, string> = {
  'to right': 'to right',
  'to bottom': 'to bottom',
  'to bottom right': 'to bottom right',
  'to top right': 'to top right',
};

const PRESETS: { label: string; colors: [string, string, ...string[]] }[] = [
  { label: 'Sunset', colors: ['#FF6B6B', '#FFD93D'] },
  { label: 'Ocean', colors: ['#0093E9', '#80D0C7'] },
  { label: 'Purple', colors: ['#8B5CF6', '#EC4899'] },
  { label: 'Tri-color', colors: ['#EF4444', '#10B981', '#3B82F6'] },
];

const ANGLE_OPTIONS = [0, 45, 90, 135, 180];

export function GradientPlaygroundScreen() {
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [direction, setDirection] = useState<Direction>('to right');
  const [angle, setAngle] = useState(90);
  const [useAngle, setUseAngle] = useState(false);
  const [preset, setPreset] = useState(0);
  const [borderRadius, setBorderRadius] = useState(12);

  const colors = PRESETS[preset].colors;
  const positionedStops = colors
    .map((color, idx) => {
      const pct = colors.length === 1 ? 0 : Math.round((idx / (colors.length - 1)) * 100);
      return `${color} ${pct}%`;
    })
    .join(', ');

  const buildGradient = (): string => {
    if (gradientType === 'radial') {
      return `radial-gradient(circle at center, ${positionedStops})`;
    }
    if (gradientType === 'conic') {
      return `conic-gradient(from ${angle}deg at center, ${positionedStops})`;
    }
    // linear
    const dir = useAngle ? `${angle}deg` : direction;
    return `linear-gradient(${dir}, ${positionedStops})`;
  };

  const gradient = buildGradient();

  const cycleGradientType = useCallback(() => {
    const i = GRADIENT_TYPES.indexOf(gradientType);
    setGradientType(GRADIENT_TYPES[(i + 1) % GRADIENT_TYPES.length]);
  }, [gradientType]);

  const cycleDirection = useCallback(() => {
    const i = DIRECTIONS.indexOf(direction);
    setDirection(DIRECTIONS[(i + 1) % DIRECTIONS.length]);
  }, [direction]);

  const cycleAngle = useCallback(() => {
    const i = ANGLE_OPTIONS.indexOf(angle);
    setAngle(ANGLE_OPTIONS[(i + 1) % ANGLE_OPTIONS.length]);
  }, [angle]);

  const cyclePreset = useCallback(() => {
    setPreset((prev) => (prev + 1) % PRESETS.length);
  }, []);

  const increaseBorderRadius = useCallback(() => setBorderRadius((prev) => Math.min(prev + 8, 80)), []);
  const decreaseBorderRadius = useCallback(() => setBorderRadius((prev) => Math.max(prev - 8, 0)), []);

  return (
    <scroll-view style={{ linearWeight: 1 } as any} scroll-orientation="vertical">
      <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 }}>
        <text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 } as any}>
          Gradient Playground
        </text>
        <text style={{ fontSize: 14, color: '#CBD5F5', marginBottom: 8 } as any}>
          Test CSS gradient strings as backgroundColor on Voltra views.
        </text>
        <text style={{ fontSize: 12, color: '#FCA5A5', marginBottom: 20 } as any}>
          Playground uses parser-compatible CSS syntax only. If a preview is blank, this indicates a gradient parser bug in iOS rendering.
        </text>

        {/* Controls */}
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
          <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 } as any}>Controls</text>

          {/* Gradient Type */}
          <view style={{ display: 'linear', linearDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <text style={{ color: '#CBD5F5', fontSize: 14 }}>Type:</text>
            <view
              bindtap={cycleGradientType}
              style={{
                paddingLeft: 12, paddingRight: 12,
                paddingTop: 6, paddingBottom: 6,
                backgroundColor: '#333',
                borderRadius: '6px',
              }}
            >
              <text style={{ color: '#fff', fontSize: 13 }}>{gradientType}</text>
            </view>
          </view>

          {/* Direction (linear only) */}
          {gradientType === 'linear' && (
            <view>
              <view style={{ display: 'linear', linearDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <text style={{ color: '#CBD5F5', fontSize: 14 }}>Mode:</text>
                <view
                  bindtap={() => setUseAngle((v) => !v)}
                  style={{
                    paddingLeft: 12, paddingRight: 12,
                    paddingTop: 6, paddingBottom: 6,
                    backgroundColor: '#333',
                    borderRadius: '6px',
                  }}
                >
                  <text style={{ color: '#fff', fontSize: 13 }}>{useAngle ? 'angle' : 'direction'}</text>
                </view>
              </view>
              {useAngle ? (
                <view style={{ display: 'linear', linearDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <text style={{ color: '#CBD5F5', fontSize: 14 }}>Angle: {angle}deg</text>
                  <view
                    bindtap={cycleAngle}
                    style={{
                      paddingLeft: 12, paddingRight: 12,
                      paddingTop: 6, paddingBottom: 6,
                      backgroundColor: '#333',
                      borderRadius: '6px',
                    }}
                  >
                    <text style={{ color: '#fff', fontSize: 13 }}>cycle</text>
                  </view>
                </view>
              ) : (
                <view style={{ display: 'linear', linearDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <text style={{ color: '#CBD5F5', fontSize: 14 }}>Direction:</text>
                  <view
                    bindtap={cycleDirection}
                    style={{
                      paddingLeft: 12, paddingRight: 12,
                      paddingTop: 6, paddingBottom: 6,
                      backgroundColor: '#333',
                      borderRadius: '6px',
                    }}
                  >
                    <text style={{ color: '#fff', fontSize: 13 }}>{DIRECTION_LABELS[direction]}</text>
                  </view>
                </view>
              )}
            </view>
          )}

          {/* Angle for conic */}
          {gradientType === 'conic' && (
            <view style={{ display: 'linear', linearDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <text style={{ color: '#CBD5F5', fontSize: 14 }}>Start angle: {angle}deg</text>
              <view
                bindtap={cycleAngle}
                style={{
                  paddingLeft: 12, paddingRight: 12,
                  paddingTop: 6, paddingBottom: 6,
                  backgroundColor: '#333',
                  borderRadius: '6px',
                }}
              >
                <text style={{ color: '#fff', fontSize: 13 }}>cycle</text>
              </view>
            </view>
          )}

          {/* Color Preset */}
          <view style={{ display: 'linear', linearDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <text style={{ color: '#CBD5F5', fontSize: 14 }}>Colors: {PRESETS[preset].label}</text>
            <view
              bindtap={cyclePreset}
              style={{
                paddingLeft: 12, paddingRight: 12,
                paddingTop: 6, paddingBottom: 6,
                backgroundColor: '#333',
                borderRadius: '6px',
              }}
            >
              <text style={{ color: '#fff', fontSize: 13 }}>cycle</text>
            </view>
          </view>

          {/* Border Radius */}
          <view style={{ display: 'linear', linearDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <text style={{ color: '#CBD5F5', fontSize: 14 }}>borderRadius: {borderRadius}px</text>
            <view style={{ display: 'linear', linearDirection: 'row' }}>
              <view
                bindtap={decreaseBorderRadius}
                style={{
                  paddingLeft: 14, paddingRight: 14,
                  paddingTop: 6, paddingBottom: 6,
                  backgroundColor: '#333',
                  borderRadius: '6px',
                }}
              >
                <text style={{ color: '#fff', fontSize: 15 }}>-</text>
              </view>
              <view
                bindtap={increaseBorderRadius}
                style={{
                  paddingLeft: 14, paddingRight: 14,
                  paddingTop: 6, paddingBottom: 6,
                  backgroundColor: '#333',
                  borderRadius: '6px',
                  marginLeft: 8,
                }}
              >
                <text style={{ color: '#fff', fontSize: 15 }}>+</text>
              </view>
            </view>
          </view>
        </view>

        {/* Live Preview */}
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
          <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 10 } as any}>Live Preview</text>

          <view style={{ backgroundColor: '#1E293B', borderRadius: '12px', overflow: 'hidden' } as any}>
            <VoltraPreview id="gradient-live-preview" height={220}>
              <Voltra.VStack
                style={{
                  height: '100%',
                  backgroundColor: gradient,
                  borderRadius,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                } as any}
              >
                <Voltra.Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' } as any}>Gradient View</Voltra.Text>
                <Voltra.Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 } as any}>{gradient}</Voltra.Text>
              </Voltra.VStack>
            </VoltraPreview>
          </view>
        </view>

        {/* Color Stop Positions */}
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
          <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 } as any}>Color Stop Positions</text>
          <text style={{ fontSize: 12, color: '#94A3B8', marginBottom: 10 } as any}>
            Explicit percentage stops: red 10%, yellow 50%, blue 90%
          </text>

          <view style={{ backgroundColor: '#1E293B', borderRadius: '12px', overflow: 'hidden' } as any}>
            <VoltraPreview id="gradient-color-stops" height={80}>
              <Voltra.View
                style={{
                  height: '100%',
                  backgroundColor: 'linear-gradient(to right, red 10%, yellow 50%, blue 90%)',
                  borderRadius: 8,
                  width: '100%',
                } as any}
              />
            </VoltraPreview>
          </view>
        </view>

        {/* RGBA Inside Gradient */}
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
          <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 } as any}>RGBA Inside Gradient</text>
          <text style={{ fontSize: 12, color: '#94A3B8', marginBottom: 10 } as any}>
            linear-gradient(to right, rgba(255,0,0,0.8) 0%, rgba(0,0,255,0.3) 100%)
          </text>

          <view style={{ backgroundColor: '#1E293B', borderRadius: '12px', overflow: 'hidden' } as any}>
            <VoltraPreview id="gradient-rgba" height={80}>
              <Voltra.View
                style={{
                  height: '100%',
                  backgroundColor: 'linear-gradient(to right, rgba(255,0,0,0.8) 0%, rgba(0,0,255,0.3) 100%)',
                  borderRadius: 8,
                  width: '100%',
                } as any}
              />
            </VoltraPreview>
          </view>
        </view>

        {/* Solid Color */}
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
          <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 } as any}>Solid Color (Unchanged)</text>
          <text style={{ fontSize: 12, color: '#94A3B8', marginBottom: 10 } as any}>
            backgroundColor: "#3B82F6" — plain colors still work
          </text>

          <view style={{ backgroundColor: '#1E293B', borderRadius: '12px', overflow: 'hidden' } as any}>
            <VoltraPreview id="gradient-solid" height={80}>
              <Voltra.View
                style={{
                  height: '100%',
                  backgroundColor: '#3B82F6',
                  borderRadius: 8,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                } as any}
              >
                <Voltra.Text style={{ color: '#FFFFFF', fontSize: 12 } as any}>Solid #3B82F6</Voltra.Text>
              </Voltra.View>
            </VoltraPreview>
          </view>
        </view>
      </view>
    </scroll-view>
  );
}
