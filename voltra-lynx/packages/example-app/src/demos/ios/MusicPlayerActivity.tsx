import { useState, useCallback } from '@lynx-js/react';
import { makeMusicPlayerPayload, SONGS, type Song } from '../../voltra-payload';

declare const NativeModules: {
  VoltraModule: {
    startLiveActivity: (json: string, options: any, callback: (id: any) => void) => void;
    updateLiveActivity: (id: string, json: string, options: any, callback: (r: any) => void) => void;
    endLiveActivity: (id: string, options: any, callback: (r: any) => void) => void;
  };
};

export function MusicPlayerActivity() {
  const [activityId, setActivityId] = useState<string | null>(null);
  const [songIndex, setSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState('Not started');

  const isActive = activityId !== null;
  const currentSong = SONGS[songIndex];

  const startOrUpdate = useCallback((song: Song, playing: boolean, existingId?: string) => {
    'background only';
    const payload = makeMusicPlayerPayload(song, playing);
    if (existingId) {
      NativeModules.VoltraModule.updateLiveActivity(existingId, payload, {}, () => {
        setStatus(`Playing: ${song.title}`);
      });
    } else {
      NativeModules.VoltraModule.startLiveActivity(payload, { activityName: 'music-player' }, (id: any) => {
        const result = String(id);
        if (result.startsWith('ERROR:')) {
          setStatus('Error: ' + result.substring(6));
        } else {
          setActivityId(result);
          setStatus(`Playing: ${song.title}`);
        }
      });
    }
  }, []);

  const start = useCallback(() => {
    'background only';
    startOrUpdate(SONGS[songIndex], true);
    setIsPlaying(true);
  }, [songIndex, startOrUpdate]);

  const prev = useCallback(() => {
    'background only';
    const newIndex = songIndex === 0 ? SONGS.length - 1 : songIndex - 1;
    setSongIndex(newIndex);
    if (activityId) startOrUpdate(SONGS[newIndex], isPlaying, activityId);
  }, [songIndex, activityId, isPlaying, startOrUpdate]);

  const next = useCallback(() => {
    'background only';
    const newIndex = songIndex === SONGS.length - 1 ? 0 : songIndex + 1;
    setSongIndex(newIndex);
    if (activityId) startOrUpdate(SONGS[newIndex], isPlaying, activityId);
  }, [songIndex, activityId, isPlaying, startOrUpdate]);

  const togglePlay = useCallback(() => {
    'background only';
    const newPlaying = !isPlaying;
    setIsPlaying(newPlaying);
    if (activityId) startOrUpdate(SONGS[songIndex], newPlaying, activityId);
  }, [isPlaying, songIndex, activityId, startOrUpdate]);

  const stop = useCallback(() => {
    'background only';
    if (!activityId) return;
    NativeModules.VoltraModule.endLiveActivity(activityId, { dismissalPolicy: { type: 'immediate' } }, () => {
      setActivityId(null);
      setIsPlaying(false);
      setStatus('Stopped');
    });
  }, [activityId]);

  return (
    <view style={{ padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Music Player
      </text>

      {/* Now Playing Card */}
      <view style={{
        backgroundColor: '#0F172A',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
      }}>
        <text style={{ color: '#F0F9FF', fontSize: 22, fontWeight: 'bold' }}>
          {currentSong.title}
        </text>
        <text style={{ color: '#94A3B8', fontSize: 15, marginTop: 4 }}>
          {currentSong.artist}
        </text>

        {/* Controls */}
        <view style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <view bindtap={prev} style={{ padding: 12 }}>
            <text style={{ color: '#F0F9FF', fontSize: 24 }}>⏮</text>
          </view>
          <view bindtap={isActive ? togglePlay : start} style={{
            backgroundColor: '#3B82F6',
            width: 56, height: 56, borderRadius: 28,
            alignItems: 'center', justifyContent: 'center',
            marginLeft: 24, marginRight: 24,
          }}>
            <text style={{ color: '#fff', fontSize: 24 }}>{isPlaying ? '⏸' : '▶️'}</text>
          </view>
          <view bindtap={next} style={{ padding: 12 }}>
            <text style={{ color: '#F0F9FF', fontSize: 24 }}>⏭</text>
          </view>
        </view>
      </view>

      {/* Stop Button */}
      {isActive ? (
        <view bindtap={stop} style={{
          backgroundColor: '#EF4444',
          padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 12,
        }}>
          <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Stop Activity</text>
        </view>
      ) : null}

      {/* Song List */}
      <text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, marginTop: 8 }}>Queue</text>
      {SONGS.map((song, i) => (
        <view key={song.title} style={{
          display: 'flex', flexDirection: 'row', alignItems: 'center',
          padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
          backgroundColor: i === songIndex ? '#EFF6FF' : '#fff',
        }}>
          <text style={{ fontSize: 14, color: i === songIndex ? '#3B82F6' : '#333' }}>
            {i === songIndex ? '► ' : '  '}{song.title}
          </text>
          <text style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>{song.artist}</text>
        </view>
      ))}

      <text style={{ marginTop: 12, color: '#666', fontSize: 13 }}>
        Status: {status}
      </text>
    </view>
  );
}
