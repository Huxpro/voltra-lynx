# Voltra — Project Instructions

## Overview

Voltra is a cross-platform library for building iOS Live Activities, Dynamic Island, and Android Widgets using React JSX. This repository contains both the original React Native/Expo implementation AND a Lynx port.

## Lynx Port

This project is being ported to run on LynxJS. **Read these before doing ANY Lynx port work:**

1. **[LYNX_PORT.md](./LYNX_PORT.md)** — Architectural principles, layer model, translation rules, constraints
2. **[tasks/prd-voltra-lynx-port.md](./tasks/prd-voltra-lynx-port.md)** — Full PRD with 51 stories
3. **[tasks/PROGRESS.md](./tasks/PROGRESS.md)** — Current progress tracker
4. **[tasks/PROMPT.md](./tasks/PROMPT.md)** — Ralph Loop prompt for automated execution

**All Lynx port work MUST follow the principles in LYNX_PORT.md.**

## Key Commands

```bash
pnpm install          # install all dependencies
pnpm build            # build all packages
pnpm test             # run tests
pnpm lint             # lint all packages
pnpm typecheck        # typecheck all packages
```

## Monorepo Structure

- `packages/core` — renderer, payload compression (pure JS, no framework deps)
- `packages/ios` — iOS component definitions & render functions (pure JS)
- `packages/android` — Android component definitions & render functions (pure JS)
- `packages/server` — server-side rendering foundation (Node.js)
- `packages/ios-client` — iOS client APIs (React Native/Expo specific)
- `packages/android-client` — Android client APIs (React Native/Expo specific)
- `packages/voltra` — umbrella package re-exporting all sub-packages
- `packages/expo-plugin` — Expo config plugin for native setup

## Code Generation

Component types are generated from `packages/voltra/data/components.json`:
```bash
cd packages/voltra && npm run generate
```
This generates TS types, Swift structs, and component ID mappings.
