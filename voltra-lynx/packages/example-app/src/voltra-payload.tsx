import { Voltra, renderLiveActivityToString } from '@use-voltra/ios';

// ─── Basic Live Activity ────────────────────────────────────────

export function makeBasicLiveActivityPayload(title: string, subtitle: string): string {
  return renderLiveActivityToString({
    lockScreen: (
      <Voltra.VStack alignment="center" spacing={8}>
        <Voltra.Symbol name="target" style={{ foregroundColor: '#FF3B30' } as any} />
        <Voltra.Text style={{ fontSize: 16, fontWeight: 'bold' } as any}>
          {title}
        </Voltra.Text>
        <Voltra.Text style={{ fontSize: 14, color: '#AAAAAA' } as any}>
          {subtitle}
        </Voltra.Text>
      </Voltra.VStack>
    ),
    island: {
      compact: {
        leading: <Voltra.Symbol name="target" style={{ foregroundColor: '#FF3B30' } as any} />,
        trailing: <Voltra.Text>{title}</Voltra.Text>,
      },
      expanded: {
        center: (
          <Voltra.VStack alignment="center" spacing={4}>
            <Voltra.Text style={{ fontSize: 18, fontWeight: 'bold' } as any}>
              {title}
            </Voltra.Text>
            <Voltra.Text style={{ fontSize: 14, color: '#AAAAAA' } as any}>
              {subtitle}
            </Voltra.Text>
          </Voltra.VStack>
        ),
        leading: <Voltra.Symbol name="target" style={{ foregroundColor: '#FF3B30', fontSize: 24 } as any} />,
      },
      minimal: <Voltra.Symbol name="target" style={{ foregroundColor: '#FF3B30' } as any} />,
    },
  });
}

// ─── Music Player Live Activity ─────────────────────────────────

export type Song = {
  title: string;
  artist: string;
  image: string;
};

export const SONGS: Song[] = [
  { title: 'Midnight Dreams', artist: 'The Voltra Collective', image: 'voltra-icon' },
  { title: 'Electric Pulse', artist: 'Neon Waves', image: 'voltra-light' },
  { title: 'Starlight Symphony', artist: 'Cosmic Harmony', image: 'voltra-icon' },
  { title: 'Urban Echoes', artist: 'City Lights', image: 'voltra-light' },
  { title: 'Ocean Breeze', artist: 'Coastal Vibes', image: 'voltra-icon' },
];

export function makeMusicPlayerPayload(currentSong: Song, isPlaying: boolean): string {
  return renderLiveActivityToString({
    lockScreen: (
      <Voltra.VStack id="music-player-live-activity" style={{ padding: 12 } as any} spacing={16}>
        <Voltra.HStack spacing={16}>
          <Voltra.Image
            id={currentSong.image}
            source={{ assetName: currentSong.image }}
            style={{ width: 120, height: 120, borderRadius: 12 } as any}
            resizeMode="cover"
          />
          <Voltra.VStack spacing={4}>
            <Voltra.Text style={{ color: '#F0F9FF', fontSize: 20, fontWeight: '700', letterSpacing: -0.5 } as any}>
              {currentSong.title}
            </Voltra.Text>
            <Voltra.Text style={{ color: '#94A3B8', fontSize: 15, fontWeight: '500' } as any}>
              {currentSong.artist}
            </Voltra.Text>
            <Voltra.HStack spacing={8} style={{ marginTop: 8 } as any}>
              <Voltra.Button id="previous-button">
                <Voltra.Symbol name="backward.fill" type="hierarchical" scale="large" tintColor="#F0F9FF" />
              </Voltra.Button>
              <Voltra.Button id="play-pause-button">
                <Voltra.Symbol
                  name={isPlaying ? 'pause.fill' : 'play.fill'}
                  type="hierarchical" scale="large" tintColor="#F0F9FF"
                />
              </Voltra.Button>
              <Voltra.Button id="next-button">
                <Voltra.Symbol name="forward.fill" type="hierarchical" scale="large" tintColor="#F0F9FF" />
              </Voltra.Button>
            </Voltra.HStack>
          </Voltra.VStack>
        </Voltra.HStack>
      </Voltra.VStack>
    ),
    island: {
      compact: {
        leading: <Voltra.Symbol name="music.note" style={{ foregroundColor: '#F0F9FF' } as any} />,
        trailing: <Voltra.Text style={{ fontSize: 12 } as any}>{currentSong.title}</Voltra.Text>,
      },
      expanded: {
        center: (
          <Voltra.HStack spacing={12}>
            <Voltra.VStack spacing={2}>
              <Voltra.Text style={{ fontSize: 14, fontWeight: '600', color: '#F0F9FF' } as any}>
                {currentSong.title}
              </Voltra.Text>
              <Voltra.Text style={{ fontSize: 12, color: '#94A3B8' } as any}>
                {currentSong.artist}
              </Voltra.Text>
            </Voltra.VStack>
          </Voltra.HStack>
        ),
        leading: (
          <Voltra.Image
            source={{ assetName: currentSong.image }}
            style={{ width: 40, height: 40, borderRadius: 8 } as any}
            resizeMode="cover"
          />
        ),
        trailing: (
          <Voltra.HStack spacing={8}>
            <Voltra.Button id="play-pause-button">
              <Voltra.Symbol
                name={isPlaying ? 'pause.fill' : 'play.fill'}
                type="hierarchical" tintColor="#F0F9FF"
              />
            </Voltra.Button>
            <Voltra.Button id="next-button">
              <Voltra.Symbol name="forward.fill" type="hierarchical" tintColor="#F0F9FF" />
            </Voltra.Button>
          </Voltra.HStack>
        ),
      },
      minimal: <Voltra.Symbol name="music.note" style={{ foregroundColor: '#F0F9FF' } as any} />,
    },
  });
}

