<div align="center">

# Voltra · ported to Lynx

**A [LynxJS](https://lynxjs.org/) port of [Voltra](https://www.use-voltra.dev/).**
This repo and its docs extend upstream rather than replace it.

[![docs](https://img.shields.io/badge/this%20site-huxpro.github.io%2Fvoltra--lynx-6366f1?style=for-the-badge)](https://huxpro.github.io/voltra-lynx/)
[![upstream](https://img.shields.io/badge/upstream%20docs-use--voltra.dev-blue?style=for-the-badge)](https://www.use-voltra.dev/)
[![license](https://img.shields.io/npm/l/voltra?style=for-the-badge)](./LICENSE.txt)

</div>

---

## What this fork is

A port of [Voltra](https://www.use-voltra.dev/), the React JSX library for
native iOS Live Activities, Dynamic Island, and Android Widgets, targeting
**[LynxJS](https://lynxjs.org/)**.

**The component API, hook signatures, payload format, native render behavior,
and all platform development guides are the same as upstream.** The official
documentation at **[use-voltra.dev](https://www.use-voltra.dev/)** applies
unchanged. This repo only documents what's *additional* to the port: a small
bridge layer, a list of Lynx CSS gotchas, and reference iOS/Android host apps
for embedding the Lynx SDK.

The fundamental observation that made the port cheap: Live Activities and
Widgets render in out-of-process OS extensions that only accept SwiftUI /
Compose Glance. The JS framework's job is to produce a JSON payload, then
native code turns that payload into pixels. **The rendering engine doesn't
care which JS runtime fed it the JSON.** So almost everything came across
unchanged.

| Layer | Original (React Native + Expo) | This fork (LynxJS) |
|---|---|---|
| Layer 0, pure JS packages | shipped on npm | **100% reused via npm** |
| Layer 1, client business logic (hooks, API) | written for Expo modules | **~95% vendored verbatim** |
| Layer 2, bridge adapter | `requireNativeModule` / Promise | **662 LoC new**, wraps Lynx's callback-based NativeModules into Promises |
| Layer 3, native module registration | Expo `Module` DSL | **788 LoC new**: `LynxModule` protocol (Swift) + `@LynxMethod` (Kotlin) |
| Layer 4, SwiftUI / Glance rendering | upstream Voltra | **byte-identical** |

Net new code in the port: **1,440 LoC** to bring **32,500 LoC** of native
UI library to a different host runtime. **95.6%** reuse.

## Repo layout

```
.
├── voltra-lynx/             ← THE PORT: bridge adapter, ios + android hosts,
│   │                          example app, host READMEs
│   ├── packages/
│   │   ├── lynx/            ← @use-voltra/lynx (bridge + client APIs)
│   │   └── example-app/     ← Rspeedy + ReactLynx demo app
│   └── host/
│       ├── ios/             ← LynxVoltra Xcode project
│       └── android/         ← VoltraLynx Gradle project
│
├── website/                 ← rspress site → GitHub Pages
├── LYNX_PORT.md             ← architecture, layer model, translation rules
├── packages/                ← upstream Voltra (RN/Expo) sources, kept for
│                              reference and as the Layer 0 upstream
├── example/                 ← upstream Voltra example (React Native + Expo)
└── tasks/                   ← PRDs that drove the port (61+ user stories)
```

## Where to read what

| Topic | Read |
|---|---|
| Voltra component reference (`<Voltra.VStack>`, `Symbol`, `Chart`, …) | **[use-voltra.dev](https://www.use-voltra.dev/)** ← canonical |
| Live Activity / Widget / push-update concepts | **[use-voltra.dev](https://www.use-voltra.dev/)** ← canonical |
| Original React Native + Expo setup | **[use-voltra.dev](https://www.use-voltra.dev/)** ← canonical |
| The **port architecture** (5-layer model, code reuse breakdown) | [`LYNX_PORT.md`](./LYNX_PORT.md) and [docs site](https://huxpro.github.io/voltra-lynx/lynx/architecture) |
| **Lynx CSS gotchas** (the silent-failure traps unique to the port) | [docs site](https://huxpro.github.io/voltra-lynx/lynx/css-gotchas) |
| Use Voltra in **LynxJS** (install, package layout) | [`voltra-lynx/README.md`](./voltra-lynx/README.md) |
| Build the **iOS** demo on simulator or physical iPhone | [`voltra-lynx/host/ios/README.md`](./voltra-lynx/host/ios/README.md) |
| Build the **Android** demo | [`voltra-lynx/host/android/README.md`](./voltra-lynx/host/android/README.md) |

## Quick example (Lynx)

```tsx
import { useLiveActivity } from '@use-voltra/lynx/ios-client'
import { Voltra } from '@use-voltra/ios'

export function OrderTracker({ orderId }: { orderId: string }) {
  const ui = (
    <Voltra.VStack style={{ padding: 16, borderRadius: '14px', backgroundColor: '#111827' }}>
      <Voltra.Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>
        Order #{orderId}
      </Voltra.Text>
      <Voltra.Text style={{ color: '#9CA3AF', marginTop: 6 }}>
        Driver en route · ETA 12 min
      </Voltra.Text>
    </Voltra.VStack>
  )

  const { start, update, end } = useLiveActivity(
    { lockScreen: ui },
    {
      activityName: `order-${orderId}`,
      autoStart: true,
      deepLinkUrl: `/orders/${orderId}`,
    }
  )

  return null
}
```

The only Lynx-specific things in this snippet are the `from
'@use-voltra/lynx/ios-client'` import and `borderRadius: '14px'` instead of
`14`. The Voltra JSX components, the hook API, and the JSON payload format
are identical to the original.

## Status

- ✅ iOS host app: Live Activities, Dynamic Island, Home Screen widgets,
  in-app `<voltra-preview>` Custom Elements
- ✅ Android host app: Glance widgets, ongoing notifications, live updates
- ✅ End-to-end verified on iOS Simulator AND physical iPhone (Release build,
  embedded JS bundle, no dev server needed)
- ✅ 95.6% code reuse measured against upstream
- 🚧 Turnkey dev-experience layer planned at
  [Huxpro/lynx-dev-clients-voltra](https://github.com/Huxpro/lynx-dev-clients-voltra):
  bringing the RN/Expo `RCTBundleURLProvider` + `react-native-xcode.sh` +
  dev-menu experience to any Lynx integration

## Credits

- Original Voltra: [Saúl Sharma](https://github.com/saulsharma) and
  [Szymon Chmal](https://github.com/szymonchmal) at
  [Callstack](https://callstack.com/) (MIT)
- Lynx port: [@Huxpro](https://github.com/Huxpro)

## License

MIT, same as upstream.
