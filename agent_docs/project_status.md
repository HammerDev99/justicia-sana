# Estado del Proyecto — Justicia Sana

> Nivel 2 de divulgación progresiva (CDAID). Resumen ejecutivo en `CLAUDE.md`.

## Fase actual

```
SPRINT S02 (Fase F1 — CMS Strapi) — 3/6 SPECs completados en el repo; 3 requieren acción humana*
MVP:      [####                ] ~10% (F0: 7/7 completa, F1: 3/6 en repo)
Total:    [##                  ] ~8% (10/37 ítems)
```

\* F1-02 y F1-06 cuentan como completados (contrato/manual entregados); su ejecución/capturas reales dependen de F1-01. F1-01, F1-03 y F1-05 requieren acceso humano al VPS — ver `docs/DEPLOYMENT_STRAPI.md`.

## Línea de tiempo

| Fecha      | Hito                                                                                                                                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-07-24 | Propuesta del cliente archivada (`docs/cliente/`)                                                                                                                                                                                           |
| 2026-07-24 | P00 v2: gap analysis (20 GAPs) + supuestos Q1–Q7 validados + decisiones D-A..D-D                                                                                                                                                            |
| 2026-07-24 | P01 v2: línea de trabajo MVP/post-MVP, mapa de sprints S01–S07                                                                                                                                                                              |
| 2026-07-24 | Estructura SDD Framework v2 (PDCA) conformada: plannings, sprints, validate, templates, prompts, diagrams, agent_docs                                                                                                                       |
| 2026-07-24 | Skill `sdd-framework-v2` + `refactoring` + `design-patterns` (+ ejemplos TS) instalados en `.claude/`                                                                                                                                       |
| 2026-07-24 | **Sprint S01 (F0)**: Astro 6.4.8 + TS strict + Tailwind 4 inicializado; quality gates operativos; 12 unit + 4 E2E en verde; Dockerfile/nginx/CI creados; 5 `agent_docs/` escritos; tokens WCAG AA validados por test                        |
| 2026-07-24 | Rama `main` creada (repo no la tenía) y configurada en EasyPanel; **build exitoso confirmado** por el propietario: imagen `easypanel/sprintjudicial/justicia-sana`, nginx sirviendo tráfico. **Sprint S01 cerrado — walking skeleton LIVE** |

## Próximo paso

1. **Pendiente del propietario**: confirmar en el navegador que `https://justiciasana.sprintjudicial.com/` resuelve (DNS/Traefik) — no bloquea el resto del plan.
2. **Pendiente del propietario**: ejecutar `docs/DEPLOYMENT_STRAPI.md` (F1-01, F1-03, F1-05) — aprovisionar Strapi, crear los 9 content types, rol Editor CCL, token y webhook.
3. Auditoría de gate F0 (Check): `docs/validate/AUDIT_01_..._GATE_F0_SCAFFOLDING.md`.
4. Auditoría de gate F1 (Check): `docs/validate/AUDIT_02_..._GATE_F1_CMS_STRAPI.md`.
5. Tras gates aprobados: Sprint S03 (Fase F2 — Layout), que no depende de que F1-01/03/05 estén ejecutados.

## Hallazgos abiertos (alimentan las auditorías de gate F0/F1)

| Hallazgo                                            | Impacto         | Detalle                                                                                                                   |
| --------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Resolución pública del dominio sin confirmar        | Bajo            | Build y contenedor OK; confirmación de DNS/Traefik pendiente del propietario (sandbox sin salida a dominios arbitrarios)  |
| SIGQUIT ~1 min tras arranque en primer deploy       | Bajo, a vigilar | Apagado _graceful_ (workers exit 0), consistente con reinicio de EasyPanel tras deploy. Vigilar que no se repita en bucle |
| CI (`ci.yml`) sin ejecución real verificada         | Bajo            | Requiere push remoto a GitHub                                                                                             |
| CVEs altos en `astro@6.4.8`                         | Bajo por ahora  | XSS en islands hidratadas; sin islands hasta F5. Revisar antes de F5 — ver `agent_docs/antipatterns.md`                   |
| F1-01/03/05 pendientes (Strapi real)                | Bloqueante F1   | Acción humana en el VPS — guía en `docs/DEPLOYMENT_STRAPI.md`                                                             |
| Cliente Strapi sin verificación de integración real | Bajo            | Tests mockean `fetch`; falta probar contra una instancia real tras F1-01                                                  |

## Métricas

| Métrica             | Valor                                                                     |
| ------------------- | ------------------------------------------------------------------------- |
| Plannings           | 2 (P00 v2, P01 v2)                                                        |
| Sprints ejecutados  | S01 (F0) completo — 7/7 SPECs. S02 (F1) en curso — 3/6 SPECs (repo)       |
| Tests unitarios     | 34 (Vitest) — `src/lib/tokens.ts`, `src/lib/site.ts`, `src/lib/strapi.ts` |
| Tests E2E           | 4 (Playwright) — `tests/e2e/home.spec.ts`                                 |
| Content types       | 9 documentados (contrato) — 0 creados en instancia real                   |
| Páginas funcionales | 2 (`/`, `/404`)                                                           |
| `astro check`       | 0 errores                                                                 |
| `npm run lint`      | limpio                                                                    |
| `npm run build`     | OK (token de Strapi verificado ausente en `dist/`)                        |
| Deploy              | **LIVE** (build confirmado) — `justiciasana.sprintjudicial.com`           |

---

**Actualizado**: 2026-07-24 (Sprint S02 en curso — cliente Strapi + contrato de content types)
