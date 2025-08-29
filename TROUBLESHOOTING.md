# GitHub Pages 404 Error - Troubleshooting Guide

## Common Issues and Solutions

### 1. Check GitHub Pages Settings
1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Make sure **Source** is set to "GitHub Actions" (NOT "Deploy from a branch")

### 2. Check if the Action Ran
1. Go to your repository
2. Click the **Actions** tab
3. Look for a workflow run after your last push
4. If it failed, click on it to see the error

### 3. Asset Path Issue (Most Common)
The built files have absolute paths (`/assets/...`) which don't work on GitHub Pages subdirectories.

**Solution A: Use the base path fix**
Update your package.json script to:
```json
"build:gh-pages": "vite build --base=./"
```

**Solution B: Alternative deployment**
Instead of the GitHub Actions workflow, try manual deployment:
```bash
npm run build:gh-pages
npm run deploy
```

### 4. Repository Name Issue
If your repository is named something other than `username.github.io`, your site will be at:
`https://username.github.io/repository-name/`

Make sure you're accessing the correct URL!

### 5. Check Build Output
Run locally to verify the build works:
```bash
npm run build:gh-pages
```
Check that `dist/public/index.html` exists and has correct paths.

### 6. Alternative: Force gh-pages Branch Deployment
If GitHub Actions isn't working:

1. **Change package.json build script:**
   ```json
   "build:gh-pages": "vite build --base=./"
   ```

2. **Deploy manually:**
   ```bash
   npm run build:gh-pages
   npm run deploy
   ```

3. **Change GitHub Pages settings:**
   - Go to Settings → Pages
   - Change Source to "Deploy from a branch"
   - Select "gh-pages" branch

## Quick Fix Commands

Try these in order:

```bash
# Fix 1: Build with correct base path
npm run build:gh-pages -- --base=./

# Fix 2: Deploy to gh-pages branch
npm run deploy

# Fix 3: If that doesn't work, try absolute base
npm run build:gh-pages -- --base=/your-repo-name/
npm run deploy
```

## Check Your Site
Your site should be at one of these URLs:
- `https://username.github.io/repository-name/`
- `https://username.github.io/` (if repo is named username.github.io)

## Still Having Issues?
1. Share your repository URL
2. Check the Actions tab for error messages
3. Verify the GitHub Pages settings are correct