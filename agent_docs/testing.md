# Testing — Justicia Sana

> Nivel 2 de divulgación progresiva.

## Comandos

```bash
npm test                # Vitest — tests unitarios (tests/unit/**/*.test.ts)
npm run test:watch      # Vitest en modo watch
npm run test:coverage   # Vitest con cobertura (v8) — umbral 80% en src/lib/
npm run test:e2e        # Playwright — tests/e2e/**/*.spec.ts (requiere build + preview)
npx astro check         # TypeScript strict + diagnósticos de Astro
npm run lint             # ESLint + Prettier --check
npm run lint:fix         # Autofix
npm run build            # Build de producción (astro build)
```

Quality gate completo antes de cada commit (regla crítica 7):

```bash
npm run lint && npx astro check && npm test && npm run build
```

## Estructura

```
tests/
├── unit/     # Vitest — funciones puras de src/lib/ (sin DOM, sin red)
└── e2e/      # Playwright — flujos de usuario contra el sitio construido
```

## Convenciones de tests unitarios

- Un archivo de test por módulo de `src/lib/` (`tokens.test.ts` ↔ `tokens.ts`).
- Cobertura mínima 80% (statements/branches/functions/lines) en `src/lib/**/*.ts` — configurado en `vitest.config.ts`. Los componentes `.astro` no se testean por cobertura de línea; su comportamiento se cubre con E2E.
- Para lógica con reglas de negocio verificables matemáticamente (p. ej. `contrastRatio`, cálculo WCAG), testear casos borde explícitos (idénticos, simétricos, formato inválido) además del caso feliz — ver `tests/unit/tokens.test.ts`.

## Convenciones de tests E2E (Playwright)

- Un archivo por flujo/página relevante (`home.spec.ts`).
- Priorizar accesibilidad real en las aserciones: roles ARIA (`getByRole`), foco de teclado (`toBeFocused()`), ausencia de errores de consola — no solo presencia de texto.
- `playwright.config.ts` sirve el sitio ya construido (`npm run preview`) contra `http://localhost:4321` — los E2E validan el artefacto de producción, no el dev server.

### Nota de entorno (sandbox de desarrollo agentic)

Si la versión de `@playwright/test` instalada espera una revisión de Chromium distinta a la preinstalada en el contenedor, exportar `PLAYWRIGHT_EXECUTABLE_PATH` apuntando al binario disponible (p. ej. `/opt/pw-browsers/chromium`) solo para esa ejecución local — `playwright.config.ts` lo respeta si está definido y usa la resolución normal de Playwright si no. **No** ejecutar `playwright install` en ese sandbox (ver `/root/.ccr/README.md` del entorno). En GitHub Actions (`ci.yml`) el job `e2e` sí instala navegadores normalmente (`npx playwright install --with-deps chromium`), porque ahí no hay caché preexistente.

## Umbrales y CI

El job `test` (Vitest) y `e2e` (Playwright) de `.github/workflows/ci.yml` corren en cada push/PR a `main`. El job `build` depende de `lint`, `typecheck` y `test`; `e2e` depende de `build`.

---

**Actualizado**: 2026-07-24 (Sprint S01 — Fase F0)
