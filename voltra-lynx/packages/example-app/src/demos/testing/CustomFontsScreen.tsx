import { useState } from '@lynx-js/react';

interface FontEntry {
  name: string;
  family: string;
  loaded: boolean;
  weight: string;
}

const mockFonts: FontEntry[] = [
  { name: 'Inter Regular', family: 'Inter', loaded: true, weight: '400' },
  { name: 'Inter Bold', family: 'Inter', loaded: true, weight: '700' },
  { name: 'Roboto Mono', family: 'RobotoMono', loaded: true, weight: '400' },
  { name: 'SF Pro Display', family: 'SFProDisplay', loaded: false, weight: '400' },
  { name: 'Playfair Display', family: 'PlayfairDisplay', loaded: false, weight: '700' },
];

const sampleText = 'The quick brown fox jumps over the lazy dog. 0123456789';

export function CustomFontsScreen() {
  const [fonts, setFonts] = useState(mockFonts);
  const [selectedFont, setSelectedFont] = useState(0);
  const [fontSize, setFontSize] = useState(16);

  const loadFont = (index: number) => {
    // Simulate font loading
    setFonts(fonts.map((f, i) =>
      i === index ? { ...f, loaded: true } : f
    ));
  };

  const selected = fonts[selectedFont];
  const loadedCount = fonts.filter((f) => f.loaded).length;

  return (
    <scroll-view style={{ flex: 1 }}>
      <view style={{ padding: 16 }}>
        <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          Custom Fonts
        </text>
        <text style={{ color: '#666', marginBottom: 24 }}>
          Custom font loading and preview demo.
        </text>

        {/* Preview area */}
        <view style={{
          backgroundColor: '#1c1c1e',
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
        }}>
          <text style={{ color: '#666', fontSize: 11, marginBottom: 8 }}>
            Preview: {selected.name} ({selected.weight})
          </text>
          <text style={{
            color: '#fff',
            fontSize: fontSize,
            fontWeight: selected.weight as any,
            fontFamily: selected.family,
          }}>
            {sampleText}
          </text>
        </view>

        {/* Font size control */}
        <view style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 }}>
          <text style={{ fontSize: 13, fontWeight: '600' }}>Size: {fontSize}px</text>
          <view
            bindtap={() => setFontSize(Math.max(10, fontSize - 2))}
            style={{ backgroundColor: '#e5e5e5', paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6, borderRadius: 6 }}
          >
            <text style={{ fontSize: 16, fontWeight: 'bold' }}>-</text>
          </view>
          <view
            bindtap={() => setFontSize(Math.min(32, fontSize + 2))}
            style={{ backgroundColor: '#e5e5e5', paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6, borderRadius: 6 }}
          >
            <text style={{ fontSize: 16, fontWeight: 'bold' }}>+</text>
          </view>
        </view>

        {/* Font list */}
        <text style={{ fontSize: 14, fontWeight: '600', marginBottom: 12 }}>
          Fonts ({loadedCount}/{fonts.length} loaded)
        </text>
        <view style={{ gap: 8, marginBottom: 20 }}>
          {fonts.map((font, i) => (
            <view
              key={font.name}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                backgroundColor: selectedFont === i ? '#f0f7ff' : '#f5f5f5',
                borderRadius: 10,
                borderWidth: selectedFont === i ? 1 : 0,
                borderColor: '#007AFF',
                gap: 10,
              }}
            >
              {/* Status */}
              <view style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: font.loaded ? '#34C759' : '#FF9500',
              }} />

              {/* Info */}
              <view
                bindtap={() => setSelectedFont(i)}
                style={{ flex: 1 }}
              >
                <text style={{ fontSize: 14, fontWeight: '500' }}>{font.name}</text>
                <text style={{ fontSize: 11, color: '#666' }}>
                  Family: {font.family} | Weight: {font.weight}
                </text>
              </view>

              {/* Load button */}
              {!font.loaded && (
                <view
                  bindtap={() => loadFont(i)}
                  style={{
                    backgroundColor: '#007AFF',
                    paddingLeft: 10, paddingRight: 10,
                    paddingTop: 5, paddingBottom: 5,
                    borderRadius: 6,
                  }}
                >
                  <text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>Load</text>
                </view>
              )}
            </view>
          ))}
        </view>

        {/* Typography scale */}
        <text style={{ fontSize: 14, fontWeight: '600', marginBottom: 12 }}>Typography Scale</text>
        <view style={{ gap: 6 }}>
          {[32, 24, 20, 16, 14, 12, 10].map((size) => (
            <text key={`size-${size}`} style={{ fontSize: size, fontFamily: selected.family, fontWeight: selected.weight as any }}>
              {size}px - Sample Text
            </text>
          ))}
        </view>
      </view>
    </scroll-view>
  );
}
