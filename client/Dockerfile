# syntax=docker/dockerfile:1

# ─────────────────────────── Build ───────────────────────────
FROM node:22.12.0-bookworm AS builder
WORKDIR /app

# El cliente hornea el entorno en build (build-process.js lee process.env):
# - URL_API_GATEWAY: URL PÚBLICA del backend a la que llega el navegador.
# - IS_PRODUCTION / ENV: marcan el build de producción.
ARG URL_API_GATEWAY
ARG IS_PRODUCTION=true
ARG ENV=production
ENV URL_API_GATEWAY=$URL_API_GATEWAY
ENV IS_PRODUCTION=$IS_PRODUCTION
ENV ENV=$ENV

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ─────────────────────────── Serve (Nginx) ───────────────────────────
FROM nginx:1.27-alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
