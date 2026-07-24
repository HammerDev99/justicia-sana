# Estado del Proyecto — Justicia Sana

> Nivel 2 de divulgación progresiva (CDAID). Resumen ejecutivo en `CLAUDE.md`.

## Fase actual

```
GATE F2 APROBADO (AUDIT_03) — Sprint S03 (F2 — Layout) completo, 4/4 SPECs. F1 (CMS Strapi) — 3/6 en repo, resto en VPS*
MVP:      [##########          ] ~48% (F0: 7/7, F1: 3/6 repo, F2: 4/4 completa)
Total:    [########            ] ~38% (14/37 ítems)
```

\* F1-02 y F1-06 cuentan como completados (contrato/manual entregados); su ejecución/capturas reales dependen de F1-01. F1-01, F1-03 y F1-05 requieren acceso humano al VPS — ver `docs/DEPLOYMENT_STRAPI.md`.

## Línea de tiempo

| Fecha      | Hito                                                                                                                                                                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-07-24 | Propuesta del cliente archivada (`docs/cliente/`)                                                                                                                                                                                            |
| 2026-07-24 | P00 v2: gap analysis (20 GAPs) + supuestos Q1–Q7 validados + decisiones D-A..D-D                                                                                                                                                             |
| 2026-07-24 | P01 v2: línea de trabajo MVP/post-MVP, mapa de sprints S01–S07                                                                                                                                                                               |
| 2026-07-24 | Estructura SDD Framework v2 (PDCA) conformada: plannings, sprints, validate, templates, prompts, diagrams, agent_docs                                                                                                                        |
| 2026-07-24 | Skill `sdd-framework-v2` + `refactoring` + `design-patterns` (+ ejemplos TS) instalados en `.claude/`                                                                                                                                        |
| 2026-07-24 | **Sprint S01 (F0)**: Astro 6.4.8 + TS strict + Tailwind 4 inicializado; quality gates operativos; 12 unit + 4 E2E en verde; Dockerfile/nginx/CI creados; 5 `agent_docs/` escritos; tokens WCAG AA validados por test                         |
| 2026-07-24 | Rama `main` creada (repo no la tenía) y configurada en EasyPanel; **build exitoso confirmado** por el propietario: imagen `easypanel/sprintjudicial/justicia-sana`, nginx sirviendo tráfico. **Sprint S01 cerrado — walking skeleton LIVE**  |
| 2026-07-24 | **Sprint S02 (F1)**: cliente Strapi tipado + 22 tests + contrato de 9 content types; **Sprint S02-P02**: repo `justicia-sana-cms` creado y verificado en local (bug de unicidad `home`/`quienes-somos` encontrado y corregido)               |
| 2026-07-24 | **Sprint S03 (F2) completo**: BaseLayout/PageLayout/SEO extraídos, Header/Footer accesibles sin JS, 6 componentes UI, 3 páginas nuevas — **F0-A resuelto** (cero 404 en la navegación principal), 14 tests E2E nuevos, 5 páginas construidas |

## Próximo paso

1. **Fix de deploy aplicado** (`27075e9` en `main`): eliminado el `HEALTHCHECK` del Dockerfile que causaba bucle de reinicios en EasyPanel (SIGQUIT ~1 min). Pendiente: confirmar que el redeploy queda estable y el dominio resuelve.
2. **Pendiente del propietario (crítico)**: adecuar Strapi a producción antes de cargar contenido — se desplegó en SQLite/development (efímero). Planning: `docs/plannings/P02_STRAPI_PRODUCCION.md`.
3. **Pendiente del propietario**: completar F1-01/03/05 (`docs/DEPLOYMENT_STRAPI.md`) una vez P02 (Postgres+production) esté listo.
4. ~~Auditoría de gate F0 (Check)~~ ✅ **AUDIT_01** — APROBADO (SDD 100 %, 0 defectos).
5. ~~Auditoría de gate F1 (Check)~~ ✅ **AUDIT_02** — APROBADO (código), con salvedad operativa (P02 pendiente).
6. ~~Generar repo Strapi `justicia-sana-cms` (P02 Fase B)~~ ✅ **Creado y pusheado** — `HammerDev99/justicia-sana-cms` (9 content types verificados en local, Dockerfile + driver pg).
7. **Pendiente del propietario**: P02 Fases A/C (Postgres persistente, volumen uploads, backups) + desplegar `justicia-sana-cms` en EasyPanel + permisos API (B-03).
8. ~~Sprint S03 (F2 — Layout)~~ ✅ **Completo** — 4/4 SPECs, F0-A resuelto, 15 tests E2E.
9. ~~Auditoría de gate F2 (Check)~~ ✅ **AUDIT_03** — APROBADO (SDD 90.6 %, 0 defectos sin resolver; 1 defecto de test de seguridad encontrado y corregido con TDD dentro del gate).
10. **Siguiente (a tu orden)**: Sprint S04 (F3 — Contenido Núcleo vía Strapi), que reemplaza el contenido estático de F2 con datos reales una vez P02 esté completo en el VPS.

