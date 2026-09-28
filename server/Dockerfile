# syntax=docker/dockerfile:1

# ─────────────────────────── Build ───────────────────────────
FROM node:22-slim AS builder
WORKDIR /app

# openssl: requerido por las herramientas de Prisma.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

# Instala dependencias (con dev, para compilar y para el CLI de Prisma).
COPY package*.json ./
RUN npm ci

# Copia el código y genera el cliente Prisma ANTES de compilar (queda en
# src/generated/prisma y `nest build` lo compila a dist/generated/prisma).
COPY . .
RUN npx prisma generate && npm run build

# ─────────────────────────── Runtime ───────────────────────────
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

# Reutilizamos node_modules del builder: trae el cliente Prisma generado, el CLI
# de Prisma (para `migrate deploy`) y los binarios nativos (sharp) ya resueltos.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
# Aplica migraciones pendientes y arranca la API.
ENTRYPOINT ["docker-entrypoint.sh"]
