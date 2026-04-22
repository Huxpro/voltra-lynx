import { useState } from '@lynx-js/react';

interface WidgetPayload {
  type: string;
  props: Record<string, unknown>;
  children?: WidgetPayload[];
}

const mockPayloads: { name: string; payload: WidgetPayload }[] = [
  {
    name: 'Simple Text',
    payload: {
      type: 'container',
      props: { backgroundColor: '#1c1c1e', borderRadius: '12px', padding: 16 },
      children: [
        { type: 'text', props: { content: 'Hello from server!', color: '#fff', fontSize: 18, fontWeight: 'bold' } },
        { type: 'text', props: { content: 'This widget is server-driven.', color: '#aaa', fontSize: 14 } },
      ],
    },
  },
  {
    name: 'Status Card',
    payload: {
      type: 'container',
      props: { backgroundColor: '#1c1c1e', borderRadius: '12px', padding: 16 },
      children: [
        { type: 'row', props: {}, children: [
          { type: 'text', props: { content: 'Server Status', color: '#fff', fontSize: 16, fontWeight: '600' } },
          { type: 'badge', props: { content: 'Online', color: '#34C759' } },
        ]},
        { type: 'text', props: { content: 'Last checked: 2 min ago', color: '#666', fontSize: 12 } },
      ],
    },
  },
  {
    name: 'Promo Banner',
    payload: {
      type: 'container',
      props: { backgroundColor: '#5856D6', borderRadius: '12px', padding: 20 },
      children: [
        { type: 'text', props: { content: '50% OFF', color: '#fff', fontSize: 28, fontWeight: 'bold' } },
        { type: 'text', props: { content: 'Limited time offer', color: 'rgba(255,255,255,0.8)', fontSize: 14 } },
        { type: 'button', props: { content: 'Shop Now', backgroundColor: '#fff', color: '#5856D6' } },
      ],
    },
  },
];

export function ServerDrivenWidgetsScreen() {
  const [selectedPayload, setSelectedPayload] = useState(0);
  const [showJson, setShowJson] = useState(false);
  const current = mockPayloads[selectedPayload];

  return (
    <scroll-view style={{ flex: 1 }}>
      <view style={{ padding: 16 }}>
        <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          Server-Driven Widgets
        </text>
        <text style={{ color: '#666', marginBottom: 24 }}>
          Widgets rendered from server-provided JSON payloads.
        </text>

        {/* Payload selector */}
        <view style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          {mockPayloads.map((p, i) => (
            <view
              key={p.name}
              bindtap={() => setSelectedPayload(i)}
              style={{
                flex: 1,
                paddingTop: 8, paddingBottom: 8,
                backgroundColor: selectedPayload === i ? '#007AFF' : '#e5e5e5',
                borderRadius: '8px',
                alignItems: 'center',
              }}
            >
              <text style={{
                color: selectedPayload === i ? '#fff' : '#333',
                fontSize: 11,
                fontWeight: '600',
              }}>
                {p.name}
              </text>
            </view>
          ))}
        </view>

        {/* Rendered widget preview */}
        <view style={{ marginBottom: 20 }}>
          <text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Rendered Widget</text>
          <RenderPayload payload={current.payload} />
        </view>

        {/* Toggle JSON view */}
        <view
          bindtap={() => setShowJson(!showJson)}
          style={{
            backgroundColor: '#333',
            padding: 12,
            borderRadius: '8px',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
            {showJson ? 'Hide' : 'Show'} JSON Payload
          </text>
        </view>

        {/* JSON display */}
        {showJson && (
          <view style={{
            backgroundColor: '#1c1c1e',
            borderRadius: '8px',
            padding: 12,
          }}>
            <text style={{ color: '#aaa', fontSize: 11, fontFamily: 'monospace' }}>
              {JSON.stringify(current.payload, null, 2)}
            </text>
          </view>
        )}
      </view>
    </scroll-view>
  );
}

// Simple recursive renderer for server payloads
function RenderPayload({ payload }: { payload: WidgetPayload }) {
  const { type, props, children } = payload;

  if (type === 'text') {
    return (
      <text style={{
        color: props.color as string || '#333',
        fontSize: props.fontSize as number || 14,
        fontWeight: (props.fontWeight as "bold" | "normal") || 'normal',
        marginTop: 4,
      }}>
        {props.content as string}
      </text>
    );
  }

  if (type === 'badge') {
    return (
      <view style={{
        backgroundColor: props.color as string,
        paddingLeft: 8, paddingRight: 8,
        paddingTop: 3, paddingBottom: 3,
        borderRadius: '6px',
      }}>
        <text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>
          {props.content as string}
        </text>
      </view>
    );
  }

  if (type === 'button') {
    return (
      <view style={{
        backgroundColor: props.backgroundColor as string || '#007AFF',
        paddingLeft: 16, paddingRight: 16,
        paddingTop: 10, paddingBottom: 10,
        borderRadius: '8px',
        alignItems: 'center',
        marginTop: 8,
      }}>
        <text style={{ color: props.color as string || '#fff', fontSize: 14, fontWeight: '600' }}>
          {props.content as string}
        </text>
      </view>
    );
  }

  if (type === 'row') {
    return (
      <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {children?.map((child, i) => <RenderPayload key={`child-${i}`} payload={child} />)}
      </view>
    );
  }

  // Default: container
  return (
    <view style={{
      backgroundColor: props.backgroundColor as string || 'transparent',
      borderRadius: props.borderRadius as number || 0,
      padding: props.padding as number || 0,
    }}>
      {children?.map((child, i) => <RenderPayload key={`child-${i}`} payload={child} />)}
    </view>
  );
}
