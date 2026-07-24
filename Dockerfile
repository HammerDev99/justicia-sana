# Dockerfile multi-stage para Justicia Sana (Astro estático)
# Patrón de despliegue: HammerDev99/blog-sprintjudicial (VPS SprintJudicial, EasyPanel + Traefik)

# Etapa 1: build del sitio Astro
FROM node:22-alpine AS builder

WORKDIR /src

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2: servidor estático Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /src/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1
