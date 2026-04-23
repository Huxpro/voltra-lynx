import { useState, useCallback, useEffect } from '@lynx-js/react';
import { Voltra } from '@use-voltra/ios';
import type { WidgetFamily } from '@use-voltra/ios';
import { updateWidget, reloadWidgets, scheduleWidget } from '@use-voltra/lynx/ios-client';
import { VoltraWidgetPreview } from '../../components/VoltraWidgetPreview';

// ---------------------------------------------------------------------------
// Weather types & constants (mirroring example/widgets/weather-types.ts)
// ---------------------------------------------------------------------------

type WeatherCondition = 'sunny' | 'cloudy' | 'rainy';

interface WeatherData {
  condition: WeatherCondition;
  temperature: number;
  highTemp?: number;
  lowTemp?: number;
  location?: string;
  description?: string;
  lastUpdated?: Date;
}

const WEATHER_GRADIENTS: Record<
  WeatherCondition,
  { colors: readonly [string, string, ...string[]]; start: 'top' | 'bottom'; end: 'top' | 'bottom' }
> = {
  sunny: {
    colors: ['#FFD700', '#FFA500', '#FF8C00'],
    start: 'top',
    end: 'bottom',
  },
  cloudy: {
    colors: ['#778899', '#B0C4DE', '#D3D3D3'],
    start: 'top',
    end: 'bottom',
  },
  rainy: {
    colors: ['#4682B4', '#5F9EA0', '#778899'],
    start: 'top',
    end: 'bottom',
  },
};

const WEATHER_EMOJIS: Record<WeatherCondition, string> = {
  sunny: '\u2600\uFE0F',
  cloudy: '\u2601\uFE0F',
  rainy: '\uD83C\uDF27\uFE0F',
};

const WEATHER_DESCRIPTIONS: Record<WeatherCondition, string> = {
  sunny: 'Sunny',
  cloudy: 'Cloudy',
  rainy: 'Rainy',
};

const SAMPLE_WEATHER_DATA: Record<WeatherCondition, WeatherData> = {
  sunny: {
    condition: 'sunny',
    temperature: 75,
    highTemp: 82,
    lowTemp: 68,
    location: 'San Francisco',
    description: 'Clear skies',
    lastUpdated: new Date(),
  },
  cloudy: {
    condition: 'cloudy',
    temperature: 68,
    highTemp: 74,
    lowTemp: 62,
    location: 'London',
    description: 'Overcast',
    lastUpdated: new Date(),
  },
  rainy: {
    condition: 'rainy',
    temperature: 62,
    highTemp: 68,
    lowTemp: 58,
    location: 'Seattle',
    description: 'Light rain',
    lastUpdated: new Date(),
  },
};

// ---------------------------------------------------------------------------
// Widget family & weather condition constants (matching RN version exactly)
// ---------------------------------------------------------------------------

const WIDGET_FAMILIES: { id: WidgetFamily; title: string; description: string }[] = [
  { id: 'systemSmall', title: 'System Small', description: '2x2 grid widget (170x170pt)' },
  { id: 'systemMedium', title: 'System Medium', description: '4x2 grid widget (364x170pt)' },
  { id: 'systemLarge', title: 'System Large', description: '4x4 grid widget (364x382pt)' },
  { id: 'systemExtraLarge', title: 'System Extra Large', description: '4x8 grid widget (364x768pt)' },
  { id: 'accessoryCircular', title: 'Accessory Circular', description: 'Circular widget (76x76pt)' },
  { id: 'accessoryRectangular', title: 'Accessory Rectangular', description: 'Rectangular widget (172x76pt)' },
  { id: 'accessoryInline', title: 'Accessory Inline', description: 'Inline widget (172x40pt)' },
];

const WEATHER_CONDITIONS: { id: WeatherCondition; label: string; emoji: string }[] = [
  { id: 'sunny', label: 'Sunny', emoji: '\u2600\uFE0F' },
  { id: 'cloudy', label: 'Cloudy', emoji: '\u2601\uFE0F' },
  { id: 'rainy', label: 'Rainy', emoji: '\uD83C\uDF27\uFE0F' },
];

// ---------------------------------------------------------------------------
// WeatherWidget — Voltra JSX component (from IosWeatherWidget.tsx)
// ---------------------------------------------------------------------------

