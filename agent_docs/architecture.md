# Arquitectura — Justicia Sana

> Nivel 2 de divulgación progresiva. Decisión completa y justificación en `docs/plannings/P00_ANALISIS_REQUISITOS.md`.

## Visión general

JAMstack desplegado íntegramente en el VPS SprintJudicial (Hostinger, Ubuntu + EasyPanel + Traefik), sin dependencias de plataformas externas (Q6):

```
Editores CCL ──▶ Strapi v5 (VPS, EasyPanel)      [F1 — post F0]
                        │ publish webhook
                        ▼
GitHub justicia-sana ──▶ EasyPanel build ──▶ Dockerfile multi-stage
  (push a main)          (Astro fetch Strapi     (node:22-alpine build
                           en build-time)          → nginx:alpine)
                        │
                        ▼
Traefik (HTTPS) ──▶ justiciasana.sprintjudicial.com ──▶ Ciudadanía / Funcionarios
                        │ runtime fetch (islands, post-MVP)
                        ▼
SIRAL — siral.sprintjudicial.com (VPS)
  FastAPI + PostgreSQL 16 — estadísticas públicas, encuestas, PQRS, buzón
```

## Capas del frontend

```
src/
├── lib/          # Lógica pura, sin JSX/Astro — testeable con Vitest
│                 #   site.ts    → config global, nav
│                 #   tokens.ts  → design tokens + cálculo de contraste WCAG
│                 #   (F1) strapi.ts → cliente tipado, fetch build-time
│                 #   (F4) siral.ts  → cliente API pública SIRAL
├── layouts/      # BaseLayout (SEO, skip-link, header/footer), PageLayout (F2)
├── components/   # UI reutilizable; ui/ para átomos (Card, Callout, Accordion)
├── pages/        # File-based routing — cada .astro es una ruta estática
└── styles/       # global.css — Tailwind 4 + @theme con tokens de marca
```

**Principio HTML-first**: cero JS por defecto. Los componentes `.astro` renderizan a HTML estático en build-time. El primer JS de cliente aparece en F5 (islands: encuestas, PQRS, buzón), contra endpoints públicos anonimizados de SIRAL — nunca antes.

## Decisión: por qué estático + Strapi, no SSR

- El portal no maneja datos confidenciales (esos viven en SIRAL); no hay razón para un servidor de aplicación.
- Presupuesto y operación mínimos: un contenedor nginx sirviendo archivos, mismo patrón ya probado en `blog-sprintjudicial`.
- Rebuild en cada publicación de contenido (webhook Strapi → EasyPanel) es aceptable para un portal informativo de bajo volumen de cambios.
- Si en el futuro se requiere contenido verdaderamente dinámico de alta frecuencia, se evalúa entonces — no se diseña de más ahora (YAGNI).

## Pipeline de build y despliegue

1. Push a `main` → GitHub Actions (`ci.yml`): lint, `astro check`, unit tests (Vitest), build, E2E (Playwright).
2. EasyPanel detecta el push (o el webhook de Strapi) → construye la imagen con `Dockerfile` (multi-stage: `node:22-alpine` compila con `npm run build`; `nginx:alpine` sirve `dist/`).
3. Traefik enruta `justiciasana.sprintjudicial.com` (HTTPS) al contenedor.

Detalle operativo de EasyPanel/DNS: `docs/plannings/P01_PLAN_ESTRATEGICO.md` (F0-06) y la guía de referencia en `HammerDev99/HammeredSolutions` (`configuracion DNS.md`).

## Resiliencia ante servicios externos caídos

El build **no debe romperse** si Strapi o la API de SIRAL no responden en build-time (F1-04, F4-02): el cliente tipado debe manejar el caso de fallo devolviendo listas vacías o datos de respaldo, nunca lanzando una excepción que tumbe el pipeline. Se documenta y testea al implementar F1/F4.

## Convenciones de tipado

- Ningún `any` (TS strict, heredado de `astro/tsconfigs/strict`).
- Respuestas de API externas (Strapi, SIRAL): tipadas explícitamente, `readonly`, sin mutación.
- Configuración y constantes: `as const` (ver `src/lib/site.ts`).

---

**Actualizado**: 2026-07-24 (Sprint S01 — Fase F0)
