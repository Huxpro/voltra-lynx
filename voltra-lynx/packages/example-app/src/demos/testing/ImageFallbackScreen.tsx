import { useState, useCallback } from '@lynx-js/react';
import { VoltraModule } from '@use-voltra/lynx/ios-client';
import { Voltra, renderLiveActivityToString } from '@use-voltra/ios';

// ─── Payload builders (Voltra JSX rendered to string) ───────────────────────

function bgColorPayload(): string {
  return renderLiveActivityToString({
    lockScreen: (
      <Voltra.VStack style={{ padding: 16, backgroundColor: '#1E293B' } as any} spacing={12}>
        <Voltra.Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' } as any}>
          Missing Image Test
        </Voltra.Text>
        <Voltra.HStack spacing={8}>
          <Voltra.Image
            source={{ assetName: 'nonexistent-image' }}
            style={{
              width: 60,
              height: 60,
              backgroundColor: '#EF4444',
              borderRadius: 12,
            } as any}
          />
          <Voltra.VStack spacing={4}>
            <Voltra.Text style={{ fontSize: 14, fontWeight: '600', color: '#F1F5F9' } as any}>
              Red Background
            </Voltra.Text>
            <Voltra.Text style={{ fontSize: 12, color: '#94A3B8' } as any}>
              backgroundColor: '#EF4444'
            </Voltra.Text>
          </Voltra.VStack>
        </Voltra.HStack>
      </Voltra.VStack>
    ),
  });
}

function multipleColorsPayload(): string {
  return renderLiveActivityToString({
    lockScreen: (
      <Voltra.VStack style={{ padding: 16, backgroundColor: '#0F172A' } as any} spacing={12}>
        <Voltra.Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' } as any}>
          Color Palette
        </Voltra.Text>
        <Voltra.HStack spacing={8}>
          <Voltra.Image
            source={{ assetName: 'missing-1' }}
            style={{ width: 50, height: 50, backgroundColor: '#EF4444', borderRadius: 8 } as any}
          />
          <Voltra.Image
            source={{ assetName: 'missing-2' }}
            style={{ width: 50, height: 50, backgroundColor: '#F59E0B', borderRadius: 8 } as any}
          />
          <Voltra.Image
            source={{ assetName: 'missing-3' }}
            style={{ width: 50, height: 50, backgroundColor: '#10B981', borderRadius: 8 } as any}
          />
          <Voltra.Image
            source={{ assetName: 'missing-4' }}
            style={{ width: 50, height: 50, backgroundColor: '#3B82F6', borderRadius: 8 } as any}
          />
        </Voltra.HStack>
      </Voltra.VStack>
    ),
  });
}

function transparentPayload(): string {
  return renderLiveActivityToString({
    lockScreen: (
      <Voltra.VStack style={{ padding: 16, backgroundColor: '#6366F1' } as any} spacing={12}>
        <Voltra.Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' } as any}>
          Transparent Fallback
        </Voltra.Text>
        <Voltra.Image
          source={{ assetName: 'nonexistent' }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: '#FFFFFF',
          } as any}
        />
        <Voltra.Text style={{ fontSize: 12, color: '#E0E7FF' } as any}>
          No backgroundColor - parent color shows through
        </Voltra.Text>
      </Voltra.VStack>
    ),
  });
}

function combinedStylesPayload(): string {
  return renderLiveActivityToString({
    lockScreen: (
      <Voltra.VStack style={{ padding: 16, backgroundColor: '#1E293B' } as any} spacing={12}>
        <Voltra.Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' } as any}>
          Styled Fallback
        </Voltra.Text>
        <Voltra.Image
          source={{ assetName: 'missing-styled' }}
          style={{
            width: 120,
            height: 80,
            backgroundColor: '#8B5CF6',
            borderRadius: 20,
            borderWidth: 3,
            borderColor: '#A78BFA',
          } as any}
        />
        <Voltra.Text style={{ fontSize: 11, color: '#94A3B8' } as any}>
          backgroundColor + borderRadius + borders
        </Voltra.Text>
      </Voltra.VStack>
    ),
  });
}

function customFallbackPayload(): string {
  return renderLiveActivityToString({
    lockScreen: (
      <Voltra.VStack style={{ padding: 16, backgroundColor: '#0F172A' } as any} spacing={12}>
        <Voltra.Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' } as any}>
          Custom Fallback
        </Voltra.Text>
        <Voltra.Image
          source={{ assetName: 'missing-custom' }}
          fallback={
            <Voltra.VStack style={{ flex: 1 } as any} spacing={4} alignment="center">
              <Voltra.Symbol name="photo" size={32} tintColor="#64748B" />
              <Voltra.Text style={{ fontSize: 10, color: '#64748B' } as any}>No Image</Voltra.Text>
            </Voltra.VStack>
          }
          style={{
            width: 100,
            height: 100,
            backgroundColor: '#1E293B',
            borderRadius: 12,
            borderWidth: 2,
            borderColor: '#334155',
          } as any}
        />
      </Voltra.VStack>
    ),
  });
}

