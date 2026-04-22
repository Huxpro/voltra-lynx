import { useState, useCallback } from '@lynx-js/react';
import { Voltra, renderVoltraVariantToJson } from '@use-voltra/ios';

const IMAGE =
  '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';

interface ComponentExample {
  id: string;
  title: string;
  description: string;
  renderJson: () => string;
}

const COMPONENTS_DATA: ComponentExample[] = [
  {
    id: 'button',
    title: 'Button',
    description: 'An interactive button component for user actions.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.Button id="primary-button">
              <Voltra.Text>Primary Button</Voltra.Text>
            </Voltra.Button>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'text',
    title: 'Text',
    description: 'Basic text component with styling capabilities.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack>
              <Voltra.Text style={{ color: '#FFFFFF', fontSize: 16 } as any}>Hello World</Voltra.Text>
              <Voltra.Text style={{ color: '#3B82F6', fontSize: 14, fontWeight: 'bold' } as any}>Styled Text</Voltra.Text>
            </Voltra.VStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'vstack',
    title: 'VStack',
    description: 'Vertical stack layout component for arranging elements vertically.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12 } as any}>
              <Voltra.Text>Item 1</Voltra.Text>
              <Voltra.Text>Item 2</Voltra.Text>
              <Voltra.Text>Item 3</Voltra.Text>
            </Voltra.VStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'hstack',
    title: 'HStack',
    description: 'Horizontal stack layout component for arranging elements horizontally.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.HStack style={{ backgroundColor: '#334155', padding: 12 } as any}>
              <Voltra.Text>Left</Voltra.Text>
              <Voltra.Text>Center</Voltra.Text>
              <Voltra.Text>Right</Voltra.Text>
            </Voltra.HStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'zstack',
    title: 'ZStack',
    description: 'Z-axis stack component for layering elements on top of each other.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.ZStack style={{ width: '100%', height: 60 } as any}>
              <Voltra.VStack style={{ backgroundColor: '#DC2626', flex: 1, opacity: 0.8 } as any}>
                <Voltra.Text>Background</Voltra.Text>
              </Voltra.VStack>
              <Voltra.VStack style={{ backgroundColor: '#2563EB', width: 120, height: 40, offsetX: 20, offsetY: 10 } as any}>
                <Voltra.Text>Overlay</Voltra.Text>
              </Voltra.VStack>
            </Voltra.ZStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'spacer',
    title: 'Spacer',
    description: 'Flexible spacer component for creating gaps between elements.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12, height: 100 } as any}>
              <Voltra.Text>Top Item</Voltra.Text>
              <Voltra.Spacer />
              <Voltra.Text>Bottom Item</Voltra.Text>
            </Voltra.VStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'divider',
    title: 'Divider',
    description: 'Visual separator component for dividing content sections.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12 } as any}>
              <Voltra.Text>Section 1</Voltra.Text>
              <Voltra.Divider style={{ marginTop: 8, marginBottom: 8 } as any} />
              <Voltra.Text>Section 2</Voltra.Text>
            </Voltra.VStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'image',
    title: 'Image',
    description: 'Component for displaying images with various sources and styling.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12 } as any} alignment="center">
              <Voltra.Image source={{ base64: IMAGE }} style={{ width: 50, height: 50, borderRadius: 8 } as any} />
            </Voltra.VStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'label',
    title: 'Label',
    description: 'Styled label component for displaying text with consistent formatting.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12 } as any}>
              <Voltra.Label title="Primary Label" systemImage="star.fill" style={{ color: '#FFFFFF' } as any} />
            </Voltra.VStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'toggle',
    title: 'Toggle',
    description: 'Interactive toggle switch component for boolean states.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12 } as any} alignment="center">
              <Voltra.Toggle defaultValue={true} />
            </Voltra.VStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'progress',
    title: 'Progress Components',
    description: 'Linear and circular progress indicators for showing completion states.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12 } as any} spacing={12}>
              <Voltra.LinearProgressView
                value={75}
                progressColor="#8232FF"
                label={<Voltra.Text>Downloading...</Voltra.Text>}
                currentValueLabel={<Voltra.Text>75%</Voltra.Text>}
              />
              <Voltra.CircularProgressView
                value={45}
                progressColor="#00D1FF"
                label={<Voltra.Text style={{ fontSize: 10 } as any}>Uptime</Voltra.Text>}
                currentValueLabel={<Voltra.Text style={{ fontSize: 10 } as any}>45%</Voltra.Text>}
                style={{ width: 60, height: 60 } as any}
              />
            </Voltra.VStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'gauge',
    title: 'Gauge',
    description: 'Circular gauge component for displaying values within a range.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12 } as any}>
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
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'timer',
    title: 'Timer',
    description: 'Countdown timer component for displaying remaining time.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12 } as any}>
              <Voltra.Timer endAtMs={1765384922000} />
              <Voltra.Text>1 hour remaining</Voltra.Text>
            </Voltra.VStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'symbol',
    title: 'Symbol',
    description: 'SF Symbols component for displaying system icons.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack style={{ backgroundColor: '#334155', padding: 12 } as any}>
              <Voltra.HStack>
                <Voltra.Symbol tintColor="#FFFFFF" name="star.fill" />
                <Voltra.Symbol tintColor="#FFFFFF" name="heart.fill" />
                <Voltra.Symbol tintColor="#FFFFFF" name="checkmark.circle.fill" />
              </Voltra.HStack>
            </Voltra.VStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'groupbox',
    title: 'GroupBox',
    description: 'Container component for grouping related elements with visual styling.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.GroupBox style={{ backgroundColor: '#334155', padding: 12 } as any} label={<Voltra.Text>Label</Voltra.Text>}>
              <Voltra.Text>Grouped Content</Voltra.Text>
            </Voltra.GroupBox>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'lineargradient',
    title: 'LinearGradient',
    description: 'Gradient background component for creating smooth color transitions.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.LinearGradient
              colors={['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#A855F7', '#EC4899']}
              start="leading"
              end="trailing"
            >
              <Voltra.Text>Gradient</Voltra.Text>
            </Voltra.LinearGradient>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'glass',
    title: 'Glass Components',
    description: 'Specialized glass effect components for iOS 26+ (Liquid Glass).',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.ZStack>
              <Voltra.LinearGradient
                colors={['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#A855F7', '#EC4899']}
                start="leading"
                end="trailing"
                style={{ width: '100%', height: '100%' } as any}
              />
              <Voltra.GlassContainer spacing={10} style={{ padding: 12 } as any}>
                <Voltra.VStack>
                  <Voltra.VStack style={{ padding: 12, borderRadius: 16, glassEffect: 'regular' } as any}>
                    <Voltra.Text style={{ color: '#000', fontWeight: '600' } as any}>Glass View</Voltra.Text>
                  </Voltra.VStack>
                  <Voltra.VStack style={{ padding: 12, borderRadius: 16, glassEffect: 'regular' } as any}>
                    <Voltra.Text style={{ color: '#000', fontWeight: '600' } as any}>Glass View</Voltra.Text>
                  </Voltra.VStack>
                </Voltra.VStack>
              </Voltra.GlassContainer>
            </Voltra.ZStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'mask',
    title: 'Mask',
    description: 'Component for applying masks to content for creative layouts.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.Mask maskElement={<Voltra.Text style={{ fontSize: 48, fontWeight: 'bold' } as any}>MASK</Voltra.Text>}>
              <Voltra.LinearGradient
                colors={['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#A855F7', '#EC4899']}
                start="leading"
                end="trailing"
              />
            </Voltra.Mask>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'view',
    title: 'View',
    description: 'Generic container with flexDirection support for custom layouts.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.View style={{ flexDirection: 'row', gap: 8, padding: 12, backgroundColor: '#334155' } as any}>
              <Voltra.Text style={{ color: '#FFFFFF' } as any}>Flex Row</Voltra.Text>
              <Voltra.Text style={{ color: '#3B82F6' } as any}>Item 2</Voltra.Text>
            </Voltra.View>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
];

export function ComponentsCatalogScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev: string | null) => (prev === id ? null : id));
  }, []);

  return (
    <scroll-view style={{ flex: 1 } as any} scroll-orientation="vertical">
      <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 }}>
        <text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF' } as any}>
          Components Showcase
        </text>
        <text style={{ fontSize: 14, lineHeight: 20, color: '#CBD5F5', marginBottom: 8 } as any}>
          Explore all available Voltra components. Each card shows the component name, description, and rendered JSON output. Tap a card to expand the JSON preview.
        </text>

        <view style={{ gap: 12, marginTop: 8 }}>
          {COMPONENTS_DATA.map((item) => (
            <view
              key={item.id}
              style={{
                backgroundColor: '#1E293B',
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: expandedId === item.id ? '#3B82F6' : '#334155',
              } as any}
              bindtap={() => toggleExpand(item.id)}
            >
              <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 } as any}>
                {item.title}
              </text>
              <text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 8 } as any}>
                {item.description}
              </text>

              {/* Always show a compact indicator */}
              <view style={{
                backgroundColor: '#0F172A',
                borderRadius: 8,
                padding: 10,
              } as any}>
                {expandedId === item.id ? (
                  <text style={{
                    fontSize: 10,
                    fontFamily: 'monospace',
                    color: '#4ADE80',
                    lineHeight: 14,
                  } as any}>
                    {item.renderJson()}
                  </text>
                ) : (
                  <text style={{ fontSize: 11, color: '#64748B' } as any}>
                    Tap to show JSON output
                  </text>
                )}
              </view>
            </view>
          ))}
        </view>

        {/* Summary */}
        <view style={{ marginTop: 20, padding: 12, backgroundColor: '#1E293B', borderRadius: 8 }}>
          <text style={{ fontSize: 13, color: '#94A3B8' } as any}>
            Total components: {COMPONENTS_DATA.length}
          </text>
        </view>
      </view>
    </scroll-view>
  );
}
