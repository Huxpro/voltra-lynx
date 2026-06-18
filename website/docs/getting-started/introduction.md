# Introduction

**Voltra for Lynx** brings native iOS Live Activities, Dynamic Island layouts,
and Android Home Screen widgets to [LynxJS](https://lynxjs.org/) — using the
same React JSX API as the original [Voltra](https://github.com/callstackincubator/voltra)
React Native library.

This is a port. The original Voltra runs on React Native + Expo; this fork
runs on Lynx + Rspeedy. Crucially, **the rendering pipeline is unchanged**.
Your JSX serializes into a JSON payload, the payload crosses the bridge into
native code, native code constructs SwiftUI / Compose Glance views. Lynx just
substitutes for React Native at the front of that pipeline.

## Why a Lynx fork?

Live Activities, Dynamic Island, and Widgets render in out-of-process OS
extensions that only accept SwiftUI / Compose Glance. They cannot be backed
by WebView, React Native bridge, or a Lynx runtime directly. So the JS
framework's only job is to produce a JSON payload — and that means the
choice of JS framework only matters at the bridge layer, not the rendering
layer.

The result is that ~96% of upstream Voltra came across to Lynx unchanged.
The full breakdown:

| Layer | What | Original | Lynx port | Reuse |
|---|---|---|---|---|
| L0 | Pure JS — `@use-voltra/core`, `ios`, `android`, `server` | shipped on npm | reused via npm | 100% |
| L1 | Client business logic — hooks, widget-api, live-activity-api | written for Expo modules | vendored verbatim | ~95% |
| L2 | Bridge adapter | `requireNativeModule` / Promise | **662 LoC new** | NEW |
| L3 | Native module registration | Expo `Module` DSL | **788 LoC new** | rewrite |
| L4 | SwiftUI / Glance rendering | upstream Voltra | byte-identical | 100% |

See [Lynx Port Architecture](/lynx/architecture) for the full layer model
and translation tables.

## What it looks like

The same JSX you'd write in upstream Voltra works in Lynx. The only
differences are the import path and a handful of Lynx CSS conventions
(strings instead of bare numbers for `borderRadius`, etc.).

```tsx
import { useLiveActivity } from '@use-voltra/lynx/ios-client'
import { Voltra } from '@use-voltra/ios'

export function OrderTracker({ orderId }: { orderId: string }) {
  const ui = (
    <Voltra.VStack style={{ padding: 16, borderRadius: '14px', backgroundColor: '#111827' }}>
      <Voltra.Symbol name="car.fill" type="hierarchical" scale="large" tintColor="#38BDF8" />
      <Voltra.Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>
        Order #{orderId}
      </Voltra.Text>
      <Voltra.Text style={{ color: '#9CA3AF', marginTop: 6 }}>
        Driver en route · ETA 12 min
      </Voltra.Text>
    </Voltra.VStack>
  )

  useLiveActivity(
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

The breakthrough that makes this work: Lynx's `pluginReactLynx` aliases
`react → @lynx-js/react` at build time. So Voltra's components — which only
use `createElement` and hooks, never DOM APIs — get Lynx's `createElement`
instead of React DOM's, and the resulting element tree is identical in
shape. `renderLiveActivityToString()` then walks it and produces the same
JSON it would in React Native.

## Server-side rendering still works

The same trick that lets components work in both runtimes also lets the
server-side renderer keep working. You can produce push-update payloads
on a Node.js server using the exact same JSX:

```tsx
import { renderLiveActivityToString } from '@use-voltra/server'
import { Voltra } from '@use-voltra/ios'

const payload = renderLiveActivityToString({
  lockScreen: (
    <Voltra.VStack style={{ padding: 16, borderRadius: '18px', backgroundColor: '#101828' }}>
      <Voltra.Symbol name="car.fill" type="hierarchical" scale="large" tintColor="#38BDF8" />
      <Voltra.Text style={{ color: '#F8FAFC', fontSize: 18, fontWeight: '600' }}>
        Driver arrived
      </Voltra.Text>
      <Voltra.Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 8 }}>
        Ready for pickup
      </Voltra.Text>
    </Voltra.VStack>
  ),
})
```

This payload is byte-identical to what upstream Voltra produces.

## What's next

- [Installation](./installation) — add Voltra for Lynx to a Rspeedy project
- [Lynx Port Architecture](/lynx/architecture) — layer model, translation
  tables, the React alias breakthrough, CSS gotchas
- [Run the iOS demo](/lynx/run-ios) — full rebuild SOP from a fresh clone
- [iOS API](/ios/introduction) and [Android API](/android/introduction) —
  the component APIs (largely shared with upstream Voltra)
