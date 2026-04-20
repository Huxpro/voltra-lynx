import { useState } from '@lynx-js/react';

interface GradientPreset {
  name: string;
  colors: string[];
}

const gradientPresets: GradientPreset[] = [
  { name: 'Sunrise', colors: ['#FF512F', '#F09819'] },
  { name: 'Ocean', colors: ['#2193b0', '#6dd5ed'] },
  { name: 'Forest', colors: ['#134E5E', '#71B280'] },
  { name: 'Purple Haze', colors: ['#7303c0', '#ec38bc'] },
  { name: 'Midnight', colors: ['#232526', '#414345'] },
  { name: 'Peach', colors: ['#ED4264', '#FFEDBC'] },
  { name: 'Aqua', colors: ['#00d2ff', '#3a7bd5'] },
  { name: 'Ember', colors: ['#ff0844', '#ffb199'] },
];

export function GradientPlaygroundScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = gradientPresets[selectedIndex];

  return (
    <scroll-view style={{ flex: 1 }}>
      <view style={{ padding: 16 }}>
        <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          Gradient Playground
        </text>
        <text style={{ color: '#666', marginBottom: 24 }}>
          Gradient style showcase using layered color views.
        </text>

        {/* Large preview */}
        <view style={{
          height: 180,
          borderRadius: 16,
          overflow: 'hidden',
          marginBottom: 24,
          flexDirection: 'row',
        }}>
          <view style={{ flex: 1, backgroundColor: selected.colors[0] }} />
          <view style={{ flex: 1, backgroundColor: mixColors(selected.colors[0], selected.colors[1], 0.33) }} />
          <view style={{ flex: 1, backgroundColor: mixColors(selected.colors[0], selected.colors[1], 0.66) }} />
          <view style={{ flex: 1, backgroundColor: selected.colors[1] }} />
        </view>

        {/* Gradient info */}
        <view style={{ marginBottom: 20, alignItems: 'center' }}>
          <text style={{ fontSize: 18, fontWeight: '600' }}>{selected.name}</text>
          <text style={{ color: '#666', fontSize: 13, marginTop: 4 }}>
            {selected.colors[0]} → {selected.colors[1]}
          </text>
        </view>

        {/* Presets grid */}
        <text style={{ fontSize: 14, fontWeight: '600', marginBottom: 12 }}>Presets</text>
        <view style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
          {gradientPresets.map((preset, i) => (
            <view
              key={preset.name}
              bindtap={() => setSelectedIndex(i)}
              style={{
                width: '47%',
                height: 60,
                borderRadius: 10,
                overflow: 'hidden',
                flexDirection: 'row',
                borderWidth: selectedIndex === i ? 3 : 0,
                borderColor: '#007AFF',
              }}
            >
              <view style={{ flex: 1, backgroundColor: preset.colors[0] }} />
              <view style={{ flex: 1, backgroundColor: preset.colors[1] }} />
            </view>
          ))}
        </view>

        {/* Direction variants */}
        <text style={{ fontSize: 14, fontWeight: '600', marginBottom: 12 }}>Direction Variants</text>
        <view style={{ gap: 10 }}>
          {/* Horizontal */}
          <view>
            <text style={{ color: '#666', fontSize: 12, marginBottom: 4 }}>Horizontal</text>
            <view style={{ height: 40, borderRadius: 8, overflow: 'hidden', flexDirection: 'row' }}>
              <view style={{ flex: 1, backgroundColor: selected.colors[0] }} />
              <view style={{ flex: 1, backgroundColor: mixColors(selected.colors[0], selected.colors[1], 0.5) }} />
              <view style={{ flex: 1, backgroundColor: selected.colors[1] }} />
            </view>
          </view>

          {/* Vertical */}
          <view>
            <text style={{ color: '#666', fontSize: 12, marginBottom: 4 }}>Vertical</text>
            <view style={{ height: 60, borderRadius: 8, overflow: 'hidden' }}>
              <view style={{ flex: 1, backgroundColor: selected.colors[0] }} />
              <view style={{ flex: 1, backgroundColor: mixColors(selected.colors[0], selected.colors[1], 0.5) }} />
              <view style={{ flex: 1, backgroundColor: selected.colors[1] }} />
            </view>
          </view>

          {/* Radial-like (concentric boxes) */}
          <view>
            <text style={{ color: '#666', fontSize: 12, marginBottom: 4 }}>Radial (simulated)</text>
            <view style={{
              height: 80,
              backgroundColor: selected.colors[1],
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <view style={{
                width: '70%',
                height: '70%',
                backgroundColor: mixColors(selected.colors[0], selected.colors[1], 0.5),
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <view style={{
                  width: '60%',
                  height: '60%',
                  backgroundColor: selected.colors[0],
                  borderRadius: 8,
                }} />
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  );
}

// Simple color mixing helper (approximation)
function mixColors(hex1: string, hex2: string, ratio: number): string {
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
