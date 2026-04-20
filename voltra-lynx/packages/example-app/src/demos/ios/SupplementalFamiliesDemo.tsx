import { useState } from '@lynx-js/react';

type WidgetFamily = 'small' | 'medium' | 'large' | 'accessoryCircular' | 'accessoryRectangular' | 'accessoryInline';

interface FamilyInfo {
  id: WidgetFamily;
  label: string;
  width: number;
  height: number;
  description: string;
}

const families: FamilyInfo[] = [
  { id: 'small', label: 'Small', width: 155, height: 155, description: 'Home screen small widget' },
  { id: 'medium', label: 'Medium', width: 329, height: 155, description: 'Home screen medium widget' },
  { id: 'large', label: 'Large', width: 329, height: 345, description: 'Home screen large widget' },
  { id: 'accessoryCircular', label: 'Circular', width: 50, height: 50, description: 'Lock screen circular' },
  { id: 'accessoryRectangular', label: 'Rectangular', width: 160, height: 50, description: 'Lock screen rectangular' },
  { id: 'accessoryInline', label: 'Inline', width: 200, height: 20, description: 'Lock screen inline text' },
];

export function SupplementalFamiliesDemo() {
  const [selectedFamily, setSelectedFamily] = useState<WidgetFamily>('medium');
  const selected = families.find((f) => f.id === selectedFamily)!;

  // Scale factor for preview
  const maxWidth = 300;
  const scale = Math.min(1, maxWidth / selected.width);
  const previewWidth = selected.width * scale;
  const previewHeight = selected.height * scale;

  return (
    <view style={{ flex: 1, padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Supplemental Widget Families
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Preview different widget family sizes and their supplemental configurations.
      </text>

      {/* Family selector */}
      <scroll-view scroll-orientation="horizontal" style={{ marginBottom: 20 }}>
        <view style={{ flexDirection: 'row', gap: 8 }}>
          {families.map((family) => (
            <view
              key={family.id}
              bindtap={() => setSelectedFamily(family.id)}
              style={{
                backgroundColor: selectedFamily === family.id ? '#007AFF' : '#e5e5e5',
                paddingLeft: 14, paddingRight: 14,
                paddingTop: 8, paddingBottom: 8,
                borderRadius: 8,
              }}
            >
              <text style={{
                color: selectedFamily === family.id ? '#fff' : '#333',
                fontSize: 13,
                fontWeight: '600',
              }}>
                {family.label}
              </text>
            </view>
          ))}
        </view>
      </scroll-view>

      {/* Preview area */}
      <view style={{
        alignItems: 'center',
        marginBottom: 24,
        padding: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 16,
      }}>
        <text style={{ color: '#666', fontSize: 12, marginBottom: 12 }}>
          {selected.width} x {selected.height} pt
        </text>

        {/* Widget preview */}
        <view style={{
          width: previewWidth,
          height: previewHeight,
          backgroundColor: '#1c1c1e',
          borderRadius: selected.id.startsWith('accessory') ? 8 : 16,
          padding: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <text style={{ color: '#fff', fontSize: selected.id === 'accessoryInline' ? 11 : 14, fontWeight: '600' }}>
            {selected.label} Widget
          </text>
          {selected.height > 50 && (
            <text style={{ color: '#aaa', fontSize: 11, marginTop: 4 }}>
              Content Area
            </text>
          )}
        </view>
      </view>

      {/* Info */}
      <view style={{
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 14,
      }}>
        <text style={{ fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
          {selected.label}
        </text>
        <text style={{ color: '#666', fontSize: 13 }}>
          {selected.description}
        </text>
        <text style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
          Family ID: {selected.id}
        </text>
      </view>
    </view>
  );
}
