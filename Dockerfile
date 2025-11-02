# # Build stage
# FROM node:20.18.0-alpine AS builder

# # ARG NEXT_PUBLIC_STORE_FRONT
# # ARG NEXT_PUBLIC_DOMAIN
# # ARG NEXT_PUBLIC_ACCENT_COLOR
# # ARG NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR
# # ARG NEXT_PUBLIC_LOGO_URL

# # ENV NEXT_PUBLIC_STORE_FRONT=$NEXT_PUBLIC_STORE_FRONT
# # ENV NEXT_PUBLIC_DOMAIN=$NEXT_PUBLIC_DOMAIN
# # ENV NEXT_PUBLIC_ACCENT_COLOR=$NEXT_PUBLIC_ACCENT_COLOR
# # ENV NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR=$NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR
# # ENV NEXT_PUBLIC_LOGO_URL=$NEXT_PUBLIC_LOGO_URL

# ARG NEXT_PUBLIC_STORE_FRONT
# ARG NEXT_PUBLIC_DOMAIN
# ARG NEXT_PUBLIC_ACCENT_COLOR
# ARG NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR
# ARG NEXT_PUBLIC_LOGO_URL
# ARG NEXT_PUBLIC_REACT_APP_API_URL
# ARG NEXT_PUBLIC_REXPAY_MODE
# ARG REXPAY_PUBLIC_KEY
# ARG REXPAY_SECRET_KEY
# ARG REXPAY_USERNAME
# ARG REXPAY_CLIENT_ID
# ARG NEXT_PUBLIC_REXPAY_CLIENT_ID
# ARG NEXT_PUBLIC_FONT_FAMILY
# ARG NEXT_PUBLIC_BANNER_URL
# ARG NEXT_PUBLIC_ENTITYCODE
# ARG NEXT_PUBLIC_SOURCE_CODE
# ARG NEXT_PUBLIC_STORE_CODE
# ARG NEXT_PUBLIC_REXPAY_PROD_USERNAME
# ARG NEXT_PUBLIC_REXPAY_PROD_CLIENT_ID
# ARG NEXT_PUBLIC_REXPAY_PROD_SECRET_KEY


# ENV NEXT_PUBLIC_STORE_FRONT=$NEXT_PUBLIC_STORE_FRONT
# ENV NEXT_PUBLIC_DOMAIN=$NEXT_PUBLIC_DOMAIN
# ENV NEXT_PUBLIC_ACCENT_COLOR=$NEXT_PUBLIC_ACCENT_COLOR
# ENV NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR=$NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR
# ENV NEXT_PUBLIC_LOGO_URL=$NEXT_PUBLIC_LOGO_URL
# ENV NEXT_PUBLIC_REACT_APP_API_URL=$NEXT_PUBLIC_REACT_APP_API_URL
# ENV NEXT_PUBLIC_REXPAY_MODE=$NEXT_PUBLIC_REXPAY_MODE
# ENV REXPAY_PUBLIC_KEY=$REXPAY_PUBLIC_KEY
# ENV REXPAY_SECRET_KEY=$REXPAY_SECRET_KEY
# ENV REXPAY_USERNAME=$REXPAY_USERNAME
# ENV REXPAY_CLIENT_ID=$REXPAY_CLIENT_ID
# ENV NEXT_PUBLIC_REXPAY_CLIENT_ID=$NEXT_PUBLIC_REXPAY_CLIENT_ID
# ENV NEXT_PUBLIC_FONT_FAMILY=$NEXT_PUBLIC_FONT_FAMILY
# ENV NEXT_PUBLIC_BANNER_URL=$NEXT_PUBLIC_BANNER_URL
# ENV NEXT_PUBLIC_ENTITYCODE=$NEXT_PUBLIC_ENTITYCODE
# ENV NEXT_PUBLIC_SOURCE_CODE=$NEXT_PUBLIC_SOURCE_CODE
# ENV NEXT_PUBLIC_STORE_CODE=$NEXT_PUBLIC_STORE_CODE
# ENV NEXT_PUBLIC_REXPAY_MODE=$NEXT_PUBLIC_REXPAY_MODE
# ENV NEXT_PUBLIC_REXPAY_PROD_USERNAME=$NEXT_PUBLIC_REXPAY_PROD_USERNAME
# ENV NEXT_PUBLIC_REXPAY_PROD_CLIENT_ID=$NEXT_PUBLIC_REXPAY_PROD_CLIENT_ID
# ENV NEXT_PUBLIC_REXPAY_PROD_SECRET_KEY=$NEXT_PUBLIC_REXPAY_PROD_SECRET_KEY


# # Install libc6-compat for Alpine compatibility
# RUN apk add --no-cache libc6-compat

# WORKDIR /app

# # Copy package files
# # COPY package.json yarn.lock ./
# COPY package.json package-lock.json ./

# # Install all dependencies (including devDependencies)
# RUN yarn install --frozen-lockfile

# # Copy source code
# COPY . .

# # Build the application
# RUN yarn build

# # Production stage
# FROM node:20.18.0-alpine AS runner

# # Install libc6-compat for Alpine compatibility
# RUN apk add --no-cache libc6-compat

