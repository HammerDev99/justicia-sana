# AUDIT 01 — Gate F0: Scaffolding + Walking Skeleton

**Fecha**: 2026-07-24
**Fase auditada**: F0 (Sprint S01) — `docs/sprints/S01_SCAFFOLDING/`
**Tipo**: Gate entre fases (Check del ciclo PDCA)
**Auditor**: revisión inline multi-rol (code-reviewer, security-scanner, refactor-planner, design-patterns, doc-auditor) — sin subagentes
**Commits auditados**: `9f54d21` (F0) · `27075e9` (fix deploy)

> Instrumentos adaptados al stack (ver `docs/validate/README.md`): `pytest`→Vitest/Playwright, `ruff`/`mypy`→ESLint/`astro check`, `bandit`→`npm audit`.

---

## 1. Checklist de gate

### Funcional

- [x] `npm run build` genera `dist/` (index.html, 404.html, sitemap, robots) — verificado
- [x] Walking skeleton **LIVE** en `justiciasana.sprintjudicial.com` (build EasyPanel confirmado por el propietario; bucle de reinicios resuelto en `27075e9`)
- [x] 404 propio (`src/pages/404.astro`) servido por `nginx.conf` (`try_files … /404.html`)
- [x] E2E: home carga, título institucional, navegación accesible, skip-link enfocable, sin errores de consola (4/4)

### Seguridad

- [x] Sin secretos en el repo (`.env` en `.gitignore`; no hay tokens hardcodeados en F0)
- [x] Cabeceras de seguridad en `nginx.conf`: `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`
- [x] Sitio estático sin backend propio → superficie de ataque mínima (decisión de arquitectura P00)
- [⚠] `npm audit`: 3 vulnerabilidades (2 high + 1 low) en `astro@6.4.8` / esbuild / sharp — ver Hallazgo F0-C (diferido justificado)

### Calidad

- [x] `npm run lint` (ESLint + Prettier) limpio
- [x] `npx astro check` — 0 errores, 0 warnings, 0 hints (16 archivos)
- [x] 34 tests unitarios (Vitest) en verde
- [x] **CI en GitHub Actions verificado con éxito real** — runs #1 (`9f54d21`) y #2 (`27075e9`) ambos `conclusion: success` (API GitHub). Resuelve el hallazgo "CI sin ejecución real" del sprint S01

### Arquitectura

- [x] Estructura `src/{lib,layouts,components,pages,styles}` conforme a P01
- [x] TypeScript strict (extiende `astro/tsconfigs/strict`); ningún `any`
- [x] Zero JS por defecto (sin islands en F0) — regla crítica 2
- [x] Dockerfile multi-stage (node build → nginx:alpine), patrón `blog-sprintjudicial`

---

## 2. Conformidad SDD (protocolo 8 puntos, adaptado a frontend)

| #   | Punto (adaptado)                                            | Resultado | Evidencia                                                                                                               |
| --- | ----------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| P1  | Inmutabilidad de datos (`readonly`/`as const` ≈ frozen DTO) | CONFORME  | `tokens.ts` `brand … as const`; `site.ts` `as const`, `NavLink readonly`                                                |
| P2  | Funciones: firma tipada, caminos de éxito/fallo             | CONFORME  | `contrastRatio`/`meetsAA` puros; `hexToRgb` lanza ante hex inválido (fallo explícito, testeado)                         |
| P3  | Backward compat (callers no rotos)                          | N/A       | Greenfield — sin callers previos                                                                                        |
| P4  | Configuración/DI                                            | CONFORME  | Sin contenedor DI (innecesario); config vía `site.ts` tipado                                                            |
| P5  | Delegación de interfaces                                    | CONFORME  | `index.astro`/`404.astro` delegan en `BaseLayout`; layout consume `site`/`navLinks`                                     |
| P6  | Tests: éxito + fallo + cobertura                            | CONFORME  | 12 unit (tokens/site) incl. caso de error (hex inválido, `toThrow`) + 4 E2E; cobertura `src/lib` = funciones exportadas |
| P7  | Code smells                                                 | CONFORME  | Ver §3 (refactor-planner) — sin smells relevantes                                                                       |
| P8  | Patrones                                                    | CONFORME  | Ver §3 (design-patterns) — Layout como plantilla, sin sobre-ingeniería                                                  |

**Tasa de aprobación SDD**: 7 CONFORME / 7 aplicables = **100 %** (≥ 85 % ✓)

---

## 3. Reportes de revisión (multi-rol, inline)

### code-reviewer

