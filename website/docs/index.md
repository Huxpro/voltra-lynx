---
pageType: home

hero:
  image:
    src:
      light: /logo-light.svg
      dark: /logo-dark.svg
    alt: Voltra for Lynx
  name: 'Voltra · ported to Lynx'
  tagline: 'A Lynx port of <a href="https://www.use-voltra.dev/" target="_blank">Voltra</a> — the React JSX library for iOS Live Activities, Dynamic Island, and Android Home Screen widgets. 95.6% of upstream ships byte-identical; only the bridge layer is new. This site documents the port. For the component API and platform development guides, see the official Voltra docs.'
  actions:
    - theme: brand
      text: How the port works
      link: /lynx/architecture
    - theme: alt
      text: Official Voltra docs ↗
      link: https://www.use-voltra.dev/
  badge:
    text: Extension of upstream · Hackathon
    type: info
features:
  - title: 95.6% Code Reuse
    details: 'Only 1,440 lines of new code (662 bridge adapter + 788 native module shims) to port 32,500 lines of upstream Voltra to LynxJS. The entire SwiftUI/Glance rendering engine ships byte-identical.'
    icon: <img src="/icons/card-id.svg" />
  - title: Same JSX, different runtime
    details: '<code>&lt;Voltra.VStack&gt;</code>, <code>&lt;Voltra.Text&gt;</code>, <code>useLiveActivity</code> — the API surface is unchanged. Lynx aliases <code>react</code> to <code>@lynx-js/react</code> at build time, so upstream components work as-is. Read the component reference at <a href="https://www.use-voltra.dev/" target="_blank">use-voltra.dev</a>.'
    icon: <img src="/icons/subscriptions.svg" />
  - title: What this site covers
    details: 'Three things you only need if you are using the Lynx port: the layer-model architecture, a list of Lynx CSS gotchas that bit every commit cluster during the port, and rebuild SOPs for the iOS and Android host apps.'
    icon: <img src="/icons/radio-signal.svg" />
---
