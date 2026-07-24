# Convenciones de Código — Justicia Sana

> Nivel 2 de divulgación progresiva. Reglas críticas resumidas en `CLAUDE.md`.

## Idioma

- Comunicación, commits y documentación: **español**.
- Identificadores de código (variables, funciones, tipos, archivos): **inglés**.

## TypeScript

- `strict` heredado de `astro/tsconfigs/strict` (`tsconfig.json`) — no relajar.
- Prohibido `any` explícito. Si el tipo de una respuesta externa (Strapi, SIRAL) es desconocido en el momento, modelarlo con una interfaz propia, no con `any` ni `unknown` sin acotar.
- Interfaces de datos externos: siempre `readonly` en sus campos; arrays de solo lectura donde aplique (`readonly T[]`).
- Constantes y configuración: `as const` (ver `src/lib/site.ts`, `src/lib/tokens.ts`).
- Funciones puras en `src/lib/`: sin efectos secundarios ocultos, para que sean testeables con Vitest sin mocks pesados.

## Componentes Astro

- HTML-first: un componente `.astro` sin `<script>` de cliente es el caso por defecto.
- Islands (`client:*`) solo cuando hay interactividad real que no puede resolverse en build-time (F5: encuestas, PQRS, buzón). Justificar la directiva usada (`client:load` vs `client:visible`, etc.) en el SPEC correspondiente.
- Props tipadas con `interface Props` exportada, sin `any`.
- Slots nombrados cuando un layout tiene más de una zona de contenido.

## Estilos (Tailwind CSS 4)

- Tokens de marca en `@theme` (`src/styles/global.css`), nunca colores hardcodeados en componentes.
- Mobile-first: las clases base son para mobile; breakpoints (`sm:`, `md:`, `lg:`) añaden/sobrescriben para pantallas mayores.
- Todo color de texto/fondo institucional debe tener su contraste validado (`src/lib/tokens.ts::contrastRatio` + `meetsAA`) antes de usarse — ver `tests/unit/tokens.test.ts` como ejemplo.

## Accesibilidad (WCAG AA — regla crítica 4)

- HTML semántico: `<nav aria-label>`, `<main id="contenido">`, jerarquía de encabezados sin saltos.
- Todo elemento interactivo debe ser alcanzable y operable por teclado (`:focus-visible` con anillo visible, definido globalmente en `global.css`).
- Enlace "saltar al contenido" como primer elemento enfocable de cada página (`BaseLayout.astro`).
- Contraste de texto normal ≥ 4.5:1 (AA) — verificado programáticamente, no a ojo.

## Naming

- Archivos de componentes Astro: `PascalCase.astro` (`BaseLayout.astro`).
- Módulos de `src/lib/`: `camelCase.ts` (`site.ts`, `tokens.ts`).
- Tests: `<módulo>.test.ts` (unit, junto a `tests/unit/`) / `<flujo>.spec.ts` (E2E, `tests/e2e/`).
- Rutas de Astro (`src/pages/`): kebab-case en español cuando es contenido público (`/quienes-somos`, `/canales-de-ayuda`), reflejando la URL real.

## Commits

Formato: `tipo(alcance): descripcion | SPEC: JS-XX`

| Tipo       | Uso                                                  |
| ---------- | ---------------------------------------------------- |
| `feat`     | Nueva funcionalidad o página                         |
| `fix`      | Corrección de defecto                                |
| `docs`     | Documentación (planning, sprint, agent_docs)         |
| `test`     | Tests sin cambio de comportamiento                   |
| `chore`    | Configuración, dependencias, CI                      |
| `refactor` | Cambio interno sin alterar comportamiento observable |

Sin firma de IA en el mensaje de commit (regla crítica del proyecto).

---

**Actualizado**: 2026-07-24 (Sprint S01 — Fase F0)
