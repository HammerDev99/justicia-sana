# Guía de aprovisionamiento — Strapi CMS (justicia-sana)

> F1-01, F1-03 y F1-05 de `docs/plannings/P01_PLAN_ESTRATEGICO.md`. Estos pasos se ejecutan en el panel de EasyPanel del VPS SprintJudicial y en el Strapi Admin — fuera del repositorio, no automatizables desde aquí. Referencia: decisión D-C de `docs/plannings/P00_ANALISIS_REQUISITOS.md` (Strapi v5 + PostgreSQL en el VPS, desde el día 1).

## Prerrequisitos

- Acceso al panel EasyPanel del VPS SprintJudicial.
- DNS del dominio `sprintjudicial.com` administrado (para el subdominio de Strapi).
- `docs/content-types/strapi-justicia-sana-content-types.md` como referencia exacta de los 9 content types a crear.

## Pasos

### 1. Aprovisionar Strapi v5 + PostgreSQL (F1-01)

1. Crear un servicio PostgreSQL dedicado en EasyPanel (volumen persistente, no efímero) — o reutilizar una instancia PostgreSQL existente del VPS si ya hay una gestionada, siempre con una base de datos propia para Strapi (nunca compartir esquema con SIRAL).
2. Crear el servicio Strapi v5 (imagen oficial `strapi/strapi` o build propio) apuntando a esa base de datos.
3. Añadir el subdominio (sugerido: `cms.sprintjudicial.com`, o uno específico si ya está en uso por otro proyecto — confirmar con el propietario antes de crearlo, dado que rugby-bello-site también prevé usar `cms.sprintjudicial.com`).
4. HTTPS vía Traefik (automático, igual que el resto de servicios del VPS).
5. Configurar backups periódicos de la base de datos (la propuesta original exige custodia documental; aunque el contenido público no es confidencial, sí es institucional).
6. Crear el primer usuario administrador en el Strapi Admin.

**Nota de convivencia con rugby-bello-site**: si ambos proyectos comparten el mismo subdominio/instancia Strapi, deben quedar como **content types separados y con nombres sin colisión** (ya lo están: `norma`, `articulo`, etc. de justicia-sana no chocan con `rugby-player`, `rugby-news`, etc. de rugby-bello). Si se prefiere aislar por completo, usar una instancia Strapi independiente — decisión del propietario, no bloquea el resto de F1.

### 2. Crear los content types (F1-02 — ya documentado, ejecución aquí)

En el Strapi Admin → Content-Type Builder, crear los 9 content types definidos en `docs/content-types/strapi-justicia-sana-content-types.md` (7 collection types + 2 single types), respetando exactamente los nombres de `singularName`/`pluralName` y de cada atributo — el cliente tipado en `src/lib/strapi.ts` asume esos nombres literalmente.

### 3. Roles y permisos (F1-03)

1. **Rol "Editor CCL"** (Settings → Roles → Add new role):
   - Permisos: `Create`, `Update`, `Publish`, `Delete` sobre los 9 content types de justicia-sana.
   - Sin acceso a: `Settings`, gestión de `Users & Permissions`, ni a content types de otros proyectos si la instancia es compartida.
2. **Token de build (read-only)** (Settings → API Tokens → Create new API Token):
   - Tipo: `Read-only`.
   - Duración: `Unlimited` (rotar manualmente si se sospecha compromiso).
   - Guardar el valor como variable de entorno `STRAPI_TOKEN` en la configuración de build del servicio `justicia-sana` en EasyPanel — **nunca** en el repositorio (`.env` está en `.gitignore`; ver `.env.example` para las variables esperadas).

### 4. Webhook publish → rebuild (F1-05)

1. En Strapi Admin → Settings → Webhooks → Create new webhook.
2. URL: el Deploy Hook del servicio `justicia-sana` en EasyPanel (Settings del servicio → Deploy Webhooks).
3. Eventos a suscribir: `entry.publish` y `entry.unpublish` (para que despublicar contenido también reconstruya el sitio y deje de servirlo).
4. Alcance: todos los content types de justicia-sana (o "todos" si la instancia no es compartida).

### 5. Verificación post-aprovisionamiento

- [ ] Strapi Admin accesible en su subdominio con HTTPS válido.
- [ ] Los 9 content types existen con los nombres exactos del documento de referencia.
- [ ] Rol "Editor CCL" creado y probado con un usuario de prueba (puede crear/publicar, no puede entrar a Settings).
- [ ] Token read-only generado y configurado como variable de entorno de build en EasyPanel (no commiteado).
- [ ] Publicar una entrada de prueba en cualquier content type dispara un rebuild verificable en los logs de EasyPanel.
- [ ] Despublicarla también dispara rebuild y el contenido deja de aparecer en el sitio construido.

## Notas

- Este documento no puede ejecutarse desde el entorno de desarrollo agentic (no hay acceso al panel EasyPanel ni al Strapi Admin del VPS) — es una guía para el propietario del proyecto, igual que `docs/DEPLOYMENT.md` (F0-06).
- Tras completar estos pasos, actualizar `docs/sprints/S02_CMS_STRAPI/SPEC_S02_F1_STRAPI.md` (SPEC-S02-F1-1, F1-3, F1-5) y `docs/MANUAL_EDITOR_CCL.md` (agregar capturas reales).

---

**Estado**: pendiente de ejecución (requiere acceso humano al panel EasyPanel y al Strapi Admin)
**Actualizado**: 2026-07-24
