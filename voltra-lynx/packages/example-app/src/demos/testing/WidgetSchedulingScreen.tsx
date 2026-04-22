import { useState, useCallback } from '@lynx-js/react';

// Lynx NativeModules global
declare const NativeModules: {
  VoltraModule: {
    scheduleWidget: (kind: string, entries: string, callback: (result: any) => void) => void;
    reloadWidgets: (kinds: string, callback: (result: any) => void) => void;
  };
};

interface ScheduledTime {
  past: string;
  second: string;
  third: string;
}

export function WidgetSchedulingScreen() {
  const [isScheduling, setIsScheduling] = useState(false);
  const [minutesUntilSecond, setMinutesUntilSecond] = useState(2);
  const [minutesUntilThird, setMinutesUntilThird] = useState(5);
  const [scheduledTimes, setScheduledTimes] = useState<ScheduledTime | null>(null);
  const [statusMessage, setStatusMessage] = useState('Ready to schedule.');

  const handleScheduleTimeline = useCallback(() => {
    'background only';
    setIsScheduling(true);
    setStatusMessage('Scheduling timeline...');

    const now = new Date();

    // Entry 1: Yesterday (past entry - shows as current state)
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(12, 0, 0, 0);

    // Entry 2: Future entry
    const secondEntry = new Date(now.getTime() + minutesUntilSecond * 60 * 1000);

    // Entry 3: Future entry
    const thirdEntry = new Date(now.getTime() + minutesUntilThird * 60 * 1000);

    // Build entries payload for the native module
    const entries = JSON.stringify([
      {
        date: yesterday.toISOString(),
        label: 'STATE 1',
        color: '#3498DB',
        backgroundColor: '#2C3E50',
      },
      {
        date: secondEntry.toISOString(),
        label: 'STATE 2',
        color: '#F1C40F',
        backgroundColor: '#16A085',
      },
      {
        date: thirdEntry.toISOString(),
        label: 'STATE 3',
        color: '#E74C3C',
        backgroundColor: '#8E44AD',
      },
    ]);

    try {
      NativeModules.VoltraModule.scheduleWidget('weather', entries, (result: any) => {
        const resultStr = String(result);
        if (resultStr.startsWith('ERROR:')) {
          setStatusMessage('Schedule error: ' + resultStr.substring(6));
          setIsScheduling(false);
          return;
        }

        // Reload widgets
        NativeModules.VoltraModule.reloadWidgets(JSON.stringify(['weather']), (reloadResult: any) => {
          const reloadStr = String(reloadResult);
          if (reloadStr.startsWith('ERROR:')) {
            setStatusMessage('Reload error: ' + reloadStr.substring(6));
          } else {
            const formatter = new Intl.DateTimeFormat('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              second: '2-digit',
            });

            setScheduledTimes({
              past: formatter.format(yesterday),
              second: formatter.format(secondEntry),
              third: formatter.format(thirdEntry),
            });

            setStatusMessage(
              'Timeline scheduled! State 1: ' + formatter.format(yesterday) +
              ', State 2: ' + formatter.format(secondEntry) +
              ' (+' + minutesUntilSecond + 'm)' +
              ', State 3: ' + formatter.format(thirdEntry) +
              ' (+' + minutesUntilThird + 'm)'
            );
          }
          setIsScheduling(false);
        });
      });
    } catch (e: any) {
      setStatusMessage('Error: ' + (e?.message || String(e)));
      setIsScheduling(false);
    }
  }, [minutesUntilSecond, minutesUntilThird]);

  const handleClearTimeline = useCallback(() => {
    'background only';
    try {
      NativeModules.VoltraModule.scheduleWidget('weather', JSON.stringify([]), (result: any) => {
        const resultStr = String(result);
        if (resultStr.startsWith('ERROR:')) {
          setStatusMessage('Clear error: ' + resultStr.substring(6));
          return;
        }
        NativeModules.VoltraModule.reloadWidgets(JSON.stringify(['weather']), () => {
          setScheduledTimes(null);
          setStatusMessage('Timeline cleared.');
        });
      });
    } catch (e: any) {
      setStatusMessage('Error: ' + (e?.message || String(e)));
    }
  }, []);

  const incrementSecond = useCallback(() => {
    setMinutesUntilSecond((v) => Math.min(60, v + 1));
  }, []);

  const decrementSecond = useCallback(() => {
    setMinutesUntilSecond((v) => Math.max(1, v - 1));
  }, []);

  const incrementThird = useCallback(() => {
    setMinutesUntilThird((v) => Math.min(60, v + 1));
  }, []);

  const decrementThird = useCallback(() => {
    setMinutesUntilThird((v) => Math.max(1, v - 1));
  }, []);

  return (
    <scroll-view style={{ flex: 1, backgroundColor: '#0B0F1A' } as any} scroll-orientation="vertical">
      <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 } as any}>
        <text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 } as any}>
          Widget Scheduling
        </text>
        <text style={{ fontSize: 14, color: '#CBD5F5', marginBottom: 24 } as any}>
          Test widget timeline scheduling with multiple states. Configure when each state should
          appear and watch the widget transition automatically.
        </text>

        {/* Status */}
        <view style={{
          backgroundColor: '#1E293B',
          borderRadius: 10,
          padding: 12,
          marginBottom: 16,
        } as any}>
          <text style={{ fontSize: 12, color: '#94A3B8' } as any}>{statusMessage}</text>
        </view>

        {/* Configuration */}
        <view style={{
          backgroundColor: '#1E293B',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        } as any}>
          <text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12 } as any}>
            Configuration
          </text>
          <text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 12 } as any}>
            Set when each future state should appear:
          </text>

          {/* State 2 config */}
          <view style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 } as any}>
            <text style={{ fontSize: 14, color: '#FFFFFF', flex: 1 } as any}>
              State 2 (minutes from now):
            </text>
            <view style={{ flexDirection: 'row', alignItems: 'center' } as any}>
              <view
                bindtap={decrementSecond}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  paddingLeft: 10, paddingRight: 10,
                  paddingTop: 6, paddingBottom: 6,
                  borderRadius: 6,
                } as any}
              >
                <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' } as any}>-</text>
              </view>
              <text style={{ color: '#fff', fontSize: 16, marginLeft: 12, marginRight: 12, minWidth: 30 } as any}>
                {minutesUntilSecond}
              </text>
              <view
                bindtap={incrementSecond}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  paddingLeft: 10, paddingRight: 10,
                  paddingTop: 6, paddingBottom: 6,
                  borderRadius: 6,
                } as any}
              >
                <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' } as any}>+</text>
              </view>
            </view>
          </view>

          {/* State 3 config */}
          <view style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } as any}>
            <text style={{ fontSize: 14, color: '#FFFFFF', flex: 1 } as any}>
              State 3 (minutes from now):
            </text>
            <view style={{ flexDirection: 'row', alignItems: 'center' } as any}>
              <view
                bindtap={decrementThird}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  paddingLeft: 10, paddingRight: 10,
                  paddingTop: 6, paddingBottom: 6,
                  borderRadius: 6,
                } as any}
              >
                <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' } as any}>-</text>
              </view>
              <text style={{ color: '#fff', fontSize: 16, marginLeft: 12, marginRight: 12, minWidth: 30 } as any}>
                {minutesUntilThird}
              </text>
              <view
                bindtap={incrementThird}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  paddingLeft: 10, paddingRight: 10,
                  paddingTop: 6, paddingBottom: 6,
                  borderRadius: 6,
                } as any}
              >
                <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' } as any}>+</text>
              </view>
            </view>
          </view>
        </view>

        {/* Schedule description */}
        <view style={{
          backgroundColor: '#1E293B',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        } as any}>
          <text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 } as any}>
            Schedule Timeline
          </text>
          <text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 12 } as any}>
            Schedules three widget states:{'\n'}
            - State 1 (Blue): Yesterday - shows as current{'\n'}
            - State 2 (Green): {minutesUntilSecond} minutes from now{'\n'}
            - State 3 (Purple): {minutesUntilThird} minutes from now{'\n'}{'\n'}
            Add the widget to your home screen to see it transition between states.
          </text>

          <view style={{ flexDirection: 'row' } as any}>
            <view
              bindtap={handleScheduleTimeline}
              style={{
                flex: 1,
                backgroundColor: isScheduling ? '#555' : '#007AFF',
                padding: 14,
                borderRadius: 10,
                alignItems: 'center',
                marginRight: scheduledTimes ? 8 : 0,
              } as any}
            >
              <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' } as any}>
                {isScheduling ? 'Scheduling...' : 'Schedule Timeline'}
              </text>
            </view>
            {scheduledTimes && (
              <view
                bindtap={handleClearTimeline}
                style={{
                  backgroundColor: '#FF3B30',
                  paddingLeft: 16, paddingRight: 16,
                  paddingTop: 14, paddingBottom: 14,
                  borderRadius: 10,
                  alignItems: 'center',
                } as any}
              >
                <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' } as any}>Clear</text>
              </view>
            )}
          </view>
        </view>

        {/* Scheduled Times */}
        {scheduledTimes && (
          <view style={{
            backgroundColor: '#1E293B',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          } as any}>
            <text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12 } as any}>
              Scheduled Times
            </text>

            {/* State 1 */}
            <view style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 } as any}>
              <view style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#3498DB', marginRight: 12 } as any} />
              <view style={{ flex: 1 } as any}>
                <text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' } as any}>State 1 (Current)</text>
                <text style={{ fontSize: 13, color: '#CBD5F5' } as any}>{scheduledTimes.past}</text>
              </view>
            </view>

            {/* State 2 */}
            <view style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 } as any}>
              <view style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#16A085', marginRight: 12 } as any} />
              <view style={{ flex: 1 } as any}>
                <text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' } as any}>State 2</text>
                <text style={{ fontSize: 13, color: '#CBD5F5' } as any}>{scheduledTimes.second}</text>
              </view>
            </view>

            {/* State 3 */}
            <view style={{ flexDirection: 'row', alignItems: 'center' } as any}>
              <view style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#8E44AD', marginRight: 12 } as any} />
              <view style={{ flex: 1 } as any}>
                <text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' } as any}>State 3</text>
                <text style={{ fontSize: 13, color: '#CBD5F5' } as any}>{scheduledTimes.third}</text>
              </view>
            </view>
          </view>
        )}

        {/* Widget Previews */}
        <view style={{
          backgroundColor: '#1E293B',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        } as any}>
          <text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 16 } as any}>
            Widget Previews
          </text>

          {/* State 1 preview */}
          <text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginBottom: 8 } as any}>
            State 1 (Current) - Blue
          </text>
          <view style={{
            backgroundColor: '#2C3E50',
            borderRadius: 16,
            padding: 16,
            alignItems: 'center',
            marginBottom: 16,
          } as any}>
            <text style={{ fontSize: 32, fontWeight: 'bold', color: '#3498DB' } as any}>STATE 1</text>
            <text style={{ fontSize: 14, color: '#ECF0F1', marginTop: 4 } as any}>Current State</text>
            <text style={{ fontSize: 12, color: '#BDC3C7', marginTop: 2 } as any}>Scheduled: Yesterday</text>
          </view>

          {/* State 2 preview */}
          <text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginBottom: 8 } as any}>
            State 2 - Green
          </text>
          <view style={{
            backgroundColor: '#16A085',
            borderRadius: 16,
            padding: 16,
            alignItems: 'center',
            marginBottom: 16,
          } as any}>
            <text style={{ fontSize: 32, fontWeight: 'bold', color: '#F1C40F' } as any}>STATE 2</text>
            <text style={{ fontSize: 14, color: '#ECF0F1', marginTop: 4 } as any}>Second State</text>
            <text style={{ fontSize: 12, color: '#E8F8F5', marginTop: 2 } as any}>+{minutesUntilSecond} minutes</text>
          </view>

          {/* State 3 preview */}
          <text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginBottom: 8 } as any}>
            State 3 - Purple
          </text>
          <view style={{
            backgroundColor: '#8E44AD',
            borderRadius: 16,
            padding: 16,
            alignItems: 'center',
          } as any}>
            <text style={{ fontSize: 32, fontWeight: 'bold', color: '#E74C3C' } as any}>STATE 3</text>
            <text style={{ fontSize: 14, color: '#ECF0F1', marginTop: 4 } as any}>Third State</text>
            <text style={{ fontSize: 12, color: '#E8F8F5', marginTop: 2 } as any}>+{minutesUntilThird} minutes</text>
          </view>
        </view>

        {/* How to Test */}
        <view style={{
          backgroundColor: '#1E293B',
          borderRadius: 12,
          padding: 16,
        } as any}>
          <text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 } as any}>
            How to Test
          </text>
          <text style={{ fontSize: 13, color: '#94A3B8' } as any}>
            1. Configure the timing for states 2 and 3 above{'\n'}
            2. Click Schedule Timeline{'\n'}
            3. Add the Weather widget to your home screen{'\n'}
            4. Verify it shows State 1 (blue background){'\n'}
            5. Wait for the scheduled times{'\n'}
            6. Watch the widget automatically transition:{'\n'}
            {'   '}- State 1 (Blue) {'>'} State 2 (Green) {'>'} State 3 (Purple){'\n'}{'\n'}
            Note: iOS may delay widget updates based on battery level, widget visibility, and system
            load. For immediate updates during testing, keep Xcode attached or use shorter time intervals.
          </text>
        </view>
      </view>
    </scroll-view>
  );
}
