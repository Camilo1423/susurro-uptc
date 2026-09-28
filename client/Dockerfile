# syntax=docker/dockerfile:1.7

##############################
# Etapa 1: Dependencias (Node 22)
##############################
FROM node:22.12.0-bookworm AS deps
WORKDIR /app

# Copiamos solo manifest para aprovechar cache de dependencias
COPY package*.json ./

# Instala dependencias con cache de npm (BuildKit)
RUN --mount=type=cache,target=/root/.npm npm ci

##############################
# Etapa 2: Build (Node 22)
##############################
FROM node:22.12.0-bookworm AS build
WORKDIR /app

# Traemos node_modules ya resueltos
COPY --from=deps /app/node_modules ./node_modules
# Copiamos el resto del código
COPY . .

# (Opcional) variables de build
ARG URL_API_GATEWAY
ARG IS_PRODUCTION=true
ARG ENV=production
ENV URL_API_GATEWAY=$URL_API_GATEWAY
ENV IS_PRODUCTION=$IS_PRODUCTION
ENV ENV=$ENV
ENV NODE_ENV=$ENV

# Construir la aplicación con Vite
RUN npm run build

##############################
# Etapa 3: Runtime (Nginx)
##############################
FROM nginx:1.27-alpine AS runner

# (Opcional) elimina contenido por defecto — no es estrictamente necesario
RUN rm -rf /usr/share/nginx/html/*

# Copiamos la carpeta de build de Vite
COPY --from=build /app/dist /usr/share/nginx/html

# (Opcional) Si tu app es SPA con rutas en el cliente, habilita fallback:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
