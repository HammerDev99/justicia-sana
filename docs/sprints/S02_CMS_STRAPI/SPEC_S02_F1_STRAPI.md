# SDD SPEC — Sprint 02

**Fecha**: 2026-07-24
**Planning de referencia**: `docs/plannings/P01_PLAN_ESTRATEGICO.md` (Fase F1), `docs/plannings/P00_ANALISIS_REQUISITOS.md` (Q2, D-C)
**Metodología**: SDD Framework v2 (CDAID v2) — fase Do del ciclo PDCA

---

## Resumen

| Campo                   | Valor                                           |
| ----------------------- | ----------------------------------------------- |
| Sprint                  | 02                                              |
| Total SPECs             | 6 (F1-01 a F1-06)                               |
| Fase                    | F1 — CMS Strapi (publicación sin código, día 1) |
| Esfuerzo estimado (P01) | 12–16 h                                         |

**Naturaleza mixta de esta fase**: a diferencia de F0 (100% código en este repo), F1 combina infraestructura externa (Strapi vive en el VPS, fuera de este repositorio) con código real (cliente tipado en Astro). Se aplica el mismo criterio de honestidad de F0: lo que es acción humana en el VPS se documenta como guía ejecutable y queda `[ ]` hasta confirmación; lo que es código/contrato se implementa y prueba en este sprint.

---

## Fase F1 — CMS Strapi

### SPEC-S02-F1-1: Aprovisionar Strapi v5 + PostgreSQL en EasyPanel

| Campo         | Valor                                                                |
| ------------- | -------------------------------------------------------------------- |
| **Origen**    | P01 F1-01, P00 D-C                                                   |
| **Archivos**  | `docs/DEPLOYMENT_STRAPI.md` (guía) — ejecución fuera del repositorio |
| **Prioridad** | P0 — sin esto no hay CMS que consumir                                |
| **Estado**    | `[ ]` pendiente — requiere acceso humano al panel EasyPanel del VPS  |

**Cambios realizados**:

1. `docs/DEPLOYMENT_STRAPI.md`: guía paso a paso — crear servicio Strapi v5 (imagen oficial o build propio), aprovisionar PostgreSQL dedicado, subdominio `cms.sprintjudicial.com` (o el que se decida), HTTPS vía Traefik, backups de BD.

**Criterios de aceptación**:

- [ ] Servicio Strapi accesible en su subdominio con HTTPS válido
- [ ] PostgreSQL conectado y persistente (volumen, no efímero)
- [ ] Admin de Strapi accesible y con el primer usuario administrador creado

**Verificado**: — | **Commit**: —

---

### SPEC-S02-F1-2: Content types de justicia-sana

| Campo         | Valor                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------- |
| **Origen**    | P01 F1-02 (G-01..05, G-13/14)                                                                   |
| **Archivos**  | `docs/content-types/strapi-justicia-sana-content-types.md`                                      |
| **Prioridad** | P0 — contrato que consumen tanto Strapi Admin como el cliente tipado                            |
| **Estado**    | `[x]` completado (documentado como contrato) — `[ ]` creación real en Strapi pendiente de F1-01 |

**Cambios realizados**:

1. Documentados 7 collection types (`norma`, `articulo`, `recurso-pedagogico`, `integrante-comite`, `capacitacion`, `comunicado`, `canal-ayuda`) y 2 single types (`quienes-somos`, `home`) con schema JSON completo (atributos, tipos, validaciones), siguiendo el patrón de `rugby-bello-site/docs/content-types/`.
2. Cada content type mapeado a su GAP de origen en P00 (trazabilidad requisito → dato).

**Criterios de aceptación**:

- [x] Los 9 content types cubren íntegramente F2-01..F2-08 y F3-01..F3-07 de P01 (nada de contenido núcleo queda sin modelo de datos)
- [x] Cada atributo sensible a idioma claro/legal (resúmenes, textos) tiene su campo dedicado
- [ ] **Divergencia esperada, no defecto**: la creación real de los content types en el Strapi Admin del VPS requiere F1-01 completado — este SPEC entrega el contrato, no la instancia

**Verificado**: 2026-07-24 (documento) | **Commit**: (ver registro de progreso)

---

### SPEC-S02-F1-3: Roles y permisos — Editor CCL + token de build

| Campo         | Valor                                                           |
| ------------- | --------------------------------------------------------------- |
| **Origen**    | P01 F1-03, P00 D-C                                              |
| **Archivos**  | `docs/DEPLOYMENT_STRAPI.md` (sección roles)                     |
| **Prioridad** | P1 — habilita publicación sin desarrollador (Q2)                |
| **Estado**    | `[ ]` pendiente — configuración dentro del Strapi Admin (F1-01) |

**Cambios realizados**:

1. Documentado el rol "Editor CCL" (crear/editar/publicar contenido, sin acceso a configuración de sistema ni gestión de usuarios).
2. Documentada la generación de un API Token **read-only** para el build de Astro (nunca se expone al cliente — regla crítica 5 de `CLAUDE.md`).

**Criterios de aceptación**:

- [ ] Rol "Editor CCL" creado con permisos mínimos (Create/Update/Publish sobre los 9 content types; sin Settings/Users)
- [ ] Token read-only generado y almacenado como variable de entorno de build en EasyPanel (nunca en el repo)

**Verificado**: — | **Commit**: —

---

### SPEC-S02-F1-4: Cliente Strapi tipado en Astro

