import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🚀 Starting Vercel build for Ocassia...');

try {
  // Check if vite is available
  if (!existsSync('./node_modules/.bin/vite')) {
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // Build frontend only
  console.log('Building frontend...');
  execSync('./node_modules/.bin/vite build', { stdio: 'inherit' });
  
  console.log('✅ Build complete!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}