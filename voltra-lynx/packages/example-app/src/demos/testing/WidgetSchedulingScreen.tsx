import { useState, useCallback } from '@lynx-js/react';
import { Voltra } from '@use-voltra/ios';
import { scheduleWidget, reloadWidgets } from '@use-voltra/lynx/ios-client';
import { VoltraWidgetPreview } from '../../components/VoltraWidgetPreview';

interface ScheduledTimes {
  past: string;
  second: string;
  third: string;
}

export function WidgetSchedulingScreen() {
  const [isScheduling, setIsScheduling] = useState(false);
  const [minutesUntilSecond, setMinutesUntilSecond] = useState('2');
  const [minutesUntilThird, setMinutesUntilThird] = useState('5');
  const [scheduledTimes, setScheduledTimes] = useState<ScheduledTimes | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleScheduleTimeline = useCallback(() => {
    'background only';
    setIsScheduling(true);

    const now = new Date();
    const secondMinutes = parseInt(minutesUntilSecond) || 2;
    const thirdMinutes = parseInt(minutesUntilThird) || 5;

    // Entry 1: Yesterday (past entry - shows as current state)
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(12, 0, 0, 0);

    // Entry 2: Future entry (configured minutes from now)
    const secondEntry = new Date(now.getTime() + secondMinutes * 60 * 1000);

    // Entry 3: Future entry (configured minutes from now)
    const thirdEntry = new Date(now.getTime() + thirdMinutes * 60 * 1000);

    const entries = [
      {
        date: yesterday,
        variants: {
          systemSmall: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#2C3E50', padding: 12 }}>
              <Voltra.VStack spacing={4} alignment="center">
                <Voltra.Text style={{ fontSize: 32, fontWeight: '700', color: '#3498DB' }}>STATE 1</Voltra.Text>
                <Voltra.Text style={{ fontSize: 12, color: '#ECF0F1' }}>Current</Voltra.Text>
                <Voltra.Text style={{ fontSize: 10, color: '#BDC3C7' }}>Yesterday</Voltra.Text>
              </Voltra.VStack>
            </Voltra.ZStack>
          ),
          systemMedium: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#2C3E50', padding: 16 }}>
              <Voltra.VStack spacing={8} alignment="center">
                <Voltra.Text style={{ fontSize: 48, fontWeight: '700', color: '#3498DB' }}>STATE 1</Voltra.Text>
                <Voltra.Text style={{ fontSize: 16, color: '#ECF0F1' }}>Current State</Voltra.Text>
                <Voltra.Text style={{ fontSize: 14, color: '#BDC3C7' }}>Scheduled: Yesterday</Voltra.Text>
              </Voltra.VStack>
            </Voltra.ZStack>
          ),
          systemLarge: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#2C3E50', padding: 20 }}>
              <Voltra.VStack spacing={12} alignment="center">
                <Voltra.Text style={{ fontSize: 64, fontWeight: '700', color: '#3498DB' }}>STATE 1</Voltra.Text>
                <Voltra.Text style={{ fontSize: 20, color: '#ECF0F1' }}>Current State</Voltra.Text>
                <Voltra.Text style={{ fontSize: 18, color: '#BDC3C7' }}>Scheduled: Yesterday at Noon</Voltra.Text>
              </Voltra.VStack>
            </Voltra.ZStack>
          ),
        },
      },
      {
        date: secondEntry,
        variants: {
          systemSmall: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#16A085', padding: 12 }}>
              <Voltra.VStack spacing={4} alignment="center">
                <Voltra.Text style={{ fontSize: 32, fontWeight: '700', color: '#F1C40F' }}>STATE 2</Voltra.Text>
                <Voltra.Text style={{ fontSize: 12, color: '#ECF0F1' }}>+{secondMinutes} min</Voltra.Text>
              </Voltra.VStack>
            </Voltra.ZStack>
          ),
          systemMedium: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#16A085', padding: 16 }}>
              <Voltra.VStack spacing={8} alignment="center">
                <Voltra.Text style={{ fontSize: 48, fontWeight: '700', color: '#F1C40F' }}>STATE 2</Voltra.Text>
                <Voltra.Text style={{ fontSize: 16, color: '#ECF0F1' }}>Second State</Voltra.Text>
                <Voltra.Text style={{ fontSize: 14, color: '#E8F8F5' }}>
                  {secondEntry.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </Voltra.Text>
              </Voltra.VStack>
            </Voltra.ZStack>
          ),
          systemLarge: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#16A085', padding: 20 }}>
              <Voltra.VStack spacing={12} alignment="center">
                <Voltra.Text style={{ fontSize: 64, fontWeight: '700', color: '#F1C40F' }}>STATE 2</Voltra.Text>
                <Voltra.Text style={{ fontSize: 20, color: '#ECF0F1' }}>Second State</Voltra.Text>
                <Voltra.Text style={{ fontSize: 18, color: '#E8F8F5' }}>
                  {secondEntry.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </Voltra.Text>
              </Voltra.VStack>
            </Voltra.ZStack>
          ),
        },
      },
      {
        date: thirdEntry,
        variants: {
          systemSmall: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#8E44AD', padding: 12 }}>
              <Voltra.VStack spacing={4} alignment="center">
                <Voltra.Text style={{ fontSize: 32, fontWeight: '700', color: '#E74C3C' }}>STATE 3</Voltra.Text>
                <Voltra.Text style={{ fontSize: 12, color: '#ECF0F1' }}>+{thirdMinutes} min</Voltra.Text>
              </Voltra.VStack>
            </Voltra.ZStack>
          ),
          systemMedium: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#8E44AD', padding: 16 }}>
              <Voltra.VStack spacing={8} alignment="center">
                <Voltra.Text style={{ fontSize: 48, fontWeight: '700', color: '#E74C3C' }}>STATE 3</Voltra.Text>
                <Voltra.Text style={{ fontSize: 16, color: '#ECF0F1' }}>Third State</Voltra.Text>
                <Voltra.Text style={{ fontSize: 14, color: '#E8F8F5' }}>
                  {thirdEntry.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </Voltra.Text>
              </Voltra.VStack>
            </Voltra.ZStack>
          ),
          systemLarge: (
            <Voltra.ZStack style={{ flex: 1, backgroundColor: '#8E44AD', padding: 20 }}>
              <Voltra.VStack spacing={12} alignment="center">
                <Voltra.Text style={{ fontSize: 64, fontWeight: '700', color: '#E74C3C' }}>STATE 3</Voltra.Text>
                <Voltra.Text style={{ fontSize: 20, color: '#ECF0F1' }}>Third State</Voltra.Text>
                <Voltra.Text style={{ fontSize: 18, color: '#E8F8F5' }}>
                  {thirdEntry.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </Voltra.Text>
              </Voltra.VStack>
            </Voltra.ZStack>
          ),
        },
      },
    ];

    scheduleWidget('weather', entries).then(() => {
      return reloadWidgets(['weather']);
    }).then(() => {
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
        'Timeline scheduled! ' +
        'State 1: ' + formatter.format(yesterday) +
        ', State 2: ' + formatter.format(secondEntry) + ' (+' + secondMinutes + 'm)' +
        ', State 3: ' + formatter.format(thirdEntry) + ' (+' + thirdMinutes + 'm)'
      );
      setIsScheduling(false);
    }).catch((e: any) => {
      setStatusMessage('Error: ' + (e?.message || String(e)));
      setIsScheduling(false);
    });
  }, [minutesUntilSecond, minutesUntilThird]);

  const handleClearTimeline = useCallback(() => {
    'background only';
    scheduleWidget('weather', []).then(() => {
      return reloadWidgets(['weather']);
    }).then(() => {
      setScheduledTimes(null);
      setStatusMessage('Timeline cleared.');
    }).catch((e: any) => {
      setStatusMessage('Error: ' + (e?.message || String(e)));
    });
  }, []);

  return (
    <scroll-view style={{ linearWeight: 1 } as any} scroll-orientation="vertical">
      <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 }}>
        {/* Header */}
        <text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 }}>
          Widget Scheduling
        </text>
        <text style={{ fontSize: 14, color: '#CBD5F5', lineHeight: '20px', marginBottom: 24 } as any}>
          Test widget timeline scheduling with multiple states. Configure when each
          state should appear and watch the widget transition automatically.
        </text>

        {/* Status bar */}
        {statusMessage ? (
          <view style={{
            backgroundColor: '#0F172A',
            borderRadius: '20px',
            padding: 12,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: 'rgba(148, 163, 184, 0.12)',
          } as any}>
            <text style={{ fontSize: 12, color: '#94A3B8' }}>{statusMessage}</text>
          </view>
        ) : null}

        {/* Configuration card */}
        <view style={{
          backgroundColor: '#0F172A',
          borderRadius: '20px',
          padding: 18,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: 'rgba(148, 163, 184, 0.12)',
        } as any}>
          <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 }}>
            Configuration
          </text>
          <text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 }}>
            Set when each future state should appear:
          </text>

          {/* State 2 input */}
          <view style={{
            display: 'linear',
            linearDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          } as any}>
            <text style={{ fontSize: 14, color: '#FFFFFF', linearWeight: 1 } as any}>
              State 2 (minutes from now):
            </text>
            <input
              type="number"
              value={minutesUntilSecond}
              bindinput={(e: any) => setMinutesUntilSecond(e.detail.value)}
              placeholder="2"
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#FFFFFF',
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 6,
                paddingBottom: 6,
                borderRadius: '8px',
                width: 80,
                height: 36,
                textAlign: 'right',
                fontSize: 16,
              } as any}
            />
          </view>

          {/* State 3 input */}
          <view style={{
            display: 'linear',
            linearDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          } as any}>
            <text style={{ fontSize: 14, color: '#FFFFFF', linearWeight: 1 } as any}>
              State 3 (minutes from now):
            </text>
            <input
              type="number"
              value={minutesUntilThird}
              bindinput={(e: any) => setMinutesUntilThird(e.detail.value)}
              placeholder="5"
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#FFFFFF',
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 6,
                paddingBottom: 6,
                borderRadius: '8px',
                width: 80,
                height: 36,
                textAlign: 'right',
                fontSize: 16,
              } as any}
            />
          </view>
        </view>

        {/* Schedule Timeline card */}
        <view style={{
          backgroundColor: '#0F172A',
          borderRadius: '20px',
          padding: 18,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: 'rgba(148, 163, 184, 0.12)',
        } as any}>
          <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 }}>
            Schedule Timeline
          </text>
          <text style={{ fontSize: 13, color: '#94A3B8', lineHeight: '20px', marginBottom: 16 } as any}>
            Schedules three widget states:{'\n\n'}
            - State 1 (Blue): Yesterday - shows as current{'\n'}
            - State 2 (Green): {minutesUntilSecond || '2'} minutes from now{'\n'}
            - State 3 (Purple): {minutesUntilThird || '5'} minutes from now{'\n\n'}
            Add the widget to your home screen to see it transition between states.
          </text>

          <view style={{ display: 'linear', linearDirection: 'row' } as any}>
            <view
              bindtap={handleScheduleTimeline}
              style={{
                linearWeight: 1,
                backgroundColor: isScheduling ? '#555' : '#007AFF',
                padding: 14,
                borderRadius: '10px',
                alignItems: 'center',
                marginRight: scheduledTimes ? 8 : 0,
              } as any}
            >
              <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                {isScheduling ? 'Scheduling...' : 'Schedule Timeline'}
              </text>
            </view>
            {scheduledTimes ? (
              <view
                bindtap={handleClearTimeline}
                style={{
                  backgroundColor: '#FF3B30',
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 14,
                  paddingBottom: 14,
                  borderRadius: '10px',
                  alignItems: 'center',
                  minWidth: 80,
                } as any}
              >
                <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Clear</text>
              </view>
            ) : null}
          </view>
        </view>

        {/* Scheduled Times card */}
        {scheduledTimes ? (
          <view style={{
            backgroundColor: '#0F172A',
            borderRadius: '20px',
            padding: 18,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: 'rgba(148, 163, 184, 0.12)',
          } as any}>
            <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 16 }}>
              Scheduled Times
            </text>

            {/* State 1 */}
            <view style={{ display: 'linear', linearDirection: 'row', alignItems: 'center', marginBottom: 16 } as any}>
              <view style={{
                width: 12,
                height: 12,
                borderRadius: '6px',
                backgroundColor: '#3498DB',
                marginRight: 12,
              } as any} />
              <view style={{ linearWeight: 1 } as any}>
                <text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 2 }}>
                  State 1 (Current)
                </text>
                <text style={{ fontSize: 14, color: '#CBD5F5' }}>{scheduledTimes.past}</text>
              </view>
            </view>

            {/* State 2 */}
            <view style={{ display: 'linear', linearDirection: 'row', alignItems: 'center', marginBottom: 16 } as any}>
              <view style={{
                width: 12,
                height: 12,
                borderRadius: '6px',
                backgroundColor: '#16A085',
                marginRight: 12,
              } as any} />
              <view style={{ linearWeight: 1 } as any}>
                <text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 2 }}>
                  State 2
                </text>
                <text style={{ fontSize: 14, color: '#CBD5F5' }}>{scheduledTimes.second}</text>
              </view>
            </view>

            {/* State 3 */}
            <view style={{ display: 'linear', linearDirection: 'row', alignItems: 'center' } as any}>
              <view style={{
                width: 12,
                height: 12,
                borderRadius: '6px',
                backgroundColor: '#8E44AD',
                marginRight: 12,
              } as any} />
              <view style={{ linearWeight: 1 } as any}>
                <text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 2 }}>
                  State 3
                </text>
                <text style={{ fontSize: 14, color: '#CBD5F5' }}>{scheduledTimes.third}</text>
              </view>
            </view>
          </view>
        ) : null}

        {/* Widget Previews card */}
        <view style={{
          backgroundColor: '#0F172A',
          borderRadius: '20px',
          padding: 18,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: 'rgba(148, 163, 184, 0.12)',
        } as any}>
          <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 16 }}>
            Widget Previews
          </text>

          {/* State 1 preview */}
          <text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginTop: 4, marginBottom: 8 }}>
            State 1 (Current) - Blue
          </text>
          <view style={{ alignItems: 'center', padding: 12 }}>
            <VoltraWidgetPreview family="systemMedium" id="scheduling-state1">
              <Voltra.ZStack style={{ flex: 1, backgroundColor: '#2C3E50', padding: 16 }}>
                <Voltra.VStack spacing={8} alignment="center">
                  <Voltra.Text style={{ fontSize: 48, fontWeight: '700', color: '#3498DB' }}>STATE 1</Voltra.Text>
                  <Voltra.Text style={{ fontSize: 16, color: '#ECF0F1' }}>Current State</Voltra.Text>
                  <Voltra.Text style={{ fontSize: 14, color: '#BDC3C7' }}>Scheduled: Yesterday</Voltra.Text>
                </Voltra.VStack>
              </Voltra.ZStack>
            </VoltraWidgetPreview>
          </view>

          {/* State 2 preview */}
          <text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginTop: 20, marginBottom: 8 }}>
            State 2 - Green
          </text>
          <view style={{ alignItems: 'center', padding: 12 }}>
            <VoltraWidgetPreview family="systemMedium" id="scheduling-state2">
              <Voltra.ZStack style={{ flex: 1, backgroundColor: '#16A085', padding: 16 }}>
                <Voltra.VStack spacing={8} alignment="center">
                  <Voltra.Text style={{ fontSize: 48, fontWeight: '700', color: '#F1C40F' }}>STATE 2</Voltra.Text>
                  <Voltra.Text style={{ fontSize: 16, color: '#ECF0F1' }}>Second State</Voltra.Text>
                  <Voltra.Text style={{ fontSize: 14, color: '#E8F8F5' }}>
                    +{minutesUntilSecond || '2'} minutes
                  </Voltra.Text>
                </Voltra.VStack>
              </Voltra.ZStack>
            </VoltraWidgetPreview>
          </view>

          {/* State 3 preview */}
          <text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginTop: 20, marginBottom: 8 }}>
            State 3 - Purple
          </text>
          <view style={{ alignItems: 'center', padding: 12 }}>
            <VoltraWidgetPreview family="systemMedium" id="scheduling-state3">
              <Voltra.ZStack style={{ flex: 1, backgroundColor: '#8E44AD', padding: 16 }}>
                <Voltra.VStack spacing={8} alignment="center">
                  <Voltra.Text style={{ fontSize: 48, fontWeight: '700', color: '#E74C3C' }}>STATE 3</Voltra.Text>
                  <Voltra.Text style={{ fontSize: 16, color: '#ECF0F1' }}>Third State</Voltra.Text>
                  <Voltra.Text style={{ fontSize: 14, color: '#E8F8F5' }}>
                    +{minutesUntilThird || '5'} minutes
                  </Voltra.Text>
                </Voltra.VStack>
              </Voltra.ZStack>
            </VoltraWidgetPreview>
          </view>
        </view>

        {/* How to Test card */}
        <view style={{
          backgroundColor: '#0F172A',
          borderRadius: '20px',
          padding: 18,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: 'rgba(148, 163, 184, 0.12)',
        } as any}>
          <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 }}>
            How to Test
          </text>
          <text style={{ fontSize: 13, color: '#94A3B8', lineHeight: '20px' } as any}>
            1. Configure the timing for states 2 and 3 above{'\n'}
            2. Click Schedule Timeline{'\n'}
            3. Add the Weather widget to your home screen{'\n'}
            4. Verify it shows State 1 (blue background){'\n'}
            5. Wait for the scheduled times{'\n'}
            6. Watch the widget automatically transition:{'\n'}
            {'   '}- State 1 (Blue) &gt; State 2 (Green) &gt; State 3 (Purple){'\n\n'}
            Note: iOS may delay widget updates based on battery level,
            widget visibility, and system load. For immediate updates during
            testing, keep Xcode attached or use shorter time intervals.
          </text>
        </view>
      </view>
    </scroll-view>
  );
}
