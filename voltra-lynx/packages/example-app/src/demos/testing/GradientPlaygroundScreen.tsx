import { useState, useCallback } from '@lynx-js/react';
import { Voltra, renderVoltraVariantToJson } from '@use-voltra/ios';

type GradientType = 'linear' | 'radial' | 'conic';
type Direction = 'to right' | 'to bottom' | 'to bottom right' | 'to top right';

const GRADIENT_TYPES: GradientType[] = ['linear', 'radial', 'conic'];
const DIRECTIONS: Direction[] = ['to right', 'to bottom', 'to bottom right', 'to top right'];

const PRESETS: { label: string; colors: [string, string, ...string[]] }[] = [
  { label: 'Sunset', colors: ['#FF6B6B', '#FFD93D'] },
  { label: 'Ocean', colors: ['#0093E9', '#80D0C7'] },
  { label: 'Purple', colors: ['#8B5CF6', '#EC4899'] },
  { label: 'Tri-color', colors: ['#EF4444', '#10B981', '#3B82F6'] },
];

const ANGLE_OPTIONS = [0, 45, 90, 135, 180];

function renderPreviewJson(element: React.ReactNode): string {
  try {
    return JSON.stringify(renderVoltraVariantToJson(element), null, 2);
  } catch {
    return '{ "error": "Failed to render" }';
  }
}

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

  // Build Voltra preview JSONs
  const livePreviewJson = renderPreviewJson(
    <Voltra.View
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
    </Voltra.View>
  );

  const colorStopJson = renderPreviewJson(
    <Voltra.View
      style={{
        height: '100%',
        backgroundColor: 'linear-gradient(to right, red 10%, yellow 50%, blue 90%)',
        borderRadius: 8,
        width: '100%',
      } as any}
    />
  );

  const rgbaGradientJson = renderPreviewJson(
    <Voltra.View
      style={{
        height: '100%',
        backgroundColor: 'linear-gradient(to right, rgba(255,0,0,0.8) 0%, rgba(0,0,255,0.3) 100%)',
        borderRadius: 8,
        width: '100%',
      } as any}
    />
  );

  const solidColorJson = renderPreviewJson(
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
  );

  const truncate = (json: string) => json.length > 400 ? json.slice(0, 400) + '...' : json;

  return (
    <scroll-view scroll-y style={{ flex: 1 } as any}>
      <view style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 20, paddingBottom: 24 }}>
        <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
          Gradient Playground
        </text>
        <text style={{ color: '#666', marginBottom: 8, fontSize: 13 }}>
          Test CSS gradient strings as backgroundColor on Voltra views.
        </text>
        <text style={{ color: '#FCA5A5', fontSize: 11, marginBottom: 16 }}>
          Playground uses parser-compatible CSS syntax only. If a preview is blank, this indicates a gradient parser bug in iOS rendering.
        </text>

        {/* Controls */}
        <view style={{
          backgroundColor: '#1c1c1e',
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
        }}>
          <text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Controls</text>

          {/* Gradient Type */}
          <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <text style={{ color: '#CBD5F5', fontSize: 14 }}>Type:</text>
            <view
              bindtap={cycleGradientType}
              style={{
                paddingLeft: 12, paddingRight: 12,
                paddingTop: 6, paddingBottom: 6,
                backgroundColor: '#333',
                borderRadius: 6,
              }}
            >
              <text style={{ color: '#fff', fontSize: 13 }}>{gradientType}</text>
            </view>
          </view>

          {/* Direction (linear only) */}
          {gradientType === 'linear' && (
            <view>
              <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <text style={{ color: '#CBD5F5', fontSize: 14 }}>Mode:</text>
                <view
                  bindtap={() => setUseAngle((v) => !v)}
                  style={{
                    paddingLeft: 12, paddingRight: 12,
                    paddingTop: 6, paddingBottom: 6,
                    backgroundColor: '#333',
                    borderRadius: 6,
                  }}
                >
                  <text style={{ color: '#fff', fontSize: 13 }}>{useAngle ? 'angle' : 'direction'}</text>
                </view>
              </view>
              {useAngle ? (
                <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <text style={{ color: '#CBD5F5', fontSize: 14 }}>Angle: {angle}deg</text>
                  <view
                    bindtap={cycleAngle}
                    style={{
                      paddingLeft: 12, paddingRight: 12,
                      paddingTop: 6, paddingBottom: 6,
                      backgroundColor: '#333',
                      borderRadius: 6,
                    }}
                  >
                    <text style={{ color: '#fff', fontSize: 13 }}>cycle</text>
                  </view>
                </view>
              ) : (
                <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <text style={{ color: '#CBD5F5', fontSize: 14 }}>Direction:</text>
                  <view
                    bindtap={cycleDirection}
                    style={{
                      paddingLeft: 12, paddingRight: 12,
                      paddingTop: 6, paddingBottom: 6,
                      backgroundColor: '#333',
                      borderRadius: 6,
                    }}
                  >
                    <text style={{ color: '#fff', fontSize: 13 }}>{direction}</text>
                  </view>
                </view>
              )}
            </view>
          )}

          {/* Angle for conic */}
          {gradientType === 'conic' && (
            <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <text style={{ color: '#CBD5F5', fontSize: 14 }}>Start angle: {angle}deg</text>
              <view
                bindtap={cycleAngle}
                style={{
                  paddingLeft: 12, paddingRight: 12,
                  paddingTop: 6, paddingBottom: 6,
                  backgroundColor: '#333',
                  borderRadius: 6,
                }}
              >
                <text style={{ color: '#fff', fontSize: 13 }}>cycle</text>
              </view>
            </view>
          )}

          {/* Color Preset */}
          <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <text style={{ color: '#CBD5F5', fontSize: 14 }}>Colors: {PRESETS[preset].label}</text>
            <view
              bindtap={cyclePreset}
              style={{
                paddingLeft: 12, paddingRight: 12,
                paddingTop: 6, paddingBottom: 6,
                backgroundColor: '#333',
                borderRadius: 6,
              }}
            >
              <text style={{ color: '#fff', fontSize: 13 }}>cycle</text>
            </view>
          </view>

          {/* Border Radius */}
          <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <text style={{ color: '#CBD5F5', fontSize: 14 }}>borderRadius: {borderRadius}px</text>
            <view style={{ flexDirection: 'row', gap: 8 }}>
              <view
                bindtap={() => setBorderRadius((prev) => Math.max(prev - 8, 0))}
                style={{
                  paddingLeft: 14, paddingRight: 14,
                  paddingTop: 6, paddingBottom: 6,
                  backgroundColor: '#333',
                  borderRadius: 6,
                }}
              >
                <text style={{ color: '#fff', fontSize: 15 }}>-</text>
              </view>
              <view
                bindtap={() => setBorderRadius((prev) => Math.min(prev + 8, 80))}
                style={{
                  paddingLeft: 14, paddingRight: 14,
                  paddingTop: 6, paddingBottom: 6,
                  backgroundColor: '#333',
                  borderRadius: 6,
                }}
              >
                <text style={{ color: '#fff', fontSize: 15 }}>+</text>
              </view>
            </view>
          </view>
        </view>

        {/* Live Preview */}
        <view style={{
          backgroundColor: '#1c1c1e',
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
        }}>
          <text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Live Preview</text>
          <text style={{ color: '#94A3B8', fontSize: 11, marginBottom: 8 }}>CSS: {gradient}</text>
          <text style={{ color: '#6E6E73', fontSize: 10, fontFamily: 'monospace' }}>
            {truncate(livePreviewJson)}
          </text>
        </view>

        {/* Color Stop Positions */}
        <view style={{
          backgroundColor: '#1c1c1e',
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
        }}>
          <text style={{ color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 4 }}>Color Stop Positions</text>
          <text style={{ color: '#94A3B8', fontSize: 11, marginBottom: 8 }}>
            Explicit percentage stops: red 10%, yellow 50%, blue 90%
          </text>
          <text style={{ color: '#6E6E73', fontSize: 10, fontFamily: 'monospace' }}>
            {truncate(colorStopJson)}
          </text>
        </view>

        {/* RGBA Inside Gradient */}
        <view style={{
          backgroundColor: '#1c1c1e',
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
        }}>
          <text style={{ color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 4 }}>RGBA Inside Gradient</text>
          <text style={{ color: '#94A3B8', fontSize: 11, marginBottom: 8 }}>
            linear-gradient(to right, rgba(255,0,0,0.8) 0%, rgba(0,0,255,0.3) 100%)
          </text>
          <text style={{ color: '#6E6E73', fontSize: 10, fontFamily: 'monospace' }}>
            {truncate(rgbaGradientJson)}
          </text>
        </view>

        {/* Solid Color */}
        <view style={{
          backgroundColor: '#1c1c1e',
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
        }}>
          <text style={{ color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 4 }}>Solid Color (Unchanged)</text>
          <text style={{ color: '#94A3B8', fontSize: 11, marginBottom: 8 }}>
            backgroundColor: "#3B82F6" - plain colors still work
          </text>
          <text style={{ color: '#6E6E73', fontSize: 10, fontFamily: 'monospace' }}>
            {truncate(solidColorJson)}
          </text>
        </view>
      </view>
    </scroll-view>
  );
}
