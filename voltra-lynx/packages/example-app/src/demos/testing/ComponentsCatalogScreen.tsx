import { type ReactNode, useState } from '@lynx-js/react';
import { Voltra, renderVoltraVariantToJson } from '@use-voltra/ios';
import { VoltraPreview } from '../../components/VoltraPreview';

const IMAGE =
  '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';

interface ComponentExample {
  id: string;
  title: string;
  description: string;
  height: number;
  content: () => ReactNode;
}

const COMPONENTS_DATA: ComponentExample[] = [
  {
    id: 'button',
    title: 'Button',
    description: 'An interactive button component for user actions.',
    height: 80,
    content: () => (
      <Voltra.Button id="primary-button">
        <Voltra.Text>Primary Button</Voltra.Text>
      </Voltra.Button>
    ),
  },
  {
    id: 'text',
    title: 'Text',
    description: 'Basic text component with styling capabilities.',
    height: 100,
    content: () => (
      <Voltra.VStack>
        <Voltra.Text style={{ color: '#FFFFFF', fontSize: 16 }}>Hello World</Voltra.Text>
        <Voltra.Text style={{ color: '#3B82F6', fontSize: 14, fontWeight: 'bold' }}>Styled Text</Voltra.Text>
      </Voltra.VStack>
    ),
  },
  {
    id: 'vstack',
    title: 'VStack',
    description: 'Vertical stack layout component for arranging elements vertically.',
    height: 120,
    content: () => (
      <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12 }}>
        <Voltra.Text>Item 1</Voltra.Text>
        <Voltra.Text>Item 2</Voltra.Text>
        <Voltra.Text>Item 3</Voltra.Text>
      </Voltra.VStack>
    ),
  },
  {
    id: 'hstack',
    title: 'HStack',
    description: 'Horizontal stack layout component for arranging elements horizontally.',
    height: 80,
    content: () => (
      <Voltra.HStack style={{ backgroundColor: '#334155', padding: 12 }}>
        <Voltra.Text>Left</Voltra.Text>
        <Voltra.Text>Center</Voltra.Text>
        <Voltra.Text>Right</Voltra.Text>
      </Voltra.HStack>
    ),
  },
  {
    id: 'zstack',
    title: 'ZStack',
    description: 'Z-axis stack component for layering elements on top of each other.',
    height: 100,
    content: () => (
      <Voltra.ZStack style={{ width: '100%', height: 60 }}>
        <Voltra.VStack style={{ backgroundColor: '#DC2626', flex: 1, opacity: 0.8 }}>
          <Voltra.Text>Background</Voltra.Text>
        </Voltra.VStack>
        <Voltra.VStack style={{ backgroundColor: '#2563EB', width: 120, height: 40, offsetX: 20, offsetY: 10 }}>
          <Voltra.Text>Overlay</Voltra.Text>
        </Voltra.VStack>
      </Voltra.ZStack>
    ),
  },
  {
    id: 'spacer',
    title: 'Spacer',
    description: 'Flexible spacer component for creating gaps between elements.',
    height: 100,
    content: () => (
      <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12, height: 100 }}>
        <Voltra.Text>Top Item</Voltra.Text>
        <Voltra.Spacer />
        <Voltra.Text>Bottom Item</Voltra.Text>
      </Voltra.VStack>
    ),
  },
  {
    id: 'divider',
    title: 'Divider',
    description: 'Visual separator component for dividing content sections.',
    height: 100,
    content: () => (
      <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12 }}>
        <Voltra.Text>Section 1</Voltra.Text>
        <Voltra.Divider style={{ marginVertical: 8 }} />
        <Voltra.Text>Section 2</Voltra.Text>
      </Voltra.VStack>
    ),
  },
  {
    id: 'image',
    title: 'Image',
    description: 'Component for displaying images with various sources and styling.',
    height: 200,
    content: () => (
      <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12 }} alignment="center">
        <Voltra.Image source={{ base64: IMAGE }} style={{ width: 50, height: 50, borderRadius: 8 }} />
      </Voltra.VStack>
    ),
  },
  {
    id: 'label',
    title: 'Label',
    description: 'Styled label component for displaying text with consistent formatting.',
    height: 80,
    content: () => (
      <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12 }}>
        <Voltra.Label title="Primary Label" systemImage="star.fill" style={{ color: '#FFFFFF' }} />
      </Voltra.VStack>
    ),
  },
  {
    id: 'toggle',
    title: 'Toggle',
    description: 'Interactive toggle switch component for boolean states.',
    height: 80,
    content: () => (
      <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12 }} alignment="center">
        <Voltra.Toggle defaultValue={true} />
      </Voltra.VStack>
    ),
  },
  {
    id: 'progress',
    title: 'Progress Components',
    description: 'Linear and circular progress indicators for showing completion states.',
    height: 160,
    content: () => (
      <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12 }} spacing={12}>
        <Voltra.LinearProgressView
          value={75}
          progressColor="#8232FF"
          label={<Voltra.Text>Downloading...</Voltra.Text>}
          currentValueLabel={<Voltra.Text>75%</Voltra.Text>}
        />
        <Voltra.CircularProgressView
          value={45}
          progressColor="#00D1FF"
          label={<Voltra.Text style={{ fontSize: 10 }}>Uptime</Voltra.Text>}
          currentValueLabel={<Voltra.Text style={{ fontSize: 10 }}>45%</Voltra.Text>}
          style={{ width: 60, height: 60 }}
        />
      </Voltra.VStack>
    ),
  },
  {
    id: 'gauge',
    title: 'Gauge',
    description: 'Circular gauge component for displaying values within a range.',
    height: 120,
    content: () => (
      <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12 }}>
        <Voltra.Gauge
          minimumValue={0}
          value={50}
          maximumValue={100}
          tintColor="#8232FF"
          gaugeStyle="accessoryLinearCapacity"
          currentValueLabel={<Voltra.Text>50/100</Voltra.Text>}
          minimumValueLabel={<Voltra.Text>01234</Voltra.Text>}
          maximumValueLabel={<Voltra.Text>12345</Voltra.Text>}
        />
      </Voltra.VStack>
    ),
  },
  {
    id: 'timer',
    title: 'Timer',
    description: 'Countdown timer component for displaying remaining time.',
    height: 80,
    content: () => (
      <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12 }}>
        <Voltra.Timer endAtMs={1765384922000} />
        <Voltra.Text>1 hour remaining</Voltra.Text>
      </Voltra.VStack>
    ),
  },
  {
    id: 'symbol',
    title: 'Symbol',
    description: 'SF Symbols component for displaying system icons.',
    height: 80,
    content: () => (
      <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12 }}>
        <Voltra.HStack>
          <Voltra.Symbol tintColor="#FFFFFF" name="star.fill" />
          <Voltra.Symbol tintColor="#FFFFFF" name="heart.fill" />
          <Voltra.Symbol tintColor="#FFFFFF" name="checkmark.circle.fill" />
        </Voltra.HStack>
      </Voltra.VStack>
    ),
  },
  {
    id: 'groupbox',
    title: 'GroupBox',
    description: 'Container component for grouping related elements with visual styling.',
    height: 100,
    content: () => (
      <Voltra.GroupBox style={{ backgroundColor: '#334155', padding: 12 }} label={<Voltra.Text>Label</Voltra.Text>}>
        <Voltra.Text>Grouped Content</Voltra.Text>
      </Voltra.GroupBox>
    ),
  },
  {
    id: 'lineargradient',
    title: 'LinearGradient',
    description: 'Gradient background component for creating smooth color transitions.',
    height: 80,
    content: () => (
      <Voltra.LinearGradient
        colors={['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#A855F7', '#EC4899']}
        start="leading"
        end="trailing"
      >
        <Voltra.Text>Gradient</Voltra.Text>
      </Voltra.LinearGradient>
    ),
  },
  {
    id: 'glass',
    title: 'Glass Components',
    description: 'Specialized glass effect components for iOS 26+ (Liquid Glass).',
    height: 120,
    content: () => (
      <Voltra.ZStack>
        <Voltra.LinearGradient
          colors={['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#A855F7', '#EC4899']}
          start="leading"
          end="trailing"
          style={{ width: '100%', height: '100%' }}
        />
        <Voltra.GlassContainer spacing={10} style={{ padding: 12 }}>
          <Voltra.VStack>
            <Voltra.VStack style={{ padding: 12, borderRadius: 16, glassEffect: 'regular' }}>
              <Voltra.Text style={{ color: '#000', fontWeight: '600' }}>Glass View</Voltra.Text>
            </Voltra.VStack>
            <Voltra.VStack style={{ padding: 12, borderRadius: 16, glassEffect: 'regular' }}>
              <Voltra.Text style={{ color: '#000', fontWeight: '600' }}>Glass View</Voltra.Text>
            </Voltra.VStack>
          </Voltra.VStack>
        </Voltra.GlassContainer>
      </Voltra.ZStack>
    ),
  },
  {
    id: 'mask',
    title: 'Mask',
    description: 'Component for applying masks to content for creative layouts.',
    height: 100,
    content: () => (
      <Voltra.Mask maskElement={<Voltra.Text style={{ fontSize: 48, fontWeight: 'bold' }}>MASK</Voltra.Text>}>
        <Voltra.LinearGradient
          colors={['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#A855F7', '#EC4899']}
          start="leading"
          end="trailing"
        />
      </Voltra.Mask>
    ),
  },
];

