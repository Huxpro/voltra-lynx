import { useState } from '@lynx-js/react';
import { Voltra, renderVoltraVariantToJson } from '@use-voltra/ios';

function renderPreviewJson(element: React.ReactNode): string {
  try {
    return JSON.stringify(renderVoltraVariantToJson(element), null, 2);
  } catch {
    return '{ "error": "Failed to render" }';
  }
}

const truncate = (json: string, max = 350) => json.length > max ? json.slice(0, max) + '...' : json;

// ─── Voltra positioning examples ────────────────────────────────────────────

function staticPositioningJson(): string {
  return renderPreviewJson(
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
        } as any}
      >
        <Voltra.Text style={{ color: 'white', fontSize: 12 } as any}>Static</Voltra.Text>
        <Voltra.Text style={{ color: '#93C5FD', fontSize: 10 } as any}>(Centered)</Voltra.Text>
      </Voltra.VStack>
    </Voltra.ZStack>
  );
}

function relativeBasicJson(): string {
  return renderPreviewJson(
    <Voltra.ZStack alignment="topLeading">
      <Voltra.VStack
        style={{
          backgroundColor: '#64748B',
          width: 80,
          height: 60,
          borderRadius: 8,
          opacity: 0.4,
        } as any}
      >
        <Voltra.Text style={{ color: 'white', fontSize: 10 } as any}>Natural</Voltra.Text>
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
        } as any}
      >
        <Voltra.Text style={{ color: 'white', fontSize: 12 } as any}>Relative</Voltra.Text>
        <Voltra.Text style={{ color: '#A7F3D0', fontSize: 10 } as any}>+20, +10</Voltra.Text>
      </Voltra.VStack>
    </Voltra.ZStack>
  );
}

function relativeNegativeJson(): string {
  return renderPreviewJson(
    <Voltra.ZStack alignment="center">
      <Voltra.VStack
        style={{
          backgroundColor: '#64748B',
          width: 80,
          height: 60,
          borderRadius: 8,
          opacity: 0.4,
        } as any}
      >
        <Voltra.Text style={{ color: 'white', fontSize: 10 } as any}>Natural</Voltra.Text>
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
        } as any}
      >
        <Voltra.Text style={{ color: 'white', fontSize: 12 } as any}>Relative</Voltra.Text>
        <Voltra.Text style={{ color: '#FDE68A', fontSize: 10 } as any}>-15, -15</Voltra.Text>
      </Voltra.VStack>
    </Voltra.ZStack>
  );
}

function absoluteBasicJson(): string {
  return renderPreviewJson(
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
        } as any}
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
        } as any}
      >
        <Voltra.Text style={{ color: 'white', fontSize: 12 } as any}>Absolute</Voltra.Text>
        <Voltra.Text style={{ color: '#DDD6FE', fontSize: 10 } as any}>@50, 50</Voltra.Text>
      </Voltra.VStack>
    </Voltra.ZStack>
  );
}

function absoluteCornersJson(): string {
  return renderPreviewJson(
    <Voltra.VStack style={{ width: 230, height: 200, borderColor: '#FFFFFF', borderWidth: 1 } as any}>
      <Voltra.ZStack alignment="topLeading">
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
          } as any}
        >
          <Voltra.Text style={{ color: 'white', fontSize: 8 } as any}>30,30</Voltra.Text>
        </Voltra.VStack>
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
          } as any}
        >
          <Voltra.Text style={{ color: 'white', fontSize: 8 } as any}>200,170</Voltra.Text>
        </Voltra.VStack>
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
          } as any}
        >
          <Voltra.Text style={{ color: 'white', fontSize: 8 } as any}>115,100</Voltra.Text>
        </Voltra.VStack>
        <Voltra.VStack
          style={{
            position: 'absolute', left: 115, top: 100,
            width: 6, height: 6, backgroundColor: '#FF0000', borderRadius: 3,
          } as any}
        />
        <Voltra.VStack
          style={{
            position: 'absolute', left: 200, top: 170,
            width: 6, height: 6, backgroundColor: '#EF4444', borderRadius: 3,
          } as any}
        />
        <Voltra.VStack
          style={{
            position: 'absolute', left: 30, top: 30,
            width: 6, height: 6, backgroundColor: '#EF4444', borderRadius: 3,
          } as any}
        />
      </Voltra.ZStack>
    </Voltra.VStack>
  );
}

function zIndexJson(): string {
  return renderPreviewJson(
    <Voltra.ZStack alignment="center">
      <Voltra.VStack
        style={{
          position: 'absolute', left: 80, top: 60, zIndex: 1,
          backgroundColor: '#3B82F6', width: 70, height: 70,
          borderRadius: 8, borderWidth: 2, borderColor: '#60A5FA',
        } as any}
      >
        <Voltra.Text style={{ color: 'white', fontSize: 10 } as any}>z: 1</Voltra.Text>
      </Voltra.VStack>
      <Voltra.VStack
        style={{
          position: 'absolute', left: 110, top: 75, zIndex: 2,
          backgroundColor: '#10B981', width: 70, height: 70,
          borderRadius: 8, borderWidth: 2, borderColor: '#34D399',
        } as any}
      >
        <Voltra.Text style={{ color: 'white', fontSize: 10 } as any}>z: 2</Voltra.Text>
      </Voltra.VStack>
      <Voltra.VStack
        style={{
          position: 'absolute', left: 140, top: 90, zIndex: 3,
          backgroundColor: '#F59E0B', width: 70, height: 70,
          borderRadius: 8, borderWidth: 2, borderColor: '#FBBF24',
        } as any}
      >
        <Voltra.Text style={{ color: 'white', fontSize: 10 } as any}>z: 3</Voltra.Text>
      </Voltra.VStack>
    </Voltra.ZStack>
  );
}

