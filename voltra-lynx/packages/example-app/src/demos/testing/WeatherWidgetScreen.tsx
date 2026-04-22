import { useState, useCallback } from '@lynx-js/react';

// Lynx NativeModules global
declare const NativeModules: {
  VoltraModule: {
    updateWidget: (kind: string, variants: string, callback: (result: any) => void) => void;
    reloadWidgets: (kinds: string, callback: (result: any) => void) => void;
    scheduleWidget: (kind: string, entries: string, callback: (result: any) => void) => void;
  };
};

type WeatherCondition = 'sunny' | 'cloudy' | 'rainy';

type WidgetFamily = 'systemSmall' | 'systemMedium' | 'systemLarge' | 'systemExtraLarge'
  | 'accessoryCircular' | 'accessoryRectangular' | 'accessoryInline';

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

    try {
      NativeModules.VoltraModule.updateWidget('weather', variants, (result: any) => {
        const resultStr = String(result);
        if (resultStr.startsWith('ERROR:')) {
          setStatusMessage('Update error: ' + resultStr.substring(6));
          setIsUpdating(false);
          return;
        }
        NativeModules.VoltraModule.reloadWidgets(JSON.stringify(['weather']), () => {
          setStatusMessage('Widget updated to ' + condition);
          setIsUpdating(false);
        });
      });
    } catch (e: any) {
      setStatusMessage('Error: ' + (e?.message || String(e)));
      setIsUpdating(false);
    }
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

    try {
      NativeModules.VoltraModule.updateWidget('weather', variants, (result: any) => {
        const resultStr = String(result);
        if (resultStr.startsWith('ERROR:')) {
          setStatusMessage('Update error: ' + resultStr.substring(6));
          setIsUpdating(false);
          return;
        }
        NativeModules.VoltraModule.reloadWidgets(JSON.stringify(['weather']), () => {
          setStatusMessage('Custom weather applied: ' + customWeather.temperature + 'F');
          setIsUpdating(false);
        });
      });
    } catch (e: any) {
      setStatusMessage('Error: ' + (e?.message || String(e)));
      setIsUpdating(false);
    }
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

    try {
      NativeModules.VoltraModule.scheduleWidget('weather', entries, (result: any) => {
        const resultStr = String(result);
        if (resultStr.startsWith('ERROR:')) {
          setStatusMessage('Schedule error: ' + resultStr.substring(6));
        } else {
          setStatusMessage('Timeline scheduled: 4 entries (+5s, +1m, +2m, +3m). Watch the widget change!');
        }
        setIsUpdating(false);
      });
    } catch (e: any) {
      setStatusMessage('Error: ' + (e?.message || String(e)));
      setIsUpdating(false);
    }
  }, []);

  const gradientColor = GRADIENT_COLORS[selectedWeather];

  return (
    <scroll-view style={{ flex: 1, backgroundColor: '#0B0F1A' } as any} scroll-orientation="vertical">
      <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 } as any}>
        <text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 } as any}>
          Weather Widget Testing
        </text>
        <text style={{ fontSize: 14, color: '#CBD5F5', marginBottom: 24 } as any}>
          Test the weather widget with different conditions and widget sizes. Choose from Sunny,
          Cloudy, or Rainy weather with gradient backgrounds.
        </text>

        {/* Status */}
        <view style={{
          backgroundColor: '#1E293B',
          borderRadius: '10px',
          padding: 12,
          marginBottom: 16,
        } as any}>
          <text style={{ fontSize: 12, color: '#94A3B8' } as any}>{statusMessage}</text>
        </view>

        {/* Current Weather Display */}
        <view style={{
          backgroundColor: '#1E293B',
          borderRadius: '12px',
          padding: 16,
          marginBottom: 16,
        } as any}>
          <text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 } as any}>
            Current Weather: {WEATHER_CONDITIONS.find((c) => c.id === selectedWeather)?.label}
          </text>
          <text style={{ fontSize: 13, color: '#94A3B8' } as any}>
            Temperature: {currentWeather.temperature}F | High: {currentWeather.highTemp}F | Low: {currentWeather.lowTemp}F | {currentWeather.location}
          </text>
        </view>

        {/* Widget Family Selection */}
        <view style={{
          backgroundColor: '#1E293B',
          borderRadius: '12px',
          padding: 16,
          marginBottom: 16,
        } as any}>
          <text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 } as any}>
            Widget Family: {WIDGET_FAMILIES.find((f) => f.id === selectedFamily)?.title}
          </text>
          <text style={{ fontSize: 12, color: '#94A3B8', marginBottom: 12 } as any}>
            {WIDGET_FAMILIES.find((f) => f.id === selectedFamily)?.description}
          </text>
          <view style={{ flexDirection: 'row', flexWrap: 'wrap' } as any}>
            {WIDGET_FAMILIES.map((family) => (
              <view
                key={family.id}
                bindtap={() => setSelectedFamily(family.id)}
                style={{
                  backgroundColor: selectedFamily === family.id ? '#007AFF' : 'rgba(255,255,255,0.1)',
                  paddingLeft: 10, paddingRight: 10,
                  paddingTop: 8, paddingBottom: 8,
                  borderRadius: '8px',
                  marginRight: 6,
                  marginBottom: 6,
                } as any}
              >
                <text style={{
                  color: selectedFamily === family.id ? '#fff' : '#CBD5F5',
                  fontSize: 12,
                  fontWeight: '600',
                } as any}>
                  {family.title}
                </text>
              </view>
            ))}
          </view>
        </view>

        {/* Weather Condition Buttons */}
        <view style={{
          backgroundColor: '#1E293B',
          borderRadius: '12px',
          padding: 16,
          marginBottom: 16,
        } as any}>
          <text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 } as any}>
            Weather Conditions
          </text>
          <text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 12 } as any}>
            Select a weather condition to update the widget:
          </text>
          <view style={{ flexDirection: 'row' } as any}>
            {WEATHER_CONDITIONS.map((condition) => (
              <view
                key={condition.id}
                bindtap={() => handleWeatherChange(condition.id)}
                style={{
                  flex: 1,
                  backgroundColor: selectedWeather === condition.id ? '#007AFF' : 'rgba(255,255,255,0.1)',
                  padding: 12,
                  borderRadius: '8px',
                  alignItems: 'center',
                  marginRight: condition.id !== 'rainy' ? 8 : 0,
                } as any}
              >
                <text style={{ fontSize: 18, marginBottom: 4 } as any}>{condition.emoji}</text>
                <text style={{
                  color: selectedWeather === condition.id ? '#fff' : '#CBD5F5',
                  fontSize: 13,
                  fontWeight: '600',
                } as any}>
                  {condition.label}
                </text>
              </view>
            ))}
          </view>
        </view>

        {/* Quick Actions */}
        <view style={{
          backgroundColor: '#1E293B',
          borderRadius: '12px',
          padding: 16,
          marginBottom: 16,
        } as any}>
          <text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12 } as any}>
            Quick Actions
          </text>
          <view style={{ flexDirection: 'row' } as any}>
            <view
              bindtap={handleRandomWeather}
              style={{
                flex: 1,
                backgroundColor: isUpdating ? '#555' : 'rgba(255,255,255,0.1)',
                padding: 12,
                borderRadius: '8px',
                alignItems: 'center',
                marginRight: 8,
              } as any}
            >
              <text style={{ color: '#CBD5F5', fontSize: 14, fontWeight: '600' } as any}>
                Random Weather
              </text>
            </view>
            <view
              bindtap={handleCustomWeather}
              style={{
                flex: 1,
                backgroundColor: isUpdating ? '#555' : 'rgba(255,255,255,0.1)',
                padding: 12,
                borderRadius: '8px',
                alignItems: 'center',
              } as any}
            >
              <text style={{ color: '#CBD5F5', fontSize: 14, fontWeight: '600' } as any}>
                Custom Weather
              </text>
            </view>
          </view>
        </view>

        {/* Timeline Scheduling */}
        <view style={{
          backgroundColor: '#1E293B',
          borderRadius: '12px',
          padding: 16,
          marginBottom: 16,
        } as any}>
          <text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 } as any}>
            Timeline Scheduling
          </text>
          <text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 12 } as any}>
            Schedule multiple weather updates in advance. iOS will automatically display each
            forecast at the scheduled time, even when the app is closed.
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
            <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' } as any}>
              Schedule Timeline
            </text>
          </view>
          <text style={{ fontSize: 12, color: '#64748B', fontStyle: 'italic' } as any}>
            Schedules 4 entries: 1 (+5sec), 2 (+1min), 3 (+2min), 4 (+3min). Each has a different
            background color. Note: iOS may delay updates based on battery/visibility.
          </text>
        </view>

        {/* Widget Preview */}
        <view style={{
          backgroundColor: '#1E293B',
          borderRadius: '12px',
          padding: 16,
          marginBottom: 16,
        } as any}>
          <text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 } as any}>
            Widget Preview
          </text>
          <text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 } as any}>
            This shows how the weather widget will appear on your home screen.
          </text>

          {/* Simulated widget preview */}
          <view style={{
            backgroundColor: gradientColor.from,
            borderRadius: '16px',
            padding: 20,
            alignItems: 'center',
          } as any}>
            <text style={{ fontSize: 48, fontWeight: 'bold', color: '#FFFFFF' } as any}>
              {currentWeather.temperature}°
            </text>
            <text style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 4 } as any}>
              {currentWeather.description}
            </text>
            <text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 } as any}>
              H:{currentWeather.highTemp}° L:{currentWeather.lowTemp}°
            </text>
            <text style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 8 } as any}>
              {currentWeather.location} | {selectedFamily}
            </text>
          </view>
        </view>

        {/* How to Test */}
        <view style={{
          backgroundColor: '#1E293B',
          borderRadius: '12px',
          padding: 16,
        } as any}>
          <text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 } as any}>
            How to Test
          </text>
          <text style={{ fontSize: 13, color: '#94A3B8' } as any}>
            1. Select a widget family (size) above{'\n'}
            2. Choose different weather conditions (Sunny, Cloudy, Rainy){'\n'}
            3. Notice how the gradient background changes{'\n'}
            4. Check your home screen to see the live widget update{'\n'}
            5. Try the random weather button for variety
          </text>
        </view>
      </view>
    </scroll-view>
  );
}
