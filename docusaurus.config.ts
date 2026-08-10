import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import path from 'path';

const config: Config = {
  title: 'MCA Enablement Course',
  tagline: 'Self-paced Marketing Cloud Advanced training by ListEngage',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
      },
    },
  ],

  url: 'https://bbrookslistengage.github.io',
  baseUrl: '/mcoc-enablement/',
  organizationName: 'bbrookslistengage',
  projectName: 'mcoc-enablement',
  trailingSlash: false,

  onBrokenLinks: 'warn',

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    path.join(__dirname, 'plugins/module-registry'),
  ],

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
      title: '',
      logo: {
        alt: 'ListEngage',
        src: 'img/listengage-logo.png',
        height: 22,
      },
      items: [
        {to: '/', label: 'Course Overview', position: 'left'},
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: 'Built by ListEngage',
    },
    prism: {
      theme: prismThemes.nightOwlLight,
      additionalLanguages: ['bash', 'json', 'sql', 'apex', 'java'],
    },
    mermaid: {
      theme: {light: 'neutral'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
