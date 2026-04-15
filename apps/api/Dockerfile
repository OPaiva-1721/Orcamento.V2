# ── Stage 1: builder ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace manifests first for better layer caching
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/validators/package.json   ./packages/validators/
COPY packages/pdf/package.json          ./packages/pdf/
COPY packages/db/package.json           ./packages/db/
COPY apps/api/package.json              ./apps/api/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Build shared packages then the API
RUN pnpm --filter @orcamento/shared-types build
RUN pnpm --filter @orcamento/validators   build
RUN pnpm --filter @orcamento/pdf          build
RUN pnpm --filter @orcamento/db           build
RUN pnpm --filter api                     build

# ── Stage 2: runner ───────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace manifests (production deps only)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/validators/package.json   ./packages/validators/
COPY packages/pdf/package.json          ./packages/pdf/
COPY packages/db/package.json           ./packages/db/
COPY apps/api/package.json              ./apps/api/

# Install production deps only
RUN pnpm install --frozen-lockfile --prod

# Copy compiled output from builder
COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=builder /app/packages/validators/dist   ./packages/validators/dist
COPY --from=builder /app/packages/pdf/dist          ./packages/pdf/dist
COPY --from=builder /app/packages/db/dist           ./packages/db/dist
COPY --from=builder /app/apps/api/dist              ./apps/api/dist

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "dist/main"]
