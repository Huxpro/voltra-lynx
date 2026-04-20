import { useState } from '@lynx-js/react';

interface ComponentInfo {
  name: string;
  category: string;
  description: string;
  available: boolean;
}

const components: ComponentInfo[] = [
  { name: 'view', category: 'Layout', description: 'Basic container element', available: true },
  { name: 'text', category: 'Layout', description: 'Text display element', available: true },
  { name: 'scroll-view', category: 'Layout', description: 'Scrollable container', available: true },
  { name: 'image', category: 'Media', description: 'Image display element', available: true },
  { name: 'list', category: 'Layout', description: 'Optimized list rendering', available: true },
  { name: 'swiper', category: 'Layout', description: 'Swipeable container', available: true },
  { name: 'input', category: 'Form', description: 'Text input field', available: true },
  { name: 'textarea', category: 'Form', description: 'Multi-line text input', available: true },
  { name: 'switch', category: 'Form', description: 'Toggle switch', available: true },
  { name: 'slider', category: 'Form', description: 'Value slider', available: true },
  { name: 'radio', category: 'Form', description: 'Radio button', available: true },
  { name: 'checkbox', category: 'Form', description: 'Checkbox input', available: true },
  { name: 'canvas', category: 'Media', description: 'Drawing canvas', available: false },
  { name: 'video', category: 'Media', description: 'Video player', available: false },
  { name: 'web-view', category: 'Media', description: 'Embedded web content', available: false },
];

const categories = ['All', 'Layout', 'Form', 'Media'];

export function ComponentsCatalogScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = selectedCategory === 'All'
    ? components
    : components.filter((c) => c.category === selectedCategory);

  return (
    <scroll-view style={{ flex: 1 }}>
      <view style={{ padding: 16 }}>
        <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          Components Catalog
        </text>
        <text style={{ color: '#666', marginBottom: 24 }}>
          All available Lynx built-in components and their status.
        </text>

        {/* Category filter */}
        <view style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          {categories.map((cat) => (
            <view
              key={cat}
              bindtap={() => setSelectedCategory(cat)}
              style={{
                paddingLeft: 14, paddingRight: 14,
                paddingTop: 7, paddingBottom: 7,
                backgroundColor: selectedCategory === cat ? '#007AFF' : '#e5e5e5',
                borderRadius: 8,
              }}
            >
              <text style={{
                color: selectedCategory === cat ? '#fff' : '#333',
                fontSize: 13,
                fontWeight: '600',
              }}>
                {cat}
              </text>
            </view>
          ))}
        </view>

        {/* Component list */}
        <view style={{ gap: 8 }}>
          {filtered.map((comp) => (
            <view
              key={comp.name}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                backgroundColor: '#f5f5f5',
                borderRadius: 10,
                borderLeftWidth: 3,
                borderLeftColor: comp.available ? '#34C759' : '#FF3B30',
              }}
            >
              <view style={{ flex: 1 }}>
                <view style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <text style={{ fontSize: 15, fontWeight: '600', fontFamily: 'monospace' }}>
                    {'<'}{comp.name}{'>'}
                  </text>
                  <view style={{
                    backgroundColor: comp.available ? '#34C759' : '#FF3B30',
                    paddingLeft: 6, paddingRight: 6,
                    paddingTop: 2, paddingBottom: 2,
                    borderRadius: 4,
                  }}>
                    <text style={{ color: '#fff', fontSize: 9, fontWeight: '600' }}>
                      {comp.available ? 'AVAILABLE' : 'NOT YET'}
                    </text>
                  </view>
                </view>
                <text style={{ color: '#666', fontSize: 12, marginTop: 2 }}>
                  {comp.description}
                </text>
                <text style={{ color: '#999', fontSize: 11, marginTop: 2 }}>
                  Category: {comp.category}
                </text>
              </view>
            </view>
          ))}
        </view>

        {/* Summary */}
        <view style={{ marginTop: 20, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
          <text style={{ fontSize: 13, color: '#666' }}>
            Total: {components.length} | Available: {components.filter((c) => c.available).length} | Pending: {components.filter((c) => !c.available).length}
          </text>
        </view>
      </view>
    </scroll-view>
  );
}
