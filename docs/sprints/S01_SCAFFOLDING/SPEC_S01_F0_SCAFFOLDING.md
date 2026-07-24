# SDD SPEC — Sprint 01

**Fecha**: 2026-07-24
**Planning de referencia**: `docs/plannings/P01_PLAN_ESTRATEGICO.md` (Fase F0), `docs/plannings/P00_ANALISIS_REQUISITOS.md`
**Metodología**: SDD Framework v2 (CDAID v2) — fase Do del ciclo PDCA

---

## Resumen

| Campo                   | Valor                                             |
| ----------------------- | ------------------------------------------------- |
| Sprint                  | 01                                                |
| Total SPECs             | 7 (F0-01 a F0-07)                                 |
| Fase                    | F0 — Scaffolding + Walking Skeleton en Producción |
| Esfuerzo estimado (P01) | 8–10 h                                            |

---

## Fase F0 — Scaffolding + Walking Skeleton en Producción

### SPEC-S01-F0-1: Init Astro + TS strict + Tailwind 4 + estructura src/

| Campo         | Valor                                                         |
| ------------- | ------------------------------------------------------------- |
| **Origen**    | P01 F0-01                                                     |
| **Archivos**  | `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/**` |
| **Prioridad** | P0 — sin esto no existe el proyecto                           |
| **Estado**    | `[x]` completado                                              |

**Cambios realizados**:

1. `package.json` con Astro 6.4.8, TypeScript 5, Tailwind CSS 4, `@astrojs/sitemap`, `@astrojs/check` (versiones de referencia rugby-bello, resueltas a sus últimos patch/minor disponibles).
2. `astro.config.mjs`: `site: 'https://justiciasana.sprintjudicial.com'`, plugin Tailwind Vite, integración sitemap.
3. `tsconfig.json` extiende `astro/tsconfigs/strict`.
4. Estructura `src/{lib,layouts,components/ui,pages,styles}` + `tests/{unit,e2e}`.
5. `package.json > overrides.vite = "7.3.6"` — fix de un conflicto real de resolución de dependencias (ver `agent_docs/antipatterns.md`).

**Criterios de aceptación**:

- [x] `npx astro check` sin errores
- [x] `npm run build` genera `dist/` sin errores
- [x] Estructura de directorios conforme a P01

**Verificado**: 2026-07-24 | **Commit**: (ver registro de progreso)

---

### SPEC-S01-F0-2: Quality gates — ESLint + Prettier + Vitest + Playwright + astro check

| Campo         | Valor                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Origen**    | P01 F0-02                                                                                                         |
| **Archivos**  | `eslint.config.js`, `.prettierrc.json`, `.prettierignore`, `vitest.config.ts`, `playwright.config.ts`, `tests/**` |
| **Prioridad** | P0 — gate obligatorio antes de cada commit (regla crítica 7)                                                      |
| **Estado**    | `[x]` completado                                                                                                  |

**Cambios realizados**:

1. ESLint flat config (`eslint-plugin-astro` + `eslint-config-prettier`), patrón rugby-bello.
2. Prettier con `prettier-plugin-astro`; `.prettierignore` excluye `dist/`, `.astro/`, `node_modules/` y el contenido **vendorizado verbatim** de `.claude/skills/{sdd-framework-v2,refactoring,design-patterns}` y `.claude/agents/` (no reformatear una copia fiel del repo canónico).
3. Vitest (`vitest.config.ts`) con `getViteConfig` de Astro, cobertura v8 sobre `src/lib/**`, umbral 80%.
4. Playwright (`playwright.config.ts`) contra `npm run preview`; `launchOptions.executablePath` condicional a `PLAYWRIGHT_EXECUTABLE_PATH` (ver nota de entorno en `agent_docs/testing.md`) — no hardcodea rutas de sandbox en el repo.
5. Tests reales escritos primero (RED) y verificados en verde (GREEN):
   - `tests/unit/tokens.test.ts` (9 tests): cálculo de contraste WCAG, simetría, error en hex inválido, cumplimiento AA de la paleta de marca.
   - `tests/unit/site.test.ts` (3 tests): configuración del sitio y navegación.
   - `tests/e2e/home.spec.ts` (4 tests): título, navegación accesible, skip-link enfocable primero, sin errores de consola.

**Criterios de aceptación**:

- [x] `npm run lint` limpio (ESLint + Prettier)
- [x] `npm test` — 12/12 tests unitarios pasan
- [x] `npm run test:e2e` — 4/4 tests E2E pasan
- [x] `npx astro check` sin errores

