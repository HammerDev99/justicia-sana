# Planning 02 — Adecuación de Strapi a Producción (persistencia + hardening)

**Fecha**: 2026-07-24
**Origen**: Hallazgo operativo durante F1-01. El servicio Strapi desplegado en el VPS arrancó en modo **development** con **SQLite** (`.tmp/data.db`) y sin claves de cifrado — configuración efímera e inadecuada para producción. Log de arranque (2026-07-24 16:45): `Environment: development`, `Database: sqlite → .tmp/data.db`, `warn: Encryption key is missing from admin.secrets.encryptionKey`.
**Objetivo**: Dejar Strapi en un estado de producción **persistente, reproducible y respaldado**, de modo que el contenido del CCL y los content types no se pierdan en cada redeploy del contenedor.
**Metodología**: SDD Framework v2 (CDAID v2) — fase Plan del ciclo PDCA.

---

## Estado Previo / Contexto

| Métrica                         |            Valor actual             |                         Target                          |
| ------------------------------- | :---------------------------------: | :-----------------------------------------------------: |
| Persistencia de datos           |     SQLite en `.tmp/` (efímero)     |           PostgreSQL con volumen persistente            |
| Entorno                         |            `development`            |                      `production`                       |
| Claves de seguridad (secrets)   |   Faltan (encryption key ausente)   |            6 secrets definidos como env vars            |
| Persistencia de uploads (media) | Filesystem del contenedor (efímero) |         Volumen persistente o proveedor externo         |
| Backups                         |               Ninguno               |        pg_dump programado + snapshot de volumen         |
| Content types en producción     |       Editables por UI (dev)        | Definidos en código (UI de builder desactivada en prod) |

### Por qué es urgente

1. **Pérdida de datos garantizada**: SQLite en `.tmp/data.db` vive dentro del contenedor. Cada redeploy (o el propio bucle de reinicios que ya vimos en justicia-sana) **borra la base de datos completa** — todo el contenido que cargue el CCL desaparecería.
2. **Content types también se pierden**: en un contenedor sin volumen para el código de la app, los content types creados por el Content-Type Builder (que escribe archivos `src/api/**/schema.json` en disco) se van con el contenedor.
3. **Sin claves de cifrado**: Strapi advierte que falta `admin.secrets.encryptionKey`. Sin secrets estables, los tokens de admin/API se invalidan en cada arranque y los campos cifrados no funcionan.

### Implicación de arquitectura descubierta (afecta Q2)

En `NODE_ENV=production` **Strapi desactiva el Content-Type Builder** (no se pueden crear/editar content types desde la UI). Esto **no rompe** la promesa Q2 ("el CCL publica sin tocar código"): los editores gestionan **entradas de contenido** (Content Manager), que sí funciona en producción. Lo que pasa a ser tarea de un desarrollador es definir el **esquema** (los content types) en el código de Strapi. Es la separación estándar: editores → contenido; desarrollador → esquema. Se aclara en `docs/MANUAL_EDITOR_CCL.md` (Fase D).

---

## Alcance

### Fase A — Persistencia y entorno (crítico)

| ID   | Hallazgo                                      | Dónde                        | Fix propuesto                                                                                                                                             | Esfuerzo |
| ---- | --------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | :------: |
| A-01 | SQLite efímero                                | EasyPanel (VPS)              | Crear servicio PostgreSQL dedicado con volumen persistente (BD `justicia_sana_cms`)                                                                       |  Medio   |
| A-02 | Strapi apunta a SQLite                        | Env vars del servicio Strapi | `DATABASE_CLIENT=postgres` + `DATABASE_HOST/PORT/NAME/USERNAME/PASSWORD` (red interna EasyPanel)                                                          |   Bajo   |
| A-03 | Entorno development                           | Env vars                     | `NODE_ENV=production`                                                                                                                                     |   Bajo   |
| A-04 | Secrets faltantes (encryption key, JWT, etc.) | Env vars                     | Definir `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY` (generados con `openssl rand -base64 32`) |   Bajo   |
| A-05 | Uploads (Media Library) en filesystem efímero | EasyPanel                    | Volumen persistente montado en `public/uploads` (o proveedor S3-compatible si se prefiere)                                                                |  Medio   |

### Fase B — Content types reproducibles en producción

| ID   | Hallazgo                                                                 | Dónde                              | Fix propuesto                                                                                                                                                                      | Esfuerzo |
| ---- | ------------------------------------------------------------------------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------: |
| B-01 | Content-Type Builder desactivado en prod → schemas deben estar en código | Repo/imagen de Strapi              | Definir los 9 content types como archivos de esquema Strapi (traducidos desde `docs/content-types/strapi-justicia-sana-content-types.md`) en un proyecto/repo de Strapi versionado |   Alto   |
| B-02 | Imagen de Strapi no reproducible                                         | Build de EasyPanel                 | Construir imagen desde ese repo (Dockerfile de Strapi), no desde la imagen genérica en modo dev                                                                                    |  Medio   |
| B-03 | Permisos de la API pública para el build de Astro                        | Strapi Admin (Users & Permissions) | Rol público con `find`/`findOne` sobre los 9 content types (o token read-only ya previsto en F1-03)                                                                                |   Bajo   |

