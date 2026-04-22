import { useState, useCallback } from '@lynx-js/react';
import { makeWorkoutPayload } from '../../voltra-payload';

// Lynx NativeModules global (available on background thread)
declare const NativeModules: {
  VoltraModule: {
    startLiveActivity: (json: string, options: any, callback: (id: any) => void) => void;
    updateLiveActivity: (id: string, json: string, options: any, callback: (r: any) => void) => void;
    endLiveActivity: (id: string, options: any, callback: (r: any) => void) => void;
  };
};

// Heart rate zones for display
const ZONES = [
  { min: 0, max: 114, label: 'Warm Up', color: '#38BDF8' },
  { min: 114, max: 133, label: 'Fat Burn', color: '#10B981' },
  { min: 133, max: 152, label: 'Cardio', color: '#F59E0B' },
  { min: 152, max: 171, label: 'Peak', color: '#F97316' },
  { min: 171, max: 190, label: 'Red Line', color: '#EF4444' },
];

function getZoneLabel(hr: number): string {
  const zone = ZONES.find((z) => hr >= z.min && hr < z.max);
  return zone ? zone.label : hr >= 190 ? 'Red Line' : 'Resting';
}

function getZoneColor(hr: number): string {
  const zone = ZONES.find((z) => hr >= z.min && hr < z.max);
  return zone ? zone.color : hr >= 190 ? '#EF4444' : '#94A3B8';
}

