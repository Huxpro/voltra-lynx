// Type declarations for the <voltra-preview> Lynx Custom Element
declare namespace JSX {
  interface IntrinsicElements {
    'voltra-preview': {
      payload?: string;
      'view-id'?: string;
      className?: string;
      style?: import('@lynx-js/react').CSSProperties;
    };
  }
}
