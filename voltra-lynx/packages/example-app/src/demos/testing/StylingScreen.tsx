import { useState } from '@lynx-js/react';

export function StylingScreen() {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <scroll-view style={{ flex: 1 }}>
      <view style={{ padding: 16 }}>
        <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          CSS Styling Showcase
        </text>
        <text style={{ color: '#666', marginBottom: 24 }}>
          Demonstrating various CSS styling capabilities in Lynx.
        </text>

        {/* Typography */}
        <view style={{ marginBottom: 24 }}>
          <text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Typography</text>
          <text style={{ fontSize: 28, fontWeight: 'bold' }}>Heading 1</text>
          <text style={{ fontSize: 22, fontWeight: '600' }}>Heading 2</text>
          <text style={{ fontSize: 18, fontWeight: '500' }}>Heading 3</text>
          <text style={{ fontSize: 16 }}>Body text</text>
          <text style={{ fontSize: 14, color: '#666' }}>Secondary text</text>
          <text style={{ fontSize: 12, color: '#999' }}>Caption text</text>
          <text style={{ fontSize: 14, fontStyle: 'italic' }}>Italic text</text>
          <text style={{ fontSize: 14, textDecorationLine: 'underline' }}>Underlined text</text>
        </view>

        {/* Colors and backgrounds */}
        <view style={{ marginBottom: 24 }}>
          <text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Colors & Backgrounds</text>
          <view style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#5856D6', '#AF52DE', '#FF2D55'].map((color) => (
              <view key={color} style={{
                width: 60,
                height: 60,
                backgroundColor: color,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <text style={{ color: '#fff', fontSize: 9 }}>{color}</text>
              </view>
            ))}
          </view>
        </view>

        {/* Border styles */}
        <view style={{ marginBottom: 24 }}>
          <text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Borders</text>
          <view style={{ gap: 8 }}>
            <view style={{ padding: 12, borderWidth: 1, borderColor: '#333', borderRadius: 0 }}>
              <text>Square border</text>
            </view>
            <view style={{ padding: 12, borderWidth: 2, borderColor: '#007AFF', borderRadius: 8 }}>
              <text>Rounded border</text>
            </view>
            <view style={{ padding: 12, borderWidth: 3, borderColor: '#FF3B30', borderRadius: 16 }}>
              <text>Thick rounded border</text>
            </view>
            <view style={{ padding: 12, borderLeftWidth: 4, borderLeftColor: '#34C759', backgroundColor: '#f5f5f5' }}>
              <text>Left border accent</text>
            </view>
          </view>
        </view>

        {/* Shadows and elevation */}
        <view style={{ marginBottom: 24 }}>
          <text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Elevation</text>
          <view style={{ gap: 12 }}>
            <view style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#eee' }}>
              <text>Level 0 (flat)</text>
            </view>
            <view style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd' }}>
              <text>Level 1 (subtle)</text>
            </view>
            <view style={{ padding: 16, backgroundColor: '#fff', borderRadius: 12, borderWidth: 2, borderColor: '#ccc' }}>
              <text>Level 2 (raised)</text>
            </view>
          </view>
        </view>

        {/* Opacity */}
        <view style={{ marginBottom: 24 }}>
          <text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Opacity</text>
          <view style={{ flexDirection: 'row', gap: 8 }}>
            {[1.0, 0.8, 0.6, 0.4, 0.2].map((opacity) => (
              <view key={`op-${opacity}`} style={{
                flex: 1,
                height: 50,
                backgroundColor: '#007AFF',
                opacity,
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <text style={{ color: '#fff', fontSize: 11 }}>{opacity}</text>
              </view>
            ))}
          </view>
        </view>

        {/* Spacing */}
        <view style={{ marginBottom: 24 }}>
          <text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Spacing</text>
          <view style={{ backgroundColor: '#e5e5e5', padding: 4 }}>
            <view style={{ backgroundColor: '#007AFF', padding: 8, borderRadius: 4 }}>
              <view style={{ backgroundColor: '#fff', padding: 16, borderRadius: 4 }}>
                <text style={{ textAlign: 'center' }}>Nested padding: 4 &gt; 8 &gt; 16</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  );
}
