import { useState } from '@lynx-js/react';

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: string;
  forecast: ForecastDay[];
}

const mockWeather: WeatherData = {
  location: 'San Francisco',
  temperature: 68,
  condition: 'Partly Cloudy',
  icon: '⛅',
  humidity: 62,
  wind: '12 mph W',
  forecast: [
    { day: 'Mon', high: 70, low: 55, condition: 'Sunny', icon: '☀' },
    { day: 'Tue', high: 68, low: 54, condition: 'Cloudy', icon: '☁' },
    { day: 'Wed', high: 65, low: 52, condition: 'Rain', icon: '🌧' },
    { day: 'Thu', high: 72, low: 56, condition: 'Sunny', icon: '☀' },
    { day: 'Fri', high: 74, low: 58, condition: 'Clear', icon: '☀' },
  ],
};

export function WeatherWidgetDemo() {
  const [weather] = useState(mockWeather);
  const [unit, setUnit] = useState<'F' | 'C'>('F');

  const convertTemp = (f: number) => {
    if (unit === 'C') return Math.round((f - 32) * 5 / 9);
    return f;
  };

  return (
    <view style={{ flex: 1, padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Weather Widget
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Widget displaying current weather conditions and 5-day forecast.
      </text>

      {/* Main weather card */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
      }}>
        {/* Current conditions */}
        <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <view>
            <text style={{ color: '#aaa', fontSize: 14 }}>{weather.location}</text>
            <text style={{ color: '#fff', fontSize: 48, fontWeight: 'bold' }}>
              {convertTemp(weather.temperature)}°{unit}
            </text>
            <text style={{ color: '#aaa', fontSize: 14 }}>{weather.condition}</text>
          </view>
          <text style={{ fontSize: 48 }}>{weather.icon}</text>
        </view>

        {/* Details */}
        <view style={{ flexDirection: 'row', gap: 16, marginBottom: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#333' }}>
          <view>
            <text style={{ color: '#666', fontSize: 11 }}>HUMIDITY</text>
            <text style={{ color: '#fff', fontSize: 15 }}>{weather.humidity}%</text>
          </view>
          <view>
            <text style={{ color: '#666', fontSize: 11 }}>WIND</text>
            <text style={{ color: '#fff', fontSize: 15 }}>{weather.wind}</text>
          </view>
        </view>

        {/* Forecast */}
        <view style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {weather.forecast.map((day) => (
            <view key={day.day} style={{ alignItems: 'center' }}>
              <text style={{ color: '#aaa', fontSize: 12 }}>{day.day}</text>
              <text style={{ fontSize: 20, marginTop: 4, marginBottom: 4 }}>{day.icon}</text>
              <text style={{ color: '#fff', fontSize: 12 }}>{convertTemp(day.high)}°</text>
              <text style={{ color: '#666', fontSize: 11 }}>{convertTemp(day.low)}°</text>
            </view>
          ))}
        </view>
      </view>

      {/* Unit toggle */}
      <view style={{ flexDirection: 'row', gap: 12 }}>
        <view
          bindtap={() => setUnit('F')}
          style={{
            flex: 1,
            backgroundColor: unit === 'F' ? '#007AFF' : '#e5e5e5',
            padding: 12,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <text style={{ color: unit === 'F' ? '#fff' : '#333', fontSize: 15, fontWeight: '600' }}>
            Fahrenheit
          </text>
        </view>
        <view
          bindtap={() => setUnit('C')}
          style={{
            flex: 1,
            backgroundColor: unit === 'C' ? '#007AFF' : '#e5e5e5',
            padding: 12,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <text style={{ color: unit === 'C' ? '#fff' : '#333', fontSize: 15, fontWeight: '600' }}>
            Celsius
          </text>
        </view>
      </view>
    </view>
  );
}
