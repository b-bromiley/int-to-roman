# Multi-stage Dockerfile for Roman Numeral Converter
# Builds both backend and frontend in a single container

# Stage 1: Build backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm ci

# Copy backend source code
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Build backend
RUN npm run build

# Stage 2: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source code
COPY frontend/src ./src
COPY frontend/public ./public
COPY frontend/tsconfig.json ./

# Build frontend
RUN npm run build

# Stage 3: Production runtime
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy backend from builder
COPY --from=backend-builder --chown=nodejs:nodejs /app/backend/dist ./backend/dist
COPY --from=backend-builder --chown=nodejs:nodejs /app/backend/package*.json ./backend/
COPY --from=backend-builder --chown=nodejs:nodejs /app/backend/node_modules ./backend/node_modules

# Copy frontend build from builder
COPY --from=frontend-builder --chown=nodejs:nodejs /app/frontend/build ./frontend/build

# Create logs directory
RUN mkdir -p /app/logs && chown nodejs:nodejs /app/logs

# Switch to non-root user
USER nodejs

# Expose ports
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "backend/dist/index.js"] 