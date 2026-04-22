import { useState, useCallback } from '@lynx-js/react';

// Lynx NativeModules global
declare const NativeModules: {
  VoltraModule: {
    startLiveActivity: (json: string, options: any, callback: (id: any) => void) => void;
  };
};

interface FallbackScenario {
  id: string;
  title: string;
  description: string;
  bgColor: string | null; // null = transparent fallback
  borderColor: string | null;
  borderWidth: number;
  borderRadius: number;
  hasCustomFallback: boolean;
}

const scenarios: FallbackScenario[] = [
  {
    id: '1',
    title: '1. Missing Image with Background Color',
    description: 'When an image is missing and no fallback component is provided, the backgroundColor from styles is used.',
    bgColor: '#EF4444',
    borderColor: null,
    borderWidth: 0,
    borderRadius: 12,
    hasCustomFallback: false,
  },
  {
    id: '2',
    title: '2. Multiple Fallback Colors',
    description: 'Multiple missing images with different background colors to demonstrate the style-based approach.',
    bgColor: '#F59E0B',
    borderColor: null,
    borderWidth: 0,
    borderRadius: 8,
    hasCustomFallback: false,
  },
  {
    id: '3',
    title: '3. Transparent Fallback (No Background)',
    description: 'No backgroundColor is specified. The fallback is transparent, allowing the parent background to show through.',
    bgColor: null,
    borderColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 16,
    hasCustomFallback: false,
  },
  {
    id: '4',
    title: '4. Combined Style Properties',
    description: 'Apply multiple style properties: backgroundColor, borderRadius, borders, and shadows.',
    bgColor: '#8B5CF6',
    borderColor: '#A78BFA',
    borderWidth: 3,
    borderRadius: 20,
    hasCustomFallback: false,
  },
  {
    id: '5',
    title: '5. Custom Fallback Component',
    description: 'Uses a custom fallback component with icons or text. Styles apply to the container, not the fallback content.',
    bgColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 2,
    borderRadius: 12,
    hasCustomFallback: true,
  },
  {
    id: '6',
    title: '6. Mixed: Valid and Missing Images',
    description: 'A mix of valid and missing images showing consistent styling behavior.',
    bgColor: '#DC2626',
    borderColor: null,
    borderWidth: 0,
    borderRadius: 8,
    hasCustomFallback: false,
  },
];

const colorPalette = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'];

