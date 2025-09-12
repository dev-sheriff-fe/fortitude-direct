# Build stage
FROM node:18-alpine AS builder

ARG NEXT_PUBLIC_STORE_FRONT
ARG NEXT_PUBLIC_DOMAIN
ARG NEXT_PUBLIC_ACCENT_COLOR
ARG NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR
ARG NEXT_PUBLIC_LOGO_URL

ENV NEXT_PUBLIC_STORE_FRONT=$NEXT_PUBLIC_STORE_FRONT
ENV NEXT_PUBLIC_DOMAIN=$NEXT_PUBLIC_DOMAIN
ENV NEXT_PUBLIC_ACCENT_COLOR=$NEXT_PUBLIC_ACCENT_COLOR
ENV NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR=$NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR
ENV NEXT_PUBLIC_LOGO_URL=$NEXT_PUBLIC_LOGO_URL


# Install libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install all dependencies (including devDependencies)
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:18-alpine AS runner

# Install libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/yarn.lock ./yarn.lock

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["yarn", "start"]
