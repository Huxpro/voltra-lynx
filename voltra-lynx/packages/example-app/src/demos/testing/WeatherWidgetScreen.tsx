import { useState, useCallback } from '@lynx-js/react';
import { VoltraModule } from '@use-voltra/lynx/ios-client';

type WeatherCondition = 'sunny' | 'cloudy' | 'rainy';

type WidgetFamily =
  | 'systemSmall'
  | 'systemMedium'
  | 'systemLarge'
  | 'systemExtraLarge'
  | 'accessoryCircular'
  | 'accessoryRectangular'
  | 'accessoryInline';

interface WeatherData {
  condition: WeatherCondition;
  temperature: number;
  highTemp: number;
  lowTemp: number;
  location: string;
  description: string;
}

const SAMPLE_WEATHER: Record<WeatherCondition, WeatherData> = {
  sunny: {
    condition: 'sunny',
    temperature: 75,
    highTemp: 82,
    lowTemp: 65,
    location: 'San Francisco',
    description: 'Clear skies',
  },
  cloudy: {
    condition: 'cloudy',
    temperature: 62,
    highTemp: 68,
    lowTemp: 55,
    location: 'San Francisco',
    description: 'Mostly cloudy',
  },
  rainy: {
    condition: 'rainy',
    temperature: 58,
    highTemp: 62,
    lowTemp: 52,
    location: 'San Francisco',
    description: 'Rain expected',
  },
};

const WEATHER_CONDITIONS: { id: WeatherCondition; label: string; emoji: string }[] = [
  { id: 'sunny', label: 'Sunny', emoji: 'SUN' },
  { id: 'cloudy', label: 'Cloudy', emoji: 'CLD' },
  { id: 'rainy', label: 'Rainy', emoji: 'RN' },
];

const WIDGET_FAMILIES: { id: WidgetFamily; title: string; description: string }[] = [
  { id: 'systemSmall', title: 'Small', description: '2x2 (170x170pt)' },
  { id: 'systemMedium', title: 'Medium', description: '4x2 (364x170pt)' },
  { id: 'systemLarge', title: 'Large', description: '4x4 (364x382pt)' },
  { id: 'systemExtraLarge', title: 'XL', description: '4x8 (364x768pt)' },
  { id: 'accessoryCircular', title: 'Circular', description: '76x76pt' },
  { id: 'accessoryRectangular', title: 'Rect', description: '172x76pt' },
  { id: 'accessoryInline', title: 'Inline', description: '172x40pt' },
];

const GRADIENT_COLORS: Record<WeatherCondition, { from: string; to: string }> = {
  sunny: { from: '#F59E0B', to: '#EF4444' },
  cloudy: { from: '#6B7280', to: '#374151' },
  rainy: { from: '#3B82F6', to: '#1E3A5F' },
};