**Verificado**: 2026-07-24 | **Commit**: (ver registro de progreso)

---

### SPEC-S01-F0-3: CI GitHub Actions

| Campo         | Valor                                                                                |
| ------------- | ------------------------------------------------------------------------------------ |
| **Origen**    | P01 F0-03                                                                            |
| **Archivos**  | `.github/workflows/ci.yml`                                                           |
| **Prioridad** | P1                                                                                   |
| **Estado**    | `[x]` completado (creado) — `[ ]` pendiente de verificación en un push real a GitHub |

**Cambios realizados**:

1. Jobs `lint`, `typecheck`, `test` en paralelo; `build` depende de los tres; `e2e` depende de `build` (instala Chromium en el runner, sin depender del sandbox local).
2. Sin job de `deploy`: el auto-deploy lo dispara EasyPanel al detectar el push a `main` (decisión D-A/D-D de P00) — documentado como nota al final del workflow.

**Criterios de aceptación**:

- [x] Workflow sintácticamente válido (estructura equivalente a `rugby-bello-site/.github/workflows/deploy.yml`, sin el job de Cloudflare)
- [ ] **Divergencia menor documentada**: no se pudo disparar una ejecución real en GitHub Actions desde este entorno (requiere push remoto). Verificar en el primer push a la rama de trabajo.

**Verificado**: pendiente de primer push | **Commit**: (ver registro de progreso)

---

### SPEC-S01-F0-4: CDAID setup — CLAUDE.md, agent_docs/, templates

| Campo         | Valor                          |
| ------------- | ------------------------------ |
| **Origen**    | P01 F0-04                      |
| **Archivos**  | `CLAUDE.md`, `agent_docs/*.md` |
| **Prioridad** | P1                             |
| **Estado**    | `[x]` completado               |

**Cambios realizados**:

1. `CLAUDE.md` (ya existente desde el planning, v2) actualizado con estado real del sprint.
2. `agent_docs/architecture.md`, `code_conventions.md`, `testing.md`, `workflow.md`, `antipatterns.md` — escritos con contenido real del código construido en este sprint (no especulativo).
3. `agent_docs/strapi_integration.md` **diferido a F1**: no existe cliente Strapi todavía; documentarlo ahora sería especular sobre una integración no implementada.

**Criterios de aceptación**:

- [x] Los 5 archivos de `agent_docs/` reflejan decisiones y código realmente presentes en el repo
- [x] Tabla de divulgación progresiva en `CLAUDE.md`/`README.md` actualizada

**Verificado**: 2026-07-24 | **Commit**: (ver registro de progreso)

---

### SPEC-S01-F0-5: Dockerfile multi-stage + nginx.conf

| Campo         | Valor                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------- |
| **Origen**    | P01 F0-05                                                                                      |
| **Archivos**  | `Dockerfile`, `.dockerignore`, `nginx.conf`                                                    |
| **Prioridad** | P1                                                                                             |
| **Estado**    | `[x]` completado (creado y revisado) — `[ ]` pendiente de verificación con `docker build` real |

**Cambios realizados**:

