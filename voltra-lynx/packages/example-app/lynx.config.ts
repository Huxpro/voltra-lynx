import { defineConfig } from '@lynx-js/rspeedy';
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin';

export default defineConfig({
  plugins: [pluginReactLynx()],
  server: {
    // Pin the dev server port so the iOS host's hardcoded bundle URL
    // (`http://localhost:3000/main.lynx.bundle` in ViewController.swift)
    // doesn't silently break when 3000 is taken by something else.
    port: 3000,
    strictPort: true,
  },
});
