import { useState } from '@lynx-js/react';

interface DeepLink {
  label: string;
  url: string;
  description: string;
}

const mockDeepLinks: DeepLink[] = [
  { label: 'Open Order', url: 'myapp://orders/12345', description: 'Navigate to order details' },
  { label: 'Track Delivery', url: 'myapp://delivery/track?id=abc', description: 'Open delivery tracking' },
  { label: 'Contact Support', url: 'myapp://support/chat', description: 'Launch support chat' },
  { label: 'Rate Experience', url: 'myapp://feedback/rate', description: 'Open rating screen' },
];

export function DeepLinksActivity() {
  const [lastTapped, setLastTapped] = useState<string | null>(null);
  const [tapCount, setTapCount] = useState(0);

  const handleLinkTap = (link: DeepLink) => {
    setLastTapped(link.url);
    setTapCount((c) => c + 1);
  };

  return (
    <view style={{ flex: 1, padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Deep Links Activity
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Activity with tappable link/button components that trigger deep link URLs.
      </text>

      {/* Activity preview with links */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
      }}>
        <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
          Order #12345 - Delivering
        </text>

        <view style={{ gap: 10 }}>
          {mockDeepLinks.map((link) => (
            <view
              key={link.url}
              bindtap={() => handleLinkTap(link)}
              style={{
                backgroundColor: '#2c2c2e',
                padding: 12,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <view style={{ flex: 1 }}>
                <text style={{ color: '#007AFF', fontSize: 15, fontWeight: '600' }}>
                  {link.label}
                </text>
                <text style={{ color: '#666', fontSize: 12, marginTop: 2 }}>
                  {link.description}
                </text>
              </view>
              <text style={{ color: '#666', fontSize: 16 }}>{'>'}</text>
            </view>
          ))}
        </view>
      </view>

      {/* URL display */}
      <view style={{
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 14,
        marginBottom: 16,
      }}>
        <text style={{ color: '#666', fontSize: 12, marginBottom: 4 }}>Last tapped URL:</text>
        <text style={{ color: '#333', fontSize: 14, fontFamily: 'monospace' }}>
          {lastTapped || 'None'}
        </text>
      </view>

      <text style={{ color: '#666', fontSize: 13 }}>
        Total taps: {tapCount}
      </text>

      <text style={{ color: '#999', fontSize: 12, marginTop: 16 }}>
        In production, these deep links would open the corresponding screen in the app when the user taps the Live Activity.
      </text>
    </view>
  );
}
