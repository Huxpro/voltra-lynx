import { defineConfig } from '@rspress/core'
import path from 'node:path'

// When deployed via GitHub Pages at https://huxpro.github.io/voltra-lynx/
// rspress needs the base path so asset URLs resolve correctly.
// Override with `BASE=/some-other-path/ npm run build` if hosting elsewhere.
const base = process.env.BASE ?? '/voltra-lynx/'

export default defineConfig({
  base,
  root: path.join(__dirname, 'docs'),
  title: 'Voltra for Lynx',
  description:
    'Build iOS Live Activities, Dynamic Island, and Android Home Screen widgets in ReactLynx.',
  icon: '/favicon.ico',
  logo: {
    light: '/logo-light.svg',
    dark: '/logo-dark.svg',
  },
  logoText: 'Voltra',
  themeConfig: {
    enableScrollToTop: true,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/Huxpro/voltra-lynx',
      },
    ],
    footer: {
      message:
        'Voltra for Lynx · MIT · forked from <a href="https://www.use-voltra.dev/">use-voltra.dev</a>',
    },
  },
})
