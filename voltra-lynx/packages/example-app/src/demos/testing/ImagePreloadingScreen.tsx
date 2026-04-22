import { useState, useCallback } from '@lynx-js/react';

// Lynx NativeModules global
declare const NativeModules: {
  VoltraModule: {
    preloadImages: (images: string, callback: (result: any) => void) => void;
    clearPreloadedImages: (keys: string, callback: (result: any) => void) => void;
    startLiveActivity: (json: string, options: any, callback: (id: any) => void) => void;
    reloadLiveActivities: (callback: (result: any) => void) => void;
  };
};

function generateRandomKey(): string {
  return `asset-${Math.random().toString(36).substring(2, 15)}`;
}

interface PreloadEntry {
  key: string;
  url: string;
  status: 'idle' | 'loading' | 'loaded' | 'error';
}

export function ImagePreloadingScreen() {
  const [entries, setEntries] = useState<PreloadEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready');

  const addRandomImage = useCallback(() => {
    const id = Math.floor(Math.random() * 120);
    const key = generateRandomKey();
    const url = `https://picsum.photos/id/${id}/100/100`;
    setEntries((prev) => [...prev, { key, url, status: 'idle' }]);
  }, []);

  const preloadAll = useCallback(() => {
    'background only';
    if (entries.length === 0) {
      setStatusMessage('No images to preload. Add some first.');
      return;
    }

    setIsProcessing(true);
    setStatusMessage('Preloading...');

    // Mark all as loading
    setEntries((prev) => prev.map((e) => ({ ...e, status: 'loading' as const })));

    const imagesPayload = JSON.stringify(
      entries.map((e) => ({ url: e.url, key: e.key }))
    );

    try {
      NativeModules.VoltraModule.preloadImages(imagesPayload, (result: any) => {
        const resultStr = String(result);
        if (resultStr.startsWith('ERROR:')) {
          setStatusMessage('Error: ' + resultStr.substring(6));
          setEntries((prev) => prev.map((e) => ({ ...e, status: 'error' as const })));
        } else {
          setStatusMessage('Preloaded ' + entries.length + ' images');
          setEntries((prev) => prev.map((e) => ({ ...e, status: 'loaded' as const })));
        }
        setIsProcessing(false);
      });
    } catch (e: any) {
      setStatusMessage('Catch: ' + (e?.message || String(e)));
      setEntries((prev) => prev.map((e) => ({ ...e, status: 'error' as const })));
      setIsProcessing(false);
    }
  }, [entries]);

  const clearAll = useCallback(() => {
    'background only';
    if (entries.length === 0) {
      setStatusMessage('Nothing to clear.');
      return;
    }

    const keys = JSON.stringify(entries.map((e) => e.key));
    try {
      NativeModules.VoltraModule.clearPreloadedImages(keys, (result: any) => {
        const resultStr = String(result);
        if (resultStr.startsWith('ERROR:')) {
          setStatusMessage('Clear error: ' + resultStr.substring(6));
        } else {
          setStatusMessage('Cleared all preloaded images');
          setEntries([]);
        }
      });
    } catch (e: any) {
      setStatusMessage('Catch: ' + (e?.message || String(e)));
    }
  }, [entries]);

  const statusColors: Record<string, string> = {
    idle: '#999',
    loading: '#FF9500',
    loaded: '#34C759',
    error: '#FF3B30',
  };

  const loadedCount = entries.filter((e) => e.status === 'loaded').length;
  const errorCount = entries.filter((e) => e.status === 'error').length;

  return (
    <scroll-view style={{ flex: 1, backgroundColor: '#0B0F1A' } as any} scroll-y>
      <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 } as any}>
        <text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' } as any}>
          Image Preloading
        </text>
        <text style={{ fontSize: 14, color: '#CBD5F5', marginBottom: 8 } as any}>
          Test image preloading functionality for Live Activities. Download images to App Group
          storage and verify they appear in Live Activities.
        </text>

        {/* Progress summary */}
        <view style={{
          backgroundColor: '#1E293B',
          borderRadius: 12,
          padding: 16,
          marginTop: 16,
          marginBottom: 16,
        } as any}>
          <view style={{ flexDirection: 'row', justifyContent: 'space-between' } as any}>
            <text style={{ fontSize: 13, color: '#CBD5F5' } as any}>
              Images: {entries.length} | Loaded: {loadedCount} | Errors: {errorCount}
            </text>
          </view>
          {entries.length > 0 && (
            <view style={{
              height: 6,
              backgroundColor: '#334155',
              borderRadius: 3,
              marginTop: 8,
            } as any}>
              <view style={{
                width: `${entries.length > 0 ? ((loadedCount + errorCount) / entries.length) * 100 : 0}%`,
                height: 6,
                backgroundColor: errorCount > 0 ? '#FF9500' : '#34C759',
                borderRadius: 3,
              } as any} />
            </view>
          )}
          <text style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 } as any}>
            Status: {statusMessage}
          </text>
        </view>

        {/* Image list */}
        {entries.map((entry, index) => (
          <view key={entry.key} style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            backgroundColor: '#1E293B',
            borderRadius: 8,
            marginBottom: 8,
          } as any}>
            {/* Status dot */}
            <view style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: statusColors[entry.status],
              marginRight: 10,
            } as any} />

            {/* Info */}
            <view style={{ flex: 1 } as any}>
              <text style={{ fontSize: 13, fontWeight: '500', color: '#E2E8F0' } as any}>
                {entry.key}
              </text>
              <text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 } as any}>
                {entry.url}
              </text>
            </view>

            {/* Status label */}
            <text style={{
              fontSize: 11,
              color: statusColors[entry.status],
              fontWeight: '600',
            } as any}>
              {entry.status.toUpperCase()}
            </text>
          </view>
        ))}

        {/* Controls */}
        <view style={{ marginTop: 16 } as any}>
          <view
            bindtap={addRandomImage}
            style={{
              backgroundColor: '#334155',
              padding: 14,
              borderRadius: 10,
              alignItems: 'center',
              marginBottom: 8,
            } as any}
          >
            <text style={{ color: '#E2E8F0', fontSize: 16, fontWeight: '600' } as any}>
              Add Random Picsum Image
            </text>
          </view>

          <view
            bindtap={preloadAll}
            style={{
              backgroundColor: isProcessing ? '#555' : '#007AFF',
              padding: 14,
              borderRadius: 10,
              alignItems: 'center',
              marginBottom: 8,
            } as any}
          >
            <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' } as any}>
              {isProcessing ? 'Processing...' : 'Preload All Images'}
            </text>
          </view>

          <view
            bindtap={clearAll}
            style={{
              backgroundColor: '#FF3B30',
              padding: 14,
              borderRadius: 10,
              alignItems: 'center',
            } as any}
          >
            <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' } as any}>
              Clear Preloaded Images
            </text>
          </view>
        </view>
      </view>
    </scroll-view>
  );
}
