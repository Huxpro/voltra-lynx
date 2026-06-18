# Introduction

**Voltra for Lynx** is a port of [Voltra](https://www.use-voltra.dev/) — the
React JSX library for native iOS Live Activities, Dynamic Island, and Android
Home Screen widgets — to [LynxJS](https://lynxjs.org/).

This site **doesn't replace** the official Voltra docs. The component
reference, Live Activity development guides, widget APIs, server-side
update flow, charts, performance notes — all of those live at
[**use-voltra.dev**](https://www.use-voltra.dev/) and apply unchanged to
the Lynx port.

What this site adds, on top of the upstream docs:

- [**How the port works**](/lynx/architecture) — the 5-layer model, code
  reuse table, the React Alias breakthrough that made 100% Layer 0 reuse
  possible, and the Expo→Lynx translation tables.
- [**Lynx CSS gotchas**](/lynx/css-gotchas) — silent-failure traps that
  upstream Voltra examples hit when ported (`borderRadius: 12` is silently
  ignored, `flex: 1` produces zero height on scroll-view, etc.).
- [**Run the iOS demo**](/lynx/run-ios) and
  [**Run the Android demo**](/lynx/run-android) — full host-app rebuild
  SOPs from a clean checkout, with one-shot AI build prompts at the top.

## How Voltra works (briefly)

If you're new to Voltra entirely, read
[Voltra's official Introduction](https://www.use-voltra.dev/getting-started/introduction)
first. The one-paragraph version:

Live Activities, Dynamic Island, and Widgets render in out-of-process OS
extensions that only accept SwiftUI / Compose Glance. The JS framework
serializes your JSX into a JSON payload; native code parses that payload
and constructs the SwiftUI / Glance view tree.

The key consequence: **the JS framework's only job is to produce the
payload.** Once you know that, swapping React Native for LynxJS is just a
bridge-layer change — the entire rendering pipeline behind the JSON is
shared.

## What changes vs upstream

For most code: **nothing**. The Voltra JSX API is the same; the hook
signatures are the same; the JSON payload is byte-identical. The only
differences a consumer sees are:

| | Upstream (React Native + Expo) | This fork (Lynx + Rspeedy) |
|---|---|---|
| Install | `npm install voltra` | `npm install @use-voltra/lynx @use-voltra/{core,ios,android,server} @lynx-js/react` |
| Hook import | `from 'voltra/client'` | `from '@use-voltra/lynx/ios-client'` |
| CSS `borderRadius` | `borderRadius: 12` | `borderRadius: '12px'` (see [CSS gotchas](/lynx/css-gotchas)) |
| Dev server | Metro / Expo CLI | Rspeedy (`pnpm dev`) |
| Native host | Expo prebuild | xcodegen + CocoaPods (iOS), Gradle (Android) |

[Continue to Installation →](./installation)
