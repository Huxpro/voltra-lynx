import { useState } from '@lynx-js/react';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const mockStocks: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.52, change: 2.34, changePercent: 1.33 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 141.80, change: -0.95, changePercent: -0.67 },
  { symbol: 'MSFT', name: 'Microsoft', price: 378.91, change: 4.12, changePercent: 1.10 },
  { symbol: 'TSLA', name: 'Tesla', price: 248.50, change: -3.22, changePercent: -1.28 },
  { symbol: 'AMZN', name: 'Amazon', price: 185.07, change: 1.56, changePercent: 0.85 },
];

// Mock chart data points (normalized 0-1)
const chartPoints = [0.3, 0.35, 0.32, 0.4, 0.38, 0.45, 0.5, 0.48, 0.55, 0.6, 0.58, 0.65];

export function PortfolioWidgetDemo() {
  const [stocks] = useState(mockStocks);
  const totalValue = stocks.reduce((sum, s) => sum + s.price * 10, 0); // 10 shares each mock
  const totalChange = stocks.reduce((sum, s) => sum + s.change * 10, 0);

  return (
    <view style={{ flex: 1, padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Portfolio Widget
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Stock portfolio widget with prices and a chart visualization.
      </text>

      {/* Portfolio summary card */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
      }}>
        {/* Total value */}
        <view style={{ marginBottom: 16 }}>
          <text style={{ color: '#aaa', fontSize: 12 }}>PORTFOLIO VALUE</text>
          <text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>
            ${totalValue.toFixed(2)}
          </text>
          <text style={{ color: totalChange >= 0 ? '#34C759' : '#FF3B30', fontSize: 14 }}>
            {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)} today
          </text>
        </view>

        {/* Mini chart */}
        <view style={{ marginBottom: 16 }}>
          <text style={{ color: '#666', fontSize: 11, marginBottom: 8 }}>PERFORMANCE (1D)</text>
          <view style={{ flexDirection: 'row', alignItems: 'flex-end', height: 50, gap: 2 }}>
            {chartPoints.map((point, i) => (
              <view
                key={`bar-${i}`}
                style={{
                  flex: 1,
                  height: `${point * 100}%`,
                  backgroundColor: point > 0.5 ? '#34C759' : '#007AFF',
                  borderRadius: 2,
                }}
              />
            ))}
          </view>
        </view>

        {/* Stock list */}
        <view style={{ gap: 10 }}>
          {stocks.map((stock) => (
            <view key={stock.symbol} style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 6, paddingBottom: 6,
              borderTopWidth: 1,
              borderTopColor: '#2c2c2e',
            }}>
              <view>
                <text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
                  {stock.symbol}
                </text>
                <text style={{ color: '#666', fontSize: 11 }}>
                  {stock.name}
                </text>
              </view>
              <view style={{ alignItems: 'flex-end' }}>
                <text style={{ color: '#fff', fontSize: 14 }}>
                  ${stock.price.toFixed(2)}
                </text>
                <text style={{ color: stock.change >= 0 ? '#34C759' : '#FF3B30', fontSize: 12 }}>
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </text>
              </view>
            </view>
          ))}
        </view>
      </view>

      <text style={{ color: '#999', fontSize: 12 }}>
        Mock data. In production, this widget refreshes with live market data via timeline entries.
      </text>
    </view>
  );
}
