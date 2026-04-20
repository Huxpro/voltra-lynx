import { useState } from '@lynx-js/react';

type ChartType = 'line' | 'bar';

const lineData = [25, 40, 30, 55, 45, 60, 50, 70, 65, 80, 75, 90];
const barData = [45, 65, 35, 80, 55, 70, 40, 90, 60, 75, 50, 85];

export function ChartWidgets() {
  const [chartType, setChartType] = useState<ChartType>('line');
  const data = chartType === 'line' ? lineData : barData;
  const maxVal = Math.max(...data);

  return (
    <view style={{ flex: 1, padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Chart Widgets
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Android widget chart visualizations with mock data.
      </text>

      {/* Chart type selector */}
      <view style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
        <view
          bindtap={() => setChartType('line')}
          style={{
            flex: 1,
            backgroundColor: chartType === 'line' ? '#007AFF' : '#e5e5e5',
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <text style={{ color: chartType === 'line' ? '#fff' : '#333', fontSize: 14, fontWeight: '600' }}>
            Line Chart
          </text>
        </view>
        <view
          bindtap={() => setChartType('bar')}
          style={{
            flex: 1,
            backgroundColor: chartType === 'bar' ? '#007AFF' : '#e5e5e5',
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <text style={{ color: chartType === 'bar' ? '#fff' : '#333', fontSize: 14, fontWeight: '600' }}>
            Bar Chart
          </text>
        </view>
      </view>

      {/* Chart widget preview */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
      }}>
        <text style={{ color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
          Monthly Revenue
        </text>
        <text style={{ color: '#aaa', fontSize: 12, marginBottom: 16 }}>
          {chartType === 'line' ? 'Line' : 'Bar'} Chart - 12 months
        </text>

        {/* Chart area */}
        <view style={{ height: 120, flexDirection: 'row', alignItems: 'flex-end', gap: chartType === 'bar' ? 4 : 2 }}>
          {data.map((value, i) => (
            <view
              key={`data-${i}`}
              style={{
                flex: 1,
                height: `${(value / maxVal) * 100}%`,
                backgroundColor: chartType === 'line' ? '#007AFF' : '#34C759',
                borderRadius: chartType === 'line' ? 1 : 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
                minWidth: chartType === 'line' ? 2 : undefined,
              }}
            />
          ))}
        </view>

        {/* X-axis labels */}
        <view style={{ flexDirection: 'row', marginTop: 8 }}>
          {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((month, i) => (
            <view key={`label-${i}`} style={{ flex: 1, alignItems: 'center' }}>
              <text style={{ color: '#666', fontSize: 9 }}>{month}</text>
            </view>
          ))}
        </view>
      </view>

      {/* Second chart - small widget */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
      }}>
        <text style={{ color: '#fff', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>
          Daily Steps (Small Widget)
        </text>
        <view style={{ height: 60, flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
          {[6000, 8200, 5400, 9800, 7200, 10500, 8800].map((steps, i) => (
            <view
              key={`steps-${i}`}
              style={{
                flex: 1,
                height: `${(steps / 10500) * 100}%`,
                backgroundColor: steps >= 8000 ? '#34C759' : '#FF9500',
                borderRadius: 3,
              }}
            />
          ))}
        </view>
        <view style={{ flexDirection: 'row', marginTop: 6 }}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <view key={`day-${i}`} style={{ flex: 1, alignItems: 'center' }}>
              <text style={{ color: '#666', fontSize: 10 }}>{d}</text>
            </view>
          ))}
        </view>
      </view>

      <text style={{ color: '#999', fontSize: 12 }}>
        Charts are rendered as bar/column views. On Android, Glance composables handle the actual rendering.
      </text>
    </view>
  );
}
