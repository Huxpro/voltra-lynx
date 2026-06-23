# @voltra-lynx/vue-example-app · Voltra on **Vue** Lynx

A second host for the same Voltra Lynx port — this one built with
[**Vue Lynx**](https://vue.lynxjs.org/) instead of ReactLynx. It proves the
central claim of this repo: **the UI framework is interchangeable.** Live
Activities and Widgets are produced as a JSON payload that native code turns
into SwiftUI / Compose Glance, so whichever JS runtime drives the screen
(`@lynx-js/react` or `vue-lynx`) feeds the *same* pipeline.

## How it works

```
 Vue 3 host (this app)            React payload builders         Voltra bridge
┌────────────────────┐          ┌──────────────────────┐       ┌──────────────┐
│ App.vue            │  @tap →   │ voltra-payloads.ts   │  →    │ @use-voltra/ │
│ <view> <text> …    │ ───────►  │ createElement(Voltra)│       │ lynx/        │
│ vue-lynx reactivity│           │ (no JSX, no Vue)     │       │ ios-client   │
└────────────────────┘          └──────────────────────┘       └──────┬───────┘
                                                                       │ JSON payload
                                                                       ▼
                                                            NativeModules.VoltraModule
                                                            (SwiftUI Live Activity)
```

- **`src/App.vue`** — the Vue host UI (Composition API, `<view>`/`<text>`,
  `@tap`). Calls `startLiveActivity` / `stopLiveActivity` from the Voltra
  client.
- **`src/voltra-payloads.ts`** — builds Voltra Live Activity variants with
  React's `createElement` **directly**. No JSX and no Vue: Voltra's components
  are plain element factories and `renderLiveActivityToString()` (inside
  `@use-voltra/lynx/ios-client`) serializes the tree to JSON. That step is pure
  JS, so it emits the byte-for-byte same payload the React example app does.
- **`src/index.ts`** — `createApp(App).mount()` (Vue Lynx mounts to the page
  root, no DOM selector).

The only host-framework-specific surface is `App.vue` + the entry point. The
bridge (`@use-voltra/lynx`) and Layer 0 packages (`@use-voltra/core`, `/ios`)
are reused unchanged — exactly as with the React host.

## Setup, per [vue.lynxjs.org](https://vue.lynxjs.org/guide/quick-start)

- `vue-lynx` + `vue` (3.5) provide the runtime; `createApp` comes from
  `vue-lynx`, not `vue`.
- `lynx.config.ts` registers `pluginVueLynx` from `vue-lynx/plugin` (peer deps
  `@rsbuild/core`, `@rsbuild/plugin-vue`).
- `tsconfig` uses project references with `types: ["vue-lynx/types"]` and the
  `vue-lynx/types/volar-plugin` Volar plugin, mirroring the official
  `create-vue-lynx` scaffold.

## Run it

```bash
# from the voltra-lynx/ monorepo root
pnpm install
pnpm --filter @use-voltra/lynx build      # build the bridge package once

cd packages/vue-example-app
pnpm dev                                   # dev server on :3000
# or
pnpm build                                 # → dist/main.lynx.bundle
```

The dev server is pinned to port **3000** so the existing iOS host
(`host/ios`, which fetches `http://localhost:3000/main.lynx.bundle`) loads this
Vue bundle with no changes — swap which example app's `pnpm dev` is running to
switch the host between the React and Vue demos.

> On non-Apple targets (e.g. the `web` environment / Lynx Explorer on Android)
> the native bridge is absent; `startLiveActivity` builds the payload and
> returns `''`, so the UI stays interactive and the wiring is observable
> without a crash.
