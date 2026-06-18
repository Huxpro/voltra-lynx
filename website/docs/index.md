---
pageType: home

hero:
  image:
    src:
      light: /logo-light.svg
      dark: /logo-dark.svg
    alt: Voltra for Lynx
  name: 'Live Activities & Widgets in Lynx'
  tagline: 'Voltra for Lynx brings native iOS Live Activities, Dynamic Island layouts, and Android Home Screen widgets to LynxJS — without writing Swift or Kotlin. A port of the original React Native Voltra library with 95.6% code reuse.'
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started/introduction
    - theme: alt
      text: View on GitHub
      link: https://github.com/Huxpro/voltra-lynx
  badge:
    text: Lynx fork · Hackathon
    type: info
features:
  - title: 95.6% Code Reuse
    details: Only 1,440 lines of new code (662 bridge adapter + 788 native module shims) to port 32,500 lines of native UI library to LynxJS. The entire SwiftUI/Glance rendering engine ships byte-identical from upstream.
    icon: <img src="/icons/card-id.svg" />
  - title: Native Primitives in JSX
    details: Compose SwiftUI (iOS) and Jetpack Compose Glance (Android) primitives directly in ReactLynx JSX. Same `<Voltra.VStack>`, `<Voltra.Text>`, `<Voltra.Symbol>` components as upstream Voltra — works because Lynx aliases `react` to `@lynx-js/react` at build time.
    icon: <img src="/icons/subscriptions.svg" />
  - title: Live Activities & Widgets
    details: Build Dynamic Island, Lock Screen Live Activities, and Home Screen widgets for both iOS and Android from a single ReactLynx codebase.
    icon: <img src="/icons/radio-signal.svg" />
---