function mixedImagesPayload(): string {
  return renderLiveActivityToString({
    lockScreen: (
      <Voltra.VStack style={{ padding: 16, backgroundColor: '#111827' } as any} spacing={12}>
        <Voltra.Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' } as any}>
          Image Grid
        </Voltra.Text>
        <Voltra.HStack spacing={8}>
          <Voltra.Image
            source={{ assetName: 'missing-1' }}
            style={{ width: 50, height: 50, backgroundColor: '#DC2626', borderRadius: 8 } as any}
          />
          <Voltra.Image
            source={{ assetName: 'missing-2' }}
            style={{ width: 50, height: 50, backgroundColor: '#059669', borderRadius: 8 } as any}
          />
          <Voltra.Image
            source={{ assetName: 'missing-3' }}
            style={{ width: 50, height: 50, backgroundColor: '#2563EB', borderRadius: 8 } as any}
          />
        </Voltra.HStack>
        <Voltra.Text style={{ fontSize: 11, color: '#6B7280' } as any}>
          All missing - styled with different colors
        </Voltra.Text>
      </Voltra.VStack>
    ),
  });
}

// ─── Scenario definitions ───────────────────────────────────────────────────

interface Scenario {
  id: string;
  title: string;
  description: string;
  previewColors: string[];
  previewSize: { w: number; h: number };
  previewBorderColor: string | null;
  previewBorderWidth: number;
  previewBorderRadius: string;
  hasCustomFallback: boolean;
  getPayload: () => string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'bg-color',
    title: '1. Missing Image with Background Color',
    description:
      'When an image is missing and no fallback component is provided, the backgroundColor from styles is used.',
    previewColors: ['#EF4444'],
    previewSize: { w: 60, h: 60 },
    previewBorderColor: null,
    previewBorderWidth: 0,
    previewBorderRadius: '12px',
    hasCustomFallback: false,
    getPayload: bgColorPayload,
  },
  {
    id: 'multi-colors',
    title: '2. Multiple Fallback Colors',
    description:
      'Display multiple missing images with different background colors to demonstrate the style-based approach.',
    previewColors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'],
    previewSize: { w: 50, h: 50 },
    previewBorderColor: null,
    previewBorderWidth: 0,
    previewBorderRadius: '8px',
    hasCustomFallback: false,
    getPayload: multipleColorsPayload,
  },
  {
    id: 'transparent',
    title: '3. Transparent Fallback (No Background)',
    description:
      'When no backgroundColor is specified, the fallback is transparent, allowing the parent background to show through.',
    previewColors: [],
    previewSize: { w: 100, h: 100 },
    previewBorderColor: '#FFFFFF',
    previewBorderWidth: 2,
    previewBorderRadius: '16px',
    hasCustomFallback: false,
    getPayload: transparentPayload,
  },
  {
    id: 'combined',
    title: '4. Combined Style Properties',
    description:
      'Apply multiple style properties to the fallback including backgroundColor, borderRadius, borders, and shadows.',
    previewColors: ['#8B5CF6'],
    previewSize: { w: 120, h: 80 },
    previewBorderColor: '#A78BFA',
    previewBorderWidth: 3,
    previewBorderRadius: '20px',
    hasCustomFallback: false,
    getPayload: combinedStylesPayload,
  },
  {
    id: 'custom',
    title: '5. Custom Fallback Component',
    description:
      'Use a custom fallback component with icons or text. The styles apply to the container, not the fallback content.',
    previewColors: ['#1E293B'],
    previewSize: { w: 100, h: 100 },
    previewBorderColor: '#334155',
    previewBorderWidth: 2,
    previewBorderRadius: '12px',
    hasCustomFallback: true,
    getPayload: customFallbackPayload,
  },
  {
    id: 'mixed',
    title: '6. Mixed: Valid and Missing Images',
    description:
      'Display a mix of valid and missing images to show consistent styling behavior. Valid images display normally while missing ones show the styled fallback.',
    previewColors: ['#DC2626', '#059669', '#2563EB'],
    previewSize: { w: 50, h: 50 },
    previewBorderColor: null,
    previewBorderWidth: 0,
    previewBorderRadius: '8px',
    hasCustomFallback: false,
    getPayload: mixedImagesPayload,
  },
];

