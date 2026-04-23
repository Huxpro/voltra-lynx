import { type ReactNode, useMemo } from '@lynx-js/react';
import { renderVoltraVariantToJson } from '@use-voltra/ios';

type VoltraPreviewProps = {
  /** Voltra JSX children to render as SwiftUI */
  children: ReactNode;
  /** Optional view identifier */
  id?: string;
  /** Height in px — required since the custom element has no intrinsic size */
  height?: number;
  /** Optional CSS class */
  className?: string;
};

/**
 * Renders Voltra JSX as real SwiftUI within the Lynx view hierarchy
 * via the <voltra-preview> Custom Element.
 */
export function VoltraPreview({ children, id, height = 80, className }: VoltraPreviewProps) {
  const viewId = useMemo(
    () => id || `voltra-preview-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    [id],
  );

  const json = renderVoltraVariantToJson(children);
  const payload = JSON.stringify(json);

  return (
    <voltra-preview
      payload={payload}
      view-id={viewId}
      className={className}
      style={{ height }}
    />
  );
}
