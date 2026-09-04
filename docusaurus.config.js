// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'SoroSim',
  tagline: 'Open-Source Soroban Contract Simulation & Dry-Run Sandbox',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.sorosim.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'sorosim', // Usually your GitHub org/user name.
  projectName: 'sorosim-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Head tags for SEO and social sharing
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content: 'soroban, stellar, smart contracts, blockchain, testing, simulation, development tools, sorosim',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'author',
        content: 'SoroSim Team',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:site',
        content: '@SoroSim',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:creator',
        content: '@SoroSim',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:type',
        content: 'website',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:site_name',
        content: 'SoroSim Documentation',
      },
    },
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/sorosim/sorosim-docs/tree/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/sorosim/sorosim-docs/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Social card for sharing
      image: 'img/sorosim-social-card.jpg',
      // Metadata for SEO
      metadata: [
        {
          name: 'description',
          content: 'SoroSim is an open-source Soroban contract simulation tool with visual state inspection. Test smart contracts locally without testnet.',
        },
        {
          name: 'og:title',
          content: 'SoroSim - Soroban Contract Simulation & Testing Tool',
        },
        {
          name: 'og:description',
          content: 'Open-source browser and CLI tool for simulating Soroban smart contracts with visual state inspection. No testnet required.',
        },
        {
          name: 'og:image',
          content: 'https://docs.sorosim.dev/img/sorosim-social-card.jpg',
        },
        {
          name: 'og:image:alt',
          content: 'SoroSim - Soroban Contract Simulation Tool',
        },
        {
          name: 'og:image:width',
          content: '1200',
        },
        {
          name: 'og:image:height',
          content: '630',
        },
        {
          name: 'twitter:title',
          content: 'SoroSim - Soroban Contract Simulation Tool',
        },
        {
          name: 'twitter:description',
          content: 'Open-source tool for simulating Soroban contracts locally with visual state inspection.',
        },
        {
          name: 'twitter:image',
          content: 'https://docs.sorosim.dev/img/sorosim-social-card.jpg',
        },
        {
          name: 'twitter:image:alt',
          content: 'SoroSim - Soroban Contract Simulation Tool',
        },
      ],
      // Algolia DocSearch configuration
      algolia: {
        // The application ID provided by Algolia
        appId: 'YOUR_ALGOLIA_APP_ID',
        // Public API key: it is safe to commit it
        apiKey: 'YOUR_ALGOLIA_SEARCH_API_KEY',
        indexName: 'sorosim',
        // Optional: see doc section below
        contextualSearch: true,
        // Optional: Specify domains where the navigation should occur through window.location instead on history.push
        externalUrlRegex: 'external\\.com|domain\\.com',
        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl
        replaceSearchResultPathname: {
          from: '/docs/', // or as RegExp: /\/docs\//
          to: '/',
        },
        // Optional: Algolia search parameters
        searchParameters: {},
        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',
        // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
        insights: false,
      },
      navbar: {
        title: 'SoroSim',
        logo: {
          alt: 'SoroSim Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            to: '/docs/quickstart/browser',
            label: 'Quickstart',
            position: 'left',
          },
          {
            to: '/docs/guides/mock-ledger',
            label: 'Guides',
            position: 'left',
          },
          {
            to: '/docs/api/overview',
            label: 'API Reference',
            position: 'left',
          },
          {
            to: '/blog',
            label: 'Blog',
            position: 'left',
          },
          {
            href: 'https://github.com/sorosim/sorosim',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Introduction',
                to: '/docs/intro',
              },
              {
                label: 'Quickstart',
                to: '/docs/quickstart/browser',
              },
              {
                label: 'Concepts',
                to: '/docs/concepts/ledger-entries',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/stellar',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/sorosim',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/sorosim/sorosim',
              },
              {
                label: 'Stellar',
                href: 'https://stellar.org',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} SoroSim. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['rust', 'toml', 'bash'],
      },
    }),
};

export default config;
