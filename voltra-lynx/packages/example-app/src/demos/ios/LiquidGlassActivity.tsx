import { useState } from '@lynx-js/react';

interface GlassElement {
  id: string;
  color: string;
  label: string;
  opacity: number;
}

const defaultElements: GlassElement[] = [
  { id: '1', color: '#FF6B6B', label: 'Red', opacity: 0.6 },
  { id: '2', color: '#4ECDC4', label: 'Teal', opacity: 0.5 },
  { id: '3', color: '#45B7D1', label: 'Blue', opacity: 0.7 },
  { id: '4', color: '#96CEB4', label: 'Green', opacity: 0.5 },
];

export function LiquidGlassActivity() {
  const [elements, setElements] = useState(defaultElements);
  const [blurIntensity, setBlurIntensity] = useState(2);

  const toggleElement = (id: string) => {
    setElements(elements.map((el) =>
      el.id === id ? { ...el, opacity: el.opacity > 0.3 ? 0.2 : 0.7 } : el
    ));
  };

  const cycleBlur = () => {
    setBlurIntensity((blurIntensity % 3) + 1);
  };

  return (
    <view style={{ flex: 1, padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Liquid Glass Activity
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        iOS 26 glass container effect preview with colored translucent elements.
      </text>

      {/* Glass container preview */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
      }}>
        {/* Simulated glass effect container */}
        <view style={{
          backgroundColor: `rgba(255, 255, 255, 0.${blurIntensity})`,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
          padding: 16,
          marginBottom: 16,
        }}>
          <text style={{ color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 12 }}>
            Glass Container (Blur: {blurIntensity})
          </text>

          {/* Colored elements */}
          <view style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {elements.map((el) => (
              <view
                key={el.id}
                bindtap={() => toggleElement(el.id)}
                style={{
                  width: 70,
                  height: 70,
                  backgroundColor: el.color,
                  opacity: el.opacity,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                  {el.label}
                </text>
              </view>
            ))}
          </view>
        </view>

        {/* Layered glass panels */}
        <view style={{ flexDirection: 'row', gap: 8 }}>
          <view style={{
            flex: 1,
            height: 60,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.15)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <text style={{ color: '#aaa', fontSize: 11 }}>Panel 1</text>
          </view>
          <view style={{
            flex: 1,
            height: 60,
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <text style={{ color: '#aaa', fontSize: 11 }}>Panel 2</text>
          </view>
          <view style={{
            flex: 1,
            height: 60,
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.25)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <text style={{ color: '#aaa', fontSize: 11 }}>Panel 3</text>
          </view>
        </view>
      </view>

      {/* Controls */}
      <view
        bindtap={cycleBlur}
        style={{
          backgroundColor: '#5856D6',
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
          Cycle Blur Intensity
        </text>
      </view>

      <text style={{ color: '#999', fontSize: 12 }}>
        Tap colored elements to toggle opacity. In production, this uses iOS 26 UIGlassEffect.
      </text>
    </view>
  );
}
