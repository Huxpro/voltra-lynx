import { useState, useCallback } from '@lynx-js/react';
import { makeFlightPayload } from '../../voltra-payload';

declare const NativeModules: {
  VoltraModule: {
    startLiveActivity: (json: string, options: any, callback: (id: any) => void) => void;
    updateLiveActivity: (id: string, json: string, options: any, callback: (r: any) => void) => void;
    endLiveActivity: (id: string, options: any, callback: (r: any) => void) => void;
  };
};

export function FlightTrackerActivity() {
  const [activityId, setActivityId] = useState<string | null>(null);
  const [status, setStatus] = useState('Not started');
  const isActive = activityId !== null;

  const start = useCallback(() => {
    'background only';
    const payload = makeFlightPayload();
    NativeModules.VoltraModule.startLiveActivity(
      payload,
      { activityName: 'flight' },
      (id: any) => {
        const result = String(id);
        if (result.startsWith('ERROR:')) {
          setStatus('Error: ' + result.substring(6));
        } else {
          setActivityId(result);
          setStatus('Active');
        }
      }
    );
  }, []);

  const stop = useCallback(() => {
    'background only';
    if (!activityId) return;
    NativeModules.VoltraModule.endLiveActivity(
      activityId,
      { dismissalPolicy: { type: 'immediate' } },
      () => {
        setActivityId(null);
        setStatus('Ended');
      }
    );
  }, [activityId]);

  return (
    <view style={{ padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
        Flight Tracker
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Live Activity displaying real-time flight information.
      </text>

      {/* Flight card */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
      }}>
        {/* Header */}
        <view style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            UA2645
          </text>
          <view style={{
            backgroundColor: '#34D399',
            paddingLeft: 10, paddingRight: 10,
            paddingTop: 4, paddingBottom: 4,
            borderRadius: 8,
          }}>
            <text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
              On Time
            </text>
          </view>
        </view>

        {/* Route */}
        <view style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          {/* Departure */}
          <view style={{ flex: 1, alignItems: 'flex-start' }}>
            <text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>
              EWR
            </text>
            <text style={{ color: '#34D399', fontSize: 14, marginTop: 2 }}>
              8:45 PM
            </text>
            <text style={{ color: '#94A3B8', fontSize: 12, marginTop: 2 }}>
              TC · On Time
            </text>
          </view>

          {/* Arrow */}
          <view style={{ alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
            <text style={{ color: '#94A3B8', fontSize: 16 }}>✈</text>
          </view>

          {/* Arrival */}
          <view style={{ flex: 1, alignItems: 'flex-end' }}>
            <text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>
              FLL
            </text>
            <text style={{ color: '#F87171', fontSize: 14, marginTop: 2 }}>
              12:02 AM
            </text>
            <text style={{ color: '#F87171', fontSize: 12, marginTop: 2 }}>
              3m late
            </text>
          </view>
        </view>

        {/* Details */}
        <view style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderTopWidth: 1,
          borderTopColor: '#333',
          paddingTop: 12,
        }}>
          <view>
            <text style={{ color: '#94A3B8', fontSize: 11 }}>DEPARTURE</text>
            <text style={{ color: '#34D399', fontSize: 14, fontWeight: '600' }}>1h 42m</text>
          </view>
          <view style={{
            backgroundColor: '#FCD34D',
            paddingLeft: 10, paddingRight: 10,
            paddingTop: 4, paddingBottom: 4,
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <text style={{ color: '#000', fontSize: 14, fontWeight: '600' }}>134</text>
          </view>
        </view>
      </view>

      {/* Controls */}
      <view
        bindtap={isActive ? stop : start}
        style={{
          backgroundColor: isActive ? '#EF4444' : '#007AFF',
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
          {isActive ? 'Stop Activity' : 'Start Activity'}
        </text>
      </view>

      <text style={{ marginTop: 12, color: '#666', fontSize: 13 }}>
        Status: {status}
      </text>
    </view>
  );
}
