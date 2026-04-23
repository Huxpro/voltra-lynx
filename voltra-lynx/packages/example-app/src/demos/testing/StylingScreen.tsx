import { type ReactNode, useState } from '@lynx-js/react';
import { Voltra, renderVoltraVariantToJson } from '@use-voltra/ios';
import { VoltraPreview } from '../../components/VoltraPreview';

interface StylingExample {
  id: string;
  title: string;
  description: string;
  height: number;
  content: () => ReactNode;
}

const STYLING_DATA: StylingExample[] = [
  {
    id: 'padding',
    title: 'Padding',
    description: 'Demonstrates uniform padding on all edges.',
    height: 80,
    content: () => (
      <Voltra.VStack style={{ backgroundColor: '#3B82F6', padding: 16 }}>
        <Voltra.Text style={{ color: 'white' }}>Uniform Padding (16)</Voltra.Text>
      </Voltra.VStack>
    ),
  },
  {
    id: 'individual-padding',
    title: 'Individual Edge Padding',
    description: 'Padding applied to specific edges individually.',
    height: 100,
    content: () => (
      <Voltra.VStack
        style={{
          backgroundColor: '#10B981',
          paddingTop: 8,
          paddingBottom: 16,
          paddingLeft: 12,
          paddingRight: 20,
        }}
      >
        <Voltra.Text style={{ color: 'white' }}>T:8, B:16, L:12, R:20</Voltra.Text>
      </Voltra.VStack>
    ),
  },
  {
    id: 'horizontal-vertical-padding',
    title: 'Horizontal & Vertical Padding',
    description: 'Horizontal and vertical padding shortcuts.',
    height: 80,
    content: () => (
      <Voltra.VStack style={{ backgroundColor: '#F59E0B', paddingHorizontal: 20, paddingVertical: 12 }}>
        <Voltra.Text style={{ color: 'white' }}>Horizontal:20, Vertical:12</Voltra.Text>
      </Voltra.VStack>
    ),
  },
  {
    id: 'margin',
    title: 'Margin',
    description: 'Demonstrates uniform margin on all edges.',
    height: 100,
    content: () => (
      <Voltra.VStack style={{ backgroundColor: '#8B5CF6', margin: 12 }}>
        <Voltra.Text style={{ color: 'white' }}>Uniform Margin (12)</Voltra.Text>
      </Voltra.VStack>
    ),
  },
  {
    id: 'individual-margins',
    title: 'Individual Edge Margins',
    description: 'Margins applied to specific edges individually.',
    height: 100,
    content: () => (
      <Voltra.VStack
        style={{ backgroundColor: '#EF4444', marginTop: 8, marginBottom: 16, marginLeft: 12, marginRight: 20 }}
      >
        <Voltra.Text style={{ color: 'white' }}>T:8, B:16, L:12, R:20</Voltra.Text>
      </Voltra.VStack>
    ),
  },
  {
    id: 'text-colors',
    title: 'Text Colors',
    description: 'Different text colors using the color property.',
    height: 120,
    content: () => (
      <Voltra.VStack>
        <Voltra.Text style={{ color: '#FFFFFF' }}>White Text</Voltra.Text>
        <Voltra.Text style={{ color: '#3B82F6' }}>Blue Text</Voltra.Text>
        <Voltra.Text style={{ color: '#10B981' }}>Green Text</Voltra.Text>
        <Voltra.Text style={{ color: '#F59E0B' }}>Orange Text</Voltra.Text>
      </Voltra.VStack>
    ),
  },
  {
    id: 'background-colors',
    title: 'Background Colors',
    description: 'Different background colors applied to containers.',
    height: 100,
    content: () => (
      <Voltra.HStack>
        <Voltra.VStack style={{ backgroundColor: '#3B82F6', flexGrowWidth: true, padding: 8 }}>
          <Voltra.Text style={{ color: 'white' }}>Blue</Voltra.Text>
        </Voltra.VStack>
        <Voltra.VStack style={{ backgroundColor: '#10B981', flexGrowWidth: true, padding: 8 }}>
          <Voltra.Text style={{ color: 'white' }}>Green</Voltra.Text>
        </Voltra.VStack>
        <Voltra.VStack style={{ backgroundColor: '#F59E0B', flexGrowWidth: true, padding: 8 }}>
          <Voltra.Text style={{ color: 'white' }}>Orange</Voltra.Text>
        </Voltra.VStack>
      </Voltra.HStack>
    ),
  },
  {
    id: 'borders',
    title: 'Borders',
    description: 'Border radius, width, and color properties.',
    height: 120,
    content: () => (
      <Voltra.HStack>
        <Voltra.VStack
          style={{
            backgroundColor: '#3B82F6',
            borderRadius: 8,
            borderWidth: 2,
            borderColor: '#1E40AF',
            flexGrowWidth: true,
            padding: 12,
          }}
        >
          <Voltra.Text style={{ color: 'white' }}>Rounded</Voltra.Text>
        </Voltra.VStack>
        <Voltra.VStack
          style={{
            backgroundColor: '#10B981',
            borderRadius: 120,
            borderWidth: 3,
            borderColor: '#047857',
            flexGrowWidth: true,
            padding: 12,
          }}
        >
          <Voltra.Text style={{ color: 'white' }}>More Rounded</Voltra.Text>
        </Voltra.VStack>
      </Voltra.HStack>
    ),
  },
  {
    id: 'shadows',
    title: 'Shadows',
    description: 'Shadow effects with color, offset, opacity, and radius.',
    height: 100,
    content: () => (
      <Voltra.VStack
        style={{
          backgroundColor: '#FFFFFF',
          shadowColor: '#FF0000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 8,
          padding: 16,
        }}
      >
        <Voltra.Text style={{ color: '#1F2937' }}>Shadow Effect</Voltra.Text>
      </Voltra.VStack>
    ),
  },
  {
    id: 'typography',
    title: 'Typography',
    description: 'Font size, weight, and letter spacing variations.',
    height: 140,
    content: () => (
      <Voltra.VStack>
        <Voltra.Text style={{ color: '#FFFFFF', fontSize: 12 }}>Small Text (12px)</Voltra.Text>
        <Voltra.Text style={{ color: '#FFFFFF', fontSize: 16 }}>Normal Text (16px)</Voltra.Text>
        <Voltra.Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' }}>Large Bold (20px)</Voltra.Text>
        <Voltra.Text style={{ color: '#3B82F6', letterSpacing: 2 }}>Spaced Letters</Voltra.Text>
      </Voltra.VStack>
    ),
  },
  {
    id: 'opacity',
    title: 'Opacity',
    description: 'Opacity values applied to containers.',
    height: 100,
    content: () => (
      <Voltra.HStack>
        <Voltra.VStack style={{ backgroundColor: '#3B82F6', opacity: 1.0, flexGrowWidth: true, padding: 8 }}>
          <Voltra.Text style={{ color: 'white' }}>100%</Voltra.Text>
        </Voltra.VStack>
        <Voltra.VStack style={{ backgroundColor: '#3B82F6', opacity: 0.7, flexGrowWidth: true, padding: 8 }}>
          <Voltra.Text style={{ color: 'white' }}>70%</Voltra.Text>
        </Voltra.VStack>
        <Voltra.VStack style={{ backgroundColor: '#3B82F6', opacity: 0.4, flexGrowWidth: true, padding: 8 }}>
          <Voltra.Text style={{ color: 'white' }}>40%</Voltra.Text>
        </Voltra.VStack>
      </Voltra.HStack>
    ),
  },
  {
    id: 'combined-styling',
    title: 'Combined Styling',
    description: 'A complex example combining multiple styling properties.',
    height: 120,
    content: () => (
      <Voltra.VStack
        style={{
          backgroundColor: '#8B5CF6',
          borderRadius: 12,
          borderWidth: 2,
          borderColor: '#7C3AED',
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          padding: 16,
          margin: 8,
        }}
      >
        <Voltra.Text
          style={{
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 'bold',
            letterSpacing: 0.5,
          }}
        >
          Complex Example
        </Voltra.Text>
        <Voltra.Text
          style={{
            color: '#E9D5FF',
            fontSize: 12,
            marginTop: 4,
          }}
        >
          Multiple properties combined
        </Voltra.Text>
      </Voltra.VStack>
    ),
  },
];

