import { withCallstackPreset } from '@callstack/rspress-preset'
import { defineConfig } from '@rspress/core'

// When deployed via GitHub Pages at https://huxpro.github.io/voltra-lynx/
// rspress needs to know the base path so asset URLs resolve correctly.
// Override with `BASE=/some-other-path/ pnpm build` if hosting elsewhere.
const base = process.env.BASE ?? '/voltra-lynx/'

export default withCallstackPreset(
  {
    context: __dirname,
    docs: {
      title: 'Voltra · ported to Lynx',
      description: 'A LynxJS port of Voltra (use-voltra.dev). 95.6% of upstream ships byte-identical; this site documents the bridge layer that makes it work.',
      editUrl: 'https://github.com/Huxpro/voltra-lynx/edit/main',
      rootUrl: 'https://huxpro.github.io/voltra-lynx/',
      icon: 'docs/public/favicon.ico',
      logoLight: '/logo-light.svg',
      logoDark: '/logo-dark.svg',
      ogImage: '/og-image.png',
      rootDir: 'docs',
      socials: {
        github: 'https://github.com/Huxpro/voltra-lynx',
      },
    },
    vercelAnalytics: false,
  },
  defineConfig({
    base,
    themeConfig: {
      enableScrollToTop: true,
      footer: {
        message:
          'Voltra for Lynx · MIT · forked from <a href="https://github.com/callstackincubator/voltra">callstackincubator/voltra</a>',
      },
    },
  })
)
