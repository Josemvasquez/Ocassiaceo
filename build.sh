#!/bin/bash

echo "🚀 Building Ocassia for Vercel..."

# Install dependencies
npm install

# Build with Vite
npx vite build

echo "✅ Build complete!"