// ─── Screen ─────────────────────────────────────────────────────────────────

export function ImageFallbackScreen() {
  const [statusMessage, setStatusMessage] = useState('Select a scenario to preview.');

  const handleShowExample = useCallback((scenario: Scenario) => {
    'background only';
    const payload = scenario.getPayload();
    VoltraModule.startLiveActivity(payload, { activityName: `image-fallback-${scenario.id}` }).then(() => {
      setStatusMessage('Started: ' + scenario.title);
    }).catch((e: any) => {
      setStatusMessage('Error: ' + (e?.message || String(e)));
    });
  }, []);

  return (
    <scroll-view scroll-orientation="vertical" style={{ linearWeight: 1 } as any}>
      <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 }}>
        {/* Header */}
        <text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF' }}>
          Image Fallback with Styles
        </text>
        <text style={{ fontSize: 14, color: '#CBD5F5', marginBottom: 8 }}>
          Test the new image fallback behavior using backgroundColor from styles instead of the
          deprecated fallbackColor prop.
        </text>

        {/* Status bar */}
        <view
          style={{
            backgroundColor: '#1E293B',
            borderRadius: '10px',
            padding: 12,
            marginBottom: 16,
          }}
        >
          <text style={{ fontSize: 12, color: '#94A3B8' }}>{statusMessage}</text>
        </view>

        {/* Scenario cards */}
        {SCENARIOS.map((scenario) => (
          <view
            key={scenario.id}
            style={{
              backgroundColor: '#1E293B',
              borderRadius: '12px',
              padding: 16,
              marginBottom: 12,
            }}
          >
            <text
              style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 }}
            >
              {scenario.title}
            </text>
            <text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 12 }}>
              {scenario.description}
            </text>

            {/* Fallback preview */}
            <view
              style={{
                display: 'linear',
                linearDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              {scenario.previewColors.length > 1 ? (
                scenario.previewColors.map((color, i) => (
                  <view
                    key={`${scenario.id}-${i}`}
                    style={{
                      width: scenario.previewSize.w,
                      height: scenario.previewSize.h,
                      backgroundColor: color,
                      borderRadius: scenario.previewBorderRadius,
                      marginRight: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <text style={{ color: '#FFFFFF', fontSize: 10 }}>IMG</text>
                  </view>
                ))
              ) : (
                <view
                  style={{
                    width: scenario.previewSize.w,
                    height: scenario.previewSize.h,
                    backgroundColor:
                      scenario.previewColors.length > 0
                        ? scenario.previewColors[0]
                        : 'transparent',
                    borderRadius: scenario.previewBorderRadius,
                    borderWidth: scenario.previewBorderWidth,
                    borderColor: scenario.previewBorderColor || 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {scenario.hasCustomFallback ? (
                    <view style={{ alignItems: 'center' }}>
                      <text style={{ fontSize: 24, color: '#64748B' }}>?</text>
                      <text style={{ fontSize: 10, color: '#64748B' }}>No Image</text>
                    </view>
                  ) : (
                    <text
                      style={{
                        color: scenario.previewColors.length > 0 ? '#FFFFFF' : '#666666',
                        fontSize: 11,
                      }}
                    >
                      {scenario.previewColors.length > 0 ? 'Fallback' : 'Transparent'}
                    </text>
                  )}
                </view>
              )}
            </view>

            {/* Show Example button */}
            <view
              bindtap={() => handleShowExample(scenario)}
              style={{
                backgroundColor: '#007AFF',
                padding: 12,
                borderRadius: '8px',
                alignItems: 'center',
              }}
            >
              <text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>
                Show Example
              </text>
            </view>
          </view>
        ))}

        {/* Migration note */}
        <view
          style={{
            backgroundColor: '#1E293B',
            borderRadius: '12px',
            padding: 16,
            marginTop: 8,
            borderLeftWidth: 4,
            borderLeftColor: '#3B82F6',
          }}
        >
          <text
            style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 }}
          >
            Migration Note
          </text>
          <text style={{ fontSize: 13, color: '#CBD5E1' }}>
            The fallbackColor prop has been removed. Use backgroundColor in the style prop
            instead.
          </text>
          <text style={{ fontSize: 13, color: '#CBD5E1', marginTop: 8 }}>
            Before: fallbackColor="#E0E0E0"
          </text>
          <text style={{ fontSize: 13, color: '#60A5FA' }}>
            After: style={'{'}backgroundColor: "#E0E0E0"{'}'}
          </text>
        </view>
      </view>
    </scroll-view>
  );
}
