# Quick GitHub Pages Deployment Guide

## Step 1: Add Scripts to package.json

Open `package.json` and add these two lines to the "scripts" section:

```json
"build:gh-pages": "vite build",
"deploy": "gh-pages -d dist/public"
```

## Step 2: Create GitHub Repository

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Circle of Fifths Visualizer"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## Step 3: Enable GitHub Pages

1. Go to repository Settings → Pages
2. Select "GitHub Actions" as the source
3. The workflow is already configured!

## Step 4: Deploy

**Automatic**: Every push to main branch deploys automatically

**Manual**: Run `npm run deploy`

## Your site will be live at:
`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

## What Works:
✅ Complete Circle of Fifths visualization  
✅ All audio features with Tone.js  
✅ Your custom scale patterns  
✅ All 6 modes and controls  

The app will work perfectly as a static site!