- `tokens.ts`: implementación WCAG 2.x correcta (linealización sRGB + luminancia relativa + ratio). `hexToRgb` valida formato y falla explícitamente. Sin `any`, todo `readonly`. **Sin hallazgos.**
- `BaseLayout.astro`: SEO completo (canonical, Open Graph, Twitter card), `lang` desde config, `skip-link` presente, `<nav aria-label>`, `<main id>` para el skip. **Sin hallazgos.**
- `strapi`-independiente en F0 (correcto: no se adelanta integración).

### security-scanner

- Sin secretos ni credenciales en el árbol F0. `nginx.conf` con cabeceras de endurecimiento. `X-Frame-Options: DENY` correcto para un portal sin necesidad de embedding.
- **Hallazgo F0-C** (dependencias): `astro@6.4.8` arrastra 2 CVE high de **XSS en View Transitions / islands hidratadas / spread de atributos** + esbuild (dev-server en Windows) + sharp (libvips, build-time). Explotabilidad **actual = muy baja**: el sitio no usa islands ni View Transitions y es estático; los vectores XSS no son alcanzables. **No obstante**, es de obligada re-evaluación antes de F5 (cuando aparezcan islands hidratadas).

### refactor-planner (instrumento: skill `refactoring`)

- Sin Long Method, Duplicate Code ni Feature Envy. Funciones cortas y de responsabilidad única en `tokens.ts`. Las 3 tarjetas de acceso rápido en `index.astro` tienen marcado repetido (candidato menor a componente `Card` en F2, no es deuda en F0). **Sin smell bloqueante.**

### design-patterns (instrumento: skill `design-patterns`)

- `BaseLayout` actúa como **Template/Layout** (composición vía `<slot>`), apropiado. No hay sobre-aplicación de patrones (correcto para un skeleton). **Sin hallazgos.**

### doc-auditor

- `CLAUDE.md`, `agent_docs/`, `SPEC_S01`, resumen de sprint y `project_status.md` coherentes con el código real. Métricas (34 tests, LIVE) verificadas. **Sin desincronización.**

---

## 4. Hallazgos de esta auditoría

| ID   | Hallazgo                                                                                                                            | Clasificación           | Acción                                                                                                                                            |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| F0-A | Enlaces internos de `navLinks` y home apuntan a `/quienes-somos`, `/normativa`, `/canales-de-ayuda`, que aún **devuelven 404**      | DIVERGENCIA JUSTIFICADA | Esperado en el walking skeleton; esas páginas son F2/F3. Rastreado para F2 (no romper enlaces al publicar)                                        |
| F0-B | `--font-sans` declara `'Inter'` en `global.css` pero **no se carga** (sin `@font-face`/preload en `BaseLayout`) → cae a `system-ui` | DIVERGENCIA MENOR       | Resolver en F2: cargar Inter (preload) **o** quitarla del stack. Sin impacto AA (system-ui funciona y es Lighthouse-friendly)                     |
| F0-C | CVEs en `astro@6.4.8` (2 high XSS + esbuild + sharp)                                                                                | DIVERGENCIA JUSTIFICADA | **Trigger duro**: actualizar Astro a ≥ 7.x **antes de F5** (primera island hidratada). No alcanzable hoy (estático, sin islands/View Transitions) |

Ningún hallazgo es **DEFECTO** → no hay fase Act obligatoria en este gate.

## 5. Correcciones ya aplicadas (durante el sprint, pre-gate)

| Hallazgo original                                | Fix                                    | Commit    | Verificación                             |
| ------------------------------------------------ | -------------------------------------- | --------- | ---------------------------------------- |
| Bucle de reinicios en EasyPanel (SIGQUIT ~1 min) | Eliminado `HEALTHCHECK` del Dockerfile | `27075e9` | Sitio LIVE confirmado por el propietario |
| CI sin ejecución real verificada                 | (ninguno — solo verificación)          | —         | Runs #1 y #2 `success` vía API GitHub    |
| `docker build` no verificado en sandbox          | (ninguno)                              | —         | Build real exitoso en EasyPanel          |

## 6. Hallazgos diferidos (alimentan el backlog / próximos plannings)

- **F0-C** → tarea previa a F5: upgrade de Astro (mayor). Registrar en el planning de F5.
- **F0-A / F0-B** → se resuelven naturalmente en F2 (layout + páginas de contenido).

---

## Veredicto

**GATE F0: APROBADO** ✅

- Tasa de aprobación SDD: 100 % (7/7 aplicables).
- 0 DEFECTOS; 3 divergencias (2 justificadas, 1 menor), todas con acción rastreada.
- Quality gates verdes + CI verificado con éxito real + deploy LIVE.

Habilitado para continuar. El gate F1 se audita por separado (`AUDIT_02`).

---

**Versión**: 1.0
**Fecha**: 2026-07-24
