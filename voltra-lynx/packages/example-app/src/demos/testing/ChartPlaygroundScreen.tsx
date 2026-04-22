import { useState, useCallback } from '@lynx-js/react';
import { Voltra, renderVoltraVariantToJson } from '@use-voltra/ios';

// ─── data helpers ───────────────────────────────────────────────────────────

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const randomValue = (min: number, max: number) => Math.round(Math.random() * (max - min) + min);

const randomBarData = () => MONTHS.map((m) => ({ x: m, y: randomValue(20, 120) }));

const randomMultiSeriesData = () => [
  ...MONTHS.map((m) => ({ x: m, y: randomValue(20, 100), series: 'A' })),
  ...MONTHS.map((m) => ({ x: m, y: randomValue(20, 100), series: 'B' })),
];

const randomLineData = () => MONTHS.map((m) => ({ x: m, y: randomValue(30, 100) }));

const randomAreaData = () => MONTHS.map((m) => ({ x: m, y: randomValue(10, 90) }));

const randomPointData = () => Array.from({ length: 12 }, () => ({ x: randomValue(0, 100), y: randomValue(0, 100) }));

const randomSectorData = () => [
  { category: 'Work', value: randomValue(20, 50) },
  { category: 'Sleep', value: randomValue(20, 40) },
  { category: 'Leisure', value: randomValue(10, 30) },
  { category: 'Exercise', value: randomValue(5, 20) },
];

const randomRuleY = () => randomValue(30, 80);
const randomRuleX = () => MONTHS[randomValue(0, MONTHS.length - 1)] ?? MONTHS[0];
const randomPointRuleY = () => randomValue(0, 100);
const randomPointRuleX = () => randomValue(0, 100);

// ─── chart preview JSON helper ──────────────────────────────────────────────

function renderChartPreview(element: React.ReactNode): string {
  try {
    return JSON.stringify(renderVoltraVariantToJson(element), null, 2);
  } catch {
    return '{ "error": "Failed to render" }';
  }
}

// ─── screen ─────────────────────────────────────────────────────────────────

