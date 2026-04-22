import { Voltra, renderVoltraVariantToJson } from '@use-voltra/ios';

interface StylingExample {
  id: string;
  title: string;
  description: string;
  renderJson: () => string;
}

const STYLING_DATA: StylingExample[] = [
  {
    id: 'padding',
    title: 'Padding',
    description: 'Demonstrates uniform padding on all edges.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack style={{ backgroundColor: '#3B82F6', padding: 16 } as any}>
              <Voltra.Text style={{ color: 'white' } as any}>Uniform Padding (16)</Voltra.Text>
            </Voltra.VStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'individual-padding',
    title: 'Individual Edge Padding',
    description: 'Padding applied to specific edges individually.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack
              style={{
                backgroundColor: '#10B981',
                paddingTop: 8,
                paddingBottom: 16,
                paddingLeft: 12,
                paddingRight: 20,
              } as any}
            >
              <Voltra.Text style={{ color: 'white' } as any}>T:8, B:16, L:12, R:20</Voltra.Text>
            </Voltra.VStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'horizontal-vertical-padding',
    title: 'Horizontal & Vertical Padding',
    description: 'Horizontal and vertical padding shortcuts.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack style={{ backgroundColor: '#F59E0B', paddingLeft: 20, paddingRight: 20, paddingTop: 12, paddingBottom: 12 } as any}>
              <Voltra.Text style={{ color: 'white' } as any}>Horizontal:20, Vertical:12</Voltra.Text>
            </Voltra.VStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'margin',
    title: 'Margin',
    description: 'Demonstrates uniform margin on all edges.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack style={{ backgroundColor: '#8B5CF6', margin: 12 } as any}>
              <Voltra.Text style={{ color: 'white' } as any}>Uniform Margin (12)</Voltra.Text>
            </Voltra.VStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'individual-margins',
    title: 'Individual Edge Margins',
    description: 'Margins applied to specific edges individually.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack
              style={{ backgroundColor: '#EF4444', marginTop: 8, marginBottom: 16, marginLeft: 12, marginRight: 20 } as any}
            >
              <Voltra.Text style={{ color: 'white' } as any}>T:8, B:16, L:12, R:20</Voltra.Text>
            </Voltra.VStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'text-colors',
    title: 'Text Colors',
    description: 'Different text colors using the color property.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack>
              <Voltra.Text style={{ color: '#FFFFFF' } as any}>White Text</Voltra.Text>
              <Voltra.Text style={{ color: '#3B82F6' } as any}>Blue Text</Voltra.Text>
              <Voltra.Text style={{ color: '#10B981' } as any}>Green Text</Voltra.Text>
              <Voltra.Text style={{ color: '#F59E0B' } as any}>Orange Text</Voltra.Text>
            </Voltra.VStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'background-colors',
    title: 'Background Colors',
    description: 'Different background colors applied to containers.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.HStack>
              <Voltra.VStack style={{ backgroundColor: '#3B82F6', flexGrowWidth: true, padding: 8 } as any}>
                <Voltra.Text style={{ color: 'white' } as any}>Blue</Voltra.Text>
              </Voltra.VStack>
              <Voltra.VStack style={{ backgroundColor: '#10B981', flexGrowWidth: true, padding: 8 } as any}>
                <Voltra.Text style={{ color: 'white' } as any}>Green</Voltra.Text>
              </Voltra.VStack>
              <Voltra.VStack style={{ backgroundColor: '#F59E0B', flexGrowWidth: true, padding: 8 } as any}>
                <Voltra.Text style={{ color: 'white' } as any}>Orange</Voltra.Text>
              </Voltra.VStack>
            </Voltra.HStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'borders',
    title: 'Borders',
    description: 'Border radius, width, and color properties.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.HStack>
              <Voltra.VStack
                style={{
                  backgroundColor: '#3B82F6',
                  borderRadius: '8px',
                  borderWidth: 2,
                  borderColor: '#1E40AF',
                  flexGrowWidth: true,
                  padding: 12,
                } as any}
              >
                <Voltra.Text style={{ color: 'white' } as any}>Rounded</Voltra.Text>
              </Voltra.VStack>
              <Voltra.VStack
                style={{
                  backgroundColor: '#10B981',
                  borderRadius: '120px',
                  borderWidth: 3,
                  borderColor: '#047857',
                  flexGrowWidth: true,
                  padding: 12,
                } as any}
              >
                <Voltra.Text style={{ color: 'white' } as any}>More Rounded</Voltra.Text>
              </Voltra.VStack>
            </Voltra.HStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'shadows',
    title: 'Shadows',
    description: 'Shadow effects with color, offset, opacity, and radius.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack
              style={{
                backgroundColor: '#FFFFFF',
                shadowColor: '#FF0000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 8,
                padding: 16,
              } as any}
            >
              <Voltra.Text style={{ color: '#1F2937' } as any}>Shadow Effect</Voltra.Text>
            </Voltra.VStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'typography',
    title: 'Typography',
    description: 'Font size, weight, and letter spacing variations.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack>
              <Voltra.Text style={{ color: '#FFFFFF', fontSize: 12 } as any}>Small Text (12px)</Voltra.Text>
              <Voltra.Text style={{ color: '#FFFFFF', fontSize: 16 } as any}>Normal Text (16px)</Voltra.Text>
              <Voltra.Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' } as any}>Large Bold (20px)</Voltra.Text>
              <Voltra.Text style={{ color: '#3B82F6', letterSpacing: 2 } as any}>Spaced Letters</Voltra.Text>
            </Voltra.VStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'opacity',
    title: 'Opacity',
    description: 'Opacity values applied to containers.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.HStack>
              <Voltra.VStack style={{ backgroundColor: '#3B82F6', opacity: 1.0, flexGrowWidth: true, padding: 8 } as any}>
                <Voltra.Text style={{ color: 'white' } as any}>100%</Voltra.Text>
              </Voltra.VStack>
              <Voltra.VStack style={{ backgroundColor: '#3B82F6', opacity: 0.7, flexGrowWidth: true, padding: 8 } as any}>
                <Voltra.Text style={{ color: 'white' } as any}>70%</Voltra.Text>
              </Voltra.VStack>
              <Voltra.VStack style={{ backgroundColor: '#3B82F6', opacity: 0.4, flexGrowWidth: true, padding: 8 } as any}>
                <Voltra.Text style={{ color: 'white' } as any}>40%</Voltra.Text>
              </Voltra.VStack>
            </Voltra.HStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
  {
    id: 'combined-styling',
    title: 'Combined Styling',
    description: 'A complex example combining multiple styling properties.',
    renderJson: () => {
      try {
        return JSON.stringify(
          renderVoltraVariantToJson(
            <Voltra.VStack
              style={{
                backgroundColor: '#8B5CF6',
                borderRadius: '12px',
                borderWidth: 2,
                borderColor: '#7C3AED',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
                padding: 16,
                margin: 8,
              } as any}
            >
              <Voltra.Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: 'bold',
                  letterSpacing: 0.5,
                } as any}
              >
                Complex Example
              </Voltra.Text>
              <Voltra.Text
                style={{
                  color: '#E9D5FF',
                  fontSize: 12,
                  marginTop: 4,
                } as any}
              >
                Multiple properties combined
              </Voltra.Text>
            </Voltra.VStack>
          ),
          null,
          2
        );
      } catch { return '(render error)'; }
    },
  },
];

export function StylingScreen() {
  return (
    <scroll-view style={{ linearWeight: 1 } as any} scroll-orientation="vertical">
      <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 }}>
        <text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF' } as any}>
          Styling Examples
        </text>
        <text style={{ fontSize: 14, color: '#CBD5F5', marginBottom: 8 } as any}>
          Explore Voltra's styling capabilities. Each example demonstrates different styling properties that can be applied to Voltra components.
        </text>

        <view style={{ marginTop: 8 }}>
          {STYLING_DATA.map((item) => (
            <view
              key={item.id}
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
              <text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 8 } as any}>
                {item.description}
              </text>

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
                  {item.renderJson()}
                </text>
              </view>
            </view>
          ))}
        </view>

        {/* Summary */}
        <view style={{
          marginTop: 20,
          padding: 12,
          backgroundColor: '#0F172A',
          borderRadius: '12px',
          borderWidth: 1,
          borderColor: 'rgba(148, 163, 184, 0.12)',
        } as any}>
          <text style={{ fontSize: 13, color: '#94A3B8' } as any}>
            Total styling examples: {STYLING_DATA.length}
          </text>
        </view>
      </view>
    </scroll-view>
  );
}
