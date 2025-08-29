#!/usr/bin/env node
import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildForGitHubPages() {
  try {
    await build({
      root: path.resolve(__dirname, 'client'),
      base: './',
      build: {
        outDir: path.resolve(__dirname, 'dist/public'),
        emptyOutDir: true,
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "client", "src"),
          "@shared": path.resolve(__dirname, "shared"),
          "@assets": path.resolve(__dirname, "attached_assets"),
        },
      },
    });
    console.log('✅ Build completed successfully for GitHub Pages!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildForGitHubPages();