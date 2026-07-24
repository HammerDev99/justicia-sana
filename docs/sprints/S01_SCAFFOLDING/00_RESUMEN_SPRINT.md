# Sprint 01 — Scaffolding + Walking Skeleton

**Fecha inicio**: 2026-07-24
**Objetivo**: Proyecto Astro inicializado, quality gates operativos, tokens de marca validados WCAG AA, y pipeline de despliegue (Dockerfile/CI) listo — bloqueado solo por la creación manual del servicio en EasyPanel.
**Planning**: `docs/plannings/P01_PLAN_ESTRATEGICO.md` (Fase F0)
**SPEC de referencia**: `docs/sprints/S01_SCAFFOLDING/SPEC_S01_F0_SCAFFOLDING.md`
**Metodología**: SDD Framework v2 (CDAID v2) — fase Do

---

## Estado General

```
Sprint 01: [######################----] ~85% (6/7 SPECs completados en el repo; 1 requiere acción humana fuera de él)
```

| Fase      | Total SPECs | Completados | En progreso |             Pendientes             |
| --------- | :---------: | :---------: | :---------: | :--------------------------------: |
| F0        |      7      |      6      |      0      | 1 (F0-06, acción manual EasyPanel) |
| **Total** |    **7**    |    **6**    |    **0**    |               **1**                |

---

## Registro de Progreso

| Fecha      | SPEC     | Descripción                                                     | Commit                               |    Tests     | Notas                                                                                   |
| ---------- | -------- | --------------------------------------------------------------- | ------------------------------------ | :----------: | --------------------------------------------------------------------------------------- |
| 2026-07-24 | S01-F0-1 | Init Astro 6.4.8 + TS strict + Tailwind 4 + estructura `src/`   | (pendiente de registrar tras commit) |      —       | Fix real: `overrides.vite` para resolver conflicto Astro/Tailwind (ver antipatterns.md) |
| 2026-07-24 | S01-F0-2 | Quality gates: ESLint+Prettier, Vitest, Playwright, astro check | (pendiente de registrar tras commit) |     +16      | 12 unit + 4 E2E, todos verificados en verde                                             |
| 2026-07-24 | S01-F0-3 | CI GitHub Actions (`ci.yml`)                                    | (pendiente de registrar tras commit) |      —       | No verificado con push real aún                                                         |
| 2026-07-24 | S01-F0-4 | CDAID setup: 5 archivos de `agent_docs/`                        | (pendiente de registrar tras commit) |      —       | `strapi_integration.md` diferido a F1                                                   |
| 2026-07-24 | S01-F0-5 | Dockerfile multi-stage + nginx.conf + 404.astro                 | (pendiente de registrar tras commit) |      —       | `docker build` no verificable en sandbox; revisión manual                               |
| 2026-07-24 | S01-F0-7 | Design tokens + contraste WCAG AA                               | (pendiente de registrar tras commit) | incl. en +16 | `contrastRatio`/`meetsAA` con 9 tests dedicados                                         |
| —          | S01-F0-6 | Servicio EasyPanel + DNS + auto-deploy                          | —                                    |      —       | **Pendiente** — requiere acceso humano al panel VPS. Guía: `docs/DEPLOYMENT.md`         |

---

## Métricas de Verificación

| Métrica                  | Pre-Sprint |                                   Post-Sprint                                   | Delta |
| ------------------------ | :--------: | :-----------------------------------------------------------------------------: | :---: |
| Tests unitarios (Vitest) |     0      |                                       12                                        |  +12  |
| Tests E2E (Playwright)   |     0      |                                        4                                        |  +4   |
| Páginas funcionales      |     0      |                                 2 (`/`, `/404`)                                 |  +2   |
| `astro check`            |     —      |                                    0 errores                                    |   ✓   |
| `npm run lint`           |     —      |                                     limpio                                      |   ✓   |
| `npm run build`          |     —      |                              OK (2 páginas, ~1.4s)                              |   ✓   |
| `npm audit`              |     —      | 3 vulnerabilidades altas/bajas en `astro@6.4.8` (diferido, ver antipatterns.md) |   —   |
| Cobertura `src/lib/`     |     —      |      100% de las funciones exportadas testeadas (umbral configurado: 80%)       |   —   |

---

## Decisiones e Incidentes

1. **Conflicto de versiones Vite (Astro 7.x interno vs Tailwind/Vitest 8.x)**: detectado por `astro check` fallando con un error de tipos genuino (no del código propio). Resuelto con `package.json > overrides.vite = "7.3.6"`. Documentado en `agent_docs/antipatterns.md`.
2. **CVEs en `astro@6.4.8`**: `npm audit` reporta 3 vulnerabilidades altas relacionadas con XSS en View Transitions/islands hidratadas. El fix automático salta a Astro 7 (mayor, no planificado). Se documenta como hallazgo diferido, a revisar antes de F5 (cuando el proyecto sí tendrá islands hidratadas).
3. **Playwright — versión de Chromium**: `@playwright/test@1.59.1` esperaba una revisión de Chromium más nueva que la preinstalada en el sandbox. Resuelto con `PLAYWRIGHT_EXECUTABLE_PATH` opcional en `playwright.config.ts` (no afecta CI real ni otros entornos).
4. **Docker no verificable en el sandbox**: el daemon Docker no tiene privilegios de contenedor anidado en este entorno de desarrollo. `Dockerfile`/`nginx.conf` revisados manualmente contra el patrón probado de `blog-sprintjudicial`; verificación real diferida al primer build en EasyPanel.
5. **F0-06 requiere al propietario del proyecto**: crear el servicio en EasyPanel, configurar el dominio y verificar el DNS son acciones fuera del repositorio que solo puede ejecutar quien tiene acceso al panel del VPS. Se entrega como guía ejecutable en `docs/DEPLOYMENT.md`.

---

## Próximos Pasos

1. Confirmar autoría/push del commit de este sprint.
2. **Acción del propietario**: ejecutar `docs/DEPLOYMENT.md` (F0-06) para tener el walking skeleton LIVE.
3. Auditoría de gate F0 (`docs/validate/AUDIT_01_2026-07-24_GATE_F0_SCAFFOLDING.md`) — Check del ciclo PDCA, referenciando los 5 hallazgos de la tabla en el SPEC.
4. Tras gate F0 aprobado (≥ 85%): iniciar Sprint 02 (Fase F1 — CMS Strapi).

---

**Versión**: 1.0
**Fecha**: 2026-07-24