// ─── Workout Tracker Live Activity ──────────────────────────────

export function makeWorkoutPayload(
  heartRate: number,
  distance: string,
  pace: string,
  elapsedDate: number,
): string {
  const maxHeartRate = 190;
  const zones = [
    { min: 0, max: 0.6 * maxHeartRate, label: 'Warm Up', color: '#38BDF8' },
    { min: 0.6 * maxHeartRate, max: 0.7 * maxHeartRate, label: 'Fat Burn', color: '#10B981' },
    { min: 0.7 * maxHeartRate, max: 0.8 * maxHeartRate, label: 'Cardio', color: '#F59E0B' },
    { min: 0.8 * maxHeartRate, max: 0.9 * maxHeartRate, label: 'Peak', color: '#F97316' },
    { min: 0.9 * maxHeartRate, max: maxHeartRate, label: 'Red Line', color: '#EF4444' },
  ];

  const currentZoneIndex = zones.findIndex((zone) => heartRate >= zone.min && heartRate < zone.max);

  const getCirclePosition = () => {
    const numZones = zones.length;
    const spacing = 4;
    const circleWidth = 16;
    const totalBarWidth = 360 - 32;
    const totalSpacing = (numZones - 1) * spacing;
    const pillWidth = (totalBarWidth - totalSpacing) / numZones;

    if (currentZoneIndex === -1) {
      if (heartRate < zones[0].min) return -circleWidth / 2;
      return totalBarWidth - circleWidth / 2;
    }

    const currentZone = zones[currentZoneIndex];
    const zoneRange = currentZone.max - currentZone.min;
    const heartRateInZone = heartRate - currentZone.min;
    const zoneProgress = zoneRange > 0 ? heartRateInZone / zoneRange : 0;

    const zoneStartPosition = currentZoneIndex * (pillWidth + spacing);
    const positionInPill = zoneProgress * pillWidth;

    return zoneStartPosition + positionInPill - circleWidth / 2;
  };

  const getGradientColorsAndLocations = () => {
    const grayColor = '#94A3B8';
    const numZones = zones.length;
    const zoneWidth = 1 / numZones;

    let activeZoneIndex = zones.findIndex((zone) => heartRate >= zone.min && heartRate < zone.max);
    if (activeZoneIndex === -1 && heartRate >= zones[zones.length - 1].max) {
      activeZoneIndex = zones.length;
    }

    let hrGradientPosition = 0;
    if (activeZoneIndex >= 0 && activeZoneIndex < zones.length) {
      const zone = zones[activeZoneIndex];
      const progressInZone = (heartRate - zone.min) / (zone.max - zone.min);
      hrGradientPosition = (activeZoneIndex + progressInZone) * zoneWidth;
    } else if (activeZoneIndex >= zones.length) {
      hrGradientPosition = 1;
    }

    const colors: string[] = [];
    const locations: number[] = [];

    for (let i = 0; i < numZones; i++) {
      const zoneStart = i * zoneWidth;
      const zoneEnd = (i + 1) * zoneWidth;
      const zoneColor = zones[i].color;

      const isFullyActive = zoneEnd <= hrGradientPosition;
      const containsHR = zoneStart < hrGradientPosition && hrGradientPosition < zoneEnd;
      const isFullyInactive = zoneStart >= hrGradientPosition;

      if (isFullyActive) {
        colors.push(zoneColor);
        locations.push(zoneStart);
        colors.push(zoneColor);
        locations.push(zoneEnd);
      } else if (containsHR) {
        colors.push(zoneColor);
        locations.push(zoneStart);
        colors.push(zoneColor);
        locations.push(hrGradientPosition);
        colors.push(grayColor);
        locations.push(hrGradientPosition);
        colors.push(grayColor);
        locations.push(zoneEnd);
      } else if (isFullyInactive) {
        colors.push(grayColor);
        locations.push(zoneStart);
        colors.push(grayColor);
        locations.push(zoneEnd);
      }
    }

    return {
      colors: colors as [string, string, ...string[]],
      locations,
    };
  };

  const { colors: gradientColors, locations: gradientLocations } = getGradientColorsAndLocations();

  return renderLiveActivityToString({
    lockScreen: (
      <Voltra.LinearGradient
        colors={['#0F172A', '#1E293B', '#0F172A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 16,
          borderWidth: 1,
          borderColor: 'rgba(148, 163, 184, 0.1)',
        } as any}
      >
        <Voltra.VStack id="workout-live-activity" spacing={12} style={{ padding: 16 } as any}>
          {/* Top Section - Heart Rate and Timer */}
          <Voltra.HStack style={{ marginBottom: 0 } as any} spacing={12}>
            <Voltra.VStack>
              <Voltra.HStack spacing={4}>
                <Voltra.Symbol name="timer" tintColor="#10B981" size={24} />
                <Voltra.Timer
                  style={{
                    color: '#10B981',
                    fontSize: 28,
                    fontWeight: '700',
                    fontVariant: ['tabular-nums'],
                  } as any}
                  textStyle="timer"
                  startAtMs={elapsedDate}
                  durationMs={3153600000000}
                  direction="up"
                />
              </Voltra.HStack>
            </Voltra.VStack>

            <Voltra.Spacer />

            <Voltra.VStack alignment="trailing">
              <Voltra.HStack spacing={4}>
                <Voltra.Symbol name="heart.fill" tintColor="#EF4444" size={24} />
                <Voltra.Text
                  style={{
                    color: '#EF4444',
                    fontSize: 28,
                    fontWeight: '700',
                    fontVariant: ['tabular-nums'],
                  } as any}
                >
                  {heartRate.toString()}
                </Voltra.Text>
              </Voltra.HStack>
            </Voltra.VStack>
          </Voltra.HStack>

          {/* Heart Rate Zones Progress Bar */}
          <Voltra.ZStack alignment="topLeading">
            <Voltra.VStack spacing={4}>
              <Voltra.Mask
                maskElement={
                  <Voltra.HStack spacing={4}>
                    {zones.map((_zone, index) => (
                      <Voltra.VStack
                        key={index}
                        style={{
                          flex: 1,
                          borderRadius: 8,
                          height: 8,
                          backgroundColor: '#FFFFFF',
                        } as any}
                      />
                    ))}
                  </Voltra.HStack>
                }
              >
                <Voltra.LinearGradient
                  colors={gradientColors}
                  locations={gradientLocations}
                  start="leading"
                  end="trailing"
                  style={{ borderRadius: 8, height: 8 } as any}
                />
              </Voltra.Mask>
              <Voltra.HStack spacing={4}>
                {zones.map((zone, index) => (
                  <Voltra.VStack key={index} alignment="center" spacing={0} style={{ flex: 1 } as any}>
                    <Voltra.Text
                      style={{
                        color: '#94A3B8',
                        fontSize: 10,
                        fontWeight: '500',
                        flex: 1,
                      } as any}
                    >
                      {zone.label}
                    </Voltra.Text>
                  </Voltra.VStack>
                ))}
              </Voltra.HStack>
            </Voltra.VStack>

            <Voltra.VStack
              style={{
                top: 3,
                left: getCirclePosition() + 16,
                width: 16,
                height: 16,
                backgroundColor: '#FFFFFF',
                borderColor: '#1E293B',
                borderWidth: 3,
                borderRadius: 16,
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              } as any}
            />
          </Voltra.ZStack>

          {/* Bottom Section - Three Columns */}
          <Voltra.HStack spacing={0}>
            <Voltra.VStack style={{ flex: 1 } as any} alignment="center" spacing={0}>
              <Voltra.Text
                style={{
                  color: '#F0F9FF',
                  fontSize: 24,
                  fontWeight: '700',
                  fontVariant: ['tabular-nums'],
                } as any}
              >
                {distance}
              </Voltra.Text>
              <Voltra.Text
                style={{
                  color: '#94A3B8',
                  fontSize: 12,
                  fontWeight: '500',
                  marginTop: 2,
                } as any}
              >
                DISTANCE
              </Voltra.Text>
            </Voltra.VStack>

            <Voltra.VStack style={{ width: 1, backgroundColor: 'white', height: 32 } as any} />

            <Voltra.VStack style={{ flex: 1 } as any} alignment="center" spacing={0}>
              <Voltra.Text
                style={{
                  color: '#F0F9FF',
                  fontSize: 18,
                  fontWeight: '600',
                } as any}
              >
                FITNESS
              </Voltra.Text>
            </Voltra.VStack>

            <Voltra.VStack style={{ width: 1, backgroundColor: 'white', height: 32 } as any} />

            <Voltra.VStack style={{ flex: 1 } as any} alignment="center" spacing={0}>
              <Voltra.Text
                style={{
                  color: '#F0F9FF',
                  fontSize: 24,
                  fontWeight: '700',
                  fontVariant: ['tabular-nums'],
                } as any}
              >
                {pace}
              </Voltra.Text>
              <Voltra.Text
                style={{
                  color: '#94A3B8',
                  fontSize: 12,
                  fontWeight: '500',
                  marginTop: 2,
                } as any}
              >
                PACE
              </Voltra.Text>
            </Voltra.VStack>
          </Voltra.HStack>
        </Voltra.VStack>
      </Voltra.LinearGradient>
    ),
  });
}

