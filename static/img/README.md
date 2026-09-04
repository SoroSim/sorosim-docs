# Social Preview Image Guide

## Overview

The social preview image is displayed when someone shares a SoroSim documentation link on:
- Twitter/X
- LinkedIn
- Facebook
- Discord
- Slack
- Other platforms supporting OpenGraph

## Image Specifications

### Required Dimensions

**Primary (OpenGraph & Twitter Large Card):**
- Width: 1200px
- Height: 630px
- Aspect Ratio: 1.91:1
- Format: JPG or PNG
- Max Size: < 1MB (ideally < 300KB)

### Design Guidelines

**Content:**
- SoroSim logo (prominent)
- Tagline: "Soroban Contract Simulation & Testing Tool"
- Key value proposition
- Visual elements (code snippet, state diff, etc.)
- Brand colors (purple #7c3aed)

**Typography:**
- Large, readable text (min 60px for main text)
- High contrast (dark text on light background or vice versa)
- Sans-serif fonts preferred

**Safe Zones:**
- Keep important content 40px from edges
- Center-weighted design (some platforms crop)

## Creating the Image

### Option 1: Design Tool (Figma/Canva)

**Figma Template:**
```
1. Create 1200x630px frame
2. Add background (gradient or solid)
3. Add SoroSim logo
4. Add headline: "SoroSim"
5. Add tagline: "Soroban Contract Simulation & Testing"
6. Add visual element (code snippet, mockup)
7. Export as JPG (quality: 85%)
```

**Canva Template:**
- Use "Social Media" → "Twitter Post" (1200x630)
- Follow design guidelines above
- Download as JPG

### Option 2: Code-Generated (Node.js)

Install dependencies:
```bash
npm install canvas
```

Generate image:
```javascript
const { createCanvas } = require('canvas');
const fs = require('fs');

const width = 1200;
const height = 630;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Background gradient
const gradient = ctx.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, '#7c3aed');
gradient.addColorStop(1, '#a78bfa');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// Title
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 80px sans-serif';
ctx.textAlign = 'center';
ctx.fillText('SoroSim', width / 2, height / 2 - 50);

// Subtitle
ctx.font = '40px sans-serif';
ctx.fillText('Soroban Contract Simulation & Testing', width / 2, height / 2 + 50);

// Save
const buffer = canvas.toJPEG({ quality: 0.85 });
fs.writeFileSync('./sorosim-social-card.jpg', buffer);
```

Run:
```bash
node generate-social-image.js
```

### Option 3: Screenshot Tool

Use a browser screenshot tool:
1. Design HTML page with 1200x630 viewport
2. Screenshot with browser DevTools
3. Crop and optimize

## File Location

Place the generated image at:
```
static/img/sorosim-social-card.jpg
```

This path is configured in `docusaurus.config.js`:
```javascript
image: 'img/sorosim-social-card.jpg'
```

## Optimization

**Compress the image:**
```bash
# Using ImageMagick
convert sorosim-social-card.jpg -quality 85 -strip sorosim-social-card-optimized.jpg

# Using TinyPNG (online)
# Visit tinypng.com and upload
```

**Target size:** < 300KB

## Testing

### Test Locally

**Meta Tags Validator:**
1. Build site: `npm run build`
2. Serve: `npm run serve`
3. Visit: http://localhost:3000
4. View page source, check `<meta property="og:image" ...>`

### Test on Platforms

**Twitter Card Validator:**
- Visit: https://cards-dev.twitter.com/validator
- Enter URL: https://docs.sorosim.dev
- Check preview

**Facebook Sharing Debugger:**
- Visit: https://developers.facebook.com/tools/debug/
- Enter URL: https://docs.sorosim.dev
- Check preview and scrape info

**LinkedIn Post Inspector:**
- Visit: https://www.linkedin.com/post-inspector/
- Enter URL: https://docs.sorosim.dev
- Check preview

**OpenGraph Preview:**
- Visit: https://www.opengraph.xyz/
- Enter URL: https://docs.sorosim.dev
- Check preview across platforms

## Example Design

```
┌────────────────────────────────────────────────┐
│                                                │
│         ┌──────────┐                          │
│         │  LOGO    │      SoroSim             │
│         └──────────┘                          │
│                                                │
│     Soroban Contract Simulation & Testing     │
│                                                │
│   ┌──────────────────────────────────────┐   │
│   │  simulate                             │   │
│   │  ✓ Result: Success                   │   │
│   │  ~ Balance: 1000 → 500               │   │
│   └──────────────────────────────────────┘   │
│                                                │
│   Visual State Inspection • No Testnet        │
│                                                │
└────────────────────────────────────────────────┘
```

## Branding Assets

**Colors:**
- Primary Purple: `#7c3aed`
- Light Purple: `#a78bfa`
- Dark Purple: `#5b21b6`
- White: `#ffffff`

**Fonts:**
- Headings: Inter, SF Pro, system-ui
- Body: Same as headings

**Logo:**
- Place SVG logo in `static/img/logo.svg`
- Use on social card if available

## Common Issues

### Image Not Showing

**Causes:**
1. Wrong path in config
2. Image > 1MB (some platforms reject)
3. Invalid format
4. Not deployed yet

**Solutions:**
1. Check `docusaurus.config.js` path
2. Compress image
3. Use JPG or PNG
4. Deploy and wait 5 minutes for cache

### Different Preview on Different Platforms

**Cause:** Platforms cache differently

**Solution:** 
- Wait 24 hours for cache expiration
- Force refresh on platform debugger
- Change filename (cache bust)

### Image Cropped

**Cause:** Platform crops to different aspect ratio

**Solution:**
- Keep important content in center
- Use safe zones (40px margins)
- Test on multiple platforms

## Per-Page Social Images

For specific pages, add frontmatter:

```markdown
---
title: My Guide
image: /img/my-guide-social.jpg
---
```

This overrides the default social card for that page.

## Automation

Generate social images automatically:
- Use GitHub Actions
- Generate on page creation
- Update when content changes

**Example workflow:**
```yaml
name: Generate Social Images
on: [push]
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: node scripts/generate-social-images.js
      - uses: stefanzweifel/git-auto-commit-action@v4
```

## Resources

- **OpenGraph Protocol:** https://ogp.me/
- **Twitter Cards:** https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
- **Image Optimization:** https://tinypng.com/
- **Design Inspiration:** https://www.opengraph.xyz/gallery

---

**Questions?** Ask in [GitHub Discussions](https://github.com/sorosim/sorosim-docs/discussions).
