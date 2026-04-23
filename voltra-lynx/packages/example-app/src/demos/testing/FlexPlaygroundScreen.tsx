import { useState, useCallback } from '@lynx-js/react';
import { Voltra } from '@use-voltra/ios';
import { VoltraPreview } from '../../components/VoltraPreview';

type FlexDirection = 'row' | 'column';
type AlignItems = 'flex-start' | 'center' | 'flex-end' | 'stretch';
type JustifyContent =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

const FLEX_DIRECTION_OPTIONS: FlexDirection[] = ['column', 'row'];
const ALIGN_ITEMS_OPTIONS: AlignItems[] = [
  'flex-start',
  'center',
  'flex-end',
  'stretch',
];
const JUSTIFY_CONTENT_OPTIONS: JustifyContent[] = [
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
];

export function FlexPlaygroundScreen() {
  const [flexDirection, setFlexDirection] = useState<FlexDirection>('column');
  const [alignItems, setAlignItems] = useState<AlignItems>('stretch');
  const [justifyContent, setJustifyContent] =
    useState<JustifyContent>('flex-start');
  const [gap, setGap] = useState<number>(8);
  const [containerPadding, setContainerPadding] = useState<number>(16);

  const cycleFlexDirection = useCallback(() => {
    setFlexDirection((prev: FlexDirection) => {
      const idx = FLEX_DIRECTION_OPTIONS.indexOf(prev);
      return FLEX_DIRECTION_OPTIONS[(idx + 1) % FLEX_DIRECTION_OPTIONS.length];
    });
  }, []);

  const cycleAlignItems = useCallback(() => {
    setAlignItems((prev: AlignItems) => {
      const idx = ALIGN_ITEMS_OPTIONS.indexOf(prev);
      return ALIGN_ITEMS_OPTIONS[(idx + 1) % ALIGN_ITEMS_OPTIONS.length];
    });
  }, []);

  const cycleJustifyContent = useCallback(() => {
    setJustifyContent((prev: JustifyContent) => {
      const idx = JUSTIFY_CONTENT_OPTIONS.indexOf(prev);
      return JUSTIFY_CONTENT_OPTIONS[
        (idx + 1) % JUSTIFY_CONTENT_OPTIONS.length
      ];
    });
  }, []);

  const increaseGap = useCallback(
    () => setGap((prev: number) => Math.min(prev + 4, 32)),
    [],
  );
  const decreaseGap = useCallback(
    () => setGap((prev: number) => Math.max(prev - 4, 0)),
    [],
  );
  const increasePadding = useCallback(
    () => setContainerPadding((prev: number) => Math.min(prev + 4, 32)),
    [],
  );
  const decreasePadding = useCallback(
    () => setContainerPadding((prev: number) => Math.max(prev - 4, 0)),
    [],
  );

  return (
    <scroll-view style={{ linearWeight: 1 } as any} scroll-orientation="vertical">
      <view
        style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 }}
      >
        <text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: 8,
          } as any}
        >
          Flex Layout Playground
        </text>
        <text
          style={{
            fontSize: 14,
            color: '#CBD5F5',
            marginBottom: 20,
          } as any}
        >
          Experiment with flex properties using the new View component with
          dynamic flexDirection.
        </text>

        {/* ── Controls Card ─────────────────────────────────────── */}
        <view
          style={{
            backgroundColor: '#0F172A',
            borderRadius: '20px',
            padding: 18,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: 'rgba(148, 163, 184, 0.12)',
          } as any}
        >
          <text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: 12,
            } as any}
          >
            Controls
          </text>

          {/* Flex Direction */}
          <view
            style={{
              display: 'linear',
              linearDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <text
              style={
                { fontSize: 14, color: '#CBD5F5', linearWeight: 1 } as any
              }
            >
              Flex Direction:
            </text>
            <view
              bindtap={cycleFlexDirection}
              style={{
                paddingLeft: 14,
                paddingRight: 14,
                paddingTop: 7,
                paddingBottom: 7,
                backgroundColor: '#334155',
                borderRadius: '8px',
              }}
            >
              <text
                style={
                  { color: '#3B82F6', fontSize: 13, fontWeight: '600' } as any
                }
              >
                {flexDirection}
              </text>
            </view>
          </view>

          {/* Align Items */}
          <view
            style={{
              display: 'linear',
              linearDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <text
              style={
                { fontSize: 14, color: '#CBD5F5', linearWeight: 1 } as any
              }
            >
              Align Items:
            </text>
            <view
              bindtap={cycleAlignItems}
              style={{
                paddingLeft: 14,
                paddingRight: 14,
                paddingTop: 7,
                paddingBottom: 7,
                backgroundColor: '#334155',
                borderRadius: '8px',
              }}
            >
              <text
                style={
                  { color: '#3B82F6', fontSize: 13, fontWeight: '600' } as any
                }
              >
                {alignItems}
              </text>
            </view>
          </view>

          {/* Justify Content */}
          <view
            style={{
              display: 'linear',
              linearDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <text
              style={
                { fontSize: 14, color: '#CBD5F5', linearWeight: 1 } as any
              }
            >
              Justify Content:
            </text>
            <view
              bindtap={cycleJustifyContent}
              style={{
                paddingLeft: 14,
                paddingRight: 14,
                paddingTop: 7,
                paddingBottom: 7,
                backgroundColor: '#334155',
                borderRadius: '8px',
              }}
            >
              <text
                style={
                  { color: '#3B82F6', fontSize: 13, fontWeight: '600' } as any
                }
              >
                {justifyContent}
              </text>
            </view>
          </view>

          {/* Gap */}
          <view
            style={{
              display: 'linear',
              linearDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <text
              style={
                { fontSize: 14, color: '#CBD5F5', linearWeight: 1 } as any
              }
            >
              Gap: {gap}px
            </text>
            <view
              style={{ display: 'linear', linearDirection: 'row', gap: 8 }}
            >
              <view
                bindtap={decreaseGap}
                style={{
                  paddingLeft: 14,
                  paddingRight: 14,
                  paddingTop: 7,
                  paddingBottom: 7,
                  backgroundColor: '#334155',
                  borderRadius: '8px',
                }}
              >
                <text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: '600',
                  } as any}
                >
                  -
                </text>
              </view>
              <view
                bindtap={increaseGap}
                style={{
                  paddingLeft: 14,
                  paddingRight: 14,
                  paddingTop: 7,
                  paddingBottom: 7,
                  backgroundColor: '#334155',
                  borderRadius: '8px',
                }}
              >
                <text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: '600',
                  } as any}
                >
                  +
                </text>
              </view>
            </view>
          </view>

          {/* Container Padding */}
          <view
            style={{
              display: 'linear',
              linearDirection: 'row',
              alignItems: 'center',
            }}
          >
            <text
              style={
                { fontSize: 14, color: '#CBD5F5', linearWeight: 1 } as any
              }
            >
              Padding: {containerPadding}px
            </text>
            <view
              style={{ display: 'linear', linearDirection: 'row', gap: 8 }}
            >
              <view
                bindtap={decreasePadding}
                style={{
                  paddingLeft: 14,
                  paddingRight: 14,
                  paddingTop: 7,
                  paddingBottom: 7,
                  backgroundColor: '#334155',
                  borderRadius: '8px',
                }}
              >
                <text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: '600',
                  } as any}
                >
                  -
                </text>
              </view>
              <view
                bindtap={increasePadding}
                style={{
                  paddingLeft: 14,
                  paddingRight: 14,
                  paddingTop: 7,
                  paddingBottom: 7,
                  backgroundColor: '#334155',
                  borderRadius: '8px',
                }}
              >
                <text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: '600',
                  } as any}
                >
                  +
                </text>
              </view>
            </view>
          </view>
        </view>

        {/* ── Live Preview Card ─────────────────────────────────── */}
        <view
          style={{
            backgroundColor: '#0F172A',
            borderRadius: '20px',
            padding: 18,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: 'rgba(148, 163, 184, 0.12)',
          } as any}
        >
          <text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: 4,
            } as any}
          >
            Live Preview
          </text>
          <text
            style={{ fontSize: 13, color: '#94A3B8', marginBottom: 10 } as any}
          >
            See how your flex settings affect the layout below
          </text>

          <view style={{
            backgroundColor: '#1E293B',
            borderRadius: '12px',
            overflow: 'hidden',
          } as any}>
            <VoltraPreview id="flex-playground-main" height={300}>
              <Voltra.View
                style={{
                  backgroundColor: '#334155',
                  padding: containerPadding,
                  width: '100%',
                  height: '100%',
                  flexDirection,
                  alignItems,
                  justifyContent,
                  gap,
                }}
              >
                <Voltra.View
                  style={{
                    backgroundColor: '#EF4444',
                    padding: 12,
                    borderRadius: 8,
                    width: flexDirection === 'row' ? 80 : undefined,
                    height: flexDirection === 'column' ? 60 : undefined,
                  }}
                >
                  <Voltra.Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>
                    Item 1
                  </Voltra.Text>
                </Voltra.View>

                <Voltra.View
                  style={{
                    backgroundColor: '#3B82F6',
                    padding: 12,
                    borderRadius: 8,
                    width: flexDirection === 'row' ? 100 : undefined,
                    height: flexDirection === 'column' ? 80 : undefined,
                  }}
                >
                  <Voltra.Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>
                    Item 2
                  </Voltra.Text>
                </Voltra.View>

                <Voltra.View
                  style={{
                    backgroundColor: '#10B981',
                    padding: 12,
                    borderRadius: 8,
                    width: flexDirection === 'row' ? 60 : undefined,
                    height: flexDirection === 'column' ? 50 : undefined,
                  }}
                >
                  <Voltra.Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>
                    Item 3
                  </Voltra.Text>
                </Voltra.View>
              </Voltra.View>
            </VoltraPreview>
          </view>
        </view>

        {/* ── Text Align Test Card ──────────────────────────────── */}
        <view
          style={{
            backgroundColor: '#0F172A',
            borderRadius: '20px',
            padding: 18,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: 'rgba(148, 163, 184, 0.12)',
          } as any}
        >
          <text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: 4,
            } as any}
          >
            Text Align in Flex
          </text>
          <text
            style={{ fontSize: 13, color: '#94A3B8', marginBottom: 10 } as any}
          >
            Text alignment within stretched flex children
          </text>

          <view style={{
            backgroundColor: '#1E293B',
            borderRadius: '12px',
            overflow: 'hidden',
          } as any}>
            <VoltraPreview id="flex-playground-text-align" height={200}>
              <Voltra.View
                style={{
                  backgroundColor: '#334155',
                  padding: 8,
                  width: '100%',
                  height: '100%',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: 8,
                }}
              >
                <Voltra.View style={{ backgroundColor: '#1E293B', padding: 8, flex: 1 }}>
                  <Voltra.Text style={{ color: '#FFFFFF', fontSize: 14, textAlign: 'left' }}>
                    textAlign: left
                  </Voltra.Text>
                </Voltra.View>
                <Voltra.View style={{ backgroundColor: '#1E293B', padding: 8, flex: 1 }}>
                  <Voltra.Text style={{ color: '#FFFFFF', fontSize: 14, textAlign: 'center' }}>
                    textAlign: center
                  </Voltra.Text>
                </Voltra.View>
                <Voltra.View style={{ backgroundColor: '#1E293B', padding: 8, flex: 1 }}>
                  <Voltra.Text style={{ color: '#FFFFFF', fontSize: 14, textAlign: 'right' }}>
                    textAlign: right
                  </Voltra.Text>
                </Voltra.View>
              </Voltra.View>
            </VoltraPreview>
          </view>
        </view>
      </view>
    </scroll-view>
  );
}
