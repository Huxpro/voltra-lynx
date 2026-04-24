import { useState, useCallback } from '@lynx-js/react';
import { VoltraModule } from '@use-voltra/lynx/ios-client';
// Purple gradient background matching original Voltra splash
const BG_GRADIENT = 'linear-gradient(160deg, #1a0533 0%, #0d0f1a 40%, #0a1628 60%, #0d1117 100%)';
import {
  makeBasicLiveActivityPayload,
  makeMusicPlayerPayload,
  makeFlightPayload,
  makeWorkoutPayload,
  makeCompassPayload,
  makeDeepLinksPayload,
  makeLiquidGlassPayload,
  makeSupplementalPayload,
  SONGS,
} from './voltra-payload';

// ─── Demo screens (for sub-navigation) ─────────────────────────
import { ComponentsCatalogScreen } from './demos/testing/ComponentsCatalogScreen';
import { StylingScreen } from './demos/testing/StylingScreen';
import { FlexPlaygroundScreen } from './demos/testing/FlexPlaygroundScreen';
import { TimerScreen } from './demos/testing/TimerScreen';
import { ProgressIndicatorsScreen } from './demos/testing/ProgressIndicatorsScreen';
import { ChartPlaygroundScreen } from './demos/testing/ChartPlaygroundScreen';
import { GradientPlaygroundScreen } from './demos/testing/GradientPlaygroundScreen';
import { PositioningScreen } from './demos/testing/PositioningScreen';
import { ImagePreloadingScreen } from './demos/testing/ImagePreloadingScreen';
import { ImageFallbackScreen } from './demos/testing/ImageFallbackScreen';
import { WidgetSchedulingScreen } from './demos/testing/WidgetSchedulingScreen';
import { WeatherWidgetScreen } from './demos/testing/WeatherWidgetScreen';

// ─── Activity definitions ───────────────────────────────────────

type ActivityDef = {
  key: string;
  title: string;
  description: string;
  makePayload: () => string;
  activityName: string;
};

const ACTIVITIES: ActivityDef[] = [
  {
    key: 'basic', title: 'Basic live activity',
    description: 'Inline JSX styles with core stacks, labels, and buttons.',
    makePayload: () => makeBasicLiveActivityPayload(),
    activityName: 'basic',
  },
  {
    key: 'music', title: 'Music Player',
    description: 'Provides info about current song and allows interaction with playback controls.',
    makePayload: () => makeMusicPlayerPayload(SONGS[0], true),
    activityName: 'music-player',
  },
  {
    key: 'glass', title: 'Liquid Glass',
    description: 'GlassContainer + VStack with glassEffect style property.',
    makePayload: () => makeLiquidGlassPayload(),
    activityName: 'liquid-glass',
  },
  {
    key: 'deepLinks', title: 'Links & Navigation',
    description: 'Link component for URL navigation. Supports absolute/relative URLs.',
    makePayload: () => makeDeepLinksPayload(),
    activityName: 'deep-links',
  },
  {
    key: 'flight', title: 'Flight Tracker',
    description: 'Flight information widget with departure/arrival times, gate info, and status updates.',
    makePayload: () => makeFlightPayload(),
    activityName: 'flight',
  },
  {
    key: 'workout', title: 'Workout Tracker',
    description: 'Fitness tracking widget with heart rate zones, timer, distance, and pace metrics.',
    makePayload: () => makeWorkoutPayload(120, '2.4 km', '5:30 /km', Date.now()),
    activityName: 'workout',
  },
  {
    key: 'compass', title: 'Compass',
    description: 'Real-time compass using magnetometer with rotating arrow indicator.',
    makePayload: () => makeCompassPayload(45),
    activityName: 'compass',
  },
  {
    key: 'supplemental', title: 'Supplemental Families (iOS 18+)',
    description: 'Demonstrates supplemental activity families: small (Watch/CarPlay) with compact Dynamic Island fallback.',
    makePayload: () => makeSupplementalPayload(),
    activityName: 'supplemental',
  },
];

