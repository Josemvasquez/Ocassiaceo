#!/usr/bin/env node

import { execSync } from 'child_process';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🚀 Building Ocassia for Vercel deployment...');

try {
  // Build the client (frontend)
  console.log('📦 Building client...');
  execSync('npm run build', { stdio: 'inherit', cwd: 'client' });
  
  // Build the server (backend)
  console.log('🖥️ Building server...');
  execSync('npm run build:server', { stdio: 'inherit' });
  
  // Copy important files to dist
  console.log('📋 Copying configuration files...');
  if (!existsSync('dist')) mkdirSync('dist');
  
  // Copy package.json for Vercel
  copyFileSync('package.json', 'dist/package.json');
  
  console.log('✅ Build complete! Ready for Vercel deployment.');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}