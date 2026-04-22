import { useState, useCallback } from '@lynx-js/react';
import { Button, StatusPill } from './components';
import { BasicLiveActivityDemo } from './demos/ios/BasicLiveActivity';
import { MusicPlayerActivity } from './demos/ios/MusicPlayerActivity';
import { FlightTrackerActivity } from './demos/ios/FlightTrackerActivity';
import { WorkoutTrackerActivity } from './demos/ios/WorkoutTrackerActivity';
import { CompassActivity } from './demos/ios/CompassActivity';
import { DeepLinksActivity } from './demos/ios/DeepLinksActivity';
import { LiquidGlassActivity } from './demos/ios/LiquidGlassActivity';
import { SupplementalFamiliesDemo } from './demos/ios/SupplementalFamiliesDemo';
import { WeatherWidgetDemo } from './demos/ios/WeatherWidgetDemo';
import { PortfolioWidgetDemo } from './demos/ios/PortfolioWidgetDemo';
import { VoltraWidgetLogo } from './demos/android/VoltraWidgetLogo';
import { ChartWidgets } from './demos/android/ChartWidgets';
import { MaterialColorsWidget } from './demos/android/MaterialColorsWidget';
import { InteractiveTodosWidget } from './demos/android/InteractiveTodosWidget';
import { OngoingNotificationDemo } from './demos/android/OngoingNotificationDemo';
import { TimerScreen } from './demos/testing/TimerScreen';
import { ProgressIndicatorsScreen } from './demos/testing/ProgressIndicatorsScreen';
import { StylingScreen } from './demos/testing/StylingScreen';
import { FlexPlaygroundScreen } from './demos/testing/FlexPlaygroundScreen';
import { ChartPlaygroundScreen } from './demos/testing/ChartPlaygroundScreen';
import { GradientPlaygroundScreen } from './demos/testing/GradientPlaygroundScreen';
import { PositioningScreen } from './demos/testing/PositioningScreen';
import { ComponentsCatalogScreen } from './demos/testing/ComponentsCatalogScreen';
import { ImagePreloadingScreen } from './demos/testing/ImagePreloadingScreen';
import { WidgetSchedulingScreen } from './demos/testing/WidgetSchedulingScreen';
import { ServerDrivenWidgetsScreen } from './demos/testing/ServerDrivenWidgetsScreen';
import { CustomFontsScreen } from './demos/testing/CustomFontsScreen';
import { ImageFallbackScreen } from './demos/testing/ImageFallbackScreen';
import { WeatherWidgetScreen } from './demos/testing/WeatherWidgetScreen';

// NativeModules global (available on background thread)
declare const NativeModules: {
  VoltraModule: {
    startLiveActivity: (json: string, options: any, callback: (id: any) => void) => void;
    updateLiveActivity: (id: string, json: string, options: any, callback: (r: any) => void) => void;
    endLiveActivity: (id: string, options: any, callback: (r: any) => void) => void;
    endAllLiveActivities: (callback: (r: any) => void) => void;
  };
};

// ─── Theme ──────────────────────────────────────────────────────────────────

const colors = {
  primary: '#8232FF',
  headerBg: '#0F172A',
  screenBg: '#0B0F19',
  cardBg: '#0F172A',
  cardBorder: 'rgba(148, 163, 184, 0.12)',
  textPrimary: '#E2E8F0',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  tabBarBg: '#0F172A',
  tabBarBorder: 'rgba(148, 163, 184, 0.15)',
  backButton: '#8232FF',
  chevron: '#64748B',
};

// ─── Data ───────────────────────────────────────────────────────────────────

type Tab = 'ios' | 'android' | 'testing';

const iosActivities = [
  { id: 'basic', title: 'Basic Live Activity', active: false },
  { id: 'music', title: 'Music Player', active: false },
  { id: 'flight', title: 'Flight Tracker', active: false },
  { id: 'workout', title: 'Workout Tracker', active: false },
  { id: 'compass', title: 'Compass', active: false },
  { id: 'deeplinks', title: 'Deep Links', active: false },
  { id: 'liquid-glass', title: 'Liquid Glass', active: false },
  { id: 'supplemental', title: 'Supplemental Families', active: false },
  { id: 'weather-widget', title: 'Weather Widget', active: false },
  { id: 'portfolio-widget', title: 'Portfolio Widget', active: false },
];

const androidWidgets = [
  { id: 'logo', title: 'Voltra Widget (Logo)' },
  { id: 'charts', title: 'Chart Widgets' },
  { id: 'material-colors', title: 'Material Colors' },
  { id: 'todos', title: 'Interactive Todos' },
  { id: 'ongoing', title: 'Ongoing Notification' },
];

type TestingEntry = { id: string; title: string };
type TestingSection = { header: string; entries: TestingEntry[] };

