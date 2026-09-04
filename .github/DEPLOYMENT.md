# Deployment Guide

This document explains how to deploy SoroSim documentation to GitHub Pages.

## Overview

The documentation site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

**Live URL:** https://sorosim.github.io/sorosim-docs/

Or with custom domain: https://docs.sorosim.dev

## Automatic Deployment

### How It Works

1. Push commits to `main` branch
2. GitHub Actions workflow triggers (`deploy.yml`)
3. Docusaurus site builds
4. Artifact uploaded to GitHub Pages
5. Site deployed automatically
6. Available at URL within ~2 minutes

### Workflow File

Location: `.github/workflows/deploy.yml`

**Triggers:**
- Push to `main` branch
- Manual dispatch (Actions tab)

**Jobs:**
1. **Build** - Installs dependencies and builds site
2. **Deploy** - Deploys build artifact to GitHub Pages

## Manual Deployment

### Prerequisites

```bash
# Install dependencies
npm install

# Build site
npm run build
```

### Deploy with Script

```bash
# Using deployment script (if configured)
GIT_USER=<Your GitHub username> npm run deploy
```

Or with SSH:

```bash
USE_SSH=true npm run deploy
```

### Deploy Manually

```bash
# Build production site
npm run build

# Commit build directory
git add build
git commit -m "Deploy website"

# Push to gh-pages branch
git subtree push --prefix build origin gh-pages
```

## GitHub Pages Setup

### Initial Setup

1. **Enable GitHub Pages:**
   - Go to repository Settings
   - Navigate to "Pages" section
   - Source: "GitHub Actions"
   - Save

2. **Configure Base URL:**
   
   In `docusaurus.config.js`:
   ```javascript
   const config = {
     url: 'https://sorosim.github.io',
     baseUrl: '/sorosim-docs/',
     // Or for custom domain:
     // url: 'https://docs.sorosim.dev',
     // baseUrl: '/',
   };
   ```

3. **Set Permissions:**
   
   Repository Settings → Actions → General → Workflow permissions:
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create and approve pull requests

## Custom Domain

### Setup Custom Domain

1. **Add CNAME File:**
   
   Create `static/CNAME`:
   ```
   docs.sorosim.dev
   ```

2. **Configure DNS:**
   
   Add DNS records:
   ```
   Type: CNAME
   Name: docs
   Value: sorosim.github.io
   ```

3. **Enable in GitHub:**
   
   Repository Settings → Pages → Custom domain:
   - Enter: `docs.sorosim.dev`
   - ✅ Enforce HTTPS
   - Save

4. **Update Config:**
   
   In `docusaurus.config.js`:
   ```javascript
   const config = {
     url: 'https://docs.sorosim.dev',
     baseUrl: '/',
   };
   ```

### Verify Custom Domain

Wait 5-10 minutes, then verify:
```bash
dig docs.sorosim.dev +short
# Should show: sorosim.github.io
```

Visit: https://docs.sorosim.dev

## Testing Before Deploy

### Local Testing

```bash
# Build production version
npm run build

# Serve locally
npm run serve

# Visit: http://localhost:3000
```

### Test in PR

Every pull request triggers test workflow (`.github/workflows/test.yml`):
- ✅ Installs dependencies
- ✅ Runs linting (if configured)
- ✅ Builds site
- ✅ Checks for broken links (optional)

**Status visible in PR checks.**

## Deployment Checklist

Before deploying:

- [ ] All content reviewed
- [ ] Links tested (no broken links)
- [ ] Images optimized (< 300KB)
- [ ] Social preview image added
- [ ] Meta tags verified
- [ ] Build succeeds locally (`npm run build`)
- [ ] Site tested locally (`npm run serve`)
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Fast page load (< 3s)

## Troubleshooting

### Deployment Failed

**Check workflow logs:**
1. Go to repository → Actions tab
2. Click on failed workflow
3. Check job logs for errors

**Common issues:**

1. **Build failed:**
   ```
   Error: Command failed: npm run build
   ```
   - Fix: Run `npm run build` locally to identify error
   - Check for broken markdown links
   - Verify all images exist

2. **Permission denied:**
   ```
   Error: Resource not accessible by integration
   ```
   - Fix: Check workflow permissions in Settings → Actions

