# Estado del Proyecto — Justicia Sana

> Nivel 2 de divulgación progresiva (CDAID). Resumen ejecutivo en `CLAUDE.md`.

## Fase actual

```
SPRINT S01 (Fase F0 — Scaffolding + Walking Skeleton) — 6/7 SPECs completados en el repo
MVP:      [##                  ] ~5% (F0: 6/7 — falta F0-06, acción humana en EasyPanel)
Total:    [#                   ] ~3% (6/37 ítems)
```

## Línea de tiempo

| Fecha      | Hito                                                                                                                                                                                                                 |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-07-24 | Propuesta del cliente archivada (`docs/cliente/`)                                                                                                                                                                    |
| 2026-07-24 | P00 v2: gap analysis (20 GAPs) + supuestos Q1–Q7 validados + decisiones D-A..D-D                                                                                                                                     |
| 2026-07-24 | P01 v2: línea de trabajo MVP/post-MVP, mapa de sprints S01–S07                                                                                                                                                       |
| 2026-07-24 | Estructura SDD Framework v2 (PDCA) conformada: plannings, sprints, validate, templates, prompts, diagrams, agent_docs                                                                                                |
| 2026-07-24 | Skill `sdd-framework-v2` + `refactoring` + `design-patterns` (+ ejemplos TS) instalados en `.claude/`                                                                                                                |
| 2026-07-24 | **Sprint S01 (F0)**: Astro 6.4.8 + TS strict + Tailwind 4 inicializado; quality gates operativos; 12 unit + 4 E2E en verde; Dockerfile/nginx/CI creados; 5 `agent_docs/` escritos; tokens WCAG AA validados por test |

## Próximo paso

1. **Acción del propietario**: ejecutar `docs/DEPLOYMENT.md` (F0-06 — crear servicio en EasyPanel, DNS, auto-deploy) para tener el walking skeleton LIVE en `justiciasana.sprintjudicial.com`.
2. Auditoría de gate F0 (Check): `docs/validate/AUDIT_01_..._GATE_F0_SCAFFOLDING.md`, sobre los hallazgos listados en `docs/sprints/S01_SCAFFOLDING/SPEC_S01_F0_SCAFFOLDING.md`.
3. Tras gate aprobado: Sprint S02 (Fase F1 — CMS Strapi).

## Hallazgos abiertos (alimentan la auditoría de gate F0)

| Hallazgo                                      | Impacto                                 | Detalle                                                                                                 |
| --------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| F0-06 pendiente                               | Bloquea el hito "walking skeleton LIVE" | Requiere acceso humano al panel EasyPanel — guía en `docs/DEPLOYMENT.md`                                |
| CI (`ci.yml`) sin ejecución real verificada   | Bajo                                    | Requiere push remoto a GitHub                                                                           |
| `docker build` no verificado en sandbox       | Bajo                                    | Sin daemon Docker con privilegios; verificación real en el primer build de EasyPanel                    |
| CVEs altos en `astro@6.4.8`                   | Bajo por ahora                          | XSS en islands hidratadas; sin islands hasta F5. Revisar antes de F5 — ver `agent_docs/antipatterns.md` |
| `agent_docs/strapi_integration.md` no escrito | Ninguno                                 | Diferido a F1 (no existe integración Strapi todavía)                                                    |

## Métricas

| Métrica             | Valor                                                       |
| ------------------- | ----------------------------------------------------------- |
| Plannings           | 2 (P00 v2, P01 v2)                                          |
| Sprints ejecutados  | S01 en curso (F0) — 6/7 SPECs                               |
| Tests unitarios     | 12 (Vitest) — `src/lib/tokens.ts`, `src/lib/site.ts`        |
| Tests E2E           | 4 (Playwright) — `tests/e2e/home.spec.ts`                   |
| Páginas funcionales | 2 (`/`, `/404`)                                             |
| `astro check`       | 0 errores                                                   |
| `npm run lint`      | limpio                                                      |
| `npm run build`     | OK                                                          |
| Deploy              | pendiente F0-06 (target: `justiciasana.sprintjudicial.com`) |

---

**Actualizado**: 2026-07-24 (Sprint S01, Fase F0)
