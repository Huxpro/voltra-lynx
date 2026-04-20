import { useState, useEffect } from '@lynx-js/react';

interface ImageEntry {
  id: string;
  url: string;
  label: string;
  status: 'idle' | 'loading' | 'loaded' | 'error';
  loadTime?: number;
}

const mockImages: Omit<ImageEntry, 'status'>[] = [
  { id: '1', url: 'https://example.com/photo-1.jpg', label: 'Landscape Photo' },
  { id: '2', url: 'https://example.com/photo-2.jpg', label: 'Portrait Photo' },
  { id: '3', url: 'https://example.com/icon-set.png', label: 'Icon Set' },
  { id: '4', url: 'https://example.com/banner.jpg', label: 'Banner Image' },
  { id: '5', url: 'https://example.com/avatar.png', label: 'User Avatar' },
  { id: '6', url: 'https://invalid-url.test/broken.jpg', label: 'Broken Image (error)' },
];

export function ImagePreloadingScreen() {
  const [images, setImages] = useState<ImageEntry[]>(
    mockImages.map((img) => ({ ...img, status: 'idle' as const }))
  );
  const [isPreloading, setIsPreloading] = useState(false);

  const preloadAll = () => {
    setIsPreloading(true);
    setImages(images.map((img) => ({ ...img, status: 'loading' })));

    // Simulate sequential loading
    images.forEach((img, index) => {
      setTimeout(() => {
        setImages((prev) => prev.map((i) =>
          i.id === img.id
            ? {
                ...i,
                status: i.url.includes('invalid') ? 'error' : 'loaded',
                loadTime: 200 + Math.random() * 800,
              }
            : i
        ));

        if (index === images.length - 1) {
          setIsPreloading(false);
        }
      }, (index + 1) * 500);
    });
  };

  const reset = () => {
    setImages(mockImages.map((img) => ({ ...img, status: 'idle' as const })));
    setIsPreloading(false);
  };

  const statusColors = {
    idle: '#999',
    loading: '#FF9500',
    loaded: '#34C759',
    error: '#FF3B30',
  };

  const loadedCount = images.filter((i) => i.status === 'loaded').length;
  const errorCount = images.filter((i) => i.status === 'error').length;

  return (
    <scroll-view style={{ flex: 1 }}>
      <view style={{ padding: 16 }}>
        <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          Image Preloading
        </text>
        <text style={{ color: '#666', marginBottom: 24 }}>
          Test image preloading with load status tracking.
        </text>

        {/* Progress summary */}
        <view style={{
          backgroundColor: '#f5f5f5',
          borderRadius: 10,
          padding: 14,
          marginBottom: 20,
        }}>
          <view style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <text style={{ fontSize: 13, color: '#666' }}>
              Loaded: {loadedCount}/{images.length}
            </text>
            <text style={{ fontSize: 13, color: '#FF3B30' }}>
              Errors: {errorCount}
            </text>
          </view>
          <view style={{ height: 6, backgroundColor: '#e5e5e5', borderRadius: 3, marginTop: 8 }}>
            <view style={{
              width: `${((loadedCount + errorCount) / images.length) * 100}%`,
              height: 6,
              backgroundColor: errorCount > 0 ? '#FF9500' : '#34C759',
              borderRadius: 3,
            }} />
          </view>
        </view>

        {/* Image list */}
        <view style={{ gap: 10, marginBottom: 20 }}>
          {images.map((img) => (
            <view key={img.id} style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 12,
              backgroundColor: '#fff',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#eee',
              gap: 10,
            }}>
              {/* Status indicator */}
              <view style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: statusColors[img.status],
              }} />

              {/* Image info */}
              <view style={{ flex: 1 }}>
                <text style={{ fontSize: 14, fontWeight: '500' }}>{img.label}</text>
                <text style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{img.url}</text>
              </view>

              {/* Status text */}
              <view>
                <text style={{ fontSize: 11, color: statusColors[img.status], fontWeight: '600' }}>
                  {img.status.toUpperCase()}
                </text>
                {img.loadTime && (
                  <text style={{ fontSize: 10, color: '#999' }}>
                    {img.loadTime.toFixed(0)}ms
                  </text>
                )}
              </view>
            </view>
          ))}
        </view>

        {/* Controls */}
        <view style={{ flexDirection: 'row', gap: 12 }}>
          <view
            bindtap={preloadAll}
            style={{
              flex: 1,
              backgroundColor: isPreloading ? '#ccc' : '#007AFF',
              padding: 14,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              {isPreloading ? 'Loading...' : 'Preload All'}
            </text>
          </view>

          <view
            bindtap={reset}
            style={{
              flex: 1,
              backgroundColor: '#FF3B30',
              padding: 14,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Reset</text>
          </view>
        </view>
      </view>
    </scroll-view>
  );
}