3. **Deployment timeout:**
   ```
   Error: Deployment timed out
   ```
   - Fix: Try manual re-run in Actions tab

### Site Not Updating

**Possible causes:**

1. **Browser cache:**
   - Solution: Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
   - Clear browser cache

2. **CDN cache:**
   - Solution: Wait 5-10 minutes
   - GitHub Pages uses CDN with ~5min cache

3. **Wrong branch:**
   - Solution: Verify changes pushed to `main`
   - Check GitHub Actions ran successfully

4. **Base URL mismatch:**
   - Solution: Verify `baseUrl` in `docusaurus.config.js`
   - Should be `/sorosim-docs/` for GitHub Pages
   - Should be `/` for custom domain

### Custom Domain Not Working

**Check:**

1. **CNAME file:**
   ```bash
   # Should exist in static/CNAME
   cat static/CNAME
   # Output: docs.sorosim.dev
   ```

2. **DNS configuration:**
   ```bash
   dig docs.sorosim.dev +short
   # Should show: sorosim.github.io
   ```

3. **GitHub Pages settings:**
   - Go to Settings → Pages
   - Verify custom domain is set
   - Check "Enforce HTTPS" is enabled

### 404 Errors

**Cause:** Base URL mismatch

**Solution:**

For GitHub Pages (no custom domain):
```javascript
baseUrl: '/sorosim-docs/',
```

For custom domain:
```javascript
baseUrl: '/',
```

## Rollback

To rollback a deployment:

### Option 1: Revert Commit

```bash
# Find commit to revert
git log

# Revert commit
git revert <commit-hash>

# Push to main
git push origin main

# Automatic redeploy with reverted changes
```

### Option 2: Deploy Previous Version

```bash
# Checkout previous version
git checkout <previous-commit>

# Force deploy
GIT_USER=<username> npm run deploy
```

## Monitoring

### GitHub Actions Status

**Badge for README:**
```markdown
[![Deploy Status](https://github.com/sorosim/sorosim-docs/actions/workflows/deploy.yml/badge.svg)](https://github.com/sorosim/sorosim-docs/actions/workflows/deploy.yml)
```

### Uptime Monitoring

Use external services:
- **UptimeRobot:** https://uptimerobot.com
- **Pingdom:** https://pingdom.com
- **StatusCake:** https://statuscake.com

**Monitor:** https://docs.sorosim.dev

**Alert on:** 
- Site down (5xx errors)
- Slow response (> 3s)
- SSL certificate expiry

## Performance

### Optimization

1. **Image optimization:**
   ```bash
   # Compress images
   npm install -g imageoptim-cli
   imageoptim static/img/**/*
   ```

2. **Code splitting:**
   - Docusaurus handles automatically
   - Lazy loads pages

3. **CDN:**
   - GitHub Pages uses CDN by default
   - Or use Cloudflare for custom domain

### Metrics

Check performance:
- **Lighthouse:** Chrome DevTools → Lighthouse
- **PageSpeed Insights:** https://pagespeed.web.dev
- **GTmetrix:** https://gtmetrix.com

**Target scores:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

## Security

### HTTPS

GitHub Pages provides free SSL certificates:
- Auto-enabled for `*.github.io` domains
- Auto-enabled for custom domains
- ✅ Always enforce HTTPS

### Content Security

**Best practices:**
- Don't commit secrets
- Don't expose API keys
- Sanitize user content
- Keep dependencies updated

## Staging Environment

For testing before production:

1. **Create staging branch:**
   ```bash
   git checkout -b staging
   ```

2. **Deploy to separate Pages site:**
   - Create new repo: `sorosim-docs-staging`
   - Configure Pages
   - Deploy staging branch

3. **Or use Netlify:**
   - Connect GitHub repo
   - Deploy preview for each PR
   - Free for open source

## Support

**Deployment issues:**
- GitHub Discussions: https://github.com/sorosim/sorosim-docs/discussions
- Discord: https://discord.gg/stellar (#sorosim)

**GitHub Pages support:**
- Docs: https://docs.github.com/pages
- Status: https://www.githubstatus.com

---

**Last Updated:** January 15, 2024