export function WeatherWidgetScreen() {
  const [selectedWeather, setSelectedWeather] = useState<WeatherCondition>('sunny');
  const [selectedFamily, setSelectedFamily] = useState<WidgetFamily>('systemMedium');
  const [currentWeather, setCurrentWeather] = useState<WeatherData>(SAMPLE_WEATHER.sunny);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready');

  const handleWeatherChange = useCallback((condition: WeatherCondition) => {
    'background only';
    setSelectedWeather(condition);
    const weatherData = SAMPLE_WEATHER[condition];
    setCurrentWeather(weatherData);
    setIsUpdating(true);
    setStatusMessage('Updating widget to ' + condition + '...');

    const variants = JSON.stringify({
      systemSmall: { weather: weatherData },
      systemMedium: { weather: weatherData },
      systemLarge: { weather: weatherData },
    });

    VoltraModule.updateWidget('weather', variants).then(() => {
      return VoltraModule.reloadWidgets(['weather']);
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

    const variants = JSON.stringify({
      systemSmall: { weather: customWeather },
      systemMedium: { weather: customWeather },
      systemLarge: { weather: customWeather },
    });

    VoltraModule.updateWidget('weather', variants).then(() => {
      return VoltraModule.reloadWidgets(['weather']);
    }).then(() => {
      setStatusMessage('Custom weather applied: ' + customWeather.temperature + 'F');
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
    const entries = JSON.stringify([
      {
        date: new Date(now.getTime() + 5 * 1000).toISOString(),
        backgroundColor: '#1a1a2e',
        label: '1',
        color: '#FFFFFF',
      },
      {
        date: new Date(now.getTime() + 1 * 60 * 1000).toISOString(),
        backgroundColor: '#16213e',
        label: '2',
        color: '#00FF00',
      },
      {
        date: new Date(now.getTime() + 2 * 60 * 1000).toISOString(),
        backgroundColor: '#0f3460',
        label: '3',
        color: '#FF00FF',
      },
      {
        date: new Date(now.getTime() + 3 * 60 * 1000).toISOString(),
        backgroundColor: '#e94560',
        label: '4',
        color: '#FFFF00',
      },
    ]);

    VoltraModule.scheduleWidget('weather', entries).then(() => {
      setStatusMessage('Timeline scheduled: 4 entries (+5s, +1m, +2m, +3m). Watch the widget change!');
      setIsUpdating(false);
    }).catch((e: any) => {
      setStatusMessage('Error: ' + (e?.message || String(e)));
      setIsUpdating(false);
    });
  }, []);

  const gradientColor = GRADIENT_COLORS[selectedWeather];

  return (
    <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 }}>
      {/* Header */}
      <text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 }}>
        Weather Widget Testing
      </text>
      <text style={{ fontSize: 14, color: '#CBD5F5', lineHeight: '20px', marginBottom: 24 } as any}>
        Test the weather widget with different conditions and widget sizes.
        Choose from Sunny, Cloudy, or Rainy weather with gradient backgrounds.
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

      {/* Current Weather Display card */}
      <view style={{
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        padding: 16,
        marginBottom: 16,
      } as any}>
        <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 }}>
          Current Weather: {WEATHER_CONDITIONS.find((c) => c.id === selectedWeather)?.label}
        </text>
        <text style={{ fontSize: 13, color: '#94A3B8' }}>
          Temperature: {currentWeather.temperature}F | High: {currentWeather.highTemp}F | Low: {currentWeather.lowTemp}F | {currentWeather.location}
        </text>
      </view>

      {/* Widget Family Selection card */}
      <view style={{
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        padding: 16,
        marginBottom: 16,
      } as any}>
        <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 }}>
          Widget Family: {WIDGET_FAMILIES.find((f) => f.id === selectedFamily)?.title}
        </text>
        <text style={{ fontSize: 12, color: '#94A3B8', marginBottom: 12 }}>
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

      {/* Weather Condition Buttons card */}
      <view style={{
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        padding: 16,
        marginBottom: 16,
      } as any}>
        <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 }}>
          Weather Conditions
        </text>
        <text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 12 }}>
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

      {/* Quick Actions card */}
      <view style={{
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        padding: 16,
        marginBottom: 16,
      } as any}>
        <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 }}>
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

      {/* Timeline Scheduling card */}
      <view style={{
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        padding: 16,
        marginBottom: 16,
      } as any}>
        <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 }}>
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
          based on battery/visibility.
        </text>
      </view>

      {/* Widget Preview card */}
      <view style={{
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        padding: 16,
        marginBottom: 16,
      } as any}>
        <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 }}>
          Widget Preview
        </text>
        <text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 }}>
          This shows how the weather widget will appear on your home screen.
        </text>

        {/* Simulated widget preview */}
        <view style={{
          backgroundColor: gradientColor.from,
          borderRadius: '16px',
          padding: 20,
          alignItems: 'center',
        } as any}>
          <text style={{ fontSize: 48, fontWeight: '700', color: '#FFFFFF' }}>
            {currentWeather.temperature}deg
          </text>
          <text style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 4 }}>
            {currentWeather.description}
          </text>
          <text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
            H:{currentWeather.highTemp} L:{currentWeather.lowTemp}
          </text>
          <text style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
            {currentWeather.location} | {selectedFamily}
          </text>
        </view>
      </view>

      {/* How to Test card */}
      <view style={{
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        padding: 16,
      } as any}>
        <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 }}>
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
