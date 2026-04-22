# PRD: High-Fidelity Testing Grounds Rewrite

## Introduction

All 12 Testing Ground screens in LynxVoltra need pixel-perfect rewrites. Current ports were auto-generated and have systemic issues: wrong scroll attributes, missing `px` on borderRadius, bare lineHeight numbers, `flex` instead of `linear` layout. Each screen must be rewritten by reading the original RN source and translating it to Lynx-correct patterns.

## Goals

- Pixel-perfect match with original Voltra RN app for all Testing Ground screens
- All interactive controls working (toggles, sliders, cycle buttons)
- Correct Lynx layout patterns throughout (linear, linearWeight, scroll-orientation)
- Zero visual regressions on iOS Simulator
- `tsc --noEmit` + `rspeedy build` pass for every story

## Lynx CSS Gotchas (Reference for all stories)

These rules MUST be followed in every file:

| Pattern | Wrong (RN/Web) | Correct (Lynx) |
|---------|---------------|-----------------|
| Scroll | `scroll-y` | `scroll-orientation="vertical"` |
| Border radius | `borderRadius: 12` | `borderRadius: '12px'` |
| Line height | `lineHeight: 18` | Remove or use `'18px'` string |
| Horizontal row | `display: 'flex', flexDirection: 'row'` | `display: 'linear', linearDirection: 'row'` |
| Fill remaining space | `flex: 1` | `linearWeight: 1` |
| Full screen root | `flex: 1` | `width: '100%', height: '100%'` |
| Padding shorthand | `padding: 16` | OK in Lynx, but `paddingHorizontal` → `paddingLeft + paddingRight` |

---

## Phase 0: Shared Fix Pass

### US-000: Lynx-Safe Shared Styles & Utilities

**Description:** As a developer, I need a shared constants file so all screens use correct Lynx patterns consistently.

**Acceptance Criteria:**
- [ ] Create `src/styles/lynx-safe.ts` exporting:
  - Card style object (dark bg `#0F172A`, `borderRadius: '20px'`, border, padding)
  - Button styles (primary, secondary, ghost) with correct `borderRadius: '12px'`
  - Section header style
  - `row()` helper → `{ display: 'linear', linearDirection: 'row' }`
  - `pill()` helper → `{ borderRadius: '999px', paddingLeft, paddingRight, paddingTop, paddingBottom }`
- [ ] Bulk fix: run sed across all `src/demos/testing/*.tsx` to replace:
  - `scroll-y>` → `scroll-orientation="vertical">`
  - `borderRadius: N` → `borderRadius: 'Npx'` (for common values 4,6,8,10,12,16,20,28,999)
  - Remove any remaining bare `lineHeight: N`
  - `display: 'flex', flexDirection: 'row'` → `display: 'linear', linearDirection: 'row'`
  - `flex: 1` on non-scroll elements → `linearWeight: 1`
- [ ] `tsc --noEmit` passes
- [ ] `rspeedy build` succeeds

---

## Phase 1: Simple Screens (view-only, no complex state)

### US-001: Components Catalog — Pixel-Perfect Rewrite

**Description:** Rewrite to match original's FlatList of 19 component preview cards.

**Reference:** `example/screens/testing-grounds/components/ComponentsScreen.tsx`
**Target:** `src/demos/testing/ComponentsCatalogScreen.tsx`

**Acceptance Criteria:**
- [ ] Read original source — copy exact component list, titles, descriptions
- [ ] Each card: dark background (`#0F172A`), `borderRadius: '20px'`, border
- [ ] Card shows: title, description text, Voltra component rendered to JSON via `renderVoltraVariantToJson`
- [ ] Expandable JSON preview (tap card to show/hide)
- [ ] Scroll container: `scroll-orientation="vertical"`, `linearWeight: 1`
- [ ] All 19 components: Button, Text, VStack, HStack, ZStack, Spacer, Divider, Image, Label, Toggle, LinearProgressView, CircularProgressView, Gauge, Timer, Symbol, GroupBox, LinearGradient, GlassContainer, Mask
- [ ] `tsc --noEmit` + `rspeedy build` pass
- [ ] Verify on iOS Simulator — cards scroll, text readable, no huge gaps

