import { useState } from '@lynx-js/react';

type FlightStatus = 'On Time' | 'Delayed' | 'Boarding' | 'In Flight' | 'Landed';

interface FlightInfo {
  flightNumber: string;
  departure: { code: string; city: string; time: string; gate: string };
  arrival: { code: string; city: string; time: string; terminal: string };
  status: FlightStatus;
}

const mockFlight: FlightInfo = {
  flightNumber: 'UA 2487',
  departure: { code: 'SFO', city: 'San Francisco', time: '10:30 AM', gate: 'B42' },
  arrival: { code: 'JFK', city: 'New York', time: '6:45 PM', terminal: 'T4' },
  status: 'On Time',
};

const statusColors: Record<FlightStatus, string> = {
  'On Time': '#34C759',
  'Delayed': '#FF9500',
  'Boarding': '#007AFF',
  'In Flight': '#5856D6',
  'Landed': '#34C759',
};

const statuses: FlightStatus[] = ['On Time', 'Delayed', 'Boarding', 'In Flight', 'Landed'];

export function FlightTrackerActivity() {
  const [flight, setFlight] = useState(mockFlight);
  const [statusIndex, setStatusIndex] = useState(0);

  const cycleStatus = () => {
    const nextIndex = (statusIndex + 1) % statuses.length;
    setStatusIndex(nextIndex);
    setFlight({ ...flight, status: statuses[nextIndex] });
  };

  return (
    <view style={{ flex: 1, padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Flight Tracker Activity
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
        <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            {flight.flightNumber}
          </text>
          <view style={{
            backgroundColor: statusColors[flight.status],
            paddingLeft: 10, paddingRight: 10,
            paddingTop: 4, paddingBottom: 4,
            borderRadius: 8,
          }}>
            <text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
              {flight.status}
            </text>
          </view>
        </view>

        {/* Route */}
        <view style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          {/* Departure */}
          <view style={{ flex: 1, alignItems: 'flex-start' }}>
            <text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>
              {flight.departure.code}
            </text>
            <text style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>
              {flight.departure.city}
            </text>
            <text style={{ color: '#fff', fontSize: 14, marginTop: 4 }}>
              {flight.departure.time}
            </text>
          </view>

          {/* Arrow */}
          <view style={{ alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
            <text style={{ color: '#666', fontSize: 20 }}>---&gt;</text>
          </view>

          {/* Arrival */}
          <view style={{ flex: 1, alignItems: 'flex-end' }}>
            <text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>
              {flight.arrival.code}
            </text>
            <text style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>
              {flight.arrival.city}
            </text>
            <text style={{ color: '#fff', fontSize: 14, marginTop: 4 }}>
              {flight.arrival.time}
            </text>
          </view>
        </view>

        {/* Details */}
        <view style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#333', paddingTop: 12 }}>
          <view>
            <text style={{ color: '#666', fontSize: 11 }}>GATE</text>
            <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{flight.departure.gate}</text>
          </view>
          <view>
            <text style={{ color: '#666', fontSize: 11 }}>TERMINAL</text>
            <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{flight.arrival.terminal}</text>
          </view>
        </view>
      </view>

      {/* Cycle status button */}
      <view
        bindtap={cycleStatus}
        style={{
          backgroundColor: '#007AFF',
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
          Simulate Status Change
        </text>
      </view>
    </view>
  );
}
