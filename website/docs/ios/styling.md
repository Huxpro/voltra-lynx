# Styling Notes

Lynx accepts a subset of web CSS. A handful of properties behave
differently from React Native and the web — and some fail silently
when given the wrong shape. Worth a glance before you write Voltra JSX.

## Layout

Lynx supports **both `display: flex` (full CSS Flexbox) and `display: linear`**
(Android-LinearLayout-style). Voltra-Lynx prefers flex — it ports 1:1 from
React Native and the web. The catch: `<view>`'s default `display` is `linear`,
so you opt into flex per parent.

| Pattern | Web / RN | Lynx (preferred) | Lynx (linear fallback) |
|---|---|---|---|
| Horizontal row | `display: 'flex', flexDirection: 'row'` | same | `display: 'linear', linearDirection: 'row'` |
| Fill remaining space, parent is flex | `flex: 1` | `flex: 1` | — |
| Fill remaining space, parent is linear (default) | — | — | `linearWeight: 1` |
| Scroll axis | `scroll-y` | `scroll-orientation="vertical"` | same |
| Root view sizing | `flex: 1` | `width: '100%', height: '100%'` | same |

### `<scroll-view>` rules

Two non-obvious rules from Lynx's [`<scroll-view>` reference](https://lynxjs.org/api/elements/built-in/scroll-view.html):

1. **Direct children of `<scroll-view>` always use linear layout.** Want flex
   inside? Wrap the contents in a single `<view style={{ display: 'flex' }}>`
   child.
2. **`flex: 1` on a `<scroll-view>` only works when its parent is `display: 'flex'`.**
   If the parent is a default `<view>` (linear), the scroll-view computes to
   **zero height**. Either set `display: 'flex', flexDirection: 'column'` on
   the parent, or keep `linearWeight: 1` on the scroll-view.

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