function ExampleCard({ item }: { item: StylingExample }) {
  const [showJson, setShowJson] = useState(false);
  const voltraContent = item.content();

  let jsonText = '';
  if (showJson) {
    try {
      jsonText = JSON.stringify(renderVoltraVariantToJson(voltraContent), null, 2);
    } catch {
      jsonText = '(render error)';
    }
  }

  return (
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
      <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 } as any}>
        {item.title}
      </text>
      <text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 10 } as any}>
        {item.description}
      </text>

      {/* Live SwiftUI Preview */}
      <view style={{
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        overflow: 'hidden',
      } as any}>
        <VoltraPreview id={`styling-${item.id}`} height={item.height}>
          {voltraContent}
        </VoltraPreview>
      </view>

      {/* Toggle JSON */}
      <view
        bindtap={() => setShowJson(!showJson)}
        style={{
          paddingTop: 6,
          paddingBottom: 6,
          alignItems: 'center',
        } as any}
      >
        <text style={{ fontSize: 11, color: '#64748B' } as any}>
          {showJson ? 'Hide JSON' : 'Show JSON'}
        </text>
      </view>

      {showJson ? (
        <view style={{
          backgroundColor: '#1E293B',
          borderRadius: '12px',
          padding: 10,
        } as any}>
          <text style={{
            fontSize: 10,
            fontFamily: 'monospace',
            color: '#4ADE80',
          } as any}>
            {jsonText}
          </text>
        </view>
      ) : null}
    </view>
  );
}

export function StylingScreen() {
  return (
    <scroll-view style={{ linearWeight: 1 } as any} scroll-orientation="vertical">
      <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 }}>
        <text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF' } as any}>
          Styling Examples
        </text>
        <text style={{ fontSize: 14, color: '#CBD5F5', marginBottom: 8 } as any}>
          Explore Voltra's styling capabilities. Each example shows a live SwiftUI preview rendered via the voltra-preview custom element.
        </text>

        <view style={{ marginTop: 8 }}>
          {STYLING_DATA.map((item) => (
            <ExampleCard key={item.id} item={item} />
          ))}
        </view>
      </view>
    </scroll-view>
  );
}
