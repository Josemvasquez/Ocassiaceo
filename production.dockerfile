# Alternative deployment option: Docker container for VPS hosting
# Use this if you prefer VPS hosting over GoDaddy shared hosting

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application
COPY dist/ ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S ocassia -u 1001

# Change ownership
RUN chown -R ocassia:nodejs /app
USER ocassia

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["node", "server.js"]