function ExampleCard({ item }: { item: ComponentExample }) {
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

      <view style={{
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        padding: 16,
        overflow: 'hidden',
      } as any}>
        <VoltraPreview id={`component-${item.id}`} height={item.height}>
          {voltraContent}
        </VoltraPreview>
      </view>

      <view
        bindtap={() => setShowJson(!showJson)}
        style={{ paddingTop: 6, paddingBottom: 6, alignItems: 'center' } as any}
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
          <text style={{ fontSize: 10, fontFamily: 'monospace', color: '#4ADE80' } as any}>
            {jsonText}
          </text>
        </view>
      ) : null}
    </view>
  );
}

export function ComponentsCatalogScreen() {
  return (
    <scroll-view style={{ linearWeight: 1 } as any} scroll-orientation="vertical">
      <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 }}>
        <text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF' } as any}>
          Components Showcase
        </text>
        <text style={{ fontSize: 14, color: '#CBD5F5', marginBottom: 8 } as any}>
          Explore all available Voltra components. Each example demonstrates the component's functionality and styling capabilities within Live Activities.
        </text>

        <view style={{ marginTop: 8 }}>
          {COMPONENTS_DATA.map((item) => (
            <ExampleCard key={item.id} item={item} />
          ))}
        </view>
      </view>
    </scroll-view>
  );
}