export function ChartPlaygroundScreen() {
  const [barData, setBarData] = useState(randomBarData);
  const [multiData, setMultiData] = useState(randomMultiSeriesData);
  const [lineData, setLineData] = useState(randomLineData);
  const [areaData, setAreaData] = useState(randomAreaData);
  const [pointData, setPointData] = useState(randomPointData);
  const [pointRuleY, setPointRuleY] = useState(randomPointRuleY);
  const [pointRuleX, setPointRuleX] = useState(randomPointRuleX);
  const [sectorData, setSectorData] = useState(randomSectorData);
  const [ruleY, setRuleY] = useState(randomRuleY);
  const [ruleX, setRuleX] = useState(randomRuleX);
  const [comboBarData, setComboBarData] = useState(randomBarData);
  const [comboLineData, setComboLineData] = useState(randomLineData);

  const randomizeAll = useCallback(() => {
    setBarData(randomBarData());
    setMultiData(randomMultiSeriesData());
    setLineData(randomLineData());
    setAreaData(randomAreaData());
    setPointData(randomPointData());
    setPointRuleY(randomPointRuleY());
    setPointRuleX(randomPointRuleX());
    setSectorData(randomSectorData());
    setRuleY(randomRuleY());
    setRuleX(randomRuleX());
    setComboBarData(randomBarData());
    setComboLineData(randomLineData());
  }, []);

  // Build chart JSON previews
  const barChartJson = renderChartPreview(
    <Voltra.Chart
      style={{ width: '100%', height: '100%', color: '#FFFFFF', backgroundColor: '#0F172A' } as any}
      xAxisVisibility="visible"
      yAxisVisibility="visible"
    >
      <Voltra.BarMark data={barData} color="#4285f4" cornerRadius={4} />
    </Voltra.Chart>
  );

  const multiBarChartJson = renderChartPreview(
    <Voltra.Chart
      style={{ width: '100%', height: '100%', color: '#FFFFFF' } as any}
      yAxisVisibility="visible"
      xAxisVisibility="visible"
      foregroundStyleScale={{ A: '#4285f4', B: '#ea4335' }}
    >
      <Voltra.BarMark data={multiData} stacking="grouped" cornerRadius={4} />
    </Voltra.Chart>
  );

  const lineChartJson = renderChartPreview(
    <Voltra.Chart style={{ width: '100%', height: '100%' } as any}>
      <Voltra.LineMark data={lineData} color="#34a853" interpolation="monotone" lineWidth={2} />
    </Voltra.Chart>
  );

  const areaChartJson = renderChartPreview(
    <Voltra.Chart style={{ width: '100%', height: '100%' } as any}>
      <Voltra.AreaMark data={areaData} color="#4285f4" interpolation="monotone" />
    </Voltra.Chart>
  );

  const pointChartJson = renderChartPreview(
    <Voltra.Chart
      style={{ width: '100%', height: '100%', color: '#FFFFFF', backgroundColor: '#0F172A' } as any}
      xAxisVisibility="visible"
      yAxisVisibility="visible"
    >
      <Voltra.PointMark data={pointData} color="#fbbc04" symbolSize={60} />
      <Voltra.RuleMark xValue={pointRuleX} yValue={pointRuleY} color="#ea4335" lineWidth={2} />
    </Voltra.Chart>
  );

  const ruleChartJson = renderChartPreview(
    <Voltra.Chart
      style={{ width: '100%', height: '100%', color: '#FFFFFF', backgroundColor: '#0F172A' } as any}
      xAxisVisibility="visible"
      yAxisVisibility="visible"
    >
      <Voltra.BarMark data={barData} color="#4285f4" cornerRadius={4} />
      <Voltra.RuleMark xValue={ruleX} yValue={ruleY} color="#ea4335" lineWidth={2} />
    </Voltra.Chart>
  );

  const sectorPieJson = renderChartPreview(
    <Voltra.Chart style={{ width: '100%', height: '100%' } as any}>
      <Voltra.SectorMark data={sectorData} angularInset={2} />
    </Voltra.Chart>
  );

  const sectorDonutJson = renderChartPreview(
    <Voltra.Chart
      style={{ width: '100%', height: '100%', color: '#FFFFFF', backgroundColor: '#0F172A' } as any}
      xAxisVisibility="visible"
      yAxisVisibility="visible"
      legendVisibility="hidden"
    >
      <Voltra.SectorMark data={sectorData} innerRadius={0.5} angularInset={2} />
    </Voltra.Chart>
  );

  const comboChartJson = renderChartPreview(
    <Voltra.Chart
      style={{ width: '100%', height: '100%', color: '#FFFFFF', backgroundColor: '#0F172A' } as any}
      xAxisVisibility="visible"
      yAxisVisibility="visible"
    >
      <Voltra.BarMark data={comboBarData} color="#4285f4" cornerRadius={4} />
      <Voltra.LineMark data={comboLineData} color="#ea4335" lineWidth={2} interpolation="monotone" />
    </Voltra.Chart>
  );

  const hiddenAxesJson = renderChartPreview(
    <Voltra.Chart
      style={{ width: '100%', height: '100%', color: '#FFFFFF', backgroundColor: '#0F172A' } as any}
      xAxisVisibility="hidden"
      yAxisVisibility="hidden"
      legendVisibility="hidden"
    >
      <Voltra.AreaMark data={areaData} color="#4285f4" interpolation="monotone" />
    </Voltra.Chart>
  );

  const truncate = (json: string) => json.length > 300 ? json.slice(0, 300) + '...' : json;

  // Chart card component
  const ChartCard = ({ title, description, json, onRandomize }: {
    title: string;
    description: string;
    json: string;
    onRandomize?: () => void;
  }) => (
    <view style={{
      backgroundColor: '#1c1c1e',
      borderRadius: '16px',
      padding: 16,
      marginBottom: 16,
    }}>
      <text style={{ color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 4 }}>{title}</text>
      <text style={{ color: '#8E8E93', fontSize: 12, marginBottom: 8 }}>{description}</text>
      {onRandomize && (
        <view style={{ alignItems: 'flex-end', marginBottom: 8 }}>
          <view
            bindtap={onRandomize}
            style={{
              paddingLeft: 12, paddingRight: 12,
              paddingTop: 6, paddingBottom: 6,
              backgroundColor: '#333',
              borderRadius: '6px',
            }}
          >
            <text style={{ color: '#fff', fontSize: 12 }}>Randomize</text>
          </view>
        </view>
      )}
      <text style={{ color: '#6E6E73', fontSize: 10, fontFamily: 'monospace' }}>
        {truncate(json)}
      </text>
    </view>
  );

  return (
    <scroll-view scroll-orientation="vertical" style={{ linearWeight: 1 } as any}>
      <view style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 20, paddingBottom: 24 }}>
        <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
          Chart Playground
        </text>
        <text style={{ color: '#666', marginBottom: 16, fontSize: 13 }}>
          All SwiftUI chart mark types powered by Voltra. Tap Randomize to animate between data sets.
        </text>

        <view
          bindtap={randomizeAll}
          style={{
            backgroundColor: '#007AFF',
            padding: 12,
            borderRadius: '10px',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>Randomize All</text>
        </view>

        <ChartCard
          title="BarMark"
          description="Single series bar chart with rounded corners."
          json={barChartJson}
          onRandomize={() => setBarData(randomBarData())}
        />

        <ChartCard
          title="BarMark - Multi-series"
          description="Two series (A and B) rendered as grouped bars."
          json={multiBarChartJson}
          onRandomize={() => setMultiData(randomMultiSeriesData())}
        />

        <ChartCard
          title="LineMark"
          description="Smooth monotone line chart."
          json={lineChartJson}
          onRandomize={() => setLineData(randomLineData())}
        />

        <ChartCard
          title="AreaMark"
          description="Filled area chart - the classic stocks-app look."
          json={areaChartJson}
          onRandomize={() => setAreaData(randomAreaData())}
        />

        <ChartCard
          title="PointMark"
          description="Scatter plot with numeric axes plus reference lines."
          json={pointChartJson}
          onRandomize={() => {
            setPointData(randomPointData());
            setPointRuleY(randomPointRuleY());
            setPointRuleX(randomPointRuleX());
          }}
        />

        <ChartCard
          title="RuleMark"
          description="Bar chart with horizontal and vertical reference lines."
          json={ruleChartJson}
          onRandomize={() => {
            setBarData(randomBarData());
            setRuleY(randomRuleY());
            setRuleX(randomRuleX());
          }}
        />

        <ChartCard
          title="SectorMark - Pie"
          description="Pie chart built with SectorMark (iOS 17+)."
          json={sectorPieJson}
          onRandomize={() => setSectorData(randomSectorData())}
        />

        <ChartCard
          title="SectorMark - Donut"
          description="Same data with inner radius for donut chart."
          json={sectorDonutJson}
          onRandomize={() => setSectorData(randomSectorData())}
        />

        <ChartCard
          title="Combo - Bar + Line"
          description="Multiple mark types composited in one chart."
          json={comboChartJson}
          onRandomize={() => {
            setComboBarData(randomBarData());
            setComboLineData(randomLineData());
          }}
        />

        <ChartCard
          title="Hidden Axes"
          description="Chart with both axes hidden - clean minimal look."
          json={hiddenAxesJson}
        />
      </view>
    </scroll-view>
  );
}