> **Nota sobre B**: alternativa de menor esfuerzo pero frágil — persistir todo el directorio de la app Strapi en un volumen y crear los content types una sola vez en modo dev, luego pasar a production. Se descarta como recomendación por no ser reproducible (no versionado, difícil de recuperar ante fallo). B-01/B-02 (esquemas en repo) es la vía recomendada.

### Fase C — Backups y operación

| ID   | Hallazgo                         | Dónde         | Fix propuesto                                                                            | Esfuerzo |
| ---- | -------------------------------- | ------------- | ---------------------------------------------------------------------------------------- | :------: |
| C-01 | Sin backups de la BD             | EasyPanel/VPS | `pg_dump` programado (cron/tarea EasyPanel) + retención; snapshot del volumen de uploads |  Medio   |
| C-02 | Sin verificación de restauración | Operación     | Probar una restauración de backup en un entorno de prueba (documentar el procedimiento)  |   Bajo   |

### Fase D — Documentación y ajustes derivados

| ID   | Hallazgo                                                   | Archivo                             | Fix propuesto                                                                                     | Esfuerzo |
| ---- | ---------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------- | :------: |
| D-01 | `DEPLOYMENT_STRAPI.md` no cubre Postgres/secrets/volúmenes | `docs/DEPLOYMENT_STRAPI.md`         | Ampliar con pasos exactos: crear Postgres, env vars, secrets, volúmenes, build desde repo         |  Medio   |
| D-02 | Manual del editor sugiere crear content types por UI       | `docs/MANUAL_EDITOR_CCL.md`         | Aclarar: editores gestionan **entradas**; el **esquema** lo define el desarrollador (no rompe Q2) |   Bajo   |
| D-03 | Content types como contrato, aún no como esquemas Strapi   | `docs/content-types/` → repo Strapi | Referenciar el repo/imagen de Strapi donde viven los esquemas reales (resultado de B-01)          |   Bajo   |

---

## Hallazgos Diferidos

| ID  | Hallazgo                                             | Razón de diferimiento                                                                                                                          |
| --- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| —   | Proveedor de email `sendmail` → `nodemailer`         | El portal público del MVP es de solo lectura; no envía email transaccional. Se retoma si se activa PQRS/notificaciones (post-MVP, F5)          |
| —   | Migración de datos existentes de la SQLite actual    | Los datos actuales son de una instancia dev efímera; nada de producción que migrar. Si se cargó contenido de prueba, se recrea tras el cutover |
| —   | Proveedor de almacenamiento S3-compatible para media | Un volumen persistente en el VPS es suficiente para el piloto; S3 se evalúa si crece el volumen de archivos                                    |

---

## Esfuerzo Total

| Fase      | Ítems  | Esfuerzo estimado |
| --------- | :----: | :---------------: |
| A         |   5    |       3–4 h       |
| B         |   3    |       4–6 h       |
| C         |   2    |       2–3 h       |
| D         |   3    |        2 h        |
| **Total** | **13** |    **11–15 h**    |

> La mayor parte es **acción humana en el VPS/EasyPanel** (Fase A, C) y definición de esquemas Strapi (Fase B); solo la Fase D es edición de documentación en este repo.

---

## Criterios de Éxito

- [ ] Strapi arranca con `Environment: production` y `Database: postgres` (verificable en el log de arranque)
- [ ] Ninguna advertencia de "Encryption key is missing" ni de secrets faltantes
- [ ] Un redeploy del contenedor **conserva** los datos (crear una entrada de prueba, redeploy, la entrada sigue ahí)
- [ ] Los 9 content types existen tras el redeploy sin recrearse manualmente (esquemas en código)
- [ ] La Media Library conserva un archivo subido tras un redeploy
- [ ] Existe al menos un backup de BD y su procedimiento de restauración está documentado y probado
- [ ] `docs/DEPLOYMENT_STRAPI.md` y `docs/MANUAL_EDITOR_CCL.md` reflejan el flujo real de producción

---

## Orden de Implementación Recomendado

```
A-01 (Postgres) → A-02 (conexión) → A-04 (secrets) → A-03 (production)
                        │
                        ▼
   B-01 (esquemas en repo) → B-02 (imagen) → B-03 (permisos API)
                        │
                        ▼
   A-05 (volumen uploads) → C-01 (backups) → C-02 (probar restore)
                        │
                        ▼
              D-01/D-02/D-03 (documentación)
```

**Regla de seguridad**: no cargar contenido real del CCL en Strapi hasta que A-01..A-04 estén completos — cualquier dato ingresado antes se perderá en el primer reinicio.

### Relación con P01

Este planning **remedia y detalla F1-01** de `P01_PLAN_ESTRATEGICO.md` (que pedía "Strapi v5 + PostgreSQL … backups" pero se desplegó en SQLite/dev) y **refina F1-02** (los content types pasan de "crear por UI" a "definir en código", por la desactivación del builder en producción). No cambia el alcance del MVP; asegura que la Fase F1 quede sobre una base persistente antes de F3 (contenido real).

---

**Versión**: 1.0
**Fecha**: 2026-07-24
