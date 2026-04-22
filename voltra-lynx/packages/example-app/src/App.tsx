import { useState } from '@lynx-js/react';
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

type Tab = 'ios' | 'android' | 'testing';

const iosActivities = [
  { id: 'basic', title: 'Basic Live Activity' },
  { id: 'music', title: 'Music Player' },
  { id: 'flight', title: 'Flight Tracker' },
  { id: 'workout', title: 'Workout Tracker' },
  { id: 'compass', title: 'Compass' },
  { id: 'deeplinks', title: 'Deep Links' },
  { id: 'liquid-glass', title: 'Liquid Glass' },
  { id: 'supplemental', title: 'Supplemental Families' },
  { id: 'weather-widget', title: 'Weather Widget' },
  { id: 'portfolio-widget', title: 'Portfolio Widget' },
];

const androidWidgets = [
  { id: 'logo', title: 'Voltra Widget (Logo)' },
  { id: 'charts', title: 'Chart Widgets' },
  { id: 'material-colors', title: 'Material Colors' },
  { id: 'todos', title: 'Interactive Todos' },
  { id: 'ongoing', title: 'Ongoing Notification' },
];

const testingScreens = [
  { id: 'timer', title: 'Timer' },
  { id: 'progress', title: 'Progress Indicators' },
  { id: 'styling', title: 'Styling' },
  { id: 'flex', title: 'Flex Playground' },
  { id: 'charts', title: 'Chart Playground' },
  { id: 'gradients', title: 'Gradient Playground' },
  { id: 'positioning', title: 'Positioning' },
  { id: 'components', title: 'Components Catalog' },
  { id: 'preloading', title: 'Image Preloading' },
  { id: 'scheduling', title: 'Widget Scheduling' },
  { id: 'server-driven', title: 'Server-Driven Widgets' },
  { id: 'custom-fonts', title: 'Custom Fonts' },
  { id: 'image-fallback', title: 'Image Fallback' },
  { id: 'weather-testing', title: 'Weather Widget Testing' },
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

function DemoScreen({ id, title, onBack }: { id: string; title: string; onBack: () => void }) {
  'background only';
  const DemoComponent = demoComponents[id];

  return (
    <view style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
        }}
      >
        <view bindtap={onBack} style={{ paddingRight: 12 }}>
          <text style={{ fontSize: 16, color: '#007AFF' }}>Back</text>
        </view>
        <text style={{ fontSize: 17, fontWeight: 'bold' }}>{title}</text>
      </view>

      {/* Demo Content */}
      <scroll-view style={{ flexGrow: 1 }} scroll-y>
        {DemoComponent ? <DemoComponent /> : (
          <view style={{ padding: 16 }}>
            <text style={{ color: '#999' }}>No demo component for "{id}"</text>
          </view>
        )}
      </scroll-view>
    </view>
  );
}

function DemoList({
  entries,
  tab,
  onSelect,
}: {
  entries: { id: string; title: string }[];
  tab: Tab;
  onSelect: (id: string, title: string) => void;
}) {
  'background only';
  return (
    <scroll-view style={{ flexGrow: 1 }} scroll-y>
      {entries.map((entry) => {
        // Disambiguate 'charts' id between android and testing tabs
        const resolvedId = entry.id === 'charts'
          ? (tab === 'android' ? 'android-charts' : 'testing-charts')
          : entry.id;
        return (
          <view
            key={entry.id}
            bindtap={() => onSelect(resolvedId, entry.title)}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#f0f0f0',
            }}
          >
            <text style={{ flex: 1, fontSize: 16 }}>{entry.title}</text>
            <text style={{ color: '#ccc', fontSize: 16 }}>›</text>
          </view>
        );
      })}
    </scroll-view>
  );
}

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

  const entries =
    activeTab === 'ios'
      ? iosActivities
      : activeTab === 'android'
        ? androidWidgets
        : testingScreens;

  return (
    <view style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <view style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}>
        <text style={{ fontSize: 24, fontWeight: 'bold' }}>Voltra Lynx Demo</text>
      </view>

      {/* Content */}
      <DemoList
        entries={entries}
        tab={activeTab}
        onSelect={(id, title) => setCurrentScreen({ id, title })}
      />

      {/* Tab Bar */}
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        }}
      >
        <view
          style={{ flex: 1, padding: 12, alignItems: 'center' }}
          bindtap={() => setActiveTab('ios')}
        >
          <text
            style={{
              color: activeTab === 'ios' ? '#007AFF' : '#999',
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
              color: activeTab === 'android' ? '#007AFF' : '#999',
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
              color: activeTab === 'testing' ? '#007AFF' : '#999',
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