---

### US-002: Styling Examples — Pixel-Perfect Rewrite

**Description:** Rewrite to match original's 11 styling demonstrations.

**Reference:** `example/screens/testing-grounds/styling/StylingScreen.tsx`
**Target:** `src/demos/testing/StylingScreen.tsx`

**Acceptance Criteria:**
- [ ] Read original source — copy exact 11 examples with same titles/descriptions
- [ ] Examples: Padding, Individual Padding, Margins, Text Colors, Background Colors, Borders, Shadows, Typography, Opacity, Combined Styling, Text Alignment
- [ ] Each example in a card with Voltra component preview
- [ ] Correct Lynx layout (no bare lineHeight, borderRadius with 'px')
- [ ] `tsc --noEmit` + `rspeedy build` pass

---

### US-003: Positioning Examples — Pixel-Perfect Rewrite

**Description:** Rewrite 7 positioning demonstrations.

**Reference:** `example/screens/testing-grounds/positioning/PositioningScreen.tsx`
**Target:** `src/demos/testing/PositioningScreen.tsx`

**Acceptance Criteria:**
- [ ] 7 examples: Static, Relative basic, Relative negative, Absolute basic, Absolute corners, Z-index layering, Badge overlay
- [ ] Each example in a card with visual preview using colored boxes
- [ ] Red dot markers for absolute coordinate reference points
- [ ] Fix `scroll-y` → `scroll-orientation="vertical"`
- [ ] `tsc --noEmit` + `rspeedy build` pass

---

### US-004: Image Fallback — Pixel-Perfect Rewrite

**Description:** Rewrite 6 image fallback scenario demonstrations.

**Reference:** `example/screens/testing-grounds/ImageFallbackScreen.tsx`
**Target:** `src/demos/testing/ImageFallbackScreen.tsx`

**Acceptance Criteria:**
- [ ] 6 scenarios: background color, multiple colors, transparent, combined, custom fallback component, mixed
- [ ] Each scenario has "Show Example" button that calls NativeModules.VoltraModule.startLiveActivity
- [ ] Payload uses Voltra.Image with backgroundColor fallback
- [ ] Migration note about `fallbackColor` deprecation
- [ ] `tsc --noEmit` + `rspeedy build` pass

---

## Phase 2: Medium Screens (some interactive controls)

### US-005: Image Preloading — Pixel-Perfect Rewrite

**Description:** Rewrite image preloading test with URL input and download status.

**Reference:** `example/screens/testing-grounds/ImagePreloadingScreen.tsx`
**Target:** `src/demos/testing/ImagePreloadingScreen.tsx`

**Acceptance Criteria:**
- [ ] Read original — match URL input, download flow, status display
- [ ] Calls `NativeModules.VoltraModule.preloadImages` with picsum.photos URLs
- [ ] Shows per-image status: idle → loading → success/error
- [ ] "Clear Images" button calls `clearPreloadedImages`
- [ ] Progress indicator during download
- [ ] `tsc --noEmit` + `rspeedy build` pass

---

### US-006: Widget Scheduling — Pixel-Perfect Rewrite

**Description:** Rewrite widget timeline scheduling demo.

**Reference:** `example/screens/testing-grounds/WidgetSchedulingScreen.tsx`
**Target:** `src/demos/testing/WidgetSchedulingScreen.tsx`

**Acceptance Criteria:**
- [ ] Read original — match minutes input, schedule button, entry display
- [ ] Stepper controls for minutes (Lynx has no TextInput, use +/- buttons)
- [ ] 3 scheduled entries with different visual states (colors/text)
- [ ] Calls `NativeModules.VoltraModule.scheduleWidget`
- [ ] Shows scheduled times after scheduling
- [ ] `tsc --noEmit` + `rspeedy build` pass

---

### US-007: Weather Widget — Pixel-Perfect Rewrite

**Description:** Rewrite weather widget demo with family selector and conditions.

**Reference:** `example/screens/testing-grounds/weather/WeatherTestingScreen.tsx`
**Target:** `src/demos/testing/WeatherWidgetScreen.tsx`

