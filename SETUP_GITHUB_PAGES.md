# GitHub Pages Setup - Action Required

## ⚠️ Manual Step Required

The GitHub Actions deployment is failing because **GitHub Pages is not enabled** for this repository.

## Quick Setup (2 minutes)

### Step 1: Enable GitHub Pages

1. **Go to repository settings:**
   ```
   https://github.com/SoroSim/sorosim-docs/settings/pages
   ```

2. **Configure Source:**
   - Find the "Build and deployment" section
   - Under "Source", select: **GitHub Actions**
   - Click **Save**

### Step 2: Trigger Deployment

Option A - Re-run failed workflow:
1. Go to: https://github.com/SoroSim/sorosim-docs/actions
2. Click on the most recent failed workflow
3. Click "Re-run all jobs" button

Option B - Push any commit:
```bash
git commit --allow-empty -m "chore: trigger deployment"
git push origin main
```

## Verification

After deployment completes (~2 minutes), your site will be live at:

**Default URL:**
```
https://sorosim.github.io/sorosim-docs/
```

## Optional: Custom Domain

If you want to use a custom domain (e.g., docs.sorosim.dev):

1. Go to Settings → Pages
2. Under "Custom domain", enter: `docs.sorosim.dev`
3. Add DNS CNAME record:
   ```
   Type: CNAME
   Name: docs
   Value: sorosim.github.io
   ```
4. Wait for DNS propagation (5-10 minutes)
5. Check "Enforce HTTPS"

## Troubleshooting

### Still getting 404 error?
- Wait 2-3 minutes after enabling Pages
- Clear browser cache
- Check Actions tab for deployment status

### Permissions error?
Go to: Settings → Actions → General → Workflow permissions
- Select: "Read and write permissions"
- Check: "Allow GitHub Actions to create and approve pull requests"

## Need Help?

- GitHub Pages Docs: https://docs.github.com/pages
- SoroSim Discord: https://discord.gg/stellar (#sorosim)

---

**Delete this file after GitHub Pages is configured.**
