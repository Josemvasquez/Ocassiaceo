#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Ocassia for GoDaddy production deployment...');

// Clean previous builds
console.log('🧹 Cleaning previous builds...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}

// Create dist directory structure
fs.mkdirSync('dist', { recursive: true });
fs.mkdirSync('dist/public', { recursive: true });

// Build frontend with Vite
console.log('⚛️ Building React frontend...');
execSync('npx vite build', { stdio: 'inherit' });

// Copy frontend build to dist/public
console.log('📁 Moving frontend files...');
if (fs.existsSync('dist')) {
  // Vite builds to dist by default, rename to dist-temp first
  if (fs.existsSync('dist-temp')) {
    fs.rmSync('dist-temp', { recursive: true });
  }
  fs.renameSync('dist', 'dist-temp');
  fs.mkdirSync('dist', { recursive: true });
  fs.mkdirSync('dist/public', { recursive: true });
  
  // Copy all files from dist-temp to dist/public
  execSync('cp -r dist-temp/* dist/public/', { stdio: 'inherit' });
  
  // Clean up temp directory
  fs.rmSync('dist-temp', { recursive: true });
} else {
  console.error('❌ Frontend build directory not found');
  process.exit(1);
}

// Build backend with esbuild
console.log('🛠️ Building Express server...');
try {
  execSync('npx esbuild server/index.ts --bundle --platform=node --target=node18 --outfile=dist/server.js --external:pg-native --external:@neondatabase/serverless', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Backend build failed:', error.message);
  process.exit(1);
}

// Create production package.json
console.log('📦 Creating production package.json...');
const productionPackage = {
  "name": "ocassia-production",
  "version": "1.0.0",
  "description": "Ocassia - Personal Relationship Manager",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.10.0",
    "express": "^4.18.0",
    "express-session": "^1.17.0",
    "passport": "^0.7.0",
    "openid-client": "^5.6.0",
    "connect-pg-simple": "^9.0.0",
    "drizzle-orm": "^0.33.0",
    "ws": "^8.18.0"
  }
}

fs.writeFileSync('dist/package.json', JSON.stringify(productionPackage, null, 2));

// Create .htaccess for React Router support
console.log('🔧 Creating .htaccess for SPA routing...');
const htaccess = `RewriteEngine On
RewriteBase /

# Handle React Router client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache static assets
<FilesMatch "\\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
  ExpiresActive On
  ExpiresDefault "access plus 1 month"
  Header set Cache-Control "public, immutable"
</FilesMatch>`;

fs.writeFileSync('dist/public/.htaccess', htaccess);

// Create environment template
console.log('🔐 Creating environment template...');
const envTemplate = `# Ocassia Production Environment Variables
# Copy this to .env and fill in your actual values

# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name

# Session Security
SESSION_SECRET=your_super_secure_session_secret_here

# OpenAI Integration
OPENAI_API_KEY=your_openai_api_key_here

# Replit Auth (if using)
REPL_ID=your_repl_id
ISSUER_URL=https://replit.com/oidc
REPLIT_DOMAINS=yourdomain.com

# Production Settings
NODE_ENV=production
PORT=3000`;

fs.writeFileSync('dist/.env.template', envTemplate);

// Create deployment guide
console.log('📋 Creating deployment guide...');
const deploymentGuide = `# Ocassia GoDaddy Deployment Guide

## Files to Upload

1. **Upload these files to your GoDaddy hosting account:**
   - All files from the \`dist/public/\` directory → Root web directory
   - \`dist/server.js\` → Node.js app directory
   - \`dist/package.json\` → Node.js app directory

## GoDaddy Setup Steps

### 1. Enable Node.js
- Go to your GoDaddy hosting control panel
- Navigate to "Web Applications" or "Hosting"
- Enable Node.js for your account
- Select Node.js version 18 or higher

### 2. Upload Frontend Files
- Upload all contents of \`dist/public/\` to your website's root directory
- This includes: index.html, assets folder, .htaccess

### 3. Setup Node.js Backend
- Create a new Node.js application in your control panel
- Upload \`server.js\` and \`package.json\` to the app directory
- Set startup file to \`server.js\`

### 4. Configure Environment Variables
- In your Node.js app settings, add these environment variables:
  - DATABASE_URL (your PostgreSQL connection string)
  - SESSION_SECRET (generate a secure random string)
  - OPENAI_API_KEY (your OpenAI API key)
  - NODE_ENV=production
  - PORT=3000

### 5. Database Setup
- Option A: Use Neon PostgreSQL (recommended)
  - Sign up at neon.tech
  - Create a database
  - Copy connection string to DATABASE_URL
- Option B: Use GoDaddy's PostgreSQL
  - Enable PostgreSQL in your hosting plan
  - Create database and user
  - Update DATABASE_URL accordingly

### 6. Test Deployment
- Visit your domain to test the frontend
- Check that API endpoints work: yourdomain.com/api/auth/user
- Monitor error logs in GoDaddy control panel

## Important Notes

- **SSL Certificate**: Enable SSL in GoDaddy for HTTPS
- **Domain Configuration**: Point your domain to the hosting account
- **Database Migrations**: Run \`npm run db:push\` after deployment
- **Error Monitoring**: Check GoDaddy logs for any issues

## Troubleshooting

**Frontend not loading**: Check .htaccess file is uploaded
**API errors**: Verify environment variables are set correctly
**Database connection**: Ensure DATABASE_URL is correct and accessible
**Session issues**: Generate a strong SESSION_SECRET

## Security Checklist

✅ Enable HTTPS/SSL
✅ Set strong SESSION_SECRET
✅ Use environment variables for secrets
✅ Enable security headers via .htaccess
✅ Restrict database access to your app only`;

fs.writeFileSync('dist/DEPLOYMENT_GUIDE.md', deploymentGuide);

console.log('✅ Production build complete!');
console.log('');
console.log('📁 Files ready for GoDaddy deployment:');
console.log('   - dist/public/* → Upload to website root');
console.log('   - dist/server.js + package.json → Upload to Node.js app');
console.log('   - See DEPLOYMENT_GUIDE.md for detailed instructions');
console.log('');
console.log('🚀 Ready to deploy to your GoDaddy domain!');