# WORKDIR /app

# # Create non-root user
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# # Copy built application from builder stage
# COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
# COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
# COPY --from=builder --chown=nextjs:nodejs /app/yarn.lock ./yarn.lock

# # Install only production dependencies
# RUN yarn install --frozen-lockfile --production

# # Switch to non-root user
# USER nextjs

# # Expose port
# EXPOSE 3000

# # Set environment variables
# ENV NODE_ENV=production
# ENV PORT=3000
# ENV HOSTNAME="0.0.0.0"

# # Start the application
# CMD ["yarn", "start"]


# Build stage
FROM node:20.18.0-alpine AS builder

# Build-time args - match exactly what you pass in GitHub Actions
ARG NEXT_PUBLIC_STORE_FRONT
ARG NEXT_PUBLIC_DOMAIN
ARG NEXT_PUBLIC_ACCENT_COLOR
ARG NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR
ARG NEXT_PUBLIC_LOGO_URL
ARG NEXT_PUBLIC_BANNER_URL
ARG NEXT_PUBLIC_FONT_FAMILY
ARG NEXT_PUBLIC_ENTITYCODE
ARG NEXT_PUBLIC_REACT_APP_API_URL
ARG NEXT_PUBLIC_SOURCE_CODE
ARG NEXT_PUBLIC_REXPAY_USERNAME
ARG NEXT_PUBLIC_REXPAY_CLIENT_ID
ARG NEXT_PUBLIC_REXPAY_SECRET_KEY
ARG NEXT_PUBLIC_STORE_CODE
ARG NEXT_PUBLIC_REXPAY_MODE
ARG NEXT_PUBLIC_REXPAY_PROD_USERNAME
ARG NEXT_PUBLIC_REXPAY_PROD_CLIENT_ID
ARG NEXT_PUBLIC_REXPAY_PROD_SECRET_KEY

# Environment variables - use the exact same names
ENV NEXT_PUBLIC_STORE_FRONT=$NEXT_PUBLIC_STORE_FRONT
ENV NEXT_PUBLIC_DOMAIN=$NEXT_PUBLIC_DOMAIN
ENV NEXT_PUBLIC_ACCENT_COLOR=$NEXT_PUBLIC_ACCENT_COLOR
ENV NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR=$NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR
ENV NEXT_PUBLIC_LOGO_URL=$NEXT_PUBLIC_LOGO_URL
ENV NEXT_PUBLIC_BANNER_URL=$NEXT_PUBLIC_BANNER_URL
ENV NEXT_PUBLIC_FONT_FAMILY=$NEXT_PUBLIC_FONT_FAMILY
ENV NEXT_PUBLIC_ENTITYCODE=$NEXT_PUBLIC_ENTITYCODE
ENV NEXT_PUBLIC_REACT_APP_API_URL=$NEXT_PUBLIC_REACT_APP_API_URL
ENV NEXT_PUBLIC_SOURCE_CODE=$NEXT_PUBLIC_SOURCE_CODE
ENV NEXT_PUBLIC_REXPAY_USERNAME=$NEXT_PUBLIC_REXPAY_USERNAME
ENV NEXT_PUBLIC_REXPAY_CLIENT_ID=$NEXT_PUBLIC_REXPAY_CLIENT_ID
ENV NEXT_PUBLIC_REXPAY_SECRET_KEY=$NEXT_PUBLIC_REXPAY_SECRET_KEY
ENV NEXT_PUBLIC_STORE_CODE=$NEXT_PUBLIC_STORE_CODE
ENV NEXT_PUBLIC_REXPAY_MODE=$NEXT_PUBLIC_REXPAY_MODE
ENV NEXT_PUBLIC_REXPAY_PROD_USERNAME=$NEXT_PUBLIC_REXPAY_PROD_USERNAME
ENV NEXT_PUBLIC_REXPAY_PROD_CLIENT_ID=$NEXT_PUBLIC_REXPAY_PROD_CLIENT_ID
ENV NEXT_PUBLIC_REXPAY_PROD_SECRET_KEY=$NEXT_PUBLIC_REXPAY_PROD_SECRET_KEY

# Install build dependencies including Python 3 and build tools
RUN apk add --no-cache libc6-compat python3 make g++

# Set Python 3 as the default python
RUN ln -sf python3 /usr/bin/python

WORKDIR /app

# Copy package files first to leverage docker layer cache
COPY package.json pnpm-lock.yaml ./

# Enable corepack and install dependencies via pnpm
RUN corepack enable \
 && corepack prepare pnpm@9.15.1 --activate \
 && pnpm install --frozen-lockfile

# Copy the rest of the source
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:20.18.0-alpine AS runner

# Install libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copy only manifest files used for production install
COPY package.json pnpm-lock.yaml ./

# Disable corepack signature verification and install production deps
RUN corepack enable \
 && COREPACK_ENABLE_DOWNLOAD_PROMPT=0 corepack prepare pnpm@9.15.1 --activate \
 && pnpm install --prod --frozen-lockfile

# Copy built application and static assets from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables for runtime
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application directly with node to avoid corepack issues
CMD ["node", "node_modules/.bin/next", "start"]