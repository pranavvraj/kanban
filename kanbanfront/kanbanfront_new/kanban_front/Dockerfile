FROM node:20-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Production build
FROM nginx:stable-alpine AS production

# copy nginx configuration in side conf.d folder
COPY --from=builder /app/nginx /etc/nginx/conf.d

# Copy the build output from the dist folder into the Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 5173 (default 80) to allow access to the app
EXPOSE 5173

# Run Nginx in the foreground
ENTRYPOINT ["nginx", "-g", "daemon off;"]