// ─── Testing ground entries ─────────────────────────────────────

const TESTING_ENTRIES: { id: string; title: string; description: string; component: () => JSX.Element }[] = [
  { id: 'weather', title: 'Weather Widget', description: 'Test the weather widget with different conditions, gradients, and real-time updates. Change weather conditions and see the widget update instantly.', component: WeatherWidgetScreen },
  { id: 'timer', title: 'Timer', description: 'Test the VoltraTimer component with different styles (Timer/Relative), count directions, and templates. Verifies native Live Activity behavior.', component: TimerScreen },
  { id: 'styling', title: 'Styling', description: 'Explore Voltra styling properties including padding, margins, colors, borders, shadows, and typography.', component: StylingScreen },
  { id: 'positioning', title: 'Positioning', description: 'Learn about static, relative, and absolute positioning modes. See how left, top, and zIndex properties work with visual examples.', component: PositioningScreen },
  { id: 'progress', title: 'Progress Indicators', description: 'Explore linear and circular progress indicators. Test determinate, indeterminate, and timer-based modes with custom labels and styling.', component: ProgressIndicatorsScreen },
  { id: 'components', title: 'Components', description: 'Explore all available Voltra components including Button, Text, VStack, HStack, ZStack, Image, and more.', component: ComponentsCatalogScreen },
  { id: 'flex', title: 'Flex Layout Playground', description: 'Interactive playground for experimenting with flex layout properties. Test alignItems, justifyContent, flexDirection, spacing, and padding with live visual feedback.', component: FlexPlaygroundScreen },
  { id: 'charts', title: 'Chart Playground', description: 'Explore all SwiftUI chart mark types: BarMark, LineMark, AreaMark, PointMark, RuleMark, and SectorMark. Randomize data to see animated transitions.', component: ChartPlaygroundScreen },
  { id: 'gradients', title: 'Gradient Playground', description: 'Test CSS gradient strings as backgroundColor. Experiment with linear, radial, and conic gradients, direction/angle controls, color presets, stop positions, and borderRadius clipping.', component: GradientPlaygroundScreen },
  { id: 'preloading', title: 'Image Preloading', description: 'Test image preloading functionality for Live Activities. Download images to App Group storage and verify they appear in Live Activities.', component: ImagePreloadingScreen },
  { id: 'image-fallback', title: 'Image Fallback', description: 'Explore the new image fallback behavior using backgroundColor from styles. Test missing images with various styling approaches.', component: ImageFallbackScreen },
  { id: 'scheduling', title: 'Widget Scheduling', description: 'Test widget timeline scheduling with multiple states. Configure timing for each state and watch widgets automatically transition between them.', component: WidgetSchedulingScreen },
];

// ─── Activity Card ──────────────────────────────────────────────