// ─── Compass Live Activity ──────────────────────────────────────

function getCardinalDirection(heading: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(heading / 45) % 8;
  return directions[index];
}

export function makeCompassPayload(heading: number): string {
  const headingText = `${Math.round(heading)}°`;
  const direction = getCardinalDirection(heading);

  return renderLiveActivityToString({
    lockScreen: (
      <Voltra.HStack id="compass-live-activity" spacing={16} style={{ padding: 16 } as any}>
        {/* Left side: Rotated arrow */}
        <Voltra.VStack
          alignment="center"
          style={{
            width: 48,
            height: 48,
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderRadius: 24,
          } as any}
        >
          <Voltra.Symbol
            name="location.north.fill"
            tintColor="#3B82F6"
            size={28}
            style={{
              transform: [{ rotate: `${heading}deg` }],
            } as any}
          />
        </Voltra.VStack>

        {/* Right side: Heading info */}
        <Voltra.VStack alignment="leading" spacing={2} style={{ flex: 1 } as any}>
          <Voltra.HStack spacing={8}>
            <Voltra.Text
              style={{
                color: '#FFFFFF',
                fontSize: 28,
                fontWeight: '700',
                fontVariant: ['tabular-nums'],
              } as any}
            >
              {headingText}
            </Voltra.Text>
            <Voltra.Text
              style={{
                color: '#3B82F6',
                fontSize: 20,
                fontWeight: '600',
              } as any}
            >
              {direction}
            </Voltra.Text>
          </Voltra.HStack>
          <Voltra.Text
            style={{
              color: '#94A3B8',
              fontSize: 12,
              fontWeight: '500',
            } as any}
          >
            Magnetic North
          </Voltra.Text>
        </Voltra.VStack>
      </Voltra.HStack>
    ),
    island: {
      keylineTint: 'blue',
      compact: {
        leading: (
          <Voltra.Symbol
            name="location.north.fill"
            tintColor="#3B82F6"
            size={16}
            style={{
              transform: [{ rotate: `${heading}deg` }],
            } as any}
          />
        ),
        trailing: (
          <Voltra.Text
            style={{
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: '600',
              fontVariant: ['tabular-nums'],
            } as any}
          >
            {Math.round(heading)}°
          </Voltra.Text>
        ),
      },
      expanded: {
        leading: (
          <Voltra.Text
            style={{
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: '600',
              paddingTop: 4,
              paddingLeft: 6,
            } as any}
          >
            Compass
          </Voltra.Text>
        ),
        trailing: (
          <Voltra.Text
            style={{
              color: '#3B82F6',
              fontSize: 14,
              fontWeight: '600',
              paddingTop: 4,
              paddingRight: 6,
            } as any}
          >
            {direction}
          </Voltra.Text>
        ),
        bottom: (
          <Voltra.HStack spacing={16} style={{ paddingLeft: 12, paddingRight: 12, paddingBottom: 12 } as any}>
            {/* Left side: Rotated arrow */}
            <Voltra.VStack
              alignment="center"
              style={{
                width: 40,
                height: 40,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderRadius: 20,
              } as any}
            >
              <Voltra.Symbol
                name="location.north.fill"
                tintColor="#3B82F6"
                size={24}
                style={{
                  transform: [{ rotate: `${heading}deg` }],
                } as any}
              />
            </Voltra.VStack>

            {/* Right side: Heading */}
            <Voltra.VStack alignment="leading" spacing={2} style={{ flex: 1 } as any}>
              <Voltra.Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 24,
                  fontWeight: '700',
                  fontVariant: ['tabular-nums'],
                } as any}
              >
                {headingText}
              </Voltra.Text>
              <Voltra.Text
                style={{
                  color: '#94A3B8',
                  fontSize: 11,
                  fontWeight: '500',
                } as any}
              >
                Magnetic heading
              </Voltra.Text>
            </Voltra.VStack>
          </Voltra.HStack>
        ),
      },
      minimal: (
        <Voltra.Symbol
          name="location.north.fill"
          tintColor="#3B82F6"
          size={14}
          style={{
            transform: [{ rotate: `${heading}deg` }],
          } as any}
        />
      ),
    },
  });
}

