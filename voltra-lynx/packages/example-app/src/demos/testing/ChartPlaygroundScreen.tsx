import { useState, useCallback } from '@lynx-js/react';
import { Voltra, renderVoltraVariantToJson } from '@use-voltra/ios';
import { VoltraPreview } from '../../components/VoltraPreview';

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

// ─── chart card component ───────────────────────────────────────────────────

function ChartCard({ title, description, children, onRandomize }: {
  title: string;
  description: string;
  children: React.ReactNode;
  onRandomize?: () => void;
}) {
  const [showJson, setShowJson] = useState(false);

  let jsonText = '';
  if (showJson) {
    try {
      jsonText = JSON.stringify(renderVoltraVariantToJson(children as any), null, 2);
    } catch {
      jsonText = '(render error)';
    }
  }

  return (
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
      <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 } as any}>
        {title}
      </text>
      <text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 10 } as any}>
        {description}
      </text>

      {onRandomize ? (
        <view style={{ alignItems: 'flex-end', marginBottom: 8 } as any}>
          <view
            bindtap={onRandomize}
            style={{
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 6,
              paddingBottom: 6,
              backgroundColor: '#334155',
              borderRadius: '8px',
            } as any}
          >
            <text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' } as any}>Randomize</text>
          </view>
        </view>
      ) : null}

      {/* Live SwiftUI Preview */}
      <view style={{
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        overflow: 'hidden',
      } as any}>
        <VoltraPreview height={220}>
          {children}
        </VoltraPreview>
      </view>

      {/* Toggle JSON */}
      <view
        bindtap={() => setShowJson(!showJson)}
        style={{
          paddingTop: 6,
          paddingBottom: 6,
          alignItems: 'center',
        } as any}
      >
        <text style={{ fontSize: 11, color: '#64748B' } as any}>
          {showJson ? 'Hide JSON' : 'Show JSON'}
        </text>
      </view>

      {showJson ? (
        <view style={{
          backgroundColor: '#1E293B',
          borderRadius: '12px',
          padding: 10,
        } as any}>
          <text style={{
            fontSize: 10,
            fontFamily: 'monospace',
            color: '#4ADE80',
          } as any}>
            {jsonText}
          </text>
        </view>
      ) : null}
    </view>
  );
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

  return (
    <scroll-view style={{ linearWeight: 1 } as any} scroll-orientation="vertical">
      <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 }}>
        <text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF' } as any}>
          Chart Playground
        </text>
        <text style={{ fontSize: 14, color: '#CBD5F5', marginBottom: 8 } as any}>
          All SwiftUI chart mark types powered by Voltra. Tap Randomize to animate between data sets.
        </text>

        {/* Randomize All button */}
        <view
          bindtap={randomizeAll}
          style={{
            backgroundColor: '#007AFF',
            padding: 12,
            borderRadius: '10px',
            alignItems: 'center',
            marginBottom: 16,
          } as any}
        >
          <text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '600' } as any}>Randomize All</text>
        </view>

        <view style={{ marginTop: 8 }}>
          {/* BarMark */}
          <ChartCard
            title="BarMark"
            description="Single series bar chart with rounded corners."
            onRandomize={() => setBarData(randomBarData())}
          >
            <Voltra.Chart
              style={{ width: '100%', height: '100%', color: '#FFFFFF', backgroundColor: '#0F172A' }}
              xAxisVisibility="visible"
              yAxisVisibility="visible"
            >
              <Voltra.BarMark data={barData} color="#4285f4" cornerRadius={4} />
            </Voltra.Chart>
          </ChartCard>

          {/* BarMark multi-series */}
          <ChartCard
            title="BarMark - Multi-series"
            description="Two series (A and B) rendered as grouped bars using the supported stacking grouped mode."
            onRandomize={() => setMultiData(randomMultiSeriesData())}
          >
            <Voltra.Chart
              style={{ width: '100%', height: '100%', color: '#FFFFFF' }}
              yAxisVisibility="visible"
              xAxisVisibility="visible"
              foregroundStyleScale={{ A: '#4285f4', B: '#ea4335' }}
            >
              <Voltra.BarMark data={multiData} stacking="grouped" cornerRadius={4} />
            </Voltra.Chart>
          </ChartCard>

          {/* LineMark */}
          <ChartCard
            title="LineMark"
            description="Smooth monotone line chart."
            onRandomize={() => setLineData(randomLineData())}
          >
            <Voltra.Chart style={{ width: '100%', height: '100%' }}>
              <Voltra.LineMark data={lineData} color="#34a853" interpolation="monotone" lineWidth={2} />
            </Voltra.Chart>
          </ChartCard>

          {/* AreaMark */}
          <ChartCard
            title="AreaMark"
            description="Filled area chart - the classic stocks-app look."
            onRandomize={() => setAreaData(randomAreaData())}
          >
            <Voltra.Chart style={{ width: '100%', height: '100%' }}>
              <Voltra.AreaMark data={areaData} color="#4285f4" interpolation="monotone" />
            </Voltra.Chart>
          </ChartCard>

          {/* PointMark */}
          <ChartCard
            title="PointMark"
            description="Scatter plot with numeric x and y axes plus both vertical and horizontal reference lines."
            onRandomize={() => {
              setPointData(randomPointData());
              setPointRuleY(randomPointRuleY());
              setPointRuleX(randomPointRuleX());
            }}
          >
            <Voltra.Chart
              style={{ width: '100%', height: '100%', color: '#FFFFFF', backgroundColor: '#0F172A' }}
              xAxisVisibility="visible"
              yAxisVisibility="visible"
            >
              <Voltra.PointMark data={pointData} color="#fbbc04" symbolSize={60} />
              <Voltra.RuleMark xValue={pointRuleX} yValue={pointRuleY} color="#ea4335" lineWidth={2} />
            </Voltra.Chart>
          </ChartCard>

          {/* RuleMark */}
          <ChartCard
            title="RuleMark"
            description="Bar chart with both horizontal and vertical reference lines. When both xValue and yValue are set, both lines render."
            onRandomize={() => {
              setBarData(randomBarData());
              setRuleY(randomRuleY());
              setRuleX(randomRuleX());
            }}
          >
            <Voltra.Chart
              style={{ width: '100%', height: '100%', color: '#FFFFFF', backgroundColor: '#0F172A' }}
              xAxisVisibility="visible"
              yAxisVisibility="visible"
            >
              <Voltra.BarMark data={barData} color="#4285f4" cornerRadius={4} />
              <Voltra.RuleMark xValue={ruleX} yValue={ruleY} color="#ea4335" lineWidth={2} />
            </Voltra.Chart>
          </ChartCard>

          {/* SectorMark - Pie */}
          <ChartCard
            title="SectorMark - Pie"
            description="Pie chart built with SectorMark (iOS 17+)."
            onRandomize={() => setSectorData(randomSectorData())}
          >
            <Voltra.Chart style={{ width: '100%', height: '100%' }}>
              <Voltra.SectorMark data={sectorData} angularInset={2} />
            </Voltra.Chart>
          </ChartCard>

          {/* SectorMark - Donut */}
          <ChartCard
            title="SectorMark - Donut"
            description="Same data as above but with an inner radius to create a donut chart."
            onRandomize={() => setSectorData(randomSectorData())}
          >
            <Voltra.Chart
              style={{ width: '100%', height: '100%', color: '#FFFFFF', backgroundColor: '#0F172A' }}
              xAxisVisibility="visible"
              yAxisVisibility="visible"
              legendVisibility="hidden"
            >
              <Voltra.SectorMark data={sectorData} innerRadius={0.5} angularInset={2} />
            </Voltra.Chart>
          </ChartCard>

          {/* Combo - Bar + Line */}
          <ChartCard
            title="Combo - Bar + Line"
            description="Multiple mark types composited in one chart."
            onRandomize={() => {
              setComboBarData(randomBarData());
              setComboLineData(randomLineData());
            }}
          >
            <Voltra.Chart
              style={{ width: '100%', height: '100%', color: '#FFFFFF', backgroundColor: '#0F172A' }}
              xAxisVisibility="visible"
              yAxisVisibility="visible"
            >
              <Voltra.BarMark data={comboBarData} color="#4285f4" cornerRadius={4} />
              <Voltra.LineMark data={comboLineData} color="#ea4335" lineWidth={2} interpolation="monotone" />
            </Voltra.Chart>
          </ChartCard>

          {/* Hidden Axes */}
          <ChartCard
            title="Hidden Axes"
            description="Chart with both axes hidden - clean minimal look."
          >
            <Voltra.Chart
              style={{ width: '100%', height: '100%', color: '#FFFFFF', backgroundColor: '#0F172A' }}
              xAxisVisibility="hidden"
              yAxisVisibility="hidden"
              legendVisibility="hidden"
            >
              <Voltra.AreaMark data={areaData} color="#4285f4" interpolation="monotone" />
            </Voltra.Chart>
          </ChartCard>
        </view>
      </view>
    </scroll-view>
  );
}
