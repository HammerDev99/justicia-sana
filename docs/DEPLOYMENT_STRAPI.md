# Guía de aprovisionamiento — Strapi CMS (justicia-sana)

> F1-01/03/05 de `P01` **remediados por** `docs/plannings/P02_STRAPI_PRODUCCION.md`. Estos pasos se ejecutan en el panel de EasyPanel del VPS y en el Strapi Admin — fuera del repositorio. Referencia: P00 D-C (Strapi v5 + PostgreSQL desde el día 1).
>
> ⚠️ **Lee esto primero**: el primer despliegue arrancó en `development` + SQLite (`.tmp/data.db`), que es **efímero** — se borra en cada reinicio. Esta guía te lleva a una instalación **persistente de producción**. **No cargues contenido real del CCL hasta terminar los pasos 1–3.**

## Arquitectura objetivo (partiendo de "un solo servicio")

Hoy tienes 1 servicio (justicia-sana, el sitio estático que ya carga). Al terminar tendrás **3 servicios** en el proyecto de EasyPanel:

```
justicia-sana   (nginx estático — YA funciona)
strapi-cms      (Strapi v5, NODE_ENV=production)  ──┐
postgres-cms    (PostgreSQL 16, volumen persistente) ◀┘  conexión por red interna
```

## Prerrequisitos

- Acceso al panel EasyPanel del VPS SprintJudicial.
- DNS de `sprintjudicial.com` administrado (para el subdominio de Strapi).
- `docs/content-types/strapi-justicia-sana-content-types.md` como contrato exacto de los 9 content types.
- `openssl` disponible en tu máquina (para generar secrets).

---

## Paso 1 — PostgreSQL persistente (P02 A-01)

1. En el proyecto de EasyPanel, **crear servicio** → plantilla **PostgreSQL** (v16).
2. Nombre sugerido: `postgres-cms`. Anota usuario, contraseña y nombre de BD (sugerido `justicia_sana_cms`).
3. **Verifica que tenga volumen persistente** (EasyPanel lo asigna por defecto en la plantilla de Postgres — confírmalo en la pestaña de Volúmenes del servicio). Sin esto, volvemos al problema de la efimeralidad.
4. No expongas Postgres a Internet (sin dominio público); solo se usa por la red interna del proyecto.

## Paso 2 — Configurar Strapi para Postgres + producción + secrets (P02 A-02/03/04)

En el servicio de Strapi → pestaña **Environment**, define estas variables.

**Conexión a la base de datos** (el host es el nombre interno del servicio Postgres, p.ej. `postgres-cms`):

```
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres-cms
DATABASE_PORT=5432
DATABASE_NAME=justicia_sana_cms
DATABASE_USERNAME=<el usuario del paso 1>
DATABASE_PASSWORD=<la contraseña del paso 1>
DATABASE_SSL=false
```

**Entorno de producción**:

```
NODE_ENV=production
```

**Secrets** (Strapi los exige; el log advirtió que faltaba `ENCRYPTION_KEY`). Genera **cada uno** con:

```bash
openssl rand -base64 32
```

Y define (APP_KEYS necesita al menos 2 valores separados por coma):

```
APP_KEYS=<clave1>,<clave2>
API_TOKEN_SALT=<clave>
ADMIN_JWT_SECRET=<clave>
TRANSFER_TOKEN_SALT=<clave>
JWT_SECRET=<clave>
ENCRYPTION_KEY=<clave>
```

> Guarda estos valores en un gestor de secretos seguro. Si los pierdes y los regeneras, se invalidan los tokens de admin/API existentes.

## Paso 3 — Volumen para uploads / Media Library (P02 A-05)

Los archivos que suba el CCL (PDFs de normas, imágenes, infografías) van por defecto a `public/uploads` **dentro del contenedor** → también efímeros. En el servicio de Strapi → **Volúmenes**, monta un volumen persistente en la ruta `/opt/app/public/uploads` (o la ruta de la app según la imagen que uses). Alternativa (post-piloto): proveedor S3-compatible.

## Paso 4 — Content types en código, no por UI (P02 B-01/B-02) — **cambio importante**

En `NODE_ENV=production`, **Strapi desactiva el Content-Type Builder**: no podrás crear los content types desde la interfaz. Deben venir definidos en el **código** de la app Strapi. Camino recomendado (reproducible):

