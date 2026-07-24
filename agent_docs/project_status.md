# Estado del Proyecto — Justicia Sana

> Nivel 2 de divulgación progresiva (CDAID). Resumen ejecutivo en `CLAUDE.md`.

## Fase actual

```
PLANEACIÓN COMPLETA — implementación no iniciada
MVP:      [                    ] 0% (0/29 ítems — F0-F4 + F6)
Total:    [                    ] 0% (0/37 ítems)
```

## Línea de tiempo

| Fecha | Hito |
|-------|------|
| 2026-07-24 | Propuesta del cliente archivada (`docs/cliente/`) |
| 2026-07-24 | P00 v2: gap analysis (20 GAPs) + supuestos Q1–Q7 validados + decisiones D-A..D-D |
| 2026-07-24 | P01 v2: línea de trabajo MVP/post-MVP, mapa de sprints S01–S07 |
| 2026-07-24 | Estructura CDAID/SDD v2 conformada (plannings, sprints, templates, agent_docs) |
| — | S01 (F0): pendiente de arranque |

## Próximo paso

**Sprint S01 — Fase F0**: scaffolding Astro + quality gates + CI + Dockerfile/nginx + servicio EasyPanel + DNS `justiciasana.sprintjudicial.com` → walking skeleton LIVE.

## Archivos de agent_docs/ pendientes (se crean en F0-04)

| Archivo | Contenido previsto |
|---------|--------------------|
| `architecture.md` | JAMstack VPS: Astro → nginx (EasyPanel/Traefik), Strapi, API SIRAL, flujo de rebuild |
| `code_conventions.md` | Naming, imports, tipos Strapi/SIRAL, patrones Astro |
| `testing.md` | Vitest + Playwright: comandos, estructura, patrones |
| `workflow.md` | Ciclo CDAID adaptado a frontend (TDD, SPECs, quality gates) |
| `antipatterns.md` | Decisiones técnicas y antipatrones a evitar |
| `strapi_integration.md` | Content types, cliente tipado, webhook rebuild |

## Métricas

| Métrica | Valor |
|---------|-------|
| Plannings | 2 (P00 v2, P01 v2) |
| Sprints ejecutados | 0 / 5 MVP |
| SPECs | 0 |
| Tests | 0 |
| Deploy | — (target: justiciasana.sprintjudicial.com) |

---

**Actualizado**: 2026-07-24