1. `Dockerfile` multi-stage: `node:22-alpine` (build con `npm ci && npm run build`) → `nginx:alpine` (sirve `dist/`), patrón `blog-sprintjudicial`/`HammeredSolutions`.
2. `nginx.conf`: `try_files` para rutas estáticas + fallback a `404.html` real (`src/pages/404.astro` creado para que exista el artefacto), cache agresivo de assets versionados, cabeceras de seguridad (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`), gzip.
3. `.dockerignore` excluye `docs/`, `agent_docs/`, `.claude/`, tests y artefactos de test del contexto de build.

**Criterios de aceptación**:

- [x] `npm run build` genera `dist/index.html` y `dist/404.html`
- [ ] **DIVERGENCIA — pendiente de verificación real**: `docker build` no pudo ejecutarse en el entorno de desarrollo agentic (daemon Docker sin privilegios de contenedor anidado; ver `agent_docs/antipatterns.md`). Verificación efectiva: primer build en EasyPanel (F0-06).

**Verificado**: revisión manual 2026-07-24; build real pendiente | **Commit**: (ver registro de progreso)

---

### SPEC-S01-F0-6: Servicio EasyPanel + DNS + Traefik + auto-deploy

| Campo         | Valor                                                         |
| ------------- | ------------------------------------------------------------- |
| **Origen**    | P01 F0-06                                                     |
| **Archivos**  | `docs/DEPLOYMENT.md` (guía) — ejecución fuera del repositorio |
| **Prioridad** | P0 — sin esto no hay walking skeleton "en producción"         |
| **Estado**    | `[x]` completado                                              |

**Cambios realizados**:

1. `docs/DEPLOYMENT.md`: guía paso a paso (crear servicio, dominio, DNS, auto-deploy, checklist de verificación post-deploy).
2. Rama `main` creada a partir de la rama de trabajo (el repositorio no la tenía) y pusheada a `origin` — requisito previo para que EasyPanel tuviera una rama estable que rastrear.
3. Servicio creado en EasyPanel por el propietario del proyecto siguiendo la guía; build ejecutado con éxito (evidencia: log de build adjunto por el propietario — `astro build` 2 páginas + sitemap, `COPY --from=builder /src/dist /usr/share/nginx/html`, imagen `easypanel/sprintjudicial/justicia-sana` construida, nginx arrancando y sirviendo tráfico).

**Criterios de aceptación**:

- [x] Servicio creado en EasyPanel apuntando a este repo/rama
- [ ] **DIVERGENCIA — pendiente de verificación externa**: `justiciasana.sprintjudicial.com` resuelve con HTTPS válido. El sandbox de desarrollo no tiene salida de red a dominios arbitrarios (proxy interno responde 403 al CONNECT); build y arranque del contenedor confirmados, resolución DNS/Traefik pública queda pendiente de que el propietario la confirme desde su navegador.
- [ ] Push a `main` dispara rebuild automático — sin verificar aún con un segundo push (solo hay evidencia del build inicial)

**Verificado**: 2026-07-24 (build) | **Commit**: `9f54d21` (main), guía y sprint en `76ab5a2`

---

### SPEC-S01-F0-7: Design tokens institucionales (WCAG AA)

| Campo         | Valor                                        |
| ------------- | -------------------------------------------- |
| **Origen**    | P01 F0-07                                    |
| **Archivos**  | `src/lib/tokens.ts`, `src/styles/global.css` |
| **Prioridad** | P1                                           |
| **Estado**    | `[x]` completado                             |

**Cambios realizados**:

1. `src/lib/tokens.ts`: paleta `brand` (primary/onPrimary/ink/surface/accent/danger) + `contrastRatio()` (fórmula WCAG 2.x, luminancia relativa sRGB) + `meetsAA()`.
2. `src/styles/global.css`: tokens expuestos vía `@theme` de Tailwind 4, skip-link, anillo de foco visible global.
3. Cada par de color usado para texto (ink/surface, onPrimary/primary) validado ≥ 4.5:1 **con test**, no visualmente.

**Criterios de aceptación**:

- [x] `contrastRatio` y `meetsAA` cubiertos por tests (9 casos, incluye simetría y error en hex inválido)
- [x] La paleta de marca cumple AA para texto normal (verificado programáticamente)

**Verificado**: 2026-07-24 | **Commit**: (ver registro de progreso)

---

## Hallazgos que alimentan la auditoría de gate F0 (Check)

| Hallazgo                                                 | Clasificación esperada              | Nota                                                                                                                             |
| -------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| CI (`ci.yml`) no verificado con ejecución real en GitHub | DIVERGENCIA MENOR                   | Requiere push remoto; estructura equivalente a rugby-bello                                                                       |
| `docker build` no ejecutable en sandbox de desarrollo    | DIVERGENCIA MENOR                   | Verificación real diferida al primer build en EasyPanel                                                                          |
| CVEs altos en `astro@6.4.8` (XSS en islands hidratadas)  | DIVERGENCIA JUSTIFICADA (por ahora) | Fix requiere Astro 7 (mayor, fuera de alcance F0); riesgo bajo sin islands hasta F5 — revisar antes de F5                        |
| `agent_docs/strapi_integration.md` no escrito            | DIFERIDO A F1                       | No existe integración Strapi todavía; documentarla ahora sería especulativo                                                      |
| Resolución pública de `justiciasana.sprintjudicial.com`  | DIVERGENCIA MENOR                   | Build/contenedor confirmados; DNS/Traefik público pendiente de confirmación del propietario (sin salida de red desde el sandbox) |
| `SIGQUIT` del contenedor ~1 min tras el primer arranque  | DIVERGENCIA MENOR — a vigilar       | Apagado _graceful_ (workers exit 0); consistente con reinicio de EasyPanel tras deploy. Confirmar que no se repite en bucle      |