const testingSections: TestingSection[] = [
  {
    header: 'Components & Styling',
    entries: [
      { id: 'components', title: 'Components Catalog' },
      { id: 'styling', title: 'Styling' },
      { id: 'flex', title: 'Flex Playground' },
    ],
  },
  {
    header: 'Timers & Progress',
    entries: [
      { id: 'timer', title: 'Timer' },
      { id: 'progress', title: 'Progress Indicators' },
    ],
  },
  {
    header: 'Charts & Gradients',
    entries: [
      { id: 'charts', title: 'Chart Playground' },
      { id: 'gradients', title: 'Gradient Playground' },
    ],
  },
  {
    header: 'Layout',
    entries: [
      { id: 'positioning', title: 'Positioning' },
    ],
  },
  {
    header: 'Images',
    entries: [
      { id: 'preloading', title: 'Image Preloading' },
      { id: 'image-fallback', title: 'Image Fallback' },
    ],
  },
  {
    header: 'Widgets',
    entries: [
      { id: 'scheduling', title: 'Widget Scheduling' },
      { id: 'weather-testing', title: 'Weather Widget' },
    ],
  },
];

// Map demo IDs to components
const demoComponents: Record<string, () => JSX.Element> = {
  'basic': BasicLiveActivityDemo,
  'music': MusicPlayerActivity,
  'flight': FlightTrackerActivity,
  'workout': WorkoutTrackerActivity,
  'compass': CompassActivity,
  'deeplinks': DeepLinksActivity,
  'liquid-glass': LiquidGlassActivity,
  'supplemental': SupplementalFamiliesDemo,
  'weather-widget': WeatherWidgetDemo,
  'portfolio-widget': PortfolioWidgetDemo,
  'logo': VoltraWidgetLogo,
  // Note: 'charts' conflicts between android and testing tabs
  'android-charts': ChartWidgets,
  'material-colors': MaterialColorsWidget,
  'todos': InteractiveTodosWidget,
  'ongoing': OngoingNotificationDemo,
  'timer': TimerScreen,
  'progress': ProgressIndicatorsScreen,
  'styling': StylingScreen,
  'flex': FlexPlaygroundScreen,
  'testing-charts': ChartPlaygroundScreen,
  'gradients': GradientPlaygroundScreen,
  'positioning': PositioningScreen,
  'components': ComponentsCatalogScreen,
  'preloading': ImagePreloadingScreen,
  'scheduling': WidgetSchedulingScreen,
  'server-driven': ServerDrivenWidgetsScreen,
  'custom-fonts': CustomFontsScreen,
  'image-fallback': ImageFallbackScreen,
  'weather-testing': WeatherWidgetScreen,
};

// ─── Demo Screen (detail view) ─────────────────────────────────────────────

function DemoScreen({ id, title, onBack }: { id: string; title: string; onBack: () => void }) {
  'background only';
  const DemoComponent = demoComponents[id];

  return (
    <view style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: colors.screenBg }}>
      {/* Header */}
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          paddingTop: 16,
          backgroundColor: colors.headerBg,
          borderBottomWidth: 1,
          borderBottomColor: colors.tabBarBorder,
        }}
      >
        <view bindtap={onBack} style={{ paddingRight: 12, paddingLeft: 4, paddingTop: 4, paddingBottom: 4 }}>
          <text style={{ fontSize: 16, fontWeight: '600', color: colors.backButton }}>Back</text>
        </view>
        <text style={{ fontSize: 17, fontWeight: 'bold', color: colors.textPrimary }}>{title}</text>
      </view>

      {/* Demo Content */}
      <scroll-view style={{ flexGrow: 1 }} scroll-y>
        {DemoComponent ? <DemoComponent /> : (
          <view style={{ padding: 16 }}>
            <text style={{ color: colors.textMuted }}>No demo component for "{id}"</text>
          </view>
        )}
      </scroll-view>
    </view>
  );
}

// ─── iOS Live Activities Hub ────────────────────────────────────────────────

function IOSActivityList({
  onSelect,
}: {
  onSelect: (id: string, title: string) => void;
}) {
  'background only';

  const handleEndAll = useCallback(() => {
    'background only';
    if (typeof NativeModules !== 'undefined' && NativeModules.VoltraModule) {
      NativeModules.VoltraModule.endAllLiveActivities(() => {
        // Activities ended
      });
    }
  }, []);

  return (
    <scroll-view style={{ flexGrow: 1, backgroundColor: colors.screenBg }} scroll-y>
      <view style={{ padding: 16 }}>
        {iosActivities.map((entry) => (
          <view
            key={entry.id}
            bindtap={() => onSelect(entry.id, entry.title)}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              padding: 16,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: colors.cardBorder,
            }}
          >
            <view style={{ flex: 1 }}>
              <text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>
                {entry.title}
              </text>
            </view>
            <view style={{ marginRight: 10 }}>
              <StatusPill active={entry.active} />
            </view>
            <text style={{ color: colors.chevron, fontSize: 18 }}>›</text>
          </view>
        ))}

        {/* End All Activities Button */}
        <view style={{ marginTop: 12, marginBottom: 24 }}>
          <Button title="End All Activities" variant="ghost" onPress={handleEndAll} />
        </view>
      </view>
    </scroll-view>
  );
}

