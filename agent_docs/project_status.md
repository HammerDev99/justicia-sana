# Estado del Proyecto — Justicia Sana

> Nivel 2 de divulgación progresiva (CDAID). Resumen ejecutivo en `CLAUDE.md`.

## Fase actual

```
SPRINT S01 (Fase F0 — Scaffolding + Walking Skeleton) — 7/7 SPECs completados. LIVE.
MVP:      [###                 ] ~7% (F0: 7/7 completa)
Total:    [#                   ] ~5% (7/37 ítems)
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
| 2026-07-24 | Rama `main` creada (repo no la tenía) y configurada en EasyPanel; **build exitoso confirmado** por el propietario: imagen `easypanel/sprintjudicial/justicia-sana`, nginx sirviendo tráfico. **Sprint S01 cerrado — walking skeleton LIVE** |

## Próximo paso

1. **Pendiente del propietario**: confirmar en el navegador que `https://justiciasana.sprintjudicial.com/` resuelve (DNS/Traefik) — no bloquea el resto del plan.
2. Auditoría de gate F0 (Check): `docs/validate/AUDIT_01_..._GATE_F0_SCAFFOLDING.md`, sobre los hallazgos listados en `docs/sprints/S01_SCAFFOLDING/SPEC_S01_F0_SCAFFOLDING.md`.
3. **Sprint S02 (Fase F1 — CMS Strapi) en curso** — no bloqueado por el punto 1.

## Hallazgos abiertos (alimentan la auditoría de gate F0)

| Hallazgo                                      | Impacto         | Detalle                                                                                                 |
| --------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------- |
| Resolución pública del dominio sin confirmar  | Bajo              | Build y contenedor OK; confirmación de DNS/Traefik pendiente del propietario (sandbox sin salida a dominios arbitrarios) |
| SIGQUIT ~1 min tras arranque en primer deploy | Bajo, a vigilar   | Apagado *graceful* (workers exit 0), consistente con reinicio de EasyPanel tras deploy. Vigilar que no se repita en bucle |
| CI (`ci.yml`) sin ejecución real verificada   | Bajo              | Requiere push remoto a GitHub                                                                           |
| CVEs altos en `astro@6.4.8`                   | Bajo por ahora    | XSS en islands hidratadas; sin islands hasta F5. Revisar antes de F5 — ver `agent_docs/antipatterns.md` |
| `agent_docs/strapi_integration.md` no escrito | Ninguno           | En progreso — Sprint S02 (F1)                                                                           |

## Métricas

| Métrica             | Valor                                                       |
| ------------------- | ----------------------------------------------------------- |
| Plannings           | 2 (P00 v2, P01 v2)                                          |
| Sprints ejecutados  | S01 (F0) completo — 7/7 SPECs. S02 (F1) en curso            |
| Tests unitarios     | 12 (Vitest) — `src/lib/tokens.ts`, `src/lib/site.ts`        |
| Tests E2E           | 4 (Playwright) — `tests/e2e/home.spec.ts`                   |
| Páginas funcionales | 2 (`/`, `/404`)                                             |
| `astro check`       | 0 errores                                                   |
| `npm run lint`      | limpio                                                      |
| `npm run build`     | OK                                                          |
| Deploy              | **LIVE** (build confirmado) — `justiciasana.sprintjudicial.com` |

---

**Actualizado**: 2026-07-24 (cierre Sprint S01 / inicio Sprint S02)
