import { useState, useCallback } from '@lynx-js/react';

// Lynx NativeModules global
declare const NativeModules: {
  VoltraModule: {
    preloadImages: (images: string, callback: (result: any) => void) => void;
    clearPreloadedImages: (keys: string, callback: (result: any) => void) => void;
  };
};

function generateRandomKey(): string {
  return `asset-${Math.random().toString(36).substring(2, 15)}`;
}

// Predefined picsum URLs (since Lynx has no TextInput)
const PICSUM_IDS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 119];

interface PreloadEntry {
  key: string;
  url: string;
  status: 'idle' | 'loading' | 'loaded' | 'error';
}

export function ImagePreloadingScreen() {
  const [entries, setEntries] = useState<PreloadEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready');
  const [nextPicsumIndex, setNextPicsumIndex] = useState(0);

  const addRandomImage = useCallback(() => {
    const id = PICSUM_IDS[nextPicsumIndex % PICSUM_IDS.length];
    setNextPicsumIndex((prev) => prev + 1);
    const key = generateRandomKey();
    const url = `https://picsum.photos/id/${id}/100/100`;
    setEntries((prev) => [...prev, { key, url, status: 'idle' as const }]);
    setStatusMessage('Image added. Tap "Preload All" to download.');
  }, [nextPicsumIndex]);

  const removeImage = useCallback((removeKey: string) => {
    setEntries((prev) => prev.filter((e) => e.key !== removeKey));
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
          setStatusMessage('Preloaded ' + entries.length + ' images successfully');
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
    idle: '#94A3B8',
    loading: '#FF9500',
    loaded: '#34C759',
    error: '#FF3B30',
  };

  const loadedCount = entries.filter((e) => e.status === 'loaded').length;
  const errorCount = entries.filter((e) => e.status === 'error').length;

  return (
    <view style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 }}>
      {/* Header */}
      <text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF' }}>
        Image Preloading
      </text>
      <text style={{ fontSize: 14, color: '#CBD5F5', lineHeight: '20px', marginBottom: 8 } as any}>
        Test image preloading functionality for Live Activities. Download images
        to App Group storage and verify they appear in Live Activities.
      </text>

      {/* Progress summary card */}
      <view style={{
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        padding: 16,
        marginTop: 16,
        marginBottom: 16,
      } as any}>
        <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 }}>
          Progress
        </text>
        <view style={{ display: 'linear', linearDirection: 'row', justifyContent: 'space-between' } as any}>
          <text style={{ fontSize: 13, color: '#CBD5F5' }}>
            Images: {entries.length}
          </text>
          <text style={{ fontSize: 13, color: '#34C759' }}>
            Loaded: {loadedCount}
          </text>
          <text style={{ fontSize: 13, color: '#FF3B30' }}>
            Errors: {errorCount}
          </text>
        </view>
        {entries.length > 0 && (
          <view style={{
            height: 6,
            backgroundColor: '#334155',
            borderRadius: '3px',
            marginTop: 10,
          } as any}>
            <view style={{
              width: `${entries.length > 0 ? ((loadedCount + errorCount) / entries.length) * 100 : 0}%`,
              height: 6,
              backgroundColor: errorCount > 0 ? '#FF9500' : '#34C759',
              borderRadius: '3px',
            } as any} />
          </view>
        )}
        <text style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>
          Status: {statusMessage}
        </text>
      </view>

      {/* Image list */}
      {entries.map((entry) => (
        <view key={entry.key} style={{
          display: 'linear',
          linearDirection: 'row',
          alignItems: 'center',
          padding: 12,
          backgroundColor: '#1E293B',
          borderRadius: '8px',
          marginBottom: 8,
        } as any}>
          {/* Status dot */}
          <view style={{
            width: 10,
            height: 10,
            borderRadius: '5px',
            backgroundColor: statusColors[entry.status],
            marginRight: 10,
          } as any} />

          {/* Info */}
          <view style={{ linearWeight: 1 } as any}>
            <text style={{ fontSize: 13, fontWeight: '500', color: '#E2E8F0' }}>
              {entry.key}
            </text>
            <text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
              {entry.url}
            </text>
          </view>

          {/* Status label */}
          <text style={{
            fontSize: 11,
            color: statusColors[entry.status],
            fontWeight: '600',
            marginLeft: 8,
          }}>
            {entry.status.toUpperCase()}
          </text>

          {/* Remove button */}
          <view
            bindtap={() => removeImage(entry.key)}
            style={{
              marginLeft: 8,
              paddingLeft: 8,
              paddingRight: 8,
              paddingTop: 4,
              paddingBottom: 4,
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 59, 48, 0.15)',
            } as any}
          >
            <text style={{ fontSize: 12, color: '#FF3B30', fontWeight: '600' }}>X</text>
          </view>
        </view>
      ))}

      {/* Empty state */}
      {entries.length === 0 && (
        <view style={{
          backgroundColor: '#1E293B',
          borderRadius: '12px',
          padding: 24,
          alignItems: 'center',
          marginBottom: 16,
        } as any}>
          <text style={{ fontSize: 14, color: '#64748B' }}>
            No images added yet. Tap "Add Image" below.
          </text>
        </view>
      )}

      {/* Controls */}
      <view style={{ marginTop: 16 }}>
        {/* Add Image button */}
        <view
          bindtap={addRandomImage}
          style={{
            backgroundColor: '#334155',
            padding: 14,
            borderRadius: '10px',
            alignItems: 'center',
            marginBottom: 8,
          } as any}
        >
          <text style={{ color: '#E2E8F0', fontSize: 16, fontWeight: '600' }}>
            Add Image (picsum #{PICSUM_IDS[nextPicsumIndex % PICSUM_IDS.length]})
          </text>
        </view>

        {/* Preload All button */}
        <view
          bindtap={preloadAll}
          style={{
            backgroundColor: isProcessing ? '#555' : '#007AFF',
            padding: 14,
            borderRadius: '10px',
            alignItems: 'center',
            marginBottom: 8,
          } as any}
        >
          <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            {isProcessing ? 'Processing...' : 'Preload All Images'}
          </text>
        </view>

        {/* Clear button */}
        <view
          bindtap={clearAll}
          style={{
            backgroundColor: entries.length > 0 ? '#FF3B30' : '#555',
            padding: 14,
            borderRadius: '10px',
            alignItems: 'center',
          } as any}
        >
          <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Clear Preloaded Images
          </text>
        </view>
      </view>

      {/* How it works */}
      <view style={{
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        padding: 16,
        marginTop: 16,
      } as any}>
        <text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 }}>
          How It Works
        </text>
        <text style={{ fontSize: 13, color: '#94A3B8', lineHeight: '20px' } as any}>
          1. Add images using the button above{'\n'}
          2. Tap "Preload All" to download to App Group{'\n'}
          3. Each image shows its status (idle/loading/loaded/error){'\n'}
          4. Use "Clear" to remove downloaded images{'\n'}
          5. Preloaded images can be referenced in Live Activities
        </text>
      </view>
    </view>
  );
}
