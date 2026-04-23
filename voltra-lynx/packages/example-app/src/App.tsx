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

const TESTING_ENTRIES: { id: string; title: string; component: () => JSX.Element }[] = [
  { id: 'components', title: 'Components Catalog', component: ComponentsCatalogScreen },
  { id: 'styling', title: 'Styling', component: StylingScreen },
  { id: 'flex', title: 'Flex Playground', component: FlexPlaygroundScreen },
  { id: 'timer', title: 'Timer', component: TimerScreen },
  { id: 'progress', title: 'Progress Indicators', component: ProgressIndicatorsScreen },
  { id: 'charts', title: 'Chart Playground', component: ChartPlaygroundScreen },
  { id: 'gradients', title: 'Gradient Playground', component: GradientPlaygroundScreen },
  { id: 'positioning', title: 'Positioning', component: PositioningScreen },
  { id: 'preloading', title: 'Image Preloading', component: ImagePreloadingScreen },
  { id: 'image-fallback', title: 'Image Fallback', component: ImageFallbackScreen },
  { id: 'scheduling', title: 'Widget Scheduling', component: WidgetSchedulingScreen },
  { id: 'weather', title: 'Weather Widget', component: WeatherWidgetScreen },
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
      <view style={{ display: 'linear', linearDirection: 'row', alignItems: 'center', padding: 12, paddingTop: 60, backgroundColor: '#0F172A', borderBottomWidth: 1, borderBottomColor: 'rgba(148, 163, 184, 0.12)' }}>
        <view bindtap={onBack} style={{ paddingRight: 12 }}>
          <text style={{ fontSize: 16, fontWeight: '600', color: '#8232FF' }}>Back</text>
        </view>
        <text style={{ fontSize: 17, fontWeight: 'bold', color: '#E2E8F0' }}>Testing Grounds</text>
      </view>
      <scroll-view style={{ width: '100%', linearWeight: 1 }} scroll-orientation="vertical">
        <view style={{ padding: 16 }}>
          {TESTING_ENTRIES.map((entry) => (
            <view
              key={entry.id}
              bindtap={() => setActiveScreen(entry.id)}
              style={{
                backgroundColor: '#0F172A', borderRadius: '12px', padding: 16, marginBottom: 8,
                borderWidth: 1, borderColor: 'rgba(148, 163, 184, 0.12)',
                display: 'linear', linearDirection: 'row', alignItems: 'center',
              }}
            >
              <text style={{ color: '#E2E8F0', fontSize: 16, linearWeight: 1 } as any}>{entry.title}</text>
              <text style={{ color: '#94A3B8', fontSize: 16 }}>›</text>
            </view>
          ))}
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
