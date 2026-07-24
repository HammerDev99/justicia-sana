# Antipatrones y Decisiones Técnicas — Justicia Sana

> Nivel 2 de divulgación progresiva. Decisiones de fondo en `docs/plannings/P00_ANALISIS_REQUISITOS.md`.

## Antipatrones a evitar

| Antipatrón                                                        | Por qué se evita aquí                                                                  | Alternativa                                                                           |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| JS de cliente por defecto en componentes Astro                    | Viola la regla "zero JS por defecto"; degrada Lighthouse y accesibilidad sin necesidad | Renderizar en build-time; reservar `client:*` para F5 (islands reales)                |
| `any` para respuestas de Strapi/SIRAL                             | Pierde el único punto de verificación real ante contratos de API externos que cambian  | Interfaces `readonly` explícitas en `src/lib/`                                        |
| Colores hardcodeados fuera de `@theme`                            | Imposibilita re-auditar contraste WCAG de forma centralizada                           | Tokens en `src/lib/tokens.ts` + `global.css`, validados con `contrastRatio`/`meetsAA` |
| Build que falla si Strapi/SIRAL están caídos                      | El portal es informativo; un servicio externo caído no debe tumbar el despliegue       | Manejo explícito de fallo con datos de respaldo/vacíos (F1/F4)                        |
| Mezclar datos confidenciales de SIRAL en este repo/sitio          | Regla crítica 3 — el portal público no debe exponer ni cachear nada de casos reales    | Toda integración con SIRAL pasa por endpoints públicos ya anonimizados                |
| SSO/JudIT o cualquier integración institucional externa en el MVP | Decisión Q6 explícita: MVP con lo que ya se tiene, sin dependencias externas nuevas    | Diferido — ver P00 § Hallazgos Diferidos (D-01, D-04)                                 |

## Decisiones técnicas registradas

### Pin de `vite` vía `overrides` (package.json)

**Problema real detectado en F0**: `@tailwindcss/vite@4.3.3` acepta `vite ^8`, mientras Astro 6.4.8 depende internamente de `vite ^7.3.2`. npm hoisteaba dos copias distintas de Vite en el árbol (7.x anidado en Astro, 8.x en la raíz para Tailwind/Vitest), y sus tipos `Plugin`/`PluginOption` no son estructuralmente compatibles → `astro check` fallaba con un error de tipos ajeno a nuestro código.

**Decisión**: fijar una única versión de Vite en todo el árbol con `"overrides": { "vite": "7.3.6" }`, alineada a la que Astro exige internamente. Revisar este pin cuando se actualice Astro a una versión mayor.

### CVEs conocidos en `astro@6.4.8` (hallazgo diferido)

`npm audit` reporta 3 vulnerabilidades altas/bajas en Astro (XSS vía View Transitions y atributos `transition:*` en islands hidratadas) cuyo fix automático (`npm audit fix --force`) implica saltar a Astro 7 — un cambio mayor no planificado, fuera del alcance de F0 y de la decisión de stack "Astro 6+" de P01.

**Decisión**: no forzar el upgrade ahora. Riesgo real actual bajo (zero JS, sin islands ni hidratación hasta F5). Queda como hallazgo diferido para la auditoría de gate F0 y debe revisarse antes de implementar F5 (cuando sí habrá islands hidratadas, el vector de estos CVEs).

### Verificación de Docker no ejecutable en el sandbox de desarrollo

El `Dockerfile`/`nginx.conf` de F0-05 se revisaron manualmente (siguiendo el patrón probado de `blog-sprintjudicial`) pero **no se pudo ejecutar `docker build`** en el entorno de desarrollo agentic (daemon Docker sin privilegios de contenedor anidado). Verificación real pendiente en el primer build de EasyPanel (F0-06) o en un entorno con Docker completo.

---

**Actualizado**: 2026-07-24 (Sprint S01 — Fase F0)
