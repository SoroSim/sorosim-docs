# Algolia DocSearch Setup Guide

This document explains how to set up Algolia DocSearch for SoroSim documentation.

## What is Algolia DocSearch?

Algolia DocSearch is a free search service for technical documentation. It provides:
- Fast, typo-tolerant search
- Instant results as you type
- Keyboard navigation
- Mobile-friendly interface
- Analytics and insights

## Prerequisites

1. **Published documentation site** at a public URL (e.g., https://docs.sorosim.dev)
2. **Docusaurus site** configured and deployed
3. **Algolia account** (free for open-source projects)

## Setup Steps

### Step 1: Apply for DocSearch

1. Visit [docsearch.algolia.com/apply](https://docsearch.algolia.com/apply/)
2. Fill out the application form:
   - **Website URL:** https://docs.sorosim.dev
   - **GitHub Repository:** https://github.com/sorosim/sorosim-docs
   - **Email:** Your maintainer email
   - **Project Type:** Open Source

3. Submit and wait for approval (usually 1-2 weeks)

### Step 2: Receive Credentials

Once approved, you'll receive:
- **Application ID** (`appId`)
- **Search-only API Key** (`apiKey`)
- **Index Name** (`indexName`)

### Step 3: Update Docusaurus Config

Open `docusaurus.config.js` and update the Algolia section:

```javascript
algolia: {
  appId: 'YOUR_ACTUAL_APP_ID',        // Replace with your app ID
  apiKey: 'YOUR_ACTUAL_API_KEY',      // Replace with your API key
  indexName: 'sorosim',                // Should be 'sorosim'
  contextualSearch: true,
  searchParameters: {},
  searchPagePath: 'search',
},
```

**Security Note:** The `apiKey` is a **search-only** key and is safe to commit publicly.

### Step 4: Verify Setup Locally

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Check search bar appears in navbar
# (It won't work until deployed and indexed)
```

### Step 5: Deploy

```bash
# Build production version
npm run build

# Deploy to your hosting
npm run deploy
```

### Step 6: Trigger Initial Crawl

After deployment, Algolia will automatically crawl your site:
- **Frequency:** Once per day (by default)
- **Timing:** Usually runs at night (UTC)
- **Duration:** 5-15 minutes for initial crawl

You can also trigger a manual crawl:
1. Go to your [Algolia dashboard](https://www.algolia.com/apps/)
2. Select your application
3. Go to "Crawler" → "Overview"
4. Click "Restart crawling"

### Step 7: Test Search

Once crawling completes:
1. Visit https://docs.sorosim.dev
2. Click the search bar (or press `Ctrl+K` / `⌘+K`)
3. Type a search query
4. Verify results appear

## Configuration Files

### `algolia-config.json`

This file configures what content is indexed and how:

```json
{
  "index_name": "sorosim",
  "start_urls": [
    {
      "url": "https://docs.sorosim.dev/docs/",
      "selectors_key": "docs"
    },
    {
      "url": "https://docs.sorosim.dev/blog/",
      "selectors_key": "blog"
    }
  ],
  "sitemap_urls": [
    "https://docs.sorosim.dev/sitemap.xml"
  ],
  "selectors": {
    "docs": {
      "lvl0": "Documentation",
      "lvl1": "article h1",
      "lvl2": "article h2",
      "lvl3": "article h3",
      "text": "article p, article li"
    }
  }
}
```

**Selectors Explanation:**
- `lvl0`: Top-level category (e.g., "Documentation", "Blog")
- `lvl1`: Main heading (h1)
- `lvl2`: Subheading (h2)
- `lvl3`: Sub-subheading (h3)
- `text`: Body content to index

### `docusaurus.config.js`

The Algolia configuration in Docusaurus:

```javascript
algolia: {
  appId: 'ABC123',           // Your app ID
  apiKey: 'xyz789',          // Public search key
  indexName: 'sorosim',      // Your index name
  contextualSearch: true,    // Enable context-aware search
  searchPagePath: 'search',  // Dedicated search page
}
```

## Customization

### Search Parameters

Customize search behavior with `searchParameters`:

```javascript
algolia: {
  // ... other config
  searchParameters: {
    facetFilters: ['language:en', 'version:latest'],
    hitsPerPage: 10,
  },
}
```

### Contextual Search

When `contextualSearch: true`, search results are filtered by:
- Current documentation version
- Current locale
- Current tag (docs vs blog)

### Custom Styling

Override search UI styles in `src/css/custom.css`:

```css
/* Search modal */
.DocSearch-Modal {
  --docsearch-primary-color: #7c3aed;
  --docsearch-text-color: #1c1e21;
}

/* Search button */
.DocSearch-Button {
  border-radius: 8px;
}

/* Search results */
.DocSearch-Hit {
  border-radius: 4px;
}
```

## Troubleshooting

### Search Bar Not Appearing

**Cause:** Missing or incorrect Algolia config

**Solution:**
1. Check `docusaurus.config.js` has `algolia` section
2. Verify all required fields are present
3. Clear cache: `npm run clear`
4. Rebuild: `npm run build`

### No Search Results

**Cause:** Index not yet populated

**Solutions:**
1. Wait for Algolia to crawl (happens daily)
2. Trigger manual crawl in Algolia dashboard
3. Check crawler logs for errors

### Search Results Outdated

**Cause:** Cache not invalidated

**Solutions:**
1. Wait for next daily crawl
2. Trigger manual recrawl
3. Check "Last crawl" time in dashboard

### "Index does not exist" Error

**Cause:** Index name mismatch

**Solution:**
- Verify `indexName` in config matches Algolia dashboard
- Check for typos
- Confirm index was created

## Monitoring

### Algolia Dashboard

Monitor search performance:
1. Go to [Algolia Dashboard](https://www.algolia.com/apps/)
2. Select your application
3. View:
   - **Search analytics:** Query volume, popular searches
   - **Crawler logs:** Last crawl status, errors
   - **Index stats:** Number of records, size

### Search Analytics

Track user behavior:
- Top searches
- No-result searches (improve content or add redirects)
- Click-through rates
- Search abandonment

## Best Practices

### Content Structure

For optimal search results:

✅ **Do:**
- Use clear, descriptive headings
- Include keywords in headings
- Write descriptive link text
- Use semantic HTML (h1, h2, h3)

❌ **Don't:**
- Use generic headings ("Introduction", "Overview")
- Bury keywords in paragraphs
- Use "click here" links
- Skip heading levels (h1 → h3)

### Metadata

Add frontmatter for better indexing:

```markdown
---
title: Mock Ledger Configuration Guide
description: Learn how to configure mock ledger state for testing
keywords: [mock, ledger, configuration, testing]
---
```

### Redirects

For moved/renamed pages, add redirects in `docusaurus.config.js`:

```javascript
presets: [
  [
    'classic',
    {
      docs: {
        // ...
        redirects: [
          {
            from: '/old-page',
            to: '/new-page',
          },
        ],
      },
    },
  ],
],
```

## Costs

**DocSearch is FREE for:**
- Open-source projects
- Technical documentation
- Non-commercial use

**If you need commercial search:**
- Pricing starts at $1/month for 10,000 requests
- See [algolia.com/pricing](https://www.algolia.com/pricing)

## Support

### DocSearch Support
- **Email:** docsearch@algolia.com
- **Forum:** [Algolia Community](https://discourse.algolia.com/)
- **Docs:** [docsearch.algolia.com/docs](https://docsearch.algolia.com/docs/)

### SoroSim Issues
- **GitHub:** [sorosim/sorosim-docs/issues](https://github.com/sorosim/sorosim-docs/issues)
- **Discord:** [discord.gg/stellar](https://discord.gg/stellar) (#sorosim)

## Alternatives

If DocSearch doesn't work for your use case:

1. **Local Search Plugin:** `@docusaurus/plugin-content-docs`
2. **Typesense DocSearch:** Open-source alternative
3. **Custom Search:** Build your own with Meilisearch or Elasticsearch

## Next Steps

After setup:
1. ✅ Monitor search analytics
2. ✅ Improve content based on popular searches
3. ✅ Add more keywords to pages
4. ✅ Fix pages with no results
5. ✅ Celebrate! 🎉

---

**Questions?** Ask in [GitHub Discussions](https://github.com/sorosim/sorosim-docs/discussions) or [Discord](https://discord.gg/stellar).