function badgeOverlayJson(): string {
  return renderPreviewJson(
    <Voltra.HStack
      alignment="center"
      style={{
        backgroundColor: '#1F2937',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#374151',
      } as any}
    >
      <Voltra.ZStack style={{ width: 50, height: 50 } as any}>
        <Voltra.VStack
          style={{
            backgroundColor: '#6366F1',
            width: 50, height: 50, borderRadius: 25,
          } as any}
        />
        <Voltra.VStack
          style={{
            position: 'absolute', left: 40, top: 5,
            backgroundColor: '#EF4444',
            width: 20, height: 20, borderRadius: 10,
            borderWidth: 2, borderColor: '#1F2937',
          } as any}
        >
          <Voltra.Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' } as any}>3</Voltra.Text>
        </Voltra.VStack>
      </Voltra.ZStack>
      <Voltra.VStack style={{ paddingLeft: 12, flexGrow: 1 } as any}>
        <Voltra.Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' } as any}>John Doe</Voltra.Text>
        <Voltra.Text style={{ color: '#9CA3AF', fontSize: 12 } as any}>Software Engineer</Voltra.Text>
      </Voltra.VStack>
    </Voltra.HStack>
  );
}

// ─── Positioning data ───────────────────────────────────────────────────────

const POSITIONING_DATA = [
  {
    id: 'static-default',
    title: 'Static Positioning (Default)',
    description: 'When position is not set or "static", left/top are ignored. Box stays centered.',
    getJson: staticPositioningJson,
  },
  {
    id: 'relative-basic',
    title: 'Relative Positioning - Basic',
    description: 'position: "relative" offsets the box from its natural position. left: 20, top: 10.',
    getJson: relativeBasicJson,
  },
  {
    id: 'relative-negative',
    title: 'Relative Positioning - Negative Offset',
    description: 'Negative values move box left and up from natural position.',
    getJson: relativeNegativeJson,
  },
  {
    id: 'absolute-basic',
    title: 'Absolute Positioning - Center-Based',
    description: 'position: "absolute" places CENTER at coordinates. left: 50, top: 50.',
    getJson: absoluteBasicJson,
  },
  {
    id: 'absolute-corners',
    title: 'Absolute Positioning - Four Corners',
    description: 'Absolute positioning at different coordinates. Red dots mark center points.',
    getJson: absoluteCornersJson,
  },
  {
    id: 'zindex-layering',
    title: 'Z-Index Layering',
    description: 'Using zIndex with positioning to control stacking order.',
    getJson: zIndexJson,
  },
  {
    id: 'practical-overlay',
    title: 'Practical Example - Badge Overlay',
    description: 'Using absolute positioning to create a notification badge on a profile card.',
    getJson: badgeOverlayJson,
  },
];

// ─── screen ─────────────────────────────────────────────────────────────────

export function PositioningScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <scroll-view scroll-y style={{ flex: 1 } as any}>
      <view style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 20, paddingBottom: 24 }}>
        <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
          Positioning Examples
        </text>
        <text style={{ color: '#666', marginBottom: 16, fontSize: 13 }}>
          Voltra positioning modes: static (default), relative (offset from natural position), and absolute (center-based coordinates). Red dots mark reference points in absolute examples.
        </text>

        {POSITIONING_DATA.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <view
              key={item.id}
              style={{
                backgroundColor: '#1c1c1e',
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <text style={{ color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 4 }}>
                {item.title}
              </text>
              <text style={{ color: '#8E8E93', fontSize: 12, marginBottom: 8 }}>
                {item.description}
              </text>

              <view
                bindtap={() => setExpandedId(isExpanded ? null : item.id)}
                style={{
                  paddingTop: 6, paddingBottom: 6,
                  paddingLeft: 12, paddingRight: 12,
                  backgroundColor: '#333',
                  borderRadius: 6,
                  alignSelf: 'flex-start',
                  marginBottom: isExpanded ? 8 : 0,
                }}
              >
                <text style={{ color: '#fff', fontSize: 12 }}>
                  {isExpanded ? 'Hide JSON' : 'Show JSON'}
                </text>
              </view>

              {isExpanded && (
                <text style={{ color: '#6E6E73', fontSize: 10, fontFamily: 'monospace' }}>
                  {truncate(item.getJson(), 500)}
                </text>
              )}
            </view>
          );
        })}
      </view>
    </scroll-view>
  );
}
