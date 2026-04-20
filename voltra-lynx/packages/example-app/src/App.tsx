import { useState } from '@lynx-js/react';

type Tab = 'ios' | 'android' | 'testing';
type Screen = { tab: Tab; demo: string } | null;

// Demo entries per tab
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
];

function DemoScreen({ demo, onBack }: { demo: string; onBack: () => void }) {
  'background only';
  return (
    <view style={{ flex: 1 }}>
      <view
        style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}
      >
        <view bindtap={onBack} style={{ paddingRight: 16 }}>
          <text style={{ fontSize: 18, color: '#007AFF' }}>← Back</text>
        </view>
        <text style={{ fontSize: 18, fontWeight: 'bold' }}>{demo}</text>
      </view>
      <view style={{ flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center' }}>
        <text style={{ fontSize: 16, color: '#666' }}>Demo: {demo}</text>
        <text style={{ fontSize: 14, color: '#999', marginTop: 8 }}>Implementation pending</text>
      </view>
    </view>
  );
}

function DemoList({
  entries,
  onSelect,
}: {
  entries: { id: string; title: string }[];
  onSelect: (title: string) => void;
}) {
  'background only';
  return (
    <scroll-view style={{ flex: 1 }} scroll-y>
      {entries.map((entry) => (
        <view
          key={entry.id}
          bindtap={() => onSelect(entry.title)}
          style={{
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <text style={{ flex: 1, fontSize: 16 }}>{entry.title}</text>
          <text style={{ color: '#ccc', fontSize: 18 }}>→</text>
        </view>
      ))}
    </scroll-view>
  );
}

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('ios');
  const [currentScreen, setCurrentScreen] = useState<Screen>(null);

  if (currentScreen) {
    return (
      <DemoScreen
        demo={currentScreen.demo}
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
    <view style={{ flex: 1 }}>
      {/* Header */}
      <view style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}>
        <text style={{ fontSize: 24, fontWeight: 'bold' }}>Voltra Lynx Demo</text>
      </view>

      {/* Content */}
      <DemoList
        entries={entries}
        onSelect={(title) => setCurrentScreen({ tab: activeTab, demo: title })}
      />

      {/* Tab Bar */}
      <view
        style={{
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