function ActivityCard({ def }: { def: ActivityDef }) {
  const [activityId, setActivityId] = useState<string | null>(null);
  const isActive = activityId !== null;

  const handleStartEnd = useCallback(() => {
    'background only';
    if (isActive && activityId) {
      VoltraModule.endLiveActivity(activityId, { dismissalPolicy: { type: 'immediate' } }).then(() => {
        setActivityId(null);
      }).catch(() => {});
    } else {
      const payload = def.makePayload();
      VoltraModule.startLiveActivity(payload, { activityName: def.activityName }).then((id) => {
        setActivityId(id);
      }).catch(() => {});
    }
  }, [isActive, activityId, def]);

  const handleUpdate = useCallback(() => {
    'background only';
    if (!activityId) return;
    const payload = def.makePayload();
    VoltraModule.updateLiveActivity(activityId, payload).catch(() => {});
  }, [activityId, def]);

  return (
    <view style={{
      backgroundColor: '#0F172A',
      borderRadius: '20px', padding: 18,
      borderWidth: 1, borderColor: 'rgba(148, 163, 184, 0.12)',
      marginTop: 16,
    }}>
      {/* Header row */}
      <view style={{ display: 'linear', linearDirection: 'row', alignItems: 'center' }}>
        <text style={{ fontSize: 18, fontWeight: '600', color: '#E2E8F0', linearWeight: 1 } as any}>
          {def.title}
        </text>
        <view style={{
          paddingLeft: 10, paddingRight: 10, paddingTop: 4, paddingBottom: 4,
          borderRadius: '999px',
          backgroundColor: isActive ? 'rgba(130, 50, 255, 0.2)' : 'rgba(148, 163, 184, 0.15)',
        }}>
          <text style={{ fontSize: 12, fontWeight: '600', color: isActive ? '#8232FF' : '#94A3B8' }}>
            {isActive ? 'Active' : 'Idle'}
          </text>
        </view>
      </view>

      {/* Description */}
      <text style={{ marginTop: 10, color: '#94A3B8', fontSize: 13 }}>
        {def.description}
      </text>

      {/* Button row */}
      <view style={{ display: 'linear', linearDirection: 'row', marginTop: 16 }}>
        <view
          bindtap={handleStartEnd}
          style={{
            backgroundColor: isActive ? 'rgba(130, 50, 255, 0.1)' : '#8232FF',
            borderWidth: isActive ? 1 : 0,
            borderColor: 'rgba(130, 50, 255, 0.4)',
            paddingTop: 12, paddingBottom: 12, paddingLeft: 24, paddingRight: 24,
            borderRadius: '12px', alignItems: 'center',
          }}
        >
          <text style={{ fontSize: 14, fontWeight: '600', color: isActive ? '#E2E8F0' : '#FFFFFF' }}>
            {isActive ? 'End live activity' : 'Start live activity'}
          </text>
        </view>
        <view
          bindtap={handleUpdate}
          style={{
            marginLeft: 12,
            borderWidth: 1, borderColor: 'rgba(130, 50, 255, 0.6)',
            paddingTop: 12, paddingBottom: 12, paddingLeft: 24, paddingRight: 24,
            borderRadius: '12px', alignItems: 'center',
            opacity: isActive ? 1 : 0.5,
          }}
        >
          <text style={{ fontSize: 14, fontWeight: '600', color: '#E2E8F0' }}>Update</text>
        </view>
      </view>
    </view>
  );
}

// ─── Testing Grounds Screen ─────────────────────────────────────

