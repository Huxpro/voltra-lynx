import { withCallstackPreset } from '@callstack/rspress-preset'
import { defineConfig } from '@rspress/core'
import path from 'node:path'

// When deployed via GitHub Pages at https://huxpro.github.io/voltra-lynx/
// rspress needs to know the base path so asset URLs resolve correctly.
// Override with `BASE=/some-other-path/ npm run build` if hosting elsewhere.
const base = process.env.BASE ?? '/voltra-lynx/'

export default withCallstackPreset(
  {
    context: __dirname,
    docs: {
      title: 'Voltra for Lynx',
      description:
        'Build iOS Live Activities, Dynamic Island, and Android Home Screen widgets in ReactLynx.',
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
    // Local stylesheet hides the three Callstack ad slots
    // (DocFooterCTA, HomeBanner, OutlineCTA) injected by the theme.
    // See theme/styles.css for details.
    globalStyles: path.join(__dirname, 'theme', 'styles.css'),
    themeConfig: {
      enableScrollToTop: true,
      footer: {
        message:
          'Voltra for Lynx · MIT · forked from <a href="https://www.use-voltra.dev/">use-voltra.dev</a>',
      },
    },
  })
)
