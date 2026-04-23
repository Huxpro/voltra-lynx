import { type ReactNode } from '@lynx-js/react';
import type { WidgetFamily } from '@use-voltra/ios';
import { VoltraPreview } from './VoltraPreview';

const WIDGET_DIMENSIONS: Record<WidgetFamily, { width: number; height: number }> = {
  systemSmall: { width: 170, height: 170 },
  systemMedium: { width: 364, height: 170 },
  systemLarge: { width: 364, height: 382 },
  systemExtraLarge: { width: 364, height: 768 },
  accessoryCircular: { width: 76, height: 76 },
  accessoryRectangular: { width: 172, height: 76 },
  accessoryInline: { width: 172, height: 40 },
};

type VoltraWidgetPreviewProps = {
  /** Widget family to preview */
  family: WidgetFamily;
  /** Voltra JSX children to render */
  children: ReactNode;
  /** Optional view identifier */
  id?: string;
  /** Optional CSS class */
  className?: string;
};

/**
 * Renders Voltra JSX at exact widget family dimensions.
 * Lynx equivalent of the RN VoltraWidgetPreview component.
 */
export function VoltraWidgetPreview({ family, children, id, className }: VoltraWidgetPreviewProps) {
  const dimensions = WIDGET_DIMENSIONS[family];
  return (
    <VoltraPreview id={id} height={dimensions.height} className={className}>
      {children}
    </VoltraPreview>
  );
}