// ─── Flight Tracker Live Activity ───────────────────────────────

export function makeFlightPayload(): string {
  return renderLiveActivityToString({
    lockScreen: (
      <Voltra.VStack id="flight-live-activity" spacing={8} style={{ padding: 12 } as any}>
        <Voltra.HStack>
          <Voltra.Symbol name="airplane" tintColor="#FFFFFF" size={14} style={{ marginRight: 4 } as any} />
          <Voltra.Text
            style={{
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: '600',
            } as any}
          >
            UA2645
          </Voltra.Text>

          <Voltra.Spacer />

          <Voltra.Text
            style={{
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: '500',
            } as any}
          >
            FLIGHTY
          </Voltra.Text>
        </Voltra.HStack>

        <Voltra.HStack>
          <Voltra.VStack spacing={4} alignment="leading">
            <Voltra.HStack spacing={4}>
              <Voltra.Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 24,
                  fontWeight: '700',
                  letterSpacing: -1,
                } as any}
              >
                EWR
              </Voltra.Text>
              <Voltra.Text
                style={{
                  color: '#34D399',
                  fontSize: 14,
                  fontWeight: '600',
                } as any}
              >
                8:45 PM
              </Voltra.Text>
            </Voltra.HStack>
            <Voltra.HStack spacing={4}>
              <Voltra.Text
                style={{
                  color: '#94A3B8',
                  fontSize: 12,
                  fontWeight: '500',
                } as any}
              >
                TC
              </Voltra.Text>
              <Voltra.Text
                style={{
                  color: '#34D399',
                  fontSize: 12,
                  fontWeight: '500',
                } as any}
              >
                On Time
              </Voltra.Text>
            </Voltra.HStack>
          </Voltra.VStack>

          <Voltra.Spacer />

          <Voltra.HStack spacing={4}>
            <Voltra.Symbol name="circle.fill" tintColor="#94A3B8" size={3} />
            <Voltra.Symbol name="circle.fill" tintColor="#94A3B8" size={3} />
            <Voltra.Symbol name="airplane" tintColor="#94A3B8" size={16} />
            <Voltra.Symbol name="circle.fill" tintColor="#94A3B8" size={3} />
            <Voltra.Symbol name="circle.fill" tintColor="#94A3B8" size={3} />
          </Voltra.HStack>

          <Voltra.Spacer />

          <Voltra.VStack spacing={4} alignment="trailing">
            <Voltra.HStack spacing={4}>
              <Voltra.Text
                style={{
                  color: '#F87171',
                  fontSize: 16,
                  fontWeight: '600',
                } as any}
              >
                12:02 AM
              </Voltra.Text>
              <Voltra.Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 24,
                  fontWeight: '700',
                  letterSpacing: -1,
                } as any}
              >
                FLL
              </Voltra.Text>
            </Voltra.HStack>
            <Voltra.Text
              style={{
                color: '#F87171',
                fontSize: 12,
                fontWeight: '500',
              } as any}
            >
              3m late
            </Voltra.Text>
          </Voltra.VStack>
        </Voltra.HStack>

        <Voltra.HStack>
          <Voltra.VStack spacing={2}>
            <Voltra.HStack>
              <Voltra.Text
                style={{
                  color: '#94A3B8',
                  fontSize: 13,
                  fontWeight: '500',
                } as any}
              >
                Gate Departure in{' '}
              </Voltra.Text>
              <Voltra.Text
                style={{
                  color: '#34D399',
                  fontSize: 13,
                  fontWeight: '600',
                } as any}
              >
                1h 42m
              </Voltra.Text>
            </Voltra.HStack>
            <Voltra.Text
              style={{
                color: '#64748B',
                fontSize: 11,
                fontWeight: '400',
              } as any}
            >
              EWR departures avg 24m late
            </Voltra.Text>
          </Voltra.VStack>

          <Voltra.Spacer />

          <Voltra.HStack
            spacing={4}
            style={{
              backgroundColor: '#FCD34D',
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 6,
              paddingBottom: 6,
              borderRadius: 12,
            } as any}
          >
            <Voltra.Symbol name="arrow.up.right" tintColor="#000000" size={14} />
            <Voltra.Text
              style={{
                color: '#000000',
                fontSize: 14,
                fontWeight: '600',
              } as any}
            >
              134
            </Voltra.Text>
          </Voltra.HStack>
        </Voltra.HStack>
      </Voltra.VStack>
    ),
    island: {
      keylineTint: '#FCD34D',
      compact: {
        leading: <Voltra.Symbol name="airplane" tintColor="#FFFFFF" size={14} />,
        trailing: (
          <Voltra.HStack
            spacing={4}
            style={{
              backgroundColor: '#FCD34D',
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 6,
              paddingBottom: 6,
              borderRadius: 12,
            } as any}
          >
            <Voltra.Text
              style={{
                color: '#000000',
                fontSize: 14,
                fontWeight: '600',
              } as any}
            >
              134
            </Voltra.Text>
          </Voltra.HStack>
        ),
      },
      expanded: {
        leading: (
          <Voltra.Text
            style={{
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: '600',
              paddingTop: 4,
              paddingLeft: 6,
            } as any}
          >
            UA2645
          </Voltra.Text>
        ),
        trailing: (
          <Voltra.Text
            style={{
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: '500',
              paddingTop: 4,
              paddingRight: 6,
            } as any}
          >
            FLIGHTY
          </Voltra.Text>
        ),
        bottom: (
          <Voltra.VStack spacing={8} style={{ paddingLeft: 6, paddingRight: 6, paddingBottom: 12 } as any}>
            <Voltra.HStack>
              <Voltra.VStack spacing={4} alignment="leading">
                <Voltra.HStack spacing={4}>
                  <Voltra.Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 20,
                      fontWeight: '700',
                      letterSpacing: -1,
                    } as any}
                  >
                    EWR
                  </Voltra.Text>
                  <Voltra.Text
                    style={{
                      color: '#34D399',
                      fontSize: 14,
                      fontWeight: '600',
                    } as any}
                  >
                    8:45 PM
                  </Voltra.Text>
                </Voltra.HStack>
                <Voltra.HStack spacing={4}>
                  <Voltra.Text
                    style={{
                      color: '#94A3B8',
                      fontSize: 12,
                      fontWeight: '500',
                    } as any}
                  >
                    TC
                  </Voltra.Text>
                  <Voltra.Text
                    style={{
                      color: '#34D399',
                      fontSize: 12,
                      fontWeight: '500',
                    } as any}
                  >
                    On Time
                  </Voltra.Text>
                </Voltra.HStack>
              </Voltra.VStack>

              <Voltra.Spacer />

              <Voltra.HStack spacing={4}>
                <Voltra.Symbol name="circle.fill" tintColor="#94A3B8" size={3} />
                <Voltra.Symbol name="circle.fill" tintColor="#94A3B8" size={3} />
                <Voltra.Symbol name="airplane" tintColor="#94A3B8" size={16} />
                <Voltra.Symbol name="circle.fill" tintColor="#94A3B8" size={3} />
                <Voltra.Symbol name="circle.fill" tintColor="#94A3B8" size={3} />
              </Voltra.HStack>

              <Voltra.Spacer />

              <Voltra.VStack spacing={4} alignment="trailing">
                <Voltra.HStack spacing={4}>
                  <Voltra.Text
                    style={{
                      color: '#F87171',
                      fontSize: 14,
                      fontWeight: '600',
                    } as any}
                  >
                    12:02 AM
                  </Voltra.Text>
                  <Voltra.Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 20,
                      fontWeight: '700',
                      letterSpacing: -1,
                    } as any}
                  >
                    FLL
                  </Voltra.Text>
                </Voltra.HStack>
                <Voltra.Text
                  style={{
                    color: '#F87171',
                    fontSize: 12,
                    fontWeight: '500',
                  } as any}
                >
                  3m late
                </Voltra.Text>
              </Voltra.VStack>
            </Voltra.HStack>

            <Voltra.HStack>
              <Voltra.VStack spacing={2}>
                <Voltra.HStack>
                  <Voltra.Text
                    style={{
                      color: '#94A3B8',
                      fontSize: 13,
                      fontWeight: '500',
                    } as any}
                  >
                    Gate Departure in{' '}
                  </Voltra.Text>
                  <Voltra.Text
                    style={{
                      color: '#34D399',
                      fontSize: 13,
                      fontWeight: '600',
                    } as any}
                  >
                    1h 42m
                  </Voltra.Text>
                </Voltra.HStack>
                <Voltra.Text
                  style={{
                    color: '#64748B',
                    fontSize: 11,
                    fontWeight: '400',
                  } as any}
                >
                  EWR departures avg 24m late
                </Voltra.Text>
              </Voltra.VStack>

              <Voltra.Spacer />

              <Voltra.HStack
                spacing={4}
                style={{
                  backgroundColor: '#FCD34D',
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 6,
                  paddingBottom: 6,
                  borderRadius: 12,
                } as any}
              >
                <Voltra.Symbol name="arrow.up.right" tintColor="#000000" size={14} />
                <Voltra.Text
                  style={{
                    color: '#000000',
                    fontSize: 14,
                    fontWeight: '600',
                  } as any}
                >
                  134
                </Voltra.Text>
              </Voltra.HStack>
            </Voltra.HStack>
          </Voltra.VStack>
        ),
      },
      minimal: <Voltra.Symbol name="airplane" tintColor="#FFFFFF" size={14} />,
    },
  });
}

