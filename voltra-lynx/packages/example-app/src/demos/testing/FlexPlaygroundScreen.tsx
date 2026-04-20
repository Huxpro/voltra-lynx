import { useState } from '@lynx-js/react';

type FlexDirection = 'row' | 'column';
type JustifyContent = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
type AlignItems = 'flex-start' | 'center' | 'flex-end' | 'stretch';

const justifyOptions: JustifyContent[] = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'];
const alignOptions: AlignItems[] = ['flex-start', 'center', 'flex-end', 'stretch'];

export function FlexPlaygroundScreen() {
  const [direction, setDirection] = useState<FlexDirection>('row');
  const [justify, setJustify] = useState<JustifyContent>('flex-start');
  const [align, setAlign] = useState<AlignItems>('flex-start');
  const [wrap, setWrap] = useState(false);

  const justifyIndex = justifyOptions.indexOf(justify);
  const alignIndex = alignOptions.indexOf(align);

  const cycleJustify = () => {
    setJustify(justifyOptions[(justifyIndex + 1) % justifyOptions.length]);
  };

  const cycleAlign = () => {
    setAlign(alignOptions[(alignIndex + 1) % alignOptions.length]);
  };

  return (
    <scroll-view style={{ flex: 1 }}>
      <view style={{ padding: 16 }}>
        <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          Flex Playground
        </text>
        <text style={{ color: '#666', marginBottom: 24 }}>
          Interactive flexbox layout playground.
        </text>

        {/* Preview area */}
        <view style={{
          height: 200,
          backgroundColor: '#f0f0f0',
          borderRadius: 12,
          borderWidth: 2,
          borderColor: '#ddd',
          padding: 8,
          marginBottom: 24,
          flexDirection: direction,
          justifyContent: justify,
          alignItems: align,
          flexWrap: wrap ? 'wrap' : 'nowrap',
        }}>
          <view style={{ width: 40, height: 40, backgroundColor: '#FF3B30', borderRadius: 6, margin: 4 }} />
          <view style={{ width: 50, height: 50, backgroundColor: '#007AFF', borderRadius: 6, margin: 4 }} />
          <view style={{ width: 35, height: 35, backgroundColor: '#34C759', borderRadius: 6, margin: 4 }} />
          <view style={{ width: 45, height: 45, backgroundColor: '#FF9500', borderRadius: 6, margin: 4 }} />
          <view style={{ width: 30, height: 30, backgroundColor: '#5856D6', borderRadius: 6, margin: 4 }} />
        </view>

        {/* Controls */}
        <view style={{ gap: 12 }}>
          {/* Direction */}
          <view style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <text style={{ fontSize: 14, fontWeight: '600' }}>Direction</text>
            <view style={{ flexDirection: 'row', gap: 8 }}>
              <view
                bindtap={() => setDirection('row')}
                style={{
                  paddingLeft: 12, paddingRight: 12,
                  paddingTop: 6, paddingBottom: 6,
                  backgroundColor: direction === 'row' ? '#007AFF' : '#e5e5e5',
                  borderRadius: 6,
                }}
              >
                <text style={{ color: direction === 'row' ? '#fff' : '#333', fontSize: 13 }}>Row</text>
              </view>
              <view
                bindtap={() => setDirection('column')}
                style={{
                  paddingLeft: 12, paddingRight: 12,
                  paddingTop: 6, paddingBottom: 6,
                  backgroundColor: direction === 'column' ? '#007AFF' : '#e5e5e5',
                  borderRadius: 6,
                }}
              >
                <text style={{ color: direction === 'column' ? '#fff' : '#333', fontSize: 13 }}>Column</text>
              </view>
            </view>
          </view>

          {/* Justify Content */}
          <view style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <text style={{ fontSize: 14, fontWeight: '600' }}>Justify</text>
            <view
              bindtap={cycleJustify}
              style={{
                paddingLeft: 12, paddingRight: 12,
                paddingTop: 6, paddingBottom: 6,
                backgroundColor: '#007AFF',
                borderRadius: 6,
              }}
            >
              <text style={{ color: '#fff', fontSize: 13 }}>{justify}</text>
            </view>
          </view>

          {/* Align Items */}
          <view style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <text style={{ fontSize: 14, fontWeight: '600' }}>Align</text>
            <view
              bindtap={cycleAlign}
              style={{
                paddingLeft: 12, paddingRight: 12,
                paddingTop: 6, paddingBottom: 6,
                backgroundColor: '#007AFF',
                borderRadius: 6,
              }}
            >
              <text style={{ color: '#fff', fontSize: 13 }}>{align}</text>
            </view>
          </view>

          {/* Wrap */}
          <view style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <text style={{ fontSize: 14, fontWeight: '600' }}>Wrap</text>
            <view
              bindtap={() => setWrap(!wrap)}
              style={{
                paddingLeft: 12, paddingRight: 12,
                paddingTop: 6, paddingBottom: 6,
                backgroundColor: wrap ? '#34C759' : '#e5e5e5',
                borderRadius: 6,
              }}
            >
              <text style={{ color: wrap ? '#fff' : '#333', fontSize: 13 }}>
                {wrap ? 'On' : 'Off'}
              </text>
            </view>
          </view>
        </view>

        {/* Current values display */}
        <view style={{ marginTop: 20, backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12 }}>
          <text style={{ fontFamily: 'monospace', fontSize: 12, color: '#333' }}>
            {`flexDirection: "${direction}"`}
          </text>
          <text style={{ fontFamily: 'monospace', fontSize: 12, color: '#333' }}>
            {`justifyContent: "${justify}"`}
          </text>
          <text style={{ fontFamily: 'monospace', fontSize: 12, color: '#333' }}>
            {`alignItems: "${align}"`}
          </text>
          <text style={{ fontFamily: 'monospace', fontSize: 12, color: '#333' }}>
            {`flexWrap: "${wrap ? 'wrap' : 'nowrap'}"`}
          </text>
        </view>
      </view>
    </scroll-view>
  );
}