1. En tu máquina, crea un proyecto Strapi: `npx create-strapi-app@latest justicia-sana-cms` (en dev usa SQLite local, está bien).
2. En modo dev (`npm run develop`), usa el Content-Type Builder para crear los **9 content types** exactamente como en `docs/content-types/strapi-justicia-sana-content-types.md` (nombres de `singularName`/`pluralName` y de cada atributo idénticos — el cliente `src/lib/strapi.ts` los asume literalmente). Esto genera archivos `src/api/**/content-types/**/schema.json`.
3. Sube ese proyecto a un repo (p.ej. `HammerDev99/justicia-sana-cms`). La config de BD por defecto de Strapi ya lee las env vars del Paso 2 — no hace falta código extra.
4. En EasyPanel, apunta el servicio Strapi a **construir la imagen desde ese repo** (no una imagen genérica en modo dev). Cada push al repo reconstruye el CMS con los content types versionados.

> **Sobre Q2 ("publicar sin tocar código")**: esto NO se rompe. Los editores del CCL siguen gestionando **entradas** (Content Manager funciona en producción). Solo el **esquema** (los content types) lo define un desarrollador una vez. Editores → contenido; desarrollador → esquema.

## Paso 5 — Subdominio + admin + roles (P01 F1-03)

1. Añade el subdominio del CMS (sugerido `cms.sprintjudicial.com`; si ya lo usa rugby-bello, elige otro, p.ej. `cms-justiciasana.sprintjudicial.com`). HTTPS automático vía Traefik.
2. Entra al Strapi Admin y crea el primer administrador.
3. **Rol "Editor CCL"** (Settings → Roles): permisos `Create`/`Update`/`Publish`/`Delete` sobre los 9 content types; sin acceso a Settings ni a Users & Permissions.
4. **Permisos de la API pública** (Settings → Users & Permissions → Roles → Public): habilita `find`/`findOne` en los 9 content types **o** usa un token read-only (siguiente punto). El sitio necesita leer el contenido publicado en build-time.
5. **Token read-only** (Settings → API Tokens): tipo `Read-only`. Guárdalo como `STRAPI_TOKEN` en las env vars de **build del servicio justicia-sana** (nunca en el repo; ver `.env.example`). Define también `STRAPI_URL` con la URL del CMS.

## Paso 6 — Webhook publish → rebuild (P01 F1-05)

1. Strapi Admin → Settings → Webhooks → Create.
2. URL: el Deploy Hook del servicio `justicia-sana` en EasyPanel (Settings del servicio → Deploy Webhooks).
3. Eventos: `entry.publish` y `entry.unpublish`.

## Paso 7 — Verificación (P02 criterios de éxito)

- [ ] El log de arranque de Strapi muestra `Environment: production` y `Database: postgres` (ya no `sqlite`).
- [ ] Sin advertencias de "Encryption key is missing" ni secrets faltantes.
- [ ] **Prueba de persistencia (la clave)**: crea una entrada de prueba → fuerza un redeploy del contenedor Strapi → la entrada **sigue ahí**.
- [ ] Los 9 content types existen tras el redeploy sin recrearlos a mano (vienen del código).
- [ ] Sube un archivo a la Media Library → redeploy → el archivo sigue disponible.
- [ ] `justicia-sana` construye leyendo contenido real del CMS (token configurado) y publicar/despublicar dispara rebuild.
- [ ] Existe al menos un backup de la BD y su restauración está probada (P02 Fase C).

---

## Notas

- Esta guía es para el propietario del proyecto (requiere acceso a EasyPanel y al Strapi Admin); no es ejecutable desde el entorno agentic.
- Tras completar los pasos, actualizar: `docs/sprints/S02_CMS_STRAPI/SPEC_S02_F1_STRAPI.md` (F1-1/3/5), `docs/plannings/P02_STRAPI_PRODUCCION.md` (marcar Fases A/B/C) y agregar capturas reales a `docs/MANUAL_EDITOR_CCL.md`.
- **Backups (P02 Fase C)**: programa un `pg_dump` periódico del servicio Postgres y prueba una restauración antes de que el CCL cargue contenido en serio.

---

**Estado**: pendiente de ejecución (requiere acceso humano al panel EasyPanel y al Strapi Admin)
**Actualizado**: 2026-07-24