## Hallazgos abiertos (post gate F2 — ver `docs/validate/AUDIT_03_2026-07-24_GATE_F2_LAYOUT.md` §6 para el detalle completo)

| Hallazgo                                                                                | Impacto        | Detalle                                                                                                                  |
| --------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Resolución pública del dominio sin confirmar                                            | Bajo           | Build y contenedor OK; confirmación de DNS/Traefik pendiente del propietario (sandbox sin salida a dominios arbitrarios) |
| ~~SIGQUIT ~1 min → bucle de reinicios~~ **RESUELTO**                                    | —              | Causa: `HEALTHCHECK` del Dockerfile (`wget --spider` no fiable en BusyBox). Eliminado en `27075e9`                       |
| ~~CI (`ci.yml`) sin ejecución real verificada~~ **RESUELTO**                            | —              | Confirmado vía API GitHub: runs #1 y #2 en `main` con `conclusion: success` (AUDIT_01)                                   |
| ~~F0-A (nav con 404)~~ **RESUELTO en S03**                                              | —              | `/quienes-somos`, `/normativa`, `/canales-de-ayuda` creadas; los 4 enlaces de `navLinks` responden 200 (verificado E2E)  |
| ~~F0-B (fuente Inter sin cargar)~~ **RESUELTO en S03**                                  | —              | Declaración eliminada de `global.css`; se formaliza el stack `system-ui` (ya cumplía AA)                                 |
| ~~F2-A (test E2E de seguridad con puntos ciegos)~~ **RESUELTO en AUDIT_03**             | —              | `layout.spec.ts` reescrito (HTML crudo, `tel:`, líneas cortas, Home) — TDD verificado RED→GREEN                          |
| Strapi en SQLite/development (efímero)                                                  | **Crítico**    | Se perdería el contenido en cada reinicio. Remediación planificada: `docs/plannings/P02_STRAPI_PRODUCCION.md`            |
| CVEs altos en `astro@6.4.8`                                                             | Bajo por ahora | XSS en islands hidratadas; sin islands hasta F5. Revisar antes de F5 — ver `agent_docs/antipatterns.md`                  |
| Contenido de F3 aún estático (F2 lo dejó como placeholder)                              | Ninguno        | Diseñado a propósito para ser reemplazado por F3-01/F3-02/F3-05 sin cambiar componentes                                  |
| F1-01/03/05 pendientes (Strapi real)                                                    | Bloqueante F1  | Acción humana en el VPS — guía en `docs/DEPLOYMENT_STRAPI.md`                                                            |
| Cliente Strapi sin verificación de integración real                                     | Bajo           | Tests mockean `fetch`; falta probar contra una instancia real tras F1-01                                                 |
| Skip-link/`id="contenido"` acoplado entre `BaseLayout`/`PageLayout`                     | Bajo           | F2-E — fijar antes de F5                                                                                                 |
| Discrepancia "≤65 días" (aquí) vs "6 meses" (SIRAL_System) para la Resolución 3461/2025 | Medio          | F2-J — requiere verificación humana contra el texto oficial de la norma, no se resuelve por inferencia                   |

## Métricas

| Métrica             | Valor                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------- |
| Plannings           | 3 (P00 v2, P01 v2, P02)                                                                  |
| Sprints ejecutados  | S01 (F0) completo — 7/7. S02 (F1) — 3/6 en repo. S03 (F2) completo — 4/4                 |
| Tests unitarios     | 34 (Vitest) — `src/lib/tokens.ts`, `src/lib/site.ts`, `src/lib/strapi.ts`                |
| Tests E2E           | 15 (Playwright) — `home.spec.ts` (4) + `layout.spec.ts` (11)                             |
| Content types       | 9 documentados (contrato) + materializados en `justicia-sana-cms` — 0 en instancia real  |
| Páginas funcionales | 5 (`/`, `/quienes-somos`, `/normativa`, `/canales-de-ayuda`, `/404`)                     |
| Componentes         | 3 layout (BaseLayout/PageLayout/SEO) + 2 (Header/Footer) + 6 UI reutilizables            |
| `astro check`       | 0 errores (30 archivos)                                                                  |
| `npm run lint`      | limpio                                                                                   |
| `npm run build`     | OK (5 páginas; token de Strapi verificado ausente en `dist/`)                            |
| Deploy              | **LIVE** (build confirmado) — `justiciasana.sprintjudicial.com`                          |
| Auditorías          | AUDIT_01 (F0, aprobado) · AUDIT_02 (F1, aprobado con salvedad) · AUDIT_03 (F2, aprobado) |

---

**Actualizado**: 2026-07-24 (Gate F2 APROBADO — AUDIT_03, 0 defectos sin resolver)
