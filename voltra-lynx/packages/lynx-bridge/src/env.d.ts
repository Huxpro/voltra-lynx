// Ambient declarations for Lynx runtime environment
// Lynx provides console but doesn't use DOM lib

declare const console: {
  log(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  info(...args: any[]): void;
  debug(...args: any[]): void;
};
