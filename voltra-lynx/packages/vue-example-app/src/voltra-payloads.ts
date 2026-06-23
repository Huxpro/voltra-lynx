// Voltra Live Activity payload builders for the Vue Lynx host.
//
// IMPORTANT: these use React's `createElement` directly (no JSX, no Vue).
// Voltra's components (`@use-voltra/ios`) are plain `createElement` factories,
// and `startLiveActivity()` serializes the resulting React element tree to JSON
// via `renderLiveActivityToString()`. That serialization is pure JS — it never
// touches the DOM or a host renderer — so it produces the *exact same* payload
// whether the surrounding app is React Lynx or Vue Lynx.
//
// This is the crux of Vue Lynx support: the UI host framework changes, but the
// payload pipeline (Layer 0/1) stays byte-for-byte identical.
import { createElement as h } from 'react';
import { Voltra } from '@use-voltra/ios';

// The object shape `startLiveActivity()` expects (lockScreen + Dynamic Island).
// Kept loose on purpose so we don't fork upstream's exported types.
export type LiveActivityVariants = Parameters<
  typeof import('@use-voltra/ios')['renderLiveActivityToString']
>[0];

const style = (s: Record<string, unknown>) => s as never;

// ─── Basic Live Activity ────────────────────────────────────────
export function makeBasicLiveActivityVariants(): LiveActivityVariants {
  const icon = (size: number, radius: number) =>
    h(Voltra.Image, {
      source: { assetName: 'voltra-icon' },
      style: style({ width: size, height: size, borderRadius: radius }),
      resizeMode: 'stretch',
    });

  return {
    lockScreen: h(
      Voltra.VStack,
      { id: 'basic-live-activity', spacing: 16, style: style({ padding: 16 }) },
      h(
        Voltra.VStack,
        { spacing: 8, alignment: 'center' },
        h(
          Voltra.ZStack,
          { alignment: 'center' },
          icon(60, 12),
          h(
            Voltra.Text,
            {
              style: style({
                backgroundColor: '#8232FF',
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: '600',
                paddingLeft: 4,
                paddingRight: 4,
                paddingTop: 2,
                paddingBottom: 2,
                borderRadius: 6,
              }),
            },
            'NEW',
          ),
        ),
        h(
          Voltra.Text,
          {
            style: style({
              color: '#F0F9FF',
              fontSize: 28,
              fontWeight: '700',
              letterSpacing: -0.5,
              fontFamily: 'Merriweather-Regular',
            }),
          },
          'Hello, Vue Lynx!',
        ),
        h(
          Voltra.Text,
          { style: style({ color: '#94A3B8', fontSize: 16, fontWeight: '500' }) },
          'This Live Activity was started from a Vue app.',
        ),
      ),
    ),
    island: {
      compact: {
        leading: icon(24, 6),
        trailing: h(Voltra.Text, { style: style({ fontSize: 12, color: '#F0F9FF' }) }, 'Voltra'),
      },
      expanded: {
        center: h(
          Voltra.VStack,
          { alignment: 'center', spacing: 4 },
          h(
            Voltra.Text,
            { style: style({ fontSize: 18, fontWeight: '700', color: '#F0F9FF' }) },
            'Hello, Vue Lynx!',
          ),
          h(
            Voltra.Text,
            { style: style({ fontSize: 14, color: '#94A3B8' }) },
            'Started from a Vue app.',
          ),
        ),
        leading: icon(40, 10),
      },
      minimal: icon(16, 4),
    },
  };
}

// ─── Music Player Live Activity ─────────────────────────────────
export function makeMusicPlayerVariants(isPlaying: boolean): LiveActivityVariants {
  const cover = h(Voltra.Image, {
    source: { assetName: 'voltra-icon' },
    style: style({ width: 120, height: 120, borderRadius: 12 }),
    resizeMode: 'cover',
  });

  return {
    lockScreen: h(
      Voltra.VStack,
      { id: 'music-player-live-activity', style: style({ padding: 12 }), spacing: 16 },
      h(
        Voltra.HStack,
        { spacing: 16 },
        cover,
        h(
          Voltra.VStack,
          { spacing: 4 },
          h(
            Voltra.Text,
            { style: style({ color: '#F0F9FF', fontSize: 20, fontWeight: '700', letterSpacing: -0.5 }) },
            'Midnight Dreams',
          ),
          h(
            Voltra.Text,
            { style: style({ color: '#94A3B8', fontSize: 15, fontWeight: '500' }) },
            'The Voltra Collective',
          ),
          h(
            Voltra.HStack,
            { spacing: 8, style: style({ marginTop: 8 }) },
            h(
              Voltra.Button,
              { id: 'play-pause-button' },
              h(Voltra.Symbol, {
                name: isPlaying ? 'pause.fill' : 'play.fill',
                type: 'hierarchical',
                scale: 'large',
                tintColor: '#F0F9FF',
              }),
            ),
          ),
        ),
      ),
    ),
    island: {
      compact: {
        leading: h(Voltra.Image, {
          source: { assetName: 'voltra-icon' },
          style: style({ width: 24, height: 24, borderRadius: 6 }),
          resizeMode: 'cover',
        }),
        trailing: h(Voltra.Symbol, {
          name: isPlaying ? 'pause.fill' : 'play.fill',
          type: 'hierarchical',
          scale: 'small',
          tintColor: '#F0F9FF',
        }),
      },
      expanded: {
        center: h(
          Voltra.Text,
          { style: style({ fontSize: 16, fontWeight: '700', color: '#F0F9FF' }) },
          'Midnight Dreams',
        ),
        leading: h(Voltra.Image, {
          source: { assetName: 'voltra-icon' },
          style: style({ width: 40, height: 40, borderRadius: 10 }),
          resizeMode: 'cover',
        }),
      },
      minimal: h(Voltra.Symbol, {
        name: isPlaying ? 'pause.fill' : 'play.fill',
        type: 'hierarchical',
        scale: 'small',
        tintColor: '#F0F9FF',
      }),
    },
  };
}
