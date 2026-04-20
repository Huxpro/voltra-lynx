import { useState } from '@lynx-js/react';

interface ColorSwatch {
  name: string;
  shades: { label: string; hex: string }[];
}

const materialColors: ColorSwatch[] = [
  {
    name: 'Red',
    shades: [
      { label: '100', hex: '#FFCDD2' },
      { label: '300', hex: '#E57373' },
      { label: '500', hex: '#F44336' },
      { label: '700', hex: '#D32F2F' },
      { label: '900', hex: '#B71C1C' },
    ],
  },
  {
    name: 'Blue',
    shades: [
      { label: '100', hex: '#BBDEFB' },
      { label: '300', hex: '#64B5F6' },
      { label: '500', hex: '#2196F3' },
      { label: '700', hex: '#1976D2' },
      { label: '900', hex: '#0D47A1' },
    ],
  },
  {
    name: 'Green',
    shades: [
      { label: '100', hex: '#C8E6C9' },
      { label: '300', hex: '#81C784' },
      { label: '500', hex: '#4CAF50' },
      { label: '700', hex: '#388E3C' },
      { label: '900', hex: '#1B5E20' },
    ],
  },
  {
    name: 'Purple',
    shades: [
      { label: '100', hex: '#E1BEE7' },
      { label: '300', hex: '#BA68C8' },
      { label: '500', hex: '#9C27B0' },
      { label: '700', hex: '#7B1FA2' },
      { label: '900', hex: '#4A148C' },
    ],
  },
  {
    name: 'Orange',
    shades: [
      { label: '100', hex: '#FFE0B2' },
      { label: '300', hex: '#FFB74D' },
      { label: '500', hex: '#FF9800' },
      { label: '700', hex: '#F57C00' },
      { label: '900', hex: '#E65100' },
    ],
  },
];

export function MaterialColorsWidget() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  return (
    <view style={{ flex: 1, padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Material Colors Widget
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Material Design color palette widget for Android.
      </text>

      {/* Color palette */}
      <view style={{ gap: 12, marginBottom: 16 }}>
        {materialColors.map((color) => (
          <view key={color.name}>
            <text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 }}>
              {color.name}
            </text>
            <view style={{ flexDirection: 'row', gap: 4 }}>
              {color.shades.map((shade) => (
                <view
                  key={shade.hex}
                  bindtap={() => setSelectedColor(shade.hex)}
                  style={{
                    flex: 1,
                    height: 44,
                    backgroundColor: shade.hex,
                    borderRadius: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: selectedColor === shade.hex ? 2 : 0,
                    borderColor: '#000',
                  }}
                >
                  <text style={{
                    color: parseInt(shade.label) <= 300 ? '#333' : '#fff',
                    fontSize: 9,
                    fontWeight: '600',
                  }}>
                    {shade.label}
                  </text>
                </view>
              ))}
            </view>
          </view>
        ))}
      </view>

      {/* Selected color info */}
      <view style={{
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}>
        <view style={{
          width: 36,
          height: 36,
          backgroundColor: selectedColor || '#ccc',
          borderRadius: 8,
        }} />
        <view>
          <text style={{ fontSize: 14, fontWeight: '600' }}>
            {selectedColor ? 'Selected' : 'Tap a color'}
          </text>
          <text style={{ color: '#666', fontSize: 13, fontFamily: 'monospace' }}>
            {selectedColor || '---'}
          </text>
        </view>
      </view>
    </view>
  );
}
