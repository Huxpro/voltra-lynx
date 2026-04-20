import { useState } from '@lynx-js/react';

type ChartType = 'bar' | 'column' | 'stacked';

const datasets = {
  revenue: [42, 58, 35, 72, 48, 65, 82, 55, 90, 68, 75, 95],
  users: [120, 180, 150, 220, 190, 250, 280, 210, 300, 260, 290, 340],
  errors: [8, 12, 5, 15, 9, 7, 3, 11, 6, 4, 8, 2],
};

export function ChartPlaygroundScreen() {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [dataKey, setDataKey] = useState<keyof typeof datasets>('revenue');
  const data = datasets[dataKey];
  const maxVal = Math.max(...data);

  const labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  return (
    <scroll-view style={{ flex: 1 }}>
      <view style={{ padding: 16 }}>
        <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          Chart Playground
        </text>
        <text style={{ color: '#666', marginBottom: 24 }}>
          Experiment with different chart types and data sets.
        </text>

        {/* Chart type selector */}
        <view style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {(['bar', 'column', 'stacked'] as ChartType[]).map((type) => (
            <view
              key={type}
              bindtap={() => setChartType(type)}
              style={{
                flex: 1,
                paddingTop: 8, paddingBottom: 8,
                backgroundColor: chartType === type ? '#007AFF' : '#e5e5e5',
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <text style={{ color: chartType === type ? '#fff' : '#333', fontSize: 13, fontWeight: '600' }}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </text>
            </view>
          ))}
        </view>

        {/* Dataset selector */}
        <view style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
          {(Object.keys(datasets) as (keyof typeof datasets)[]).map((key) => (
            <view
              key={key}
              bindtap={() => setDataKey(key)}
              style={{
                flex: 1,
                paddingTop: 8, paddingBottom: 8,
                backgroundColor: dataKey === key ? '#5856D6' : '#e5e5e5',
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <text style={{ color: dataKey === key ? '#fff' : '#333', fontSize: 12, fontWeight: '600' }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </text>
            </view>
          ))}
        </view>

        {/* Chart rendering */}
        <view style={{
          backgroundColor: '#1c1c1e',
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
        }}>
          <text style={{ color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 12 }}>
            {dataKey.charAt(0).toUpperCase() + dataKey.slice(1)} - {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
          </text>

          {chartType === 'bar' && (
            <view style={{ gap: 6 }}>
              {data.map((value, i) => (
                <view key={`bar-${i}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <text style={{ color: '#666', fontSize: 10, width: 14 }}>{labels[i]}</text>
                  <view style={{ flex: 1, height: 16, backgroundColor: '#333', borderRadius: 3 }}>
                    <view style={{
                      width: `${(value / maxVal) * 100}%`,
                      height: 16,
                      backgroundColor: '#007AFF',
                      borderRadius: 3,
                    }} />
                  </view>
                  <text style={{ color: '#aaa', fontSize: 10, width: 30 }}>{value}</text>
                </view>
              ))}
            </view>
          )}

          {chartType === 'column' && (
            <view>
              <view style={{ height: 150, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                {data.map((value, i) => (
                  <view key={`col-${i}`} style={{ flex: 1, alignItems: 'center' }}>
                    <view style={{
                      width: '100%',
                      height: `${(value / maxVal) * 100}%`,
                      backgroundColor: '#34C759',
                      borderTopLeftRadius: 3,
                      borderTopRightRadius: 3,
                    }} />
                  </view>
                ))}
              </view>
              <view style={{ flexDirection: 'row', marginTop: 4 }}>
                {labels.map((l, i) => (
                  <view key={`lbl-${i}`} style={{ flex: 1, alignItems: 'center' }}>
                    <text style={{ color: '#666', fontSize: 9 }}>{l}</text>
                  </view>
                ))}
              </view>
            </view>
          )}

          {chartType === 'stacked' && (
            <view>
              <view style={{ height: 150, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                {data.map((value, i) => {
                  const portion1 = value * 0.4;
                  const portion2 = value * 0.35;
                  const portion3 = value * 0.25;
                  return (
                    <view key={`stack-${i}`} style={{ flex: 1 }}>
                      <view style={{
                        height: `${(portion3 / maxVal) * 100}%`,
                        backgroundColor: '#FF9500',
                        borderTopLeftRadius: 3,
                        borderTopRightRadius: 3,
                      }} />
                      <view style={{
                        height: `${(portion2 / maxVal) * 100}%`,
                        backgroundColor: '#5856D6',
                      }} />
                      <view style={{
                        height: `${(portion1 / maxVal) * 100}%`,
                        backgroundColor: '#007AFF',
                      }} />
                    </view>
                  );
                })}
              </view>
              <view style={{ flexDirection: 'row', marginTop: 8, gap: 12, justifyContent: 'center' }}>
                <view style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <view style={{ width: 10, height: 10, backgroundColor: '#007AFF', borderRadius: 2 }} />
                  <text style={{ color: '#aaa', fontSize: 10 }}>Part A</text>
                </view>
                <view style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <view style={{ width: 10, height: 10, backgroundColor: '#5856D6', borderRadius: 2 }} />
                  <text style={{ color: '#aaa', fontSize: 10 }}>Part B</text>
                </view>
                <view style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <view style={{ width: 10, height: 10, backgroundColor: '#FF9500', borderRadius: 2 }} />
                  <text style={{ color: '#aaa', fontSize: 10 }}>Part C</text>
                </view>
              </view>
            </view>
          )}
        </view>

        <text style={{ color: '#999', fontSize: 12 }}>
          Max value: {maxVal} | Data points: {data.length}
        </text>
      </view>
    </scroll-view>
  );
}
