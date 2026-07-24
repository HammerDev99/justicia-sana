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

# Sin HEALTHCHECK en el Dockerfile: el `wget --spider` de BusyBox (nginx:alpine)
# es poco fiable y, al fallar bajo Docker Swarm/EasyPanel, provoca un bucle de
# reinicios (SIGQUIT ~1 min tras arrancar). El patrón probado en el mismo VPS
# (blog-sprintjudicial) no define HEALTHCHECK; EasyPanel monitorea el servicio
# por su cuenta. Si se quiere un healthcheck, configurarlo en EasyPanel, no aquí.