// ─── Deep Links Live Activity ──────────────────────────────────

export function makeDeepLinksPayload(): string {
  return renderLiveActivityToString({
    lockScreen: (
      <Voltra.HStack id="deep-links-live-activity" spacing={8} style={{ padding: 16 } as any} alignment="top">
        <Voltra.VStack spacing={10} style={{ flex: 1 } as any}>
          {/* Link with absolute URL */}
          <Voltra.Link destination="myapp://orders/123">
            <Voltra.HStack
              spacing={8}
              style={{
                padding: 12,
                backgroundColor: '#1E293B',
                borderRadius: 10,
              } as any}
            >
              <Voltra.Symbol name="bag.fill" tintColor="#F59E0B" size={20} />
              <Voltra.VStack spacing={2} alignment="leading">
                <Voltra.Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' } as any}>Order #123</Voltra.Text>
                <Voltra.Text style={{ color: '#94A3B8', fontSize: 11 } as any}>Tap to view details</Voltra.Text>
              </Voltra.VStack>
              <Voltra.Spacer />
              <Voltra.Symbol name="chevron.right" tintColor="#64748B" size={14} />
            </Voltra.HStack>
          </Voltra.Link>

          {/* Link with relative path */}
          <Voltra.Link destination="/settings">
            <Voltra.HStack
              spacing={8}
              style={{
                padding: 12,
                backgroundColor: '#1E293B',
                borderRadius: 10,
              } as any}
            >
              <Voltra.Symbol name="gearshape.fill" tintColor="#8B5CF6" size={20} />
              <Voltra.VStack spacing={2} alignment="leading">
                <Voltra.Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' } as any}>Settings</Voltra.Text>
                <Voltra.Text style={{ color: '#94A3B8', fontSize: 11 } as any}>Manage preferences</Voltra.Text>
              </Voltra.VStack>
              <Voltra.Spacer />
              <Voltra.Symbol name="chevron.right" tintColor="#64748B" size={14} />
            </Voltra.HStack>
          </Voltra.Link>
        </Voltra.VStack>
      </Voltra.HStack>
    ),
    island: {
      keylineTint: '#3B82F6',
    },
  });
}

// ─── Liquid Glass Live Activity ────────────────────────────────

export function makeLiquidGlassPayload(): string {
  return renderLiveActivityToString({
    island: {
      compact: {
        leading: <Voltra.Symbol name="heart.fill" tintColor="#FF0000" size={28} />,
        trailing: <Voltra.Symbol name="heart.fill" tintColor="#FFFF00" size={28} />,
      },
      expanded: {
        center: (
          <Voltra.HStack alignment="center" spacing={12}>
            <Voltra.Text style={{ color: '#F8FAFC', fontSize: 24, fontWeight: '700', letterSpacing: -0.5 } as any}>
              Voltra
            </Voltra.Text>
            <Voltra.Symbol name="heart.fill" tintColor="#FF0000" size={32} />
            <Voltra.Text style={{ color: '#F8FAFC', fontSize: 24, fontWeight: '700', letterSpacing: -0.5 } as any}>
              liquid glass
            </Voltra.Text>
          </Voltra.HStack>
        ),
      },
    },
    lockScreen: {
      content: (
        <Voltra.GlassContainer spacing={10}>
          <Voltra.VStack style={{ padding: 20, borderRadius: 24, glassEffect: true } as any}>
            <Voltra.HStack alignment="center" spacing={12}>
              <Voltra.Text style={{ color: '#F8FAFC', fontSize: 24, fontWeight: '700', letterSpacing: -0.5 } as any}>
                Voltra
              </Voltra.Text>
              <Voltra.Symbol name="heart.fill" tintColor="#FF0000" size={32} />
              <Voltra.Text style={{ color: '#F8FAFC', fontSize: 24, fontWeight: '700', letterSpacing: -0.5 } as any}>
                liquid glass
              </Voltra.Text>
            </Voltra.HStack>
          </Voltra.VStack>
        </Voltra.GlassContainer>
      ),
      activityBackgroundTint: 'clear',
    },
  });
}

