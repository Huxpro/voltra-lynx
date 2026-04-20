import { useState } from '@lynx-js/react';
import { renderVoltraVariantToJson } from '@use-voltra/ios';
import { renderAndroidWidgetToJson } from '@use-voltra/android';

// Re-export to prove Layer 0 imports resolve
export { renderVoltraVariantToJson, renderAndroidWidgetToJson };

type Tab = 'ios' | 'android' | 'testing';

function TabContent({ tab }: { tab: Tab }) {
  'background only';

  switch (tab) {
    case 'ios':
      return (
        <view>
          <text style={{ fontSize: 20, fontWeight: 'bold' }}>
            iOS Activities
          </text>
          <text>Live Activity demos will appear here.</text>
        </view>
      );
    case 'android':
      return (
        <view>
          <text style={{ fontSize: 20, fontWeight: 'bold' }}>
            Android Widgets
          </text>
          <text>Android widget demos will appear here.</text>
        </view>
      );
    case 'testing':
      return (
        <view>
          <text style={{ fontSize: 20, fontWeight: 'bold' }}>Testing</text>
          <text>Testing ground screens will appear here.</text>
        </view>
      );
  }
}

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('ios');

  return (
    <view style={{ flex: 1 }}>
      {/* Header */}
      <view style={{ padding: 16 }}>
        <text style={{ fontSize: 24, fontWeight: 'bold' }}>
          Voltra Lynx Demo
        </text>
      </view>

      {/* Content */}
      <view style={{ flex: 1, padding: 16 }}>
        <TabContent tab={activeTab} />
      </view>

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
            }}
          >
            iOS Activities
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
            }}
          >
            Testing
          </text>
        </view>
      </view>
    </view>
  );
}
