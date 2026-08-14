import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import path from 'path';

const config: Config = {
  title: 'Marketing Cloud Next Enablement Course',
  tagline: 'Self-paced Marketing Cloud Next (Advanced Edition) training by ListEngage',
  favicon: 'img/favicon.svg',

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
  ],

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
      type: 'text/css',
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
