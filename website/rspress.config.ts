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
      title: 'Voltra for Lynx',
      description: 'Build Live Activities, Dynamic Island, and Widgets with JSX — on LynxJS.',
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