function TestingGroundsScreen({ onBack }: { onBack: () => void }) {
  const [activeScreen, setActiveScreen] = useState<string | null>(null);

  if (activeScreen) {
    const entry = TESTING_ENTRIES.find(e => e.id === activeScreen);
    const DemoComponent = entry?.component;
    return (
      <view style={{ width: '100%', height: '100%', backgroundColor: '#0B0F19' }}>
        <view style={{ display: 'linear', linearDirection: 'row', alignItems: 'center', padding: 12, paddingTop: 60, backgroundColor: '#0F172A', borderBottomWidth: 1, borderBottomColor: 'rgba(148, 163, 184, 0.12)' }}>
          <view bindtap={() => setActiveScreen(null)} style={{ paddingRight: 12 }}>
            <text style={{ fontSize: 16, fontWeight: '600', color: '#8232FF' }}>Back</text>
          </view>
          <text style={{ fontSize: 17, fontWeight: 'bold', color: '#E2E8F0' }}>{entry?.title}</text>
        </view>
        <scroll-view style={{ width: '100%', linearWeight: 1 }} scroll-orientation="vertical">
          {DemoComponent ? <DemoComponent /> : null}
        </scroll-view>
      </view>
    );
  }

  return (
    <view style={{ width: '100%', height: '100%', backgroundColor: '#0B0F19' }}>
      <scroll-view style={{ width: '100%', linearWeight: 1 } as any} scroll-orientation="vertical">
        <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 70, paddingBottom: 24 }}>
          <text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF' } as any}>
            Testing Grounds
          </text>
          <text style={{ fontSize: 14, color: '#CBD5F5', marginBottom: 8 } as any}>
            Explore different aspects of Voltra development. Each section provides hands-on examples and demonstrations of specific features.
          </text>

          {TESTING_ENTRIES.map((entry) => (
            <view
              key={entry.id}
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
                {entry.title}
              </text>
              <text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 } as any}>
                {entry.description}
              </text>
              <view
                bindtap={() => setActiveScreen(entry.id)}
                style={{
                  backgroundColor: '#8232FF',
                  borderRadius: '12px',
                  paddingTop: 12,
                  paddingBottom: 12,
                  paddingLeft: 24,
                  paddingRight: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                } as any}
              >
                <text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' } as any}>
                  Explore {entry.title}
                </text>
              </view>
            </view>
          ))}

          <view style={{ marginTop: 24, alignItems: 'center' } as any}>
            <view
              bindtap={onBack}
              style={{
                borderWidth: 1,
                borderColor: 'rgba(130, 50, 255, 0.6)',
                backgroundColor: 'transparent',
                borderRadius: '12px',
                paddingTop: 12,
                paddingBottom: 12,
                paddingLeft: 24,
                paddingRight: 24,
                alignItems: 'center',
              } as any}
            >
              <text style={{ color: '#E2E8F0', fontSize: 14, fontWeight: '600' } as any}>
                Back to Live Activities
              </text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  );
}

// ─── Main App ───────────────────────────────────────────────────

export function App() {
  const [screen, setScreen] = useState<'home' | 'testing'>('home');

  if (screen === 'testing') {
    return <TestingGroundsScreen onBack={() => setScreen('home')} />;
  }

  return (
    <view style={{ width: '100%', height: '100%', backgroundImage: BG_GRADIENT } as any}>
      <scroll-view style={{ width: '100%', linearWeight: 1 }} scroll-orientation="vertical">
        <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 60, paddingBottom: 24 }}>
          {/* Header */}
          <text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF' }}>Voltra</text>
          <text style={{ fontSize: 14, color: '#CBD5F5', marginBottom: 8 }}>
            Voltra is a library that lets you build custom Live Activities and Dynamic Island layouts using Lynx — powered by the same rendering engine.
          </text>

          {/* Navigation */}
          <view style={{ marginTop: 16, display: 'linear', linearDirection: 'row' }}>
            <view
              bindtap={() => setScreen('testing')}
              style={{
                backgroundColor: 'rgba(130, 50, 255, 0.1)',
                borderWidth: 1, borderColor: 'rgba(130, 50, 255, 0.4)',
                paddingTop: 12, paddingBottom: 12, paddingLeft: 24, paddingRight: 24,
                borderRadius: '12px', alignItems: 'center',
              }}
            >
              <text style={{ fontSize: 14, fontWeight: '600', color: '#E2E8F0' }}>Testing Grounds</text>
            </view>
          </view>

          {/* Live Activity Cards */}
          {ACTIVITIES.map((def) => (
            <ActivityCard key={def.key} def={def} />
          ))}

          {/* End All */}
          <view
            bindtap={() => {
              'background only';
              VoltraModule.endAllLiveActivities().catch(() => {});
            }}
            style={{
              marginTop: 12,
              borderWidth: 1, borderColor: 'rgba(130, 50, 255, 0.4)',
              backgroundColor: 'rgba(130, 50, 255, 0.1)',
              paddingTop: 12, paddingBottom: 12, paddingLeft: 24, paddingRight: 24,
              borderRadius: '12px', alignItems: 'center',
            }}
          >
            <text style={{ fontSize: 14, fontWeight: '600', color: '#8232FF' }}>End all live activities</text>
          </view>
        </view>
      </scroll-view>
    </view>
  );
}
