// Ambient declarations for Lynx runtime
declare const __DEV__: boolean;

declare const console: {
  log(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  info(...args: any[]): void;
  debug(...args: any[]): void;
};

declare const global: Record<string, any>;
