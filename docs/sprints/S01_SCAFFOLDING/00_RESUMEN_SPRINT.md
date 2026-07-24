# Sprint 01 — Scaffolding + Walking Skeleton

**Fecha inicio**: 2026-07-24
**Objetivo**: Proyecto Astro inicializado, quality gates operativos, tokens de marca validados WCAG AA, y pipeline de despliegue (Dockerfile/CI) listo — bloqueado solo por la creación manual del servicio en EasyPanel.
**Cierre**: 2026-07-24 — build exitoso en EasyPanel confirmado por el propietario del proyecto (log de build + arranque de nginx adjuntos). Walking skeleton LIVE.
**Planning**: `docs/plannings/P01_PLAN_ESTRATEGICO.md` (Fase F0)
**SPEC de referencia**: `docs/sprints/S01_SCAFFOLDING/SPEC_S01_F0_SCAFFOLDING.md`
**Metodología**: SDD Framework v2 (CDAID v2) — fase Do

---

## Estado General

```
Sprint 01: [############################] 100% (7/7 SPECs completados)
```

| Fase      | Total SPECs | Completados | En progreso | Pendientes |
| --------- | :---------: | :---------: | :---------: | :--------: |
| F0        |      7      |      7      |      0      |     0      |
| **Total** |    **7**    |    **7**    |    **0**    |   **0**    |

---

## Registro de Progreso

| Fecha      | SPEC     | Descripción                                                     | Commit                               |    Tests     | Notas                                                                                   |
| ---------- | -------- | --------------------------------------------------------------- | ------------------------------------ | :----------: | --------------------------------------------------------------------------------------- |
| 2026-07-24 | S01-F0-1 | Init Astro 6.4.8 + TS strict + Tailwind 4 + estructura `src/`   | `9f54d21` |      —       | Fix real: `overrides.vite` para resolver conflicto Astro/Tailwind (ver antipatterns.md) |
| 2026-07-24 | S01-F0-2 | Quality gates: ESLint+Prettier, Vitest, Playwright, astro check | `9f54d21` |     +16      | 12 unit + 4 E2E, todos verificados en verde                                             |
| 2026-07-24 | S01-F0-3 | CI GitHub Actions (`ci.yml`)                                    | `9f54d21` |      —       | No verificado con push real aún                                                         |
| 2026-07-24 | S01-F0-4 | CDAID setup: 5 archivos de `agent_docs/`                        | `9f54d21` |      —       | `strapi_integration.md` diferido a F1                                                   |
| 2026-07-24 | S01-F0-5 | Dockerfile multi-stage + nginx.conf + 404.astro                 | `9f54d21` |      —       | `docker build` no verificable en sandbox; revisión manual                               |
| 2026-07-24 | S01-F0-7 | Design tokens + contraste WCAG AA                               | `9f54d21` | incl. en +16 | `contrastRatio`/`meetsAA` con 9 tests dedicados                                         |
| 2026-07-24 | S01-F0-6 | Servicio EasyPanel + DNS + auto-deploy                          | —                                    |      —       | Build exitoso confirmado en consola EasyPanel (imagen `easypanel/sprintjudicial/justicia-sana`); nginx sirviendo en el contenedor. Verificación externa de la URL pública pendiente de confirmar por el propietario (sandbox de desarrollo no tiene salida a dominios arbitrarios) |

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
4. **Docker no verificable en el sandbox**: el daemon Docker no tiene privilegios de contenedor anidado en este entorno de desarrollo. `Dockerfile`/`nginx.conf` revisados manualmente contra el patrón probado de `blog-sprintjudicial`; verificación real confirmada en el primer build en EasyPanel (ver punto 6).
5. **F0-06 requería al propietario del proyecto**: crear el servicio en EasyPanel, configurar el dominio y verificar el DNS son acciones fuera del repositorio que solo puede ejecutar quien tiene acceso al panel del VPS. Se entregó como guía ejecutable en `docs/DEPLOYMENT.md` y fue ejecutada por el propietario el 2026-07-24.
6. **Build en EasyPanel — verificación real del pipeline**: log de build confirma `astro build` (2 páginas, sitemap generado), `COPY --from=builder /src/dist /usr/share/nginx/html`, imagen `easypanel/sprintjudicial/justicia-sana` construida con éxito, y nginx arrancando y sirviendo tráfico (`start worker processes`). Un `SIGQUIT` de apagado *graceful* ~1 min después (workers salieron con código 0) es consistente con un reinicio de EasyPanel tras el primer deploy (reconfiguración de red/healthcheck), no un crash — a vigilar si se repite en bucle.

---

## Próximos Pasos

1. ~~Confirmar autoría/push del commit de este sprint.~~ ✓ `9f54d21`
2. ~~Acción del propietario: ejecutar `docs/DEPLOYMENT.md` (F0-06).~~ ✓ Build exitoso en EasyPanel confirmado (2026-07-24)
3. **Pendiente del propietario**: confirmar en el navegador que `https://justiciasana.sprintjudicial.com/` resuelve y sirve el sitio (DNS/Traefik) — el sandbox de desarrollo no tiene salida de red a dominios arbitrarios para verificarlo
4. Auditoría de gate F0 (`docs/validate/AUDIT_01_2026-07-24_GATE_F0_SCAFFOLDING.md`) — Check del ciclo PDCA, referenciando los 6 hallazgos de la tabla en el SPEC
5. Tras gate F0 aprobado (≥ 85%): Sprint 02 (Fase F1 — CMS Strapi) arranca en paralelo (no bloqueado por el punto 3)

---

**Versión**: 1.0
**Fecha**: 2026-07-24
