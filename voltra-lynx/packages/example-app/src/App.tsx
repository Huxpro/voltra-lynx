// Verify Layer 0 packages import correctly in Lynx/Rspeedy context
import { renderVoltraVariantToJson } from '@use-voltra/ios';
import { renderAndroidWidgetToJson } from '@use-voltra/android';

// Re-export to prove the imports resolve and are usable
export { renderVoltraVariantToJson, renderAndroidWidgetToJson };

export function App() {
  return (
    <view>
      <text>Voltra Lynx Demo</text>
      <text>Layer 0 imports verified</text>
    </view>
  );
}
