/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Quickstart',
      items: [
        'quickstart/browser',
        'quickstart/cli',
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      items: [
        'concepts/ledger-entries',
        'concepts/scval-types',
        'concepts/simulation-vs-execution',
        'concepts/state-diff',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/mock-ledger',
        'guides/cross-contract',
        'guides/auth-context',
        'guides/snapshots',
        'guides/ci-integration',
      ],
    },
    {
      type: 'category',
      label: 'Contract Reference',
      items: [
        'contracts/overview',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/overview',
      ],
    },
    {
      type: 'category',
      label: 'CLI Reference',
      items: [
        'cli/commands',
      ],
    },
    {
      type: 'category',
      label: 'Additional',
      items: [
        'faq',
        'contributing',
        'architecture',
        'roadmap',
      ],
    },
  ],
};

export default sidebars;