function WeatherWidget({ weather }: { weather: WeatherData }) {
  const gradient = WEATHER_GRADIENTS[weather.condition];
  const emoji = WEATHER_EMOJIS[weather.condition];
  const description = WEATHER_DESCRIPTIONS[weather.condition];

  return (
    <Voltra.LinearGradient colors={gradient.colors} start={gradient.start} end={gradient.end} style={{ flex: 1 }}>
      <Voltra.VStack style={{ flex: 1, padding: 16 }}>
        {/* Temperature and Icon */}
        <Voltra.HStack alignment="center" spacing={8}>
          <Voltra.Text
            style={{
              fontSize: 42,
              fontWeight: '300',
              color: '#FFFFFF',
              shadowColor: '#000000',
              shadowOpacity: 0.3,
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            {weather.temperature}\u00B0
          </Voltra.Text>

          <Voltra.Spacer />

          <Voltra.Text
            style={{
              fontSize: 32,
              shadowColor: '#000000',
              shadowOpacity: 0.3,
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            {emoji}
          </Voltra.Text>
        </Voltra.HStack>

        {/* Description */}
        <Voltra.Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: '#FFFFFF',
            opacity: 0.9,
            shadowColor: '#000000',
            shadowOpacity: 0.3,
            shadowRadius: 1,
            shadowOffset: { width: 0, height: 1 },
            marginTop: 4,
          }}
        >
          {description}
        </Voltra.Text>

        {/* Location */}
        {weather.location ? (
          <Voltra.Text
            style={{
              fontSize: 14,
              color: '#FFFFFF',
              opacity: 0.8,
              shadowColor: '#000000',
              shadowOpacity: 0.3,
              shadowRadius: 1,
              shadowOffset: { width: 0, height: 1 },
              marginTop: 8,
            }}
          >
            \uD83D\uDCCD {weather.location}
          </Voltra.Text>
        ) : null}

        {/* High/Low Temps */}
        {weather.highTemp !== undefined && weather.lowTemp !== undefined ? (
          <Voltra.HStack spacing={12} style={{ marginTop: 12 }}>
            <Voltra.HStack alignment="center" spacing={4}>
              <Voltra.Text style={{ fontSize: 12, color: '#FFFFFF', opacity: 0.8 }}>\uD83D\uDD25</Voltra.Text>
              <Voltra.Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: '#FFFFFF',
                  shadowColor: '#000000',
                  shadowOpacity: 0.3,
                  shadowRadius: 1,
                  shadowOffset: { width: 0, height: 1 },
                }}
              >
                {weather.highTemp}\u00B0
              </Voltra.Text>
            </Voltra.HStack>
            <Voltra.HStack alignment="center" spacing={4}>
              <Voltra.Text style={{ fontSize: 12, color: '#FFFFFF', opacity: 0.8 }}>\u2744\uFE0F</Voltra.Text>
              <Voltra.Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: '#FFFFFF',
                  shadowColor: '#000000',
                  shadowOpacity: 0.3,
                  shadowRadius: 1,
                  shadowOffset: { width: 0, height: 1 },
                }}
              >
                {weather.lowTemp}\u00B0
              </Voltra.Text>
            </Voltra.HStack>
          </Voltra.HStack>
        ) : null}

        {/* Last Updated */}
        {weather.lastUpdated ? (
          <Voltra.Text
            style={{
              fontSize: 10,
              color: '#FFFFFF',
              opacity: 0.6,
              marginTop: 8,
            }}
          >
            \uD83D\uDD52 {weather.lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </Voltra.Text>
        ) : null}
      </Voltra.VStack>
    </Voltra.LinearGradient>
  );
}

// ---------------------------------------------------------------------------
// Card styles (matching StylingScreen pattern)
// ---------------------------------------------------------------------------

