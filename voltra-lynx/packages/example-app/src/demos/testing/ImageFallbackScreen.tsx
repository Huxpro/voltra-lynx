import { useState } from '@lynx-js/react';

type ImageStatus = 'loading' | 'loaded' | 'error';

interface ImageItem {
  id: string;
  url: string;
  label: string;
  status: ImageStatus;
  useFallback: boolean;
}

const mockImageItems: ImageItem[] = [
  { id: '1', url: 'https://example.com/valid-image.jpg', label: 'Valid Image', status: 'loaded', useFallback: false },
  { id: '2', url: 'https://broken-link.test/missing.png', label: 'Broken URL', status: 'error', useFallback: true },
  { id: '3', url: 'https://timeout.test/slow.jpg', label: 'Timeout (slow)', status: 'loading', useFallback: false },
  { id: '4', url: '', label: 'Empty URL', status: 'error', useFallback: true },
  { id: '5', url: 'https://example.com/large-file.png', label: 'Large File', status: 'loaded', useFallback: false },
];

export function ImageFallbackScreen() {
  const [images, setImages] = useState(mockImageItems);
  const [retryCount, setRetryCount] = useState(0);

  const simulateRetry = (id: string) => {
    setRetryCount((c) => c + 1);
    setImages(images.map((img) =>
      img.id === id
        ? { ...img, status: 'loading', useFallback: false }
        : img
    ));

    // Simulate retry result after delay
    setTimeout(() => {
      setImages((prev) => prev.map((img) =>
        img.id === id
          ? {
              ...img,
              status: img.url && !img.url.includes('broken') && !img.url.includes('timeout')
                ? 'loaded'
                : 'error',
              useFallback: img.url.includes('broken') || !img.url,
            }
          : img
      ));
    }, 1500);
  };

  const statusColors: Record<ImageStatus, string> = {
    loading: '#FF9500',
    loaded: '#34C759',
    error: '#FF3B30',
  };

  return (
    <scroll-view style={{ flex: 1 }}>
      <view style={{ padding: 16 }}>
        <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          Image Fallback
        </text>
        <text style={{ color: '#666', marginBottom: 24 }}>
          Image loading with fallback and error handling demonstration.
        </text>

        {/* Image cards */}
        <view style={{ gap: 12, marginBottom: 20 }}>
          {images.map((img) => (
            <view key={img.id} style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#eee',
              overflow: 'hidden',
            }}>
              {/* Image area */}
              <view style={{
                height: 80,
                backgroundColor: '#f0f0f0',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {img.status === 'loaded' && !img.useFallback && (
                  <view style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#e8f5e9',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <text style={{ color: '#34C759', fontSize: 24 }}>IMG</text>
                    <text style={{ color: '#34C759', fontSize: 10 }}>Loaded successfully</text>
                  </view>
                )}

                {img.status === 'loading' && (
                  <view style={{ alignItems: 'center' }}>
                    <text style={{ color: '#FF9500', fontSize: 14 }}>Loading...</text>
                    <view style={{ width: 80, height: 3, backgroundColor: '#ddd', borderRadius: 2, marginTop: 6 }}>
                      <view style={{ width: '60%', height: 3, backgroundColor: '#FF9500', borderRadius: 2 }} />
                    </view>
                  </view>
                )}

                {img.status === 'error' && img.useFallback && (
                  <view style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#fff3f3',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <text style={{ color: '#FF3B30', fontSize: 20 }}>!</text>
                    <text style={{ color: '#FF3B30', fontSize: 10 }}>Fallback displayed</text>
                  </view>
                )}
              </view>

              {/* Info */}
              <view style={{ padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <view style={{ flex: 1 }}>
                  <text style={{ fontSize: 14, fontWeight: '500' }}>{img.label}</text>
                  <view style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <view style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: statusColors[img.status],
                    }} />
                    <text style={{ fontSize: 11, color: '#666' }}>
                      {img.status} {img.useFallback ? '(fallback)' : ''}
                    </text>
                  </view>
                </view>

                {img.status === 'error' && (
                  <view
                    bindtap={() => simulateRetry(img.id)}
                    style={{
                      backgroundColor: '#007AFF',
                      paddingLeft: 10, paddingRight: 10,
                      paddingTop: 6, paddingBottom: 6,
                      borderRadius: 6,
                    }}
                  >
                    <text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Retry</text>
                  </view>
                )}
              </view>
            </view>
          ))}
        </view>

        {/* Stats */}
        <view style={{ backgroundColor: '#f5f5f5', borderRadius: 10, padding: 14 }}>
          <text style={{ fontSize: 13, color: '#666' }}>
            Loaded: {images.filter((i) => i.status === 'loaded').length} |
            Errors: {images.filter((i) => i.status === 'error').length} |
            Retries: {retryCount}
          </text>
        </view>
      </view>
    </scroll-view>
  );
}
