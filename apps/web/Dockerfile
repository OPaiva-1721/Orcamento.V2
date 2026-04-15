# ── Stage 1: builder ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Workspace manifests for layer caching
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/validators/package.json   ./packages/validators/
COPY apps/web/package.json              ./apps/web/

RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/shared-types/ ./packages/shared-types/
COPY packages/validators/   ./packages/validators/
COPY apps/web/              ./apps/web/

# Build shared packages then Vite SPA
RUN pnpm --filter @orcamento/shared-types build
RUN pnpm --filter @orcamento/validators   build
RUN pnpm --filter web                     build

# ── Stage 2: nginx static server ──────────────────────────────────────────────
FROM nginx:stable-alpine AS runner

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# SPA fallback: redirect all 404s to index.html so React Router works
RUN echo 'server { \
  listen 80; \
  root /usr/share/nginx/html; \
  index index.html; \
  location / { try_files $uri $uri/ /index.html; } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