**Acceptance Criteria:**
- [ ] Read original — match widget family selector, condition buttons, actions
- [ ] 7 widget families as selectable buttons
- [ ] Weather conditions: Sunny/Cloudy/Rainy with gradient preview
- [ ] "Random Weather" and "Custom Weather" quick actions
- [ ] "Schedule Timeline" with 4 timed entries
- [ ] Calls `NativeModules.VoltraModule.updateWidget` and `scheduleWidget`
- [ ] `tsc --noEmit` + `rspeedy build` pass

---

## Phase 3: Complex Screens (multiple interactive controls)

### US-008: Flex Playground — Pixel-Perfect Rewrite (Part 1: Controls)

**Description:** Rewrite flex playground controls matching original's cycling buttons.

**Reference:** `example/screens/testing-grounds/flex-playground/FlexPlaygroundScreen.tsx`
**Target:** `src/demos/testing/FlexPlaygroundScreen.tsx`

**Acceptance Criteria:**
- [ ] Read original — copy exact control layout and option lists
- [ ] Cycling buttons for: flexDirection (column/row), alignItems (4 options), justifyContent (6 options)
- [ ] +/- buttons for gap and containerPadding
- [ ] Current value displayed on each button
- [ ] Buttons use card styling with `borderRadius: '12px'`
- [ ] `tsc --noEmit` + `rspeedy build` pass

### US-009: Flex Playground — Pixel-Perfect Rewrite (Part 2: Preview)

**Description:** Add live preview area with 3 colored boxes responding to flex changes.

**Acceptance Criteria:**
- [ ] 3 colored boxes (red, blue, green) in preview area
- [ ] Box sizes change based on flexDirection
- [ ] Live update when any control changes
- [ ] Voltra JSON output card at bottom (renderVoltraVariantToJson)
- [ ] Text Align test section (matches original)
- [ ] Verify on iOS Simulator — controls cycle correctly, preview updates

---

### US-010: Timer Testing — Pixel-Perfect Rewrite (Part 1: Controls)

**Description:** Rewrite timer testing controls.

**Reference:** `example/screens/testing-grounds/timer/TimerTestingScreen.tsx`
**Target:** `src/demos/testing/TimerScreen.tsx`

**Acceptance Criteria:**
- [ ] Mode toggle: Timer/Stopwatch (2 buttons, highlighted state)
- [ ] Direction toggle: Up/Down
- [ ] Style toggle: Timer/Relative
- [ ] Show Hours toggle: Off/On
- [ ] Duration +/- stepper (since no TextInput in Lynx)
- [ ] Reset button
- [ ] All buttons match original styling

### US-011: Timer Testing — Pixel-Perfect Rewrite (Part 2: Preview)

**Description:** Add timer preview display and Voltra.Timer JSON output.

**Acceptance Criteria:**
- [ ] Timer preview area showing formatted time (HH:MM:SS or relative)
- [ ] Uses `Voltra.Timer` component for JSON output
- [ ] Start/Reset updates timer state correctly
- [ ] Verify: changing mode/direction/style updates the preview

---

### US-012: Progress Indicators — Pixel-Perfect Rewrite (Part 1: Controls)

**Description:** Rewrite progress indicator controls.

**Reference:** `example/screens/testing-grounds/progress/ProgressTestingScreen.tsx`
**Target:** `src/demos/testing/ProgressIndicatorsScreen.tsx`

**Acceptance Criteria:**
- [ ] Type toggle: Linear/Circular
- [ ] Mode toggle: Determinate/Timer/Indeterminate
- [ ] Progress value: -10/+10 stepper buttons
- [ ] Duration stepper for timer mode
- [ ] Count Down toggle
- [ ] Fix `scroll-y` → `scroll-orientation="vertical"`

### US-013: Progress Indicators — Pixel-Perfect Rewrite (Part 2: Appearance)

**Description:** Add appearance controls and Voltra preview.

**Acceptance Criteria:**
- [ ] Height selector: Small/Medium/Large (Linear only)
- [ ] Corner Radius: None/Small/Full (Linear only)
- [ ] Custom Thumb toggle (Linear only)
- [ ] Line Width: 2/6/12 (Circular only)
- [ ] Track/Progress color selectors
- [ ] Voltra component JSON preview
- [ ] Reset Timer button

