import { useState } from '@lynx-js/react';

export function PositioningScreen() {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <scroll-view style={{ flex: 1 }}>
      <view style={{ padding: 16 }}>
        <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          Positioning Demo
        </text>
        <text style={{ color: '#666', marginBottom: 24 }}>
          Demonstrates position absolute and relative layouts.
        </text>

        {/* Relative positioning */}
        <view style={{ marginBottom: 24 }}>
          <text style={{ fontSize: 14, fontWeight: '600', marginBottom: 12 }}>Relative Positioning</text>
          <view style={{
            height: 120,
            backgroundColor: '#f0f0f0',
            borderRadius: 8,
            padding: 8,
          }}>
            <view style={{
              width: 60,
              height: 60,
              backgroundColor: '#007AFF',
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <text style={{ color: '#fff', fontSize: 10 }}>Normal</text>
            </view>
            <view style={{
              width: 60,
              height: 60,
              backgroundColor: '#34C759',
              borderRadius: 6,
              position: 'relative',
              left: 30,
              top: -20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <text style={{ color: '#fff', fontSize: 10 }}>Relative</text>
              <text style={{ color: '#fff', fontSize: 8 }}>L:30 T:-20</text>
            </view>
          </view>
        </view>

        {/* Absolute positioning */}
        <view style={{ marginBottom: 24 }}>
          <text style={{ fontSize: 14, fontWeight: '600', marginBottom: 12 }}>Absolute Positioning</text>
          <view style={{
            height: 180,
            backgroundColor: '#f0f0f0',
            borderRadius: 8,
            position: 'relative',
          }}>
            {/* Top-left */}
            <view style={{
              position: 'absolute',
              top: 8,
              left: 8,
              width: 50,
              height: 50,
              backgroundColor: '#FF3B30',
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <text style={{ color: '#fff', fontSize: 9 }}>TL</text>
            </view>

            {/* Top-right */}
            <view style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 50,
              height: 50,
              backgroundColor: '#FF9500',
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <text style={{ color: '#fff', fontSize: 9 }}>TR</text>
            </view>

            {/* Center */}
            <view style={{
              position: 'absolute',
              top: 65,
              left: '38%',
              width: 70,
              height: 50,
              backgroundColor: '#5856D6',
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <text style={{ color: '#fff', fontSize: 9 }}>Center</text>
            </view>

            {/* Bottom-left */}
            <view style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              width: 50,
              height: 50,
              backgroundColor: '#34C759',
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <text style={{ color: '#fff', fontSize: 9 }}>BL</text>
            </view>

            {/* Bottom-right */}
            <view style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              width: 50,
              height: 50,
              backgroundColor: '#007AFF',
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <text style={{ color: '#fff', fontSize: 9 }}>BR</text>
            </view>
          </view>
        </view>

        {/* Z-index / stacking */}
        <view style={{ marginBottom: 24 }}>
          <text style={{ fontSize: 14, fontWeight: '600', marginBottom: 12 }}>Stacking (Z-Order)</text>
          <view style={{
            height: 120,
            backgroundColor: '#f0f0f0',
            borderRadius: 8,
            position: 'relative',
          }}>
            <view style={{
              position: 'absolute',
              top: 10,
              left: 20,
              width: 80,
              height: 80,
              backgroundColor: '#FF3B30',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <text style={{ color: '#fff', fontSize: 11 }}>Layer 1</text>
            </view>
            <view style={{
              position: 'absolute',
              top: 25,
              left: 50,
              width: 80,
              height: 80,
              backgroundColor: '#007AFF',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <text style={{ color: '#fff', fontSize: 11 }}>Layer 2</text>
            </view>
            <view style={{
              position: 'absolute',
              top: 40,
              left: 80,
              width: 80,
              height: 80,
              backgroundColor: '#34C759',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <text style={{ color: '#fff', fontSize: 11 }}>Layer 3</text>
            </view>
          </view>
        </view>

        {/* Overlay demo */}
        <view style={{ marginBottom: 24 }}>
          <text style={{ fontSize: 14, fontWeight: '600', marginBottom: 12 }}>Overlay</text>
          <view style={{
            height: 100,
            backgroundColor: '#1c1c1e',
            borderRadius: 8,
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <text style={{ color: '#fff', fontSize: 14 }}>Background Content</text>

            {showOverlay && (
              <view style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 122, 255, 0.8)',
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Overlay Active</text>
              </view>
            )}
          </view>

          <view
            bindtap={() => setShowOverlay(!showOverlay)}
            style={{
              backgroundColor: showOverlay ? '#FF3B30' : '#007AFF',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 8,
            }}
          >
            <text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
              {showOverlay ? 'Hide Overlay' : 'Show Overlay'}
            </text>
          </view>
        </view>
      </view>
    </scroll-view>
  );
}
