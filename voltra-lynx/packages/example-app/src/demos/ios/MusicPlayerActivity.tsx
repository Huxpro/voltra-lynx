import { useState } from '@lynx-js/react';

const mockUseLiveActivity = () => {
  const [isActive, setIsActive] = useState(false);
  return {
    isActive,
    start: async () => { setIsActive(true); },
    update: async () => {},
    end: async () => { setIsActive(false); },
  };
};

const mockSongs = [
  { title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration: '5:55' },
  { title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', duration: '6:30' },
  { title: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', duration: '8:02' },
];

export function MusicPlayerActivity() {
  const { isActive, start, end } = mockUseLiveActivity();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const song = mockSongs[currentIndex];

  const prev = () => {
    setCurrentIndex((currentIndex - 1 + mockSongs.length) % mockSongs.length);
  };

  const next = () => {
    setCurrentIndex((currentIndex + 1) % mockSongs.length);
  };

  const togglePlay = () => {
    if (!isActive) {
      start();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <view style={{ flex: 1, padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Music Player Activity
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Live Activity showing now-playing info with playback controls.
      </text>

      {/* Album art mock */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        alignItems: 'center',
      }}>
        {/* Album art placeholder */}
        <view style={{
          width: 180,
          height: 180,
          backgroundColor: '#333',
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}>
          <text style={{ fontSize: 48 }}>♫</text>
        </view>

        {/* Song info */}
        <text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
          {song.title}
        </text>
        <text style={{ color: '#aaa', fontSize: 14, marginBottom: 4 }}>
          {song.artist}
        </text>
        <text style={{ color: '#666', fontSize: 12, marginBottom: 16 }}>
          {song.album} - {song.duration}
        </text>

        {/* Progress bar mock */}
        <view style={{
          width: '100%',
          height: 4,
          backgroundColor: '#444',
          borderRadius: 2,
          marginBottom: 16,
        }}>
          <view style={{
            width: '35%',
            height: 4,
            backgroundColor: '#1DB954',
            borderRadius: 2,
          }} />
        </view>

        {/* Controls */}
        <view style={{ flexDirection: 'row', alignItems: 'center', gap: 32 }}>
          <view bindtap={prev} style={{ padding: 8 }}>
            <text style={{ color: '#fff', fontSize: 24 }}>⏮</text>
          </view>
          <view bindtap={togglePlay} style={{
            width: 56,
            height: 56,
            backgroundColor: '#1DB954',
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <text style={{ color: '#fff', fontSize: 24 }}>
              {isPlaying ? '⏸' : '▶'}
            </text>
          </view>
          <view bindtap={next} style={{ padding: 8 }}>
            <text style={{ color: '#fff', fontSize: 24 }}>⏭</text>
          </view>
        </view>
      </view>

      {/* Status */}
      <text style={{ color: '#666', fontSize: 13 }}>
        Activity: {isActive ? 'Active' : 'Inactive'} | {isPlaying ? 'Playing' : 'Paused'}
      </text>

      {/* Stop button */}
      <view
        bindtap={() => { setIsPlaying(false); end(); }}
        style={{
          backgroundColor: '#FF3B30',
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
          marginTop: 16,
        }}
      >
        <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
          End Activity
        </text>
      </view>
    </view>
  );
}