---

### US-014: Chart Playground — Pixel-Perfect Rewrite

**Description:** Rewrite chart playground with all chart types and randomizable data.

**Reference:** `example/screens/testing-grounds/chart-playground/ChartPlaygroundScreen.tsx`
**Target:** `src/demos/testing/ChartPlaygroundScreen.tsx`

**Acceptance Criteria:**
- [ ] Read original — copy exact chart type list and data structures
- [ ] 8 chart types: BarMark, Multi-series Bar, LineMark, AreaMark, PointMark+RuleY, PointMark+RuleX, SectorMark (pie), Combo (Bar+Line)
- [ ] "Randomize All" button at top
- [ ] Per-chart "Randomize" button
- [ ] Each chart in a card with title, description
- [ ] JSON output per chart via `renderVoltraVariantToJson`
- [ ] Fix `scroll-y` → `scroll-orientation="vertical"`
- [ ] `tsc --noEmit` + `rspeedy build` pass

---

### US-015: Gradient Playground — Pixel-Perfect Rewrite

**Description:** Rewrite gradient playground with interactive controls and live preview.

**Reference:** `example/screens/testing-grounds/gradient-playground/GradientPlaygroundScreen.tsx`
**Target:** `src/demos/testing/GradientPlaygroundScreen.tsx`

**Acceptance Criteria:**
- [ ] Read original — copy exact controls and presets
- [ ] Gradient type cycle: Linear/Radial/Conic
- [ ] Direction presets: to right, bottom, bottom right, top right
- [ ] Angle cycle: 0/45/90/135/180°
- [ ] Use Angle toggle (switches between direction and angle mode)
- [ ] Color presets: Sunset, Ocean, Purple, Tri-color
- [ ] Border radius +/- stepper
- [ ] Live gradient preview box with current CSS string
- [ ] Additional examples: explicit stops, RGBA, solid fallback
- [ ] Fix `scroll-y` → `scroll-orientation="vertical"`
- [ ] `tsc --noEmit` + `rspeedy build` pass

---

## Functional Requirements

- FR-1: Every screen reads the EXACT original RN source and translates to Lynx
- FR-2: All `borderRadius` values use string with 'px' suffix
- FR-3: All scroll containers use `scroll-orientation="vertical"`
- FR-4: All horizontal layouts use `display: 'linear', linearDirection: 'row'`
- FR-5: No bare `lineHeight` numbers (remove or use 'px' string)
- FR-6: Voltra components rendered via `renderVoltraVariantToJson` for JSON preview
- FR-7: Interactive controls use `bindtap` handlers with `'background only'` directive where needed
- FR-8: Every screen must `tsc --noEmit` + `rspeedy build` pass

## Non-Goals

- VoltraWidgetPreview inline rendering (requires Custom Element, out of scope)
- VoltraView live rendering in-app (requires Custom Element)
- TextInput fields (Lynx doesn't have native TextInput — use stepper buttons instead)
- Channel Updates screen (iOS-only APNs feature, skip)

## Technical Considerations

- Lynx's `<text>` is always block-level — text wrapping works within a single `<text>` element
- `padding: 16` works in Lynx but `paddingHorizontal`/`paddingVertical` don't — use explicit edges
- `opacity` on views works in Lynx
- `backgroundColor` supports CSS gradient strings (e.g., `'linear-gradient(to right, #f00, #00f)'`)
- Charts render to JSON only — no visual chart rendering without SwiftUI host

## Success Metrics

- Side-by-side comparison with original RN app shows visual parity on all 12 screens
- All interactive controls (toggles, steppers, cycle buttons) respond correctly
- Zero `tsc` errors, zero Rspeedy build errors
- No huge text gaps, all borderRadius rounded, correct scroll behavior

## Open Questions

- Should we add a "Visual Diff" mode that shows original screenshot alongside Lynx rendering?
- How to handle TextInput-dependent features (URL input in Image Preloading, JSON template in Timer)?