export function WorkoutTrackerActivity() {
  const [activityId, setActivityId] = useState<string | null>(null);
  const [status, setStatus] = useState('Not started');
  const [isRunning, setIsRunning] = useState(false);
  const [heartRate, setHeartRate] = useState(120);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [startTime] = useState(() => Date.now());
  const [timerRunning, setTimerRunning] = useState(false);

  const isActive = activityId !== null;

  // Format distance as X.X km
  const distanceText = (distanceMeters / 1000).toFixed(1) + ' km';

  // Calculate pace (min/km)
  const pace = (() => {
    if (distanceMeters === 0 || elapsedSeconds === 0) return '--:--';
    const paceSeconds = elapsedSeconds / (distanceMeters / 1000);
    const paceMinutes = Math.floor(paceSeconds / 60);
    const paceRemainingSeconds = Math.floor(paceSeconds % 60);
    return paceMinutes + ':' + paceRemainingSeconds.toString().padStart(2, '0');
  })();

  // Format elapsed time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0');
  };

  // Simulate workout metrics with setTimeout chain (no setInterval in Lynx)
  const tick = useCallback(() => {
    'background only';
    if (!timerRunning || !activityId) return;

    setElapsedSeconds((prev) => prev + 1);
    setHeartRate((prev) => {
      // Simulate heart rate cycling between 80-180 BPM
      const change = Math.random() * 6 - 3;
      return Math.round(Math.max(80, Math.min(180, prev + change)));
    });
    setDistanceMeters((prev) => prev + 5); // ~5 m/s jogging pace

    // Schedule next tick
    setTimeout(() => tick(), 1000);
  }, [timerRunning, activityId]);

  // Update the live activity with current metrics
  const updateActivity = useCallback(() => {
    'background only';
    if (!activityId) return;
    const payload = makeWorkoutPayload(heartRate, distanceText, pace, startTime);
    NativeModules.VoltraModule.updateLiveActivity(
      activityId, payload, {},
      () => { setStatus('Updated - HR: ' + heartRate + ' BPM'); }
    );
  }, [activityId, heartRate, distanceText, pace, startTime]);

  // Combined tick + update
  const tickAndUpdate = useCallback(() => {
    'background only';
    if (!timerRunning || !activityId) return;

    setElapsedSeconds((prev) => prev + 1);
    setHeartRate((prev) => {
      const change = Math.random() * 6 - 3;
      return Math.round(Math.max(80, Math.min(180, prev + change)));
    });
    setDistanceMeters((prev) => prev + 5);

    // Update live activity payload
    const payload = makeWorkoutPayload(heartRate, distanceText, pace, startTime);
    NativeModules.VoltraModule.updateLiveActivity(
      activityId, payload, {},
      () => {}
    );

    // Schedule next tick
    setTimeout(() => tickAndUpdate(), 1000);
  }, [timerRunning, activityId, heartRate, distanceText, pace, startTime]);

  const startWorkout = useCallback(() => {
    'background only';
    if (typeof NativeModules === 'undefined') {
      setStatus('Error: NativeModules is undefined');
      return;
    }
    if (!NativeModules.VoltraModule) {
      setStatus('Error: VoltraModule not found');
      return;
    }

    const payload = makeWorkoutPayload(120, '0.0 km', '--:--', Date.now());
    try {
      NativeModules.VoltraModule.startLiveActivity(
        payload,
        { activityName: 'workout' },
        (id: any) => {
          const result = String(id);
          if (result.startsWith('ERROR:')) {
            setStatus('Error: ' + result.substring(6));
          } else if (id && id !== null && result !== 'null') {
            setActivityId(result);
            setIsRunning(true);
            setTimerRunning(true);
            setStatus('Workout active');
            // Start the update loop
            setTimeout(() => tickAndUpdate(), 1000);
          } else {
            setStatus('Callback returned null');
          }
        }
      );
    } catch (e: any) {
      setStatus('Error: ' + (e?.message || String(e)));
    }
  }, [tickAndUpdate]);

  const stopWorkout = useCallback(() => {
    'background only';
    if (!activityId) return;
    setTimerRunning(false);
    setIsRunning(false);
    NativeModules.VoltraModule.endLiveActivity(
      activityId, { dismissalPolicy: { type: 'immediate' } },
      () => {
        setActivityId(null);
        setStatus('Workout ended');
      }
    );
  }, [activityId]);

  const zoneLabel = getZoneLabel(heartRate);
  const zoneColor = getZoneColor(heartRate);

  return (
    <view style={{ padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
        Workout Tracker
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Start a workout Live Activity with real-time heart rate, distance, and pace.
      </text>

      {/* Activity card */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
      }}>
        {/* Elapsed time */}
        <view style={{ alignItems: 'center', marginBottom: 20 }}>
          <text style={{ color: '#666', fontSize: 12 }}>ELAPSED TIME</text>
          <text style={{ color: '#fff', fontSize: 40, fontWeight: 'bold' }}>
            {formatTime(elapsedSeconds)}
          </text>
        </view>

        {/* Heart rate zone indicator */}
        <view style={{
          alignItems: 'center',
          marginBottom: 16,
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 16,
          paddingRight: 16,
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: 12,
        }}>
          <text style={{ color: zoneColor, fontSize: 14, fontWeight: '600' }}>
            {zoneLabel} Zone
          </text>
        </view>

        {/* Metrics grid */}
        <view style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          {/* Heart rate */}
          <view style={{ alignItems: 'center' }}>
            <text style={{ color: '#FF3B30', fontSize: 12 }}>BPM</text>
            <text style={{ color: '#FF3B30', fontSize: 28, fontWeight: 'bold' }}>
              {heartRate}
            </text>
            <text style={{ color: '#666', fontSize: 11 }}>Heart Rate</text>
          </view>

          {/* Distance */}
          <view style={{ alignItems: 'center' }}>
            <text style={{ color: '#34C759', fontSize: 12 }}>KM</text>
            <text style={{ color: '#34C759', fontSize: 28, fontWeight: 'bold' }}>
              {(distanceMeters / 1000).toFixed(1)}
            </text>
            <text style={{ color: '#666', fontSize: 11 }}>Distance</text>
          </view>

          {/* Pace */}
          <view style={{ alignItems: 'center' }}>
            <text style={{ color: '#007AFF', fontSize: 12 }}>MIN/KM</text>
            <text style={{ color: '#007AFF', fontSize: 28, fontWeight: 'bold' }}>
              {pace}
            </text>
            <text style={{ color: '#666', fontSize: 11 }}>Pace</text>
          </view>
        </view>
      </view>

      {/* Controls */}
      {!isActive ? (
        <view
          bindtap={startWorkout}
          style={{
            backgroundColor: '#34C759',
            padding: 14,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Start Workout
          </text>
        </view>
      ) : (
        <view
          bindtap={stopWorkout}
          style={{
            backgroundColor: '#FF3B30',
            padding: 14,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Stop Workout
          </text>
        </view>
      )}

      <view
        bindtap={updateActivity}
        style={{
          backgroundColor: isActive ? '#007AFF' : '#ccc',
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
          Force Update
        </text>
      </view>

      <text style={{ marginTop: 12, color: '#666', fontSize: 13 }}>
        Status: {status}
      </text>
    </view>
  );
}