export function ImageFallbackScreen() {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Select a scenario to preview.');

  const handleShowExample = useCallback((scenario: FallbackScenario) => {
    'background only';
    setActiveScenario(scenario.id);
    setStatusMessage('Showing: ' + scenario.title);

    // In a real implementation, this would call startLiveActivity
    // with a Voltra.Image using backgroundColor fallback.
    // Since we cannot render Voltra JSX in Lynx directly, we show the scenario
    // description and simulate the native call.
    try {
      if (typeof NativeModules !== 'undefined' && NativeModules.VoltraModule) {
        // Build a mock payload representing the fallback scenario
        const mockPayload = JSON.stringify({
          scenario: scenario.id,
          backgroundColor: scenario.bgColor,
          borderRadius: scenario.borderRadius,
        });
        NativeModules.VoltraModule.startLiveActivity(
          mockPayload,
          { activityName: `image-fallback-${scenario.id}` },
          (result: any) => {
            const resultStr = String(result);
            if (resultStr.startsWith('ERROR:')) {
              setStatusMessage('Error: ' + resultStr.substring(6));
            } else {
              setStatusMessage('Activity started for: ' + scenario.title);
            }
          }
        );
      } else {
        setStatusMessage('NativeModules not available. Showing preview only.');
      }
    } catch (e: any) {
      setStatusMessage('Error: ' + (e?.message || String(e)));
    }
  }, []);

  return (
    <scroll-view style={{ flex: 1, backgroundColor: '#0B0F1A' } as any} scroll-y>
      <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 } as any}>
        <text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' } as any}>
          Image Fallback with Styles
        </text>
        <text style={{ fontSize: 14, color: '#CBD5F5', marginBottom: 16 } as any}>
          Test the image fallback behavior using backgroundColor from styles instead of the
          deprecated fallbackColor prop.
        </text>

        {/* Status bar */}
        <view style={{
          backgroundColor: '#1E293B',
          borderRadius: 10,
          padding: 12,
          marginBottom: 16,
        } as any}>
          <text style={{ fontSize: 12, color: '#94A3B8' } as any}>{statusMessage}</text>
        </view>

        {/* Scenario cards */}
        {scenarios.map((scenario) => (
          <view key={scenario.id} style={{
            backgroundColor: '#1E293B',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            borderWidth: activeScenario === scenario.id ? 1 : 0,
            borderColor: '#3B82F6',
          } as any}>
            <text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 } as any}>
              {scenario.title}
            </text>
            <text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 12 } as any}>
              {scenario.description}
            </text>

            {/* Fallback preview */}
            <view style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            } as any}>
              {scenario.id === '2' ? (
                // Multiple colors scenario
                colorPalette.map((color, i) => (
                  <view key={`color-${i}`} style={{
                    width: 50,
                    height: 50,
                    backgroundColor: color,
                    borderRadius: scenario.borderRadius,
                    marginRight: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  } as any}>
                    <text style={{ color: '#fff', fontSize: 10 } as any}>IMG</text>
                  </view>
                ))
              ) : scenario.id === '6' ? (
                // Mixed images scenario
                ['#DC2626', '#059669', '#2563EB'].map((color, i) => (
                  <view key={`mixed-${i}`} style={{
                    width: 50,
                    height: 50,
                    backgroundColor: color,
                    borderRadius: scenario.borderRadius,
                    marginRight: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  } as any}>
                    <text style={{ color: '#fff', fontSize: 10 } as any}>IMG</text>
                  </view>
                ))
              ) : (
                // Single image preview
                <view style={{
                  width: scenario.id === '4' ? 120 : 100,
                  height: scenario.id === '4' ? 80 : 100,
                  backgroundColor: scenario.bgColor || 'transparent',
                  borderRadius: scenario.borderRadius,
                  borderWidth: scenario.borderWidth,
                  borderColor: scenario.borderColor || 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                } as any}>
                  {scenario.hasCustomFallback ? (
                    <view style={{ alignItems: 'center' } as any}>
                      <text style={{ fontSize: 24, color: '#64748B' } as any}>?</text>
                      <text style={{ fontSize: 10, color: '#64748B' } as any}>No Image</text>
                    </view>
                  ) : (
                    <text style={{ color: scenario.bgColor ? '#fff' : '#666', fontSize: 11 } as any}>
                      {scenario.bgColor ? 'Fallback' : 'Transparent'}
                    </text>
                  )}
                </view>
              )}
            </view>

            {/* Show example button */}
            <view
              bindtap={() => handleShowExample(scenario)}
              style={{
                backgroundColor: '#007AFF',
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
              } as any}
            >
              <text style={{ color: '#fff', fontSize: 14, fontWeight: '600' } as any}>
                Show Example
              </text>
            </view>
          </view>
        ))}

        {/* Migration note */}
        <view style={{
          backgroundColor: '#1E293B',
          borderRadius: 12,
          padding: 16,
          marginTop: 8,
          borderLeftWidth: 4,
          borderLeftColor: '#3B82F6',
        } as any}>
          <text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 } as any}>
            Migration Note
          </text>
          <text style={{ fontSize: 13, color: '#CBD5E1' } as any}>
            The fallbackColor prop has been removed. Use backgroundColor in the style prop instead.
          </text>
          <text style={{ fontSize: 13, color: '#CBD5E1', marginTop: 8 } as any}>
            Before: fallbackColor="#E0E0E0"
          </text>
          <text style={{ fontSize: 13, color: '#60A5FA' } as any}>
            After: style={'{'}backgroundColor: "#E0E0E0"{'}'}
          </text>
        </view>
      </view>
    </scroll-view>
  );
}
