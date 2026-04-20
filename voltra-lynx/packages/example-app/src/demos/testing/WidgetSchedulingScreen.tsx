import { useState } from '@lynx-js/react';

interface Schedule {
  id: string;
  type: 'interval' | 'daily' | 'weekly';
  label: string;
  value: string;
  active: boolean;
}

const initialSchedules: Schedule[] = [
  { id: '1', type: 'interval', label: 'Every 15 minutes', value: '15min', active: true },
  { id: '2', type: 'interval', label: 'Every 30 minutes', value: '30min', active: false },
  { id: '3', type: 'interval', label: 'Every hour', value: '60min', active: false },
  { id: '4', type: 'daily', label: 'Daily at 9:00 AM', value: '09:00', active: true },
  { id: '5', type: 'daily', label: 'Daily at 6:00 PM', value: '18:00', active: false },
  { id: '6', type: 'weekly', label: 'Every Monday', value: 'MON', active: false },
];

export function WidgetSchedulingScreen() {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [lastRefresh, setLastRefresh] = useState('Not yet');

  const toggleSchedule = (id: string) => {
    setSchedules(schedules.map((s) =>
      s.id === id ? { ...s, active: !s.active } : s
    ));
  };

  const triggerRefresh = () => {
    const now = new Date();
    setLastRefresh(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
  };

  const activeCount = schedules.filter((s) => s.active).length;

  const typeIcons: Record<string, string> = {
    interval: '⏱',
    daily: '📅',
    weekly: '🗓',
  };

  return (
    <scroll-view style={{ flex: 1 }}>
      <view style={{ padding: 16 }}>
        <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          Widget Scheduling
        </text>
        <text style={{ color: '#666', marginBottom: 24 }}>
          Configure widget refresh schedules and timeline entries.
        </text>

        {/* Status card */}
        <view style={{
          backgroundColor: '#1c1c1e',
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <view>
            <text style={{ color: '#666', fontSize: 11 }}>ACTIVE SCHEDULES</text>
            <text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>{activeCount}</text>
          </view>
          <view>
            <text style={{ color: '#666', fontSize: 11 }}>LAST REFRESH</text>
            <text style={{ color: '#fff', fontSize: 14, marginTop: 4 }}>{lastRefresh}</text>
          </view>
        </view>

        {/* Schedule list */}
        <text style={{ fontSize: 14, fontWeight: '600', marginBottom: 12 }}>Refresh Schedules</text>
        <view style={{ gap: 8, marginBottom: 20 }}>
          {schedules.map((schedule) => (
            <view
              key={schedule.id}
              bindtap={() => toggleSchedule(schedule.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 14,
                backgroundColor: schedule.active ? '#f0f7ff' : '#f5f5f5',
                borderRadius: 10,
                borderWidth: schedule.active ? 1 : 0,
                borderColor: '#007AFF',
                gap: 12,
              }}
            >
              <text style={{ fontSize: 20 }}>{typeIcons[schedule.type]}</text>
              <view style={{ flex: 1 }}>
                <text style={{ fontSize: 14, fontWeight: '500' }}>{schedule.label}</text>
                <text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                  Type: {schedule.type} | Value: {schedule.value}
                </text>
              </view>
              <view style={{
                width: 44,
                height: 26,
                borderRadius: 13,
                backgroundColor: schedule.active ? '#34C759' : '#ccc',
                justifyContent: 'center',
                paddingLeft: 2, paddingRight: 2,
              }}>
                <view style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: '#fff',
                  alignSelf: schedule.active ? 'flex-end' : 'flex-start',
                }} />
              </view>
            </view>
          ))}
        </view>

        {/* Manual refresh */}
        <view
          bindtap={triggerRefresh}
          style={{
            backgroundColor: '#007AFF',
            padding: 14,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Trigger Manual Refresh
          </text>
        </view>

        <text style={{ color: '#999', fontSize: 12 }}>
          iOS uses TimelineProvider for widget updates. Android uses WorkManager or AlarmManager for periodic refresh.
        </text>
      </view>
    </scroll-view>
  );
}
