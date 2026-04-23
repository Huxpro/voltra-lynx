import { type ReactNode, useState } from '@lynx-js/react';
import { Voltra, renderVoltraVariantToJson } from '@use-voltra/ios';
import { VoltraPreview } from '../../components/VoltraPreview';

interface PositioningExample {
  id: string;
  title: string;
  description: string;
  height: number;
  content: () => ReactNode;
}

const POSITIONING_DATA: PositioningExample[] = [
  {
    id: 'static-default',
    title: 'Static Positioning (Default)',
    description:
      'When position is not set or set to "static", left and top are ignored. Box should stay centered.',
    height: 150,
    content: () => (
      <Voltra.ZStack alignment="center">
        <Voltra.VStack
          style={{
            position: 'static',
            backgroundColor: '#3B82F6',
            width: 80,
            height: 60,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: '#60A5FA',
            left: 100,
            top: 100,
          }}
        >
          <Voltra.Text style={{ color: 'white', fontSize: 12 }}>Static</Voltra.Text>
          <Voltra.Text style={{ color: '#93C5FD', fontSize: 10 }}>(Centered)</Voltra.Text>
        </Voltra.VStack>
      </Voltra.ZStack>
    ),
  },
  {
    id: 'relative-basic',
    title: 'Relative Positioning - Basic',
    description:
      'position: "relative" offsets the box from its natural position. left: 20, top: 10 moves it right and down.',
    height: 150,
    content: () => (
      <Voltra.ZStack alignment="topLeading">
        <Voltra.VStack
          style={{
            backgroundColor: '#64748B',
            width: 80,
            height: 60,
            borderRadius: 8,
            opacity: 0.4,
          }}
        >
          <Voltra.Text style={{ color: 'white', fontSize: 10 }}>Natural</Voltra.Text>
        </Voltra.VStack>
        <Voltra.VStack
          style={{
            position: 'relative',
            left: 20,
            top: 10,
            backgroundColor: '#10B981',
            width: 80,
            height: 60,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: '#34D399',
          }}
        >
          <Voltra.Text style={{ color: 'white', fontSize: 12 }}>Relative</Voltra.Text>
          <Voltra.Text style={{ color: '#A7F3D0', fontSize: 10 }}>+20, +10</Voltra.Text>
        </Voltra.VStack>
      </Voltra.ZStack>
    ),
  },
  {
    id: 'relative-negative',
    title: 'Relative Positioning - Negative Offset',
    description:
      'Negative values move the box left (negative left) and up (negative top) from its natural position.',
    height: 150,
    content: () => (
      <Voltra.ZStack alignment="center">
        <Voltra.VStack
          style={{
            backgroundColor: '#64748B',
            width: 80,
            height: 60,
            borderRadius: 8,
            opacity: 0.4,
          }}
        >
          <Voltra.Text style={{ color: 'white', fontSize: 10 }}>Natural</Voltra.Text>
        </Voltra.VStack>
        <Voltra.VStack
          style={{
            position: 'relative',
            left: -15,
            top: -15,
            backgroundColor: '#F59E0B',
            width: 80,
            height: 60,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: '#FBBF24',
          }}
        >
          <Voltra.Text style={{ color: 'white', fontSize: 12 }}>Relative</Voltra.Text>
          <Voltra.Text style={{ color: '#FDE68A', fontSize: 10 }}>-15, -15</Voltra.Text>
        </Voltra.VStack>
      </Voltra.ZStack>
    ),
  },
  {
    id: 'absolute-basic',
    title: 'Absolute Positioning - Center-Based',
    description:
      'position: "absolute" places the CENTER of the box at the coordinates. left: 50, top: 50 means center at (50, 50).',
    height: 150,
    content: () => (
      <Voltra.ZStack alignment="topLeading">
        <Voltra.VStack
          style={{
            position: 'absolute',
            left: 50,
            top: 50,
            width: 10,
            height: 10,
            backgroundColor: '#EF4444',
            borderRadius: 5,
          }}
        />
        <Voltra.VStack
          style={{
            position: 'absolute',
            left: 50,
            top: 50,
            backgroundColor: '#8B5CF6',
            width: 80,
            height: 60,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: '#A78BFA',
          }}
        >
          <Voltra.Text style={{ color: 'white', fontSize: 12 }}>Absolute</Voltra.Text>
          <Voltra.Text style={{ color: '#DDD6FE', fontSize: 10 }}>@50, 50</Voltra.Text>
        </Voltra.VStack>
      </Voltra.ZStack>
    ),
  },
  {
    id: 'absolute-corners',
    title: 'Absolute Positioning - Four Corners',
    description:
      'Demonstrating absolute positioning at different coordinates. Red dots mark the center points.',
    height: 200,
    content: () => (
      <Voltra.VStack style={{ width: 230, height: 200, borderColor: '#FFFFFF', borderWidth: 1 }}>
        <Voltra.ZStack alignment="topLeading">
          {/* Top-left box */}
          <Voltra.VStack
            style={{
              position: 'absolute',
              left: 30,
              top: 30,
              backgroundColor: '#3B82F6',
              width: 50,
              height: 40,
              borderRadius: 6,
              opacity: 0.9,
            }}
          >
            <Voltra.Text style={{ color: 'white', fontSize: 8 }}>30,30</Voltra.Text>
          </Voltra.VStack>

          {/* Bottom-right box */}
          <Voltra.VStack
            style={{
              position: 'absolute',
              left: 200,
              top: 170,
              backgroundColor: '#10B981',
              width: 50,
              height: 40,
              borderRadius: 6,
              opacity: 0.9,
            }}
          >
            <Voltra.Text style={{ color: 'white', fontSize: 8 }}>200,170</Voltra.Text>
          </Voltra.VStack>

          {/* Center box */}
          <Voltra.VStack
            style={{
              position: 'absolute',
              left: 115,
              top: 100,
              backgroundColor: '#F59E0B',
              width: 50,
              height: 40,
              borderRadius: 6,
              opacity: 0.9,
            }}
          >
            <Voltra.Text style={{ color: 'white', fontSize: 8 }}>115,100</Voltra.Text>
          </Voltra.VStack>

          {/* Center marker */}
          <Voltra.VStack
            style={{
              position: 'absolute',
              left: 115,
              top: 100,
              width: 6,
              height: 6,
              backgroundColor: '#FF0000',
              borderRadius: 3,
            }}
          />

          {/* Bottom-right corner marker */}
          <Voltra.VStack
            style={{
              position: 'absolute',
              left: 200,
              top: 170,
              width: 6,
              height: 6,
              backgroundColor: '#EF4444',
              borderRadius: 3,
            }}
          />

          {/* Top-left corner marker */}
          <Voltra.VStack
            style={{
              position: 'absolute',
              left: 30,
              top: 30,
              width: 6,
              height: 6,
              backgroundColor: '#EF4444',
              borderRadius: 3,
            }}
          />
        </Voltra.ZStack>
      </Voltra.VStack>
    ),
  },
  {
    id: 'zindex-layering',
    title: 'Z-Index Layering',
    description: 'Using zIndex with positioning to control stacking order.',
    height: 150,
    content: () => (
      <Voltra.ZStack alignment="center">
        {/* Bottom layer (zIndex: 1) */}
        <Voltra.VStack
          style={{
            position: 'absolute',
            left: 80,
            top: 60,
            zIndex: 1,
            backgroundColor: '#3B82F6',
            width: 70,
            height: 70,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: '#60A5FA',
          }}
        >
          <Voltra.Text style={{ color: 'white', fontSize: 10 }}>z: 1</Voltra.Text>
        </Voltra.VStack>

        {/* Middle layer (zIndex: 2) */}
        <Voltra.VStack
          style={{
            position: 'absolute',
            left: 110,
            top: 75,
            zIndex: 2,
            backgroundColor: '#10B981',
            width: 70,
            height: 70,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: '#34D399',
          }}
        >
          <Voltra.Text style={{ color: 'white', fontSize: 10 }}>z: 2</Voltra.Text>
        </Voltra.VStack>

        {/* Top layer (zIndex: 3) */}
        <Voltra.VStack
          style={{
            position: 'absolute',
            left: 140,
            top: 90,
            zIndex: 3,
            backgroundColor: '#F59E0B',
            width: 70,
            height: 70,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: '#FBBF24',
          }}
        >
          <Voltra.Text style={{ color: 'white', fontSize: 10 }}>z: 3</Voltra.Text>
        </Voltra.VStack>
      </Voltra.ZStack>
    ),
  },
  {
    id: 'practical-overlay',
    title: 'Practical Example - Badge Overlay',
    description:
      'Using absolute positioning to create a notification badge on a profile card.',
    height: 120,
    content: () => (
      <Voltra.HStack
        alignment="center"
        style={{
          backgroundColor: '#1F2937',
          borderRadius: 12,
          padding: 12,
          borderWidth: 1,
          borderColor: '#374151',
        }}
      >
        {/* Avatar with badge overlay */}
        <Voltra.ZStack style={{ width: 50, height: 50 }}>
          <Voltra.VStack
            style={{
              backgroundColor: '#6366F1',
              width: 50,
              height: 50,
              borderRadius: 25,
            }}
          />

          {/* Notification Badge */}
          <Voltra.VStack
            style={{
              position: 'absolute',
              left: 40,
              top: 5,
              backgroundColor: '#EF4444',
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: '#1F2937',
            }}
          >
            <Voltra.Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>3</Voltra.Text>
          </Voltra.VStack>
        </Voltra.ZStack>

        {/* Info */}
        <Voltra.VStack style={{ paddingLeft: 12, flexGrow: 1 }}>
          <Voltra.Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>John Doe</Voltra.Text>
          <Voltra.Text style={{ color: '#9CA3AF', fontSize: 12 }}>Software Engineer</Voltra.Text>
        </Voltra.VStack>
      </Voltra.HStack>
    ),
  },
];

function ExampleCard({ item }: { item: PositioningExample }) {
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
        <VoltraPreview id={`positioning-${item.id}`} height={item.height}>
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

export function PositioningScreen() {
  return (
    <scroll-view style={{ linearWeight: 1 } as any} scroll-orientation="vertical">
      <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 }}>
        <text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF' } as any}>
          Positioning Examples
        </text>
        <text style={{ fontSize: 14, color: '#CBD5F5', marginBottom: 8 } as any}>
          Explore Voltra's positioning modes: static (default), relative (offset from natural
          position), and absolute (center-based coordinates). Red dots mark reference points in
          absolute positioning examples.
        </text>

        <view style={{ marginTop: 8 }}>
          {POSITIONING_DATA.map((item) => (
            <ExampleCard key={item.id} item={item} />
          ))}
        </view>
      </view>
    </scroll-view>
  );
}