// ─── Android Widgets List ───────────────────────────────────────────────────

function AndroidWidgetList({
  onSelect,
}: {
  onSelect: (id: string, title: string) => void;
}) {
  'background only';
  return (
    <scroll-view style={{ flexGrow: 1, backgroundColor: colors.screenBg }} scroll-y>
      <view style={{ padding: 16 }}>
        {androidWidgets.map((entry) => {
          const resolvedId = entry.id === 'charts' ? 'android-charts' : entry.id;
          return (
            <view
              key={entry.id}
              bindtap={() => onSelect(resolvedId, entry.title)}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.cardBg,
                borderRadius: 16,
                padding: 16,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: colors.cardBorder,
              }}
            >
              <text style={{ flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>
                {entry.title}
              </text>
              <text style={{ color: colors.chevron, fontSize: 18 }}>›</text>
            </view>
          );
        })}
      </view>
    </scroll-view>
  );
}

// ─── Testing Grounds Hub ────────────────────────────────────────────────────

function TestingList({
  onSelect,
}: {
  onSelect: (id: string, title: string) => void;
}) {
  'background only';
  return (
    <scroll-view style={{ flexGrow: 1, backgroundColor: colors.screenBg }} scroll-y>
      <view style={{ padding: 16 }}>
        {testingSections.map((section) => (
          <view key={section.header} style={{ marginBottom: 16 }}>
            {/* Section Header */}
            <text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: colors.textMuted,
                letterSpacing: 0.8,
                marginBottom: 8,
                marginLeft: 4,
              }}
            >
              {section.header.toUpperCase()}
            </text>

            {/* Section Entries */}
            <view
              style={{
                backgroundColor: colors.cardBg,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.cardBorder,
                overflow: 'hidden',
              }}
            >
              {section.entries.map((entry, idx) => {
                const resolvedId = entry.id === 'charts' ? 'testing-charts' : entry.id;
                return (
                  <view
                    key={entry.id}
                    bindtap={() => onSelect(resolvedId, entry.title)}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 14,
                      paddingLeft: 16,
                      paddingRight: 16,
                      borderBottomWidth: idx < section.entries.length - 1 ? 1 : 0,
                      borderBottomColor: colors.cardBorder,
                    }}
                  >
                    <text style={{ flex: 1, fontSize: 15, color: colors.textPrimary }}>
                      {entry.title}
                    </text>
                    <text style={{ color: colors.chevron, fontSize: 18 }}>›</text>
                  </view>
                );
              })}
            </view>
          </view>
        ))}
      </view>
    </scroll-view>
  );
}

// ─── App Root ───────────────────────────────────────────────────────────────

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('ios');
  const [currentScreen, setCurrentScreen] = useState<{ id: string; title: string } | null>(null);

  if (currentScreen) {
    return (
      <DemoScreen
        id={currentScreen.id}
        title={currentScreen.title}
        onBack={() => setCurrentScreen(null)}
      />
    );
  }

  const handleSelect = (id: string, title: string) => setCurrentScreen({ id, title });

  return (
    <view style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: colors.screenBg }}>
      {/* Header */}
      <view style={{ padding: 16, paddingTop: 20, backgroundColor: colors.headerBg, borderBottomWidth: 1, borderBottomColor: colors.tabBarBorder }}>
        <text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' }}>Voltra Lynx Demo</text>
      </view>

      {/* Content */}
      {activeTab === 'ios' && <IOSActivityList onSelect={handleSelect} />}
      {activeTab === 'android' && <AndroidWidgetList onSelect={handleSelect} />}
      {activeTab === 'testing' && <TestingList onSelect={handleSelect} />}

      {/* Tab Bar */}
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: colors.tabBarBg,
          borderTopWidth: 1,
          borderTopColor: colors.tabBarBorder,
        }}
      >
        <view
          style={{ flex: 1, padding: 12, alignItems: 'center' }}
          bindtap={() => setActiveTab('ios')}
        >
          <text
            style={{
              color: activeTab === 'ios' ? colors.primary : colors.textMuted,
              fontWeight: activeTab === 'ios' ? 'bold' : 'normal',
              fontSize: 13,
            }}
          >
            Live Activities
          </text>
        </view>
        <view
          style={{ flex: 1, padding: 12, alignItems: 'center' }}
          bindtap={() => setActiveTab('android')}
        >
          <text
            style={{
              color: activeTab === 'android' ? colors.primary : colors.textMuted,
              fontWeight: activeTab === 'android' ? 'bold' : 'normal',
              fontSize: 13,
            }}
          >
            Android Widgets
          </text>
        </view>
        <view
          style={{ flex: 1, padding: 12, alignItems: 'center' }}
          bindtap={() => setActiveTab('testing')}
        >
          <text
            style={{
              color: activeTab === 'testing' ? colors.primary : colors.textMuted,
              fontWeight: activeTab === 'testing' ? 'bold' : 'normal',
              fontSize: 13,
            }}
          >
            Testing
          </text>
        </view>
      </view>
    </view>
  );
}
