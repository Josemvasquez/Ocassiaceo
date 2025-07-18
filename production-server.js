// Production server configuration for GoDaddy hosting
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Import your existing server setup
// Note: This assumes your server code is built into a single file
const { registerRoutes } = require('./dist/server');

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, 'dist/public')));

// API routes
registerRoutes(app);

// Catch-all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Ocassia server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 Shutting down gracefully...');
  process.exit(0);
});