#!/usr/bin/env node

import { build } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Building Ocassia frontend for Vercel...');

try {
  await build({
    root: __dirname,
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  });
  console.log('✅ Frontend build complete!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}