// ─── Supplemental Families Live Activity ───────────────────────

export function makeSupplementalPayload(): string {
  return renderLiveActivityToString({
    lockScreen: (
      <Voltra.VStack id="supplemental-families-lock-screen" spacing={12} style={{ padding: 16 } as any}>
        <Voltra.Text
          style={{
            color: '#F0F9FF',
            fontSize: 24,
            fontWeight: '700',
          } as any}
        >
          Lock Screen
        </Voltra.Text>
      </Voltra.VStack>
    ),
    supplementalActivityFamilies: {
      small: (
        <Voltra.VStack id="supplemental-families-small" spacing={4} alignment="center" style={{ padding: 8 } as any}>
          <Voltra.Text style={{ color: '#3B82F6', fontSize: 16, fontWeight: '700' } as any}>Watch</Voltra.Text>
          <Voltra.Text style={{ color: '#94A3B8', fontSize: 11 } as any}>watchOS / CarPlay</Voltra.Text>
        </Voltra.VStack>
      ),
    },
    island: {
      keylineTint: '#10B981',
      compact: {
        leading: (
          <Voltra.VStack id="supplemental-families-compact-leading" alignment="center" style={{ padding: 6 } as any}>
            <Voltra.Text style={{ color: '#10B981', fontSize: 14, fontWeight: '700' } as any}>L</Voltra.Text>
          </Voltra.VStack>
        ),
        trailing: (
          <Voltra.VStack id="supplemental-families-compact-trailing" alignment="center" style={{ padding: 6 } as any}>
            <Voltra.Text style={{ color: '#10B981', fontSize: 14, fontWeight: '700' } as any}>R</Voltra.Text>
          </Voltra.VStack>
        ),
      },
      minimal: (
        <Voltra.VStack id="supplemental-families-minimal" alignment="center" style={{ padding: 6 } as any}>
          <Voltra.Symbol name="checkmark.circle.fill" tintColor="#10B981" />
        </Voltra.VStack>
      ),
    },
  });
}
