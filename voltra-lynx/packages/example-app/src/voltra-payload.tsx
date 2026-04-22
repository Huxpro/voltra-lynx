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
