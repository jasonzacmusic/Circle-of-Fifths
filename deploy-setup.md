# GitHub Pages Deployment Setup

## Manual Setup Steps

Since the package.json cannot be modified automatically, you'll need to add these scripts manually:

### 1. Add to package.json scripts section:

```json
"build:gh-pages": "vite build",
"predeploy": "npm run build:gh-pages", 
"deploy": "gh-pages -d dist/public"
```

Your scripts section should look like:
```json
"scripts": {
  "dev": "NODE_ENV=development tsx server/index.ts",
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "build:gh-pages": "vite build",
  "start": "NODE_ENV=production node dist/index.js",
  "check": "tsc",
  "db:push": "drizzle-kit push",
  "predeploy": "npm run build:gh-pages",
  "deploy": "gh-pages -d dist/public"
}
```

### 2. GitHub Repository Setup:

1. **Create a new repository** on GitHub (if you haven't already)
2. **Push your code** to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "GitHub Actions" as the source

### 3. Deploy Options:

**Option A: Automatic Deployment (Recommended)**
- The GitHub Actions workflow is already configured in `.github/workflows/deploy.yml`
- Every push to `main` branch will automatically deploy to GitHub Pages
- Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

**Option B: Manual Deployment**
```bash
npm run deploy
```

### 4. Important Notes:

- **Frontend-only deployment**: GitHub Pages only hosts static files, so only the React frontend will work
- **No backend features**: Database operations, API routes, and server-side functionality won't work on GitHub Pages
- **Pure client-side**: The Circle of Fifths visualizer and audio features will work perfectly
- **HTTPS required**: Audio features require HTTPS, which GitHub Pages provides automatically

### 5. Build Configuration:

The build will:
- Generate static files in `dist/public/`
- Include all client-side assets and code
- Work as a standalone React application
- Maintain the Circle of Fifths functionality and audio features

### 6. Testing Locally:

Before deploying, test the built version:
```bash
npm run build:gh-pages
# Serve the dist/public folder with any static server
```

## What Works on GitHub Pages:
✅ Circle of Fifths visualization  
✅ All 6 modes (Scales, Intervals, Chords, Modes, Random, Cadences)  
✅ Audio playback with Tone.js  
✅ Your hand-drawn scale patterns  
✅ Geometric shape drawing  
✅ Interactive controls  

## What Won't Work:
❌ Pattern saving/loading (requires database)  
❌ User authentication  
❌ Server-side API calls  

The core music theory visualization and audio features will work perfectly!