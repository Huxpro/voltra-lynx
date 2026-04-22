import type { ReactNode } from '@lynx-js/react';

export function Card({ children }: { children?: ReactNode }) {
  return (
    <view style={{
      backgroundColor: '#0F172A',
      borderRadius: 20,
      padding: 18,
      borderWidth: 1,
      borderColor: 'rgba(148, 163, 184, 0.12)',
      marginTop: 16,
    }}>
      {children}
    </view>
  );
}

Card.Title = function CardTitle({ children }: { children?: ReactNode }) {
  return (
    <text style={{ fontSize: 18, fontWeight: '600', color: '#E2E8F0' }}>
      {children}
    </text>
  );
};

Card.Text = function CardText({ children }: { children?: ReactNode }) {
  return (
    <text style={{ marginTop: 10, color: '#94A3B8', fontSize: 13, lineHeight: 18 }}>
      {children}
    </text>
  );
};
