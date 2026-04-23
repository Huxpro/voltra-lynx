import { useState } from '@lynx-js/react';
import { VoltraModule } from '@use-voltra/lynx/ios-client';
import { Voltra, renderLiveActivityToString } from '@use-voltra/ios';

// ─── Voltra positioning examples rendered to string payloads ──────────────

function staticPositioningPayload(): string {
  return renderLiveActivityToString({
    lockScreen: (
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
    ),
  });
}

function relativeBasicPayload(): string {
  return renderLiveActivityToString({
    lockScreen: (
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
    ),
  });
}

function relativeNegativePayload(): string {
  return renderLiveActivityToString({
    lockScreen: (
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
    ),
  });
}

function absoluteBasicPayload(): string {
  return renderLiveActivityToString({
    lockScreen: (
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
    ),
  });
}

function absoluteCornersPayload(): string {
  return renderLiveActivityToString({
    lockScreen: (
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
          {/* Red dot markers */}
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
    ),
  });
}

function zIndexPayload(): string {
  return renderLiveActivityToString({
    lockScreen: (
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
    ),
  });
}

function badgeOverlayPayload(): string {
  return renderLiveActivityToString({
    lockScreen: (
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
    ),
  });
}

// ─── Positioning data ───────────────────────────────────────────────────────

const POSITIONING_DATA = [
  {
    id: 'static-default',
    title: 'Static Positioning (Default)',
    description:
      'When position is not set or set to "static", left and top are ignored. Box should stay centered.',
    getPayload: staticPositioningPayload,
  },
  {
    id: 'relative-basic',
    title: 'Relative Positioning - Basic',
    description:
      'position: "relative" offsets the box from its natural position. left: 20, top: 10 moves it right and down.',
    getPayload: relativeBasicPayload,
  },
  {
    id: 'relative-negative',
    title: 'Relative Positioning - Negative Offset',
    description:
      'Negative values move the box left (negative left) and up (negative top) from its natural position.',
    getPayload: relativeNegativePayload,
  },
  {
    id: 'absolute-basic',
    title: 'Absolute Positioning - Center-Based',
    description:
      'position: "absolute" places the CENTER of the box at the coordinates. left: 50, top: 50 means center at (50, 50).',
    getPayload: absoluteBasicPayload,
  },
  {
    id: 'absolute-corners',
    title: 'Absolute Positioning - Four Corners',
    description:
      'Demonstrating absolute positioning at different coordinates. Red dots mark the center points.',
    getPayload: absoluteCornersPayload,
  },
  {
    id: 'zindex-layering',
    title: 'Z-Index Layering',
    description: 'Using zIndex with positioning to control stacking order.',
    getPayload: zIndexPayload,
  },
  {
    id: 'practical-overlay',
    title: 'Practical Example - Badge Overlay',
    description:
      'Using absolute positioning to create a notification badge on a profile card.',
    getPayload: badgeOverlayPayload,
  },
];

// ─── Screen ─────────────────────────────────────────────────────────────────

export function PositioningScreen() {
  const [statusMessage, setStatusMessage] = useState('Select a positioning example to launch.');

  const handleLaunch = (item: (typeof POSITIONING_DATA)[number]) => {
    'background only';
    const payload = item.getPayload();
    VoltraModule.startLiveActivity(payload, { activityName: `positioning-${item.id}` }).then(() => {
      setStatusMessage('Started: ' + item.title);
    }).catch((e: any) => {
      setStatusMessage('Error: ' + (e?.message || String(e)));
    });
  };

  return (
    <scroll-view scroll-orientation="vertical" style={{ linearWeight: 1 } as any}>
      <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 }}>
        {/* Header */}
        <text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF' }}>
          Positioning Examples
        </text>
        <text style={{ fontSize: 14, color: '#CBD5F5', marginBottom: 8 }}>
          Explore Voltra's positioning modes: static (default), relative (offset from natural
          position), and absolute (center-based coordinates). Red dots mark reference points in
          absolute positioning examples.
        </text>

        {/* Status bar */}
        <view
          style={{
            backgroundColor: '#1E293B',
            borderRadius: '10px',
            padding: 12,
            marginBottom: 16,
          }}
        >
          <text style={{ fontSize: 12, color: '#94A3B8' }}>{statusMessage}</text>
        </view>

        {/* Cards */}
        {POSITIONING_DATA.map((item) => (
          <view
            key={item.id}
            style={{
              backgroundColor: '#1c1c1e',
              borderRadius: '16px',
              padding: 16,
              marginBottom: 12,
            }}
          >
            <text
              style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginBottom: 4 }}
            >
              {item.title}
            </text>
            <text style={{ color: '#8E8E93', fontSize: 13, marginBottom: 12 }}>
              {item.description}
            </text>

            {/* Show Example button */}
            <view
              bindtap={() => handleLaunch(item)}
              style={{
                backgroundColor: '#007AFF',
                padding: 12,
                borderRadius: '8px',
                alignItems: 'center',
              }}
            >
              <text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>
                Show Example
              </text>
            </view>
          </view>
        ))}
      </view>
    </scroll-view>
  );
}
