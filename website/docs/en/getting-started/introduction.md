# Introduction

Voltra is a library for building iOS Live Activities, Dynamic Island layouts,
and Android Home Screen widgets using ReactLynx JSX. Until now, these features
required writing native code in Swift or Kotlin.

Voltra gives you a JavaScript API and JSX components that automatically
become native primitives (SwiftUI on iOS, Jetpack Compose Glance on Android).

## Why Voltra?

- **One codebase, two platforms.** Write the same JSX, ship it to iOS and Android.
- **No native code required.** Build widgets and live activities without touching Xcode or Android Studio for UI work.
- **Hot reload.** Rspeedy reloads bundle changes; live activities re-render in milliseconds.
- **Push updates.** Stream Live Activity updates over APNS / FCM from any JavaScript runtime.

## How it works

Voltra serializes your ReactLynx JSX into a lightweight JSON payload that the
native platform extensions interpret as SwiftUI or Compose Glance views. This
enables hot reload during development and server-side rendering for push updates.

Here's a Live Activity:

```tsx
import { useLiveActivity } from '@use-voltra/lynx/ios-client'
import { Voltra } from '@use-voltra/ios'

const ui = (
  <Voltra.VStack style={{ padding: 16, borderRadius: '18px', backgroundColor: '#101828' }}>
    <Voltra.Symbol name="car.fill" scale="large" tintColor="#38BDF8" />
    <Voltra.Text style={{ color: '#F8FAFC', fontSize: 18, fontWeight: '600' }}>
      Driver en route
    </Voltra.Text>
    <Voltra.Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 8 }}>
      Building A · Lobby pickup
    </Voltra.Text>
  </Voltra.VStack>
)

useLiveActivity({ lockScreen: ui }, { activityName: 'pickup', autoStart: true })
```

If you've used Voltra on React Native, the API is the same. The JSX,
component shapes, and payload format don't change between runtimes.

## Server-side push updates

The same components render on a Node.js server. Generate the payload, send
it via APNS / FCM, and your Live Activity updates without the app running:

```tsx
import { renderLiveActivityToString } from '@use-voltra/server'
import { Voltra } from '@use-voltra/ios'

const payload = renderLiveActivityToString({
  lockScreen: (
    <Voltra.VStack style={{ padding: 16, borderRadius: '18px', backgroundColor: '#101828' }}>
      <Voltra.Symbol name="car.fill" scale="large" tintColor="#38BDF8" />
      <Voltra.Text style={{ color: '#F8FAFC', fontSize: 18, fontWeight: '600' }}>
        Driver arrived
      </Voltra.Text>
    </Voltra.VStack>
  ),
})
```

Ready? Head to [Installation](./installation), or jump straight to the
platform guides for [iOS](/en/ios/setup) and [Android](/en/android/setup).