| Campo         | Valor                                                                                |
| ------------- | ------------------------------------------------------------------------------------ |
| **Origen**    | P01 F1-04, Q2/Q3                                                                     |
| **Archivos**  | `src/lib/types.ts`, `src/lib/strapi.ts`, `tests/unit/strapi.test.ts`, `.env.example` |
| **Prioridad** | P0 — único ítem de F1 que es código verificable en este repo                         |
| **Estado**    | `[x]` completado                                                                     |

**Cambios realizados**:

1. `src/lib/types.ts`: tipos genéricos Strapi v5 (`StrapiCollectionResponse<T>`, `StrapiSingleResponse<T>`, `StrapiMedia`, `StrapiMeta/Pagination`) + tipos de dominio `readonly` para los 9 content types de F1-02 (patrón rugby-bello `types.ts`).
2. `src/lib/strapi.ts`: `fetchCollection`/`fetchSingle`/`fetchBySlug` genéricos + funciones de dominio tipadas (`fetchNormas`, `fetchArticulos`, `fetchRecursosPedagogicos`, `fetchIntegrantesComite`, `fetchCapacitaciones`, `fetchComunicados`, `fetchCanalesAyuda`, `fetchQuienesSomos`, `fetchHome`).
3. **Degradación agraciada obligatoria** (regla del planning P01: "el build no se rompe si Strapi está caído"): toda función atrapa errores de red/HTTP, registra un `console.warn` y devuelve `[]`/`null` — nunca lanza. Verificado con tests que simulan `fetch` fallido, 404 y payload vacío.
4. `STRAPI_URL`/`STRAPI_TOKEN` leídos únicamente de `import.meta.env` (server-side); el token nunca se envía en el HTML/JS generado — regla crítica 5.
5. `.env.example` añadido con las dos variables documentadas (sin valores reales).

**Criterios de aceptación**:

- [x] `npm test` — nuevos tests de `strapi.ts` en verde (mock de `fetch`, sin red real)
- [x] Ninguna función lanza excepción ante fallo de red/HTTP/JSON inválido — todas retornan `[]`/`null`
- [x] `npx astro check` sin errores (tipos `readonly`, sin `any`)
- [x] El token no aparece en ningún archivo bajo `dist/` tras `npm run build` (grep de verificación)

**Verificado**: 2026-07-24 | **Commit**: (ver registro de progreso)

---

### SPEC-S02-F1-5: Webhook Strapi publish → deploy hook EasyPanel

| Campo         | Valor                                                                  |
| ------------- | ---------------------------------------------------------------------- |
| **Origen**    | P01 F1-05, P00 D-D                                                     |
| **Archivos**  | `docs/DEPLOYMENT_STRAPI.md` (sección webhook)                          |
| **Prioridad** | P1 — sin esto, publicar en Strapi no actualiza el sitio                |
| **Estado**    | `[ ]` pendiente — requiere F1-01 (instancia Strapi) y acceso EasyPanel |

**Cambios realizados**:

1. Documentado el flujo: Strapi → Settings → Webhooks → evento `entry.publish` (y `entry.unpublish`) → URL del Deploy Hook de EasyPanel del servicio `justicia-sana`.

**Criterios de aceptación**:

- [ ] Publicar una entrada de prueba en Strapi dispara un rebuild verificable en EasyPanel
- [ ] Despublicar también dispara rebuild (el contenido no publicado no debe quedar servido en estático)

**Verificado**: — | **Commit**: —

---

### SPEC-S02-F1-6: Manual del editor CCL

| Campo         | Valor                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------------- |
| **Origen**    | P01 F1-06, Q2                                                                                      |
| **Archivos**  | `docs/MANUAL_EDITOR_CCL.md`                                                                        |
| **Prioridad** | P2                                                                                                 |
| **Estado**    | `[x]` completado (borrador estructural) — `[ ]` capturas de pantalla reales pendientes de F1-01/02 |

**Cambios realizados**:

1. Manual paso a paso (crear/editar/publicar cada content type, buenas prácticas de imágenes y SEO básico) sin capturas de pantalla — no existe instancia real de Strapi todavía; incluirlas ahora sería fabricar evidencia visual falsa.

**Criterios de aceptación**:

- [x] Cubre el flujo de publicación de los 9 content types
- [ ] **Diferido explícitamente**: capturas de pantalla reales, a agregar cuando exista una instancia Strapi con contenido de prueba (tras F1-01)

**Verificado**: 2026-07-24 (borrador) | **Commit**: (ver registro de progreso)

---

## Hallazgos que alimentan la auditoría de gate F1 (Check)

| Hallazgo                                                       | Clasificación esperada     | Nota                                                                                         |
| -------------------------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------- |
| F1-01 (aprovisionar Strapi) pendiente                          | BLOQUEANTE                 | Acción humana en el VPS; sin esto F1-03 y F1-05 tampoco pueden verificarse en real           |
| F1-03 (roles/token) pendiente                                  | BLOQUEANTE (depende F1-01) | Configuración dentro del Strapi Admin                                                        |
| F1-05 (webhook) pendiente                                      | BLOQUEANTE (depende F1-01) | Requiere instancia Strapi real para configurar el webhook                                    |
| Cliente Strapi (F1-04) sin instancia real contra la que probar | DIVERGENCIA MENOR          | Tests unitarios mockean `fetch`; falta una verificación de integración end-to-end tras F1-01 |
| Manual del editor (F1-06) sin capturas                         | DIVERGENCIA JUSTIFICADA    | No fabricar evidencia visual de una UI que no existe aún; se completa tras F1-01             |
