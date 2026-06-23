import { defineConfig } from '@lynx-js/rspeedy';
import { pluginVueLynx } from 'vue-lynx/plugin';

// Vue Lynx host config. Mirrors the official `create-vue-lynx` scaffold
// (https://vue.lynxjs.org/guide/quick-start) but pins the dev-server port so
// the iOS host's hardcoded bundle URL (`http://localhost:3000/main.lynx.bundle`
// in ViewController.swift) keeps resolving — exactly like the React example app.
export default defineConfig({
  environments: {
    lynx: {},
    web: {},
  },
  plugins: [
    // `optionsApi: false` keeps the Composition API only (smaller runtime).
    // The CSS flags match the scaffold defaults so Lynx CSS behaves as documented.
    pluginVueLynx({
      optionsApi: false,
      enableCSSInlineVariables: true,
      enableCSSInheritance: true,
    }),
  ],
  server: {
    port: 3000,
    strictPort: true,
  },
});
