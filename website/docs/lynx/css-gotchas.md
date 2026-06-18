# Lynx CSS Gotchas

The single category of bugs that bites every Voltra-to-Lynx port — and
explains roughly 10 sequential `fix(lynx-port)` commits in this fork's
git history. Lynx's CSS engine accepts a subset of web CSS, but with
several silent-failure traps that look identical to upstream Voltra at
type-check time and break at runtime.

If any single thing on this page is wrong in your code, **you'll see a
blank screen with no error, no warning, no console message**. Encoded
into `LYNX_PORT.md` so future agents read it before writing layout code.

## Layout

| Pattern | Wrong (Web/RN) | Correct (Lynx) | Failure mode |
|---|---|---|---|
| Fill remaining space | `flex: 1` | `linearWeight: 1` | scroll-view height = 0 |
| Horizontal row | `display: 'flex', flexDirection: 'row'` | `display: 'linear', linearDirection: 'row'` | items stack vertically |
| Scroll axis | `scroll-y` | `scroll-orientation="vertical"` | scroll disabled |
| Root view sizing | `flex: 1` | `width: '100%', height: '100%'` | view collapses to 0×0 |

Lynx's default layout engine is **linear** — Android-LinearLayout-style,
not flexbox. `flex: 1` on a `<scroll-view>` computes to **zero height**.

## Styling

| Pattern | Wrong | Correct | Failure mode |
|---|---|---|---|
| Border radius | `borderRadius: 12` | `borderRadius: '12px'` | silently ignored |
| Line height | `lineHeight: 18` | `lineHeight: '18px'` or remove | 18 × font-size gaps (huge) |
| Padding shorthand | `paddingHorizontal: 16` | `paddingLeft: 16, paddingRight: 16` | not applied |

- `borderRadius` with a bare number is silently ignored. Must be a string
  with `px`. This catches every upstream Voltra example.
- `lineHeight` with a bare number is interpreted as a **multiplier**, not
  pixels — `18` means 18× font-size, which produces enormous gaps. Either
  remove it (Lynx's default is usually right) or use a string with `px`.

## Text & events

- `<text>` is always block-level — no inline layout.
- You cannot put raw text inside `<view>` — must wrap in `<text>`.
- Use `bindtap`, not `onPress` or `onClick`.
- Background-thread `NativeModule` calls need a `'background only'`
  directive.

## Static assets

- Import images: `import img from '../assets/foo.png'` → URL string
- Use in CSS: `backgroundImage: url(${img})`
- Use in JSX: `<image src={img} />`
- The Lynx host app needs a resource fetcher configured to load asset
  URLs from the dev server during development.

## How upstream Voltra examples need translating

Upstream Voltra uses bare-number CSS values throughout its examples (they
work fine in React Native). When porting those examples to Lynx you'll
typically need to:

1. Wrap every `borderRadius: N` → `borderRadius: 'Npx'`
2. Wrap every `lineHeight: N` → `lineHeight: 'Npx'` (or delete)
3. Replace `paddingHorizontal`/`paddingVertical` shorthands with explicit
   per-side values
4. Translate `onPress` → `bindtap` (also: `onClick` is web-only and
   doesn't exist in Lynx)

The Voltra render functions themselves (which produce the JSON payload
the native side parses) don't care about any of this — they just pass
the style object through. The CSS rules only bite the Lynx-side preview
components (`<voltra-preview>`, the example app's screens) that actually
need to render in the Lynx view tree.
