# Guía de despliegue — justiciasana.sprintjudicial.com

> F0-06 de `docs/plannings/P01_PLAN_ESTRATEGICO.md`. Estos pasos se ejecutan en el panel de EasyPanel del VPS SprintJudicial — fuera del repositorio, no automatizables desde aquí. Referencia: patrón ya probado en `HammerDev99/blog-sprintjudicial` y `HammerDev99/HammeredSolutions` (`configuracion DNS.md`).

## Prerrequisitos

- Acceso al panel EasyPanel del VPS SprintJudicial (Hostinger).
- Repositorio `justicia-sana` en GitHub con la rama `main` actualizada (o la rama de trabajo que se vaya a desplegar).
- DNS del dominio `sprintjudicial.com` administrado (para el registro `justiciasana`).

## Pasos

### 1. Crear el servicio en EasyPanel

1. En el proyecto SprintJudicial de EasyPanel, crear un nuevo servicio de tipo **App** (build desde Dockerfile), igual que `blog-sprintjudicial`.
2. Fuente: GitHub → repositorio `HammerDev99/justicia-sana`, rama `main`.
3. Build: EasyPanel detecta el `Dockerfile` en la raíz del repo (multi-stage `node:22-alpine` → `nginx:alpine`) — no requiere configuración adicional de build command.
4. Puerto expuesto del contenedor: `80` (definido en `Dockerfile`/`nginx.conf`).

### 2. Configurar el dominio

1. En la sección **Domains** del servicio, añadir `justiciasana.sprintjudicial.com`.
2. EasyPanel/Traefik gestiona el certificado HTTPS automáticamente (Let's Encrypt) — no se requiere configuración manual de TLS.
3. Confirmar en el DNS del dominio `sprintjudicial.com` que existe (o se crea) un registro `A`/`CNAME` para `justiciasana` apuntando a la IP del VPS, igual que los subdominios existentes (`blog`, `cms`, `siral`).

### 3. Auto-deploy en push a `main`

1. Activar el webhook de auto-deploy de EasyPanel para este servicio (se dispara en cada push a `main`, igual que `blog-sprintjudicial`).
2. Verificar que el pipeline de GitHub Actions (`ci.yml`) no bloquea el deploy — son independientes: CI corre quality gates, EasyPanel reconstruye la imagen por su cuenta al detectar el push.

### 4. Webhook de Strapi

Ahora que F1 está en curso: ver `docs/DEPLOYMENT_STRAPI.md` para el aprovisionamiento de Strapi (F1-01) y la configuración del webhook **Strapi publish → deploy hook de EasyPanel** (F1-05, decisión D-D de P00).

### 5. Verificación post-deploy

- [x] Build de la imagen exitoso en EasyPanel (confirmado 2026-07-24: `astro build` 2 páginas + sitemap, imagen `easypanel/sprintjudicial/justicia-sana`, nginx arrancando y sirviendo tráfico).
- [ ] `https://justiciasana.sprintjudicial.com` responde con HTTPS válido — **pendiente de confirmación del propietario** (el entorno de desarrollo agentic no tiene salida de red a dominios arbitrarios; no se pudo verificar desde aquí).
- [ ] La homepage carga el walking skeleton (título, navegación, accesos rápidos).
- [ ] `curl -I https://justiciasana.sprintjudicial.com` devuelve cabeceras de seguridad (`X-Content-Type-Options`, `X-Frame-Options`) definidas en `nginx.conf`.
- [ ] Un push de prueba a `main` dispara rebuild automático (revisar logs de EasyPanel) — solo se ha verificado el build inicial.

## Notas

- El `Dockerfile` y `nginx.conf` se verificaron por revisión manual (siguen el patrón de `blog-sprintjudicial`) y **el primer build real en EasyPanel confirmó que funcionan** (ver checklist arriba); `docker build` local seguía sin ser posible en el entorno de desarrollo agentic (sin daemon Docker disponible).
- Un `SIGQUIT` (apagado _graceful_, workers con exit code 0) ocurrió ~1 minuto después del primer arranque del contenedor — consistente con un reinicio de EasyPanel tras el deploy inicial, no un crash. A vigilar si se repite en bucle.
- Este documento se actualiza con el resultado real una vez confirmada la resolución pública del dominio.

---

**Estado**: build confirmado en EasyPanel; resolución pública del dominio pendiente de confirmación del propietario
**Actualizado**: 2026-07-24
