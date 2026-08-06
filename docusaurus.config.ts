import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'MCA Enablement Course',
  tagline: 'Self-paced Marketing Cloud Advanced training',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://your-docusaurus-site.example.com',
  baseUrl: '/',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: [
            './src/css/tokens.css',
            './src/css/custom.css',
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      disableSwitch: true,
      defaultMode: 'light',
    },
    navbar: {
      title: 'MCA Enablement Course',
      items: [
        {to: '/', label: 'Course Overview', position: 'left'},
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      additionalLanguages: ['bash', 'json', 'sql'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