const cardStyle = {
  backgroundColor: '#0F172A',
  borderRadius: '20px',
  padding: 18,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: 'rgba(148, 163, 184, 0.12)',
} as any;

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export function WeatherWidgetScreen() {
  const [selectedWeather, setSelectedWeather] = useState<WeatherCondition>('sunny');
  const [selectedFamily, setSelectedFamily] = useState<WidgetFamily>('systemMedium');
  const [currentWeather, setCurrentWeather] = useState<WeatherData>(SAMPLE_WEATHER_DATA.sunny);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready');

  // Auto-initialize on mount (matching RN: calls updateWidget on first render)
  useEffect(() => {
    const weatherData = SAMPLE_WEATHER_DATA['sunny'];
    updateWidget('weather', {
      systemSmall: <WeatherWidget weather={weatherData} />,
      systemMedium: <WeatherWidget weather={weatherData} />,
      systemLarge: <WeatherWidget weather={weatherData} />,
    }).catch((error: any) => {
      console.error('Failed to update weather widget:', error);
    });
    // Don't call reloadWidgets here to avoid resetting scheduled timelines
  }, []);

  const handleWeatherChange = useCallback((condition: WeatherCondition) => {
    'background only';
    setSelectedWeather(condition);
    const weatherData = SAMPLE_WEATHER_DATA[condition];
    setCurrentWeather(weatherData);
    setIsUpdating(true);
    setStatusMessage('Updating widget to ' + condition + '...');

    updateWidget('weather', {
      systemSmall: <WeatherWidget weather={weatherData} />,
      systemMedium: <WeatherWidget weather={weatherData} />,
      systemLarge: <WeatherWidget weather={weatherData} />,
    }).then(() => {
      return reloadWidgets(['weather']);
    }).then(() => {
      setStatusMessage('Widget updated to ' + condition);
      setIsUpdating(false);
    }).catch((e: any) => {
      setStatusMessage('Error: ' + (e?.message || String(e)));
      setIsUpdating(false);
    });
  }, []);

  const handleRandomWeather = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * WEATHER_CONDITIONS.length);
    const randomCondition = WEATHER_CONDITIONS[randomIndex].id;
    handleWeatherChange(randomCondition);
  }, [handleWeatherChange]);

  const handleCustomWeather = useCallback(() => {
    'background only';
    const customWeather: WeatherData = {
      condition: 'sunny',
      temperature: Math.floor(Math.random() * 40) + 50,
      highTemp: Math.floor(Math.random() * 20) + 75,
      lowTemp: Math.floor(Math.random() * 20) + 55,
      location: 'Custom Location',
      description: 'Custom Weather',
    };

    setCurrentWeather(customWeather);
    setIsUpdating(true);
    setStatusMessage('Updating with custom weather...');

    updateWidget('weather', {
      systemSmall: <WeatherWidget weather={customWeather} />,
      systemMedium: <WeatherWidget weather={customWeather} />,
      systemLarge: <WeatherWidget weather={customWeather} />,
    }).then(() => {
      return reloadWidgets(['weather']);
    }).then(() => {
      setStatusMessage('Custom weather applied: ' + customWeather.temperature + '\u00B0F');
      setIsUpdating(false);
    }).catch((e: any) => {
      setStatusMessage('Error: ' + (e?.message || String(e)));
      setIsUpdating(false);
    });
  }, []);

  const handleScheduleForecast = useCallback(() => {
    'background only';
    setIsUpdating(true);
    setStatusMessage('Scheduling forecast timeline...');

    const now = new Date();

    const entries = [
      {
        date: new Date(now.getTime() + 5 * 1000), // Entry 1: 5 seconds from now
        variants: {
          systemSmall: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
              <Voltra.Text style={{ fontSize: 48, fontWeight: '700', color: '#FFFFFF' }}>1</Voltra.Text>
            </Voltra.ZStack>
          ),
          systemMedium: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
              <Voltra.Text style={{ fontSize: 64, fontWeight: '700', color: '#FFFFFF' }}>1</Voltra.Text>
            </Voltra.ZStack>
          ),
          systemLarge: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
              <Voltra.Text style={{ fontSize: 80, fontWeight: '700', color: '#FFFFFF' }}>1</Voltra.Text>
            </Voltra.ZStack>
          ),
        },
      },
      {
        date: new Date(now.getTime() + 1 * 60 * 1000), // Entry 2: 1 minute
        variants: {
          systemSmall: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#16213e' }}>
              <Voltra.Text style={{ fontSize: 48, fontWeight: '700', color: '#00FF00' }}>2</Voltra.Text>
            </Voltra.ZStack>
          ),
          systemMedium: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#16213e' }}>
              <Voltra.Text style={{ fontSize: 64, fontWeight: '700', color: '#00FF00' }}>2</Voltra.Text>
            </Voltra.ZStack>
          ),
          systemLarge: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#16213e' }}>
              <Voltra.Text style={{ fontSize: 80, fontWeight: '700', color: '#00FF00' }}>2</Voltra.Text>
            </Voltra.ZStack>
          ),
        },
      },
      {
        date: new Date(now.getTime() + 2 * 60 * 1000), // Entry 3: 2 minutes
        variants: {
          systemSmall: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#0f3460' }}>
              <Voltra.Text style={{ fontSize: 48, fontWeight: '700', color: '#FF00FF' }}>3</Voltra.Text>
            </Voltra.ZStack>
          ),
          systemMedium: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#0f3460' }}>
              <Voltra.Text style={{ fontSize: 64, fontWeight: '700', color: '#FF00FF' }}>3</Voltra.Text>
            </Voltra.ZStack>
          ),
          systemLarge: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#0f3460' }}>
              <Voltra.Text style={{ fontSize: 80, fontWeight: '700', color: '#FF00FF' }}>3</Voltra.Text>
            </Voltra.ZStack>
          ),
        },
      },
      {
        date: new Date(now.getTime() + 3 * 60 * 1000), // Entry 4: 3 minutes
        variants: {
          systemSmall: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#e94560' }}>
              <Voltra.Text style={{ fontSize: 48, fontWeight: '700', color: '#FFFF00' }}>4</Voltra.Text>
            </Voltra.ZStack>
          ),
          systemMedium: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#e94560' }}>
              <Voltra.Text style={{ fontSize: 64, fontWeight: '700', color: '#FFFF00' }}>4</Voltra.Text>
            </Voltra.ZStack>
          ),
          systemLarge: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#e94560' }}>
              <Voltra.Text style={{ fontSize: 80, fontWeight: '700', color: '#FFFF00' }}>4</Voltra.Text>
            </Voltra.ZStack>
          ),
        },
      },
    ];

    scheduleWidget('weather', entries).then(() => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const times = entries.map((e, i) => `${i + 1}: ${formatter.format(e.date)}`).join(', ');
      setStatusMessage('Timeline scheduled! Entries: ' + times + '. Watch the widget change!');
      setIsUpdating(false);
    }).catch((e: any) => {
      setStatusMessage('Error: ' + (e?.message || String(e)));
      setIsUpdating(false);
    });
  }, []);

  return (
    <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 }}>
      {/* Header */}
      <text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 }}>
        Weather Widget Testing
      </text>
      <text style={{ fontSize: 14, color: '#CBD5F5', lineHeight: '20px', marginBottom: 24 } as any}>
        Test the weather widget with different conditions and widget sizes. Choose from Sunny, Cloudy, or Rainy
        weather with beautiful gradient backgrounds.
      </text>

      {/* Status bar */}
      <view style={{
        backgroundColor: '#1E293B',
        borderRadius: '10px',
        padding: 12,
        marginBottom: 16,
      } as any}>
        <text style={{ fontSize: 12, color: '#94A3B8' }}>{statusMessage}</text>
      </view>

      {/* Current Weather Display */}
      <view style={cardStyle}>
        <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 } as any}>
          Current Weather: {WEATHER_CONDITIONS.find((c) => c.id === selectedWeather)?.label}
        </text>
        <text style={{ fontSize: 13, color: '#94A3B8' } as any}>
          Temperature: {currentWeather.temperature}{'\u00B0'}F
          {currentWeather.highTemp !== undefined && currentWeather.lowTemp !== undefined
            ? ' \u2022 High: ' + currentWeather.highTemp + '\u00B0 \u2022 Low: ' + currentWeather.lowTemp + '\u00B0'
            : ''}
          {currentWeather.location ? ' \u2022 ' + currentWeather.location : ''}
        </text>
      </view>

      {/* Widget Family Selection */}
      <view style={cardStyle}>
        <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 } as any}>
          Widget Family: {WIDGET_FAMILIES.find((f) => f.id === selectedFamily)?.title}
        </text>
        <text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 12 } as any}>
          {WIDGET_FAMILIES.find((f) => f.id === selectedFamily)?.description}
        </text>
        <view style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' } as any}>
          {WIDGET_FAMILIES.map((family) => (
            <view
              key={family.id}
              bindtap={() => setSelectedFamily(family.id)}
              style={{
                backgroundColor: selectedFamily === family.id ? '#007AFF' : 'rgba(255,255,255,0.1)',
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 8,
                paddingBottom: 8,
                borderRadius: '8px',
                marginRight: 6,
                marginBottom: 6,
              } as any}
            >
              <text style={{
                color: selectedFamily === family.id ? '#fff' : '#CBD5F5',
                fontSize: 12,
                fontWeight: '600',
              }}>
                {family.title}
              </text>
            </view>
          ))}
        </view>
      </view>

      {/* Weather Condition Buttons */}
      <view style={cardStyle}>
        <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 } as any}>
          Weather Conditions
        </text>
        <text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 12 } as any}>
          Select a weather condition to update the widget:
        </text>
        <view style={{ display: 'linear', linearDirection: 'row' } as any}>
          {WEATHER_CONDITIONS.map((condition, index) => (
            <view
              key={condition.id}
              bindtap={() => handleWeatherChange(condition.id)}
              style={{
                linearWeight: 1,
                backgroundColor: selectedWeather === condition.id ? '#007AFF' : 'rgba(255,255,255,0.1)',
                padding: 12,
                borderRadius: '8px',
                alignItems: 'center',
                marginRight: index < WEATHER_CONDITIONS.length - 1 ? 8 : 0,
              } as any}
            >
              <text style={{ fontSize: 16, marginBottom: 4 }}>{condition.emoji}</text>
              <text style={{
                color: selectedWeather === condition.id ? '#fff' : '#CBD5F5',
                fontSize: 13,
                fontWeight: '600',
              }}>
                {condition.label}
              </text>
            </view>
          ))}
        </view>
      </view>

      {/* Quick Actions */}
      <view style={cardStyle}>
        <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 } as any}>
          Quick Actions
        </text>
        <view style={{ display: 'linear', linearDirection: 'row' } as any}>
          <view
            bindtap={handleRandomWeather}
            style={{
              linearWeight: 1,
              backgroundColor: isUpdating ? '#555' : 'rgba(255,255,255,0.1)',
              padding: 12,
              borderRadius: '8px',
              alignItems: 'center',
              marginRight: 8,
            } as any}
          >
            <text style={{ color: '#CBD5F5', fontSize: 14, fontWeight: '600' }}>
              Random Weather
            </text>
          </view>
          <view
            bindtap={handleCustomWeather}
            style={{
              linearWeight: 1,
              backgroundColor: isUpdating ? '#555' : 'rgba(255,255,255,0.1)',
              padding: 12,
              borderRadius: '8px',
              alignItems: 'center',
            } as any}
          >
            <text style={{ color: '#CBD5F5', fontSize: 14, fontWeight: '600' }}>
              Custom Weather
            </text>
          </view>
        </view>
      </view>

      {/* Timeline Scheduling */}
      <view style={cardStyle}>
        <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 } as any}>
          Timeline Scheduling
        </text>
        <text style={{ fontSize: 13, color: '#94A3B8', lineHeight: '20px', marginBottom: 12 } as any}>
          Schedule multiple weather updates in advance. iOS will automatically
          display each forecast at the scheduled time, even when the app is closed.
        </text>
        <view
          bindtap={handleScheduleForecast}
          style={{
            backgroundColor: isUpdating ? '#555' : '#007AFF',
            padding: 14,
            borderRadius: '10px',
            alignItems: 'center',
            marginBottom: 8,
          } as any}
        >
          <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Schedule Timeline
          </text>
        </view>
        <text style={{ fontSize: 12, color: '#64748B', lineHeight: '18px' } as any}>
          Schedules 4 entries: 1 (+5sec), 2 (+1min), 3 (+2min), 4 (+3min).
          Each has a different background color. Note: iOS may delay updates
          based on battery/visibility. Test with Xcode attached for immediate updates.
        </text>
      </view>

      {/* Widget Preview */}
      <view style={cardStyle}>
        <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 } as any}>
          Widget Preview
        </text>
        <text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 } as any}>
          This shows how the weather widget will appear on your home screen.
          The widget updates in real-time when you change the weather condition above.
        </text>
        <view style={{ alignItems: 'center', justifyContent: 'center', padding: 20 } as any}>
          <VoltraWidgetPreview family={selectedFamily} id="weather-widget-preview">
            <WeatherWidget weather={currentWeather} />
          </VoltraWidgetPreview>
        </view>
      </view>

      {/* How to Test */}
      <view style={cardStyle}>
        <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 } as any}>
          How to Test
        </text>
        <text style={{ fontSize: 13, color: '#94A3B8', lineHeight: '20px' } as any}>
          1. Select a widget family (size) above{'\n'}
          2. Choose different weather conditions (Sunny, Cloudy, Rainy){'\n'}
          3. Notice how the gradient background changes{'\n'}
          4. Check your home screen to see the live widget update{'\n'}
          5. Try the random weather button for variety
        </text>
      </view>
    </view>
  );
}
