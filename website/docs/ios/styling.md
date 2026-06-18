# Styling Notes

Lynx accepts a subset of web CSS. A handful of properties behave
differently from React Native and the web — and some fail silently
when given the wrong shape. Worth a glance before you write Voltra JSX.

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

## Translating Voltra examples from the official docs

The Voltra examples on [use-voltra.dev](https://www.use-voltra.dev/) use
bare-number CSS values throughout. When you copy them into a Lynx app:

1. `borderRadius: N` → `borderRadius: 'Npx'`
2. `lineHeight: N` → `lineHeight: 'Npx'` (or remove)
3. `paddingHorizontal` / `paddingVertical` → explicit per-side values
4. `onPress` → `bindtap`

Inside `<Voltra.*>` JSX, these rules only matter for the parts that
render in the Lynx view tree (a `<voltra-preview>`, a screen). The
JSON payload sent to the native renderer just forwards style objects
through — your widget on the home screen receives the same bytes either
way.
