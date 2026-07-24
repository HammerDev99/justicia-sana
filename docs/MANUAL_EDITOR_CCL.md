# Manual del Editor — Portal Justicia Sana (Strapi)

> Guía para miembros del Comité de Convivencia Laboral (CCL) con rol "Editor CCL" en Strapi. Publicar contenido aquí actualiza automáticamente el sitio público — sin necesidad de tocar código ni pedir ayuda a un desarrollador.
>
> **Estado de este manual**: borrador estructural. Las capturas de pantalla reales se agregan cuando exista una instancia de Strapi con contenido de prueba (tras `docs/DEPLOYMENT_STRAPI.md`) — no se fabrican imágenes de una interfaz que todavía no existe.

> **Qué gestionas tú y qué no**: como Editor CCL creas, editas y publicas **entradas de contenido** (una norma, un artículo, un recurso, etc.) desde el **Content Manager** — eso es todo lo que necesitas para mantener el portal al día, sin tocar código. Lo que **no** verás es el "Content-Type Builder" (la herramienta para crear los _tipos_ de contenido): esa estructura la define una sola vez el equipo técnico en producción. Si necesitas un campo nuevo o un tipo de contenido que no existe, pídelo al equipo técnico; el día a día de publicar es 100 % tuyo.

## 1. Acceder a Strapi

1. Entrar a la URL del Strapi Admin (te la comparte el equipo técnico, ej. `https://cms.sprintjudicial.com/admin`).
2. Iniciar sesión con tu usuario y contraseña.
3. Verás un menú lateral con **Content Manager** — ahí está todo lo que puedes editar.

## 2. Qué puedes publicar

| Voy a publicar...                                  | Uso el content type...    |
| -------------------------------------------------- | ------------------------- |
| Una ley, resolución o circular con su resumen      | **Norma**                 |
| Una noticia, novedad jurisprudencial o campaña     | **Artículo**              |
| Una infografía, folleto o video educativo          | **Recurso Pedagógico**    |
| Datos de un integrante del Comité                  | **Integrante del Comité** |
| Un taller o capacitación programada                | **Capacitación**          |
| Un boletín o comunicado interno                    | **Comunicado**            |
| Un canal de ayuda (psicológico, contacto, soporte) | **Canal de Ayuda**        |
| El texto de "¿Quiénes somos?" (misión, funciones)  | **Quiénes Somos** (único) |
| El texto principal de la página de inicio          | **Home** (único)          |

## 3. Crear y publicar una entrada (flujo general)

1. En el menú lateral, elige el content type (ej. "Artículo").
2. Clic en **Create new entry**.
3. Llena los campos obligatorios (marcados con \*). No dejes vacíos los campos de resumen/descripción — son los que se muestran en las tarjetas de listado del sitio.
4. Si el content type tiene imagen, súbela desde el selector de medios (formatos permitidos: JPG, PNG, WebP; usa imágenes livianas, menores a 1 MB si es posible, para que el sitio cargue rápido).
5. Clic en **Save** (guarda como borrador — todavía no es visible en el sitio público).
6. Revisa la vista previa si está disponible.
7. Clic en **Publish** — a partir de aquí, el sitio se reconstruye solo (puede tardar 1–3 minutos) y tu contenido aparece publicado.

## 4. Editar o despublicar algo ya publicado

1. Busca la entrada en el listado del content type.
2. Ábrela, haz los cambios y **Save**.
3. Si quieres que los cambios se vean en el sitio, vuelve a dar **Publish** (guardar sin publicar no actualiza el sitio en vivo).
4. Para retirar algo del sitio sin borrarlo, usa **Unpublish** — el sitio se reconstruye y el contenido deja de mostrarse, pero queda guardado en Strapi por si lo necesitas después.

## 5. Buenas prácticas

- **Lenguaje claro**: el portal es para cualquier ciudadano o funcionario, no solo para abogados. Evita tecnicismos legales sin explicación (ver ejemplos ya redactados en `Norma` como referencia de tono).
- **Imágenes con alt text**: cuando el campo lo permita, describe la imagen (ej. "Foto del equipo del Comité de Convivencia Laboral") — esto es obligatorio por accesibilidad (WCAG AA, regla crítica 4 del proyecto).
- **No subas documentos con datos personales de denunciantes/denunciados**: este portal es público e informativo; los casos confidenciales se gestionan en el sistema interno SIRAL, nunca aquí.
- **Fechas correctas**: los artículos y capacitaciones se ordenan por fecha en el sitio — una fecha mal puesta puede hacer que algo aparezca fuera de orden.
- **Orden de visualización**: algunos content types (Norma, Recurso Pedagógico, Integrante del Comité, Canal de Ayuda) tienen un campo "orden_visualizacion" — úsalo si quieres controlar en qué posición aparece cada entrada en su listado (menor número = aparece primero).

## 6. ¿Algo no funciona?

Si el sitio no se actualiza después de publicar (espera al menos 3 minutos primero), o si algo en Strapi no se ve como esperabas, contacta al equipo técnico del proyecto — no hay integración de soporte automatizada en este MVP (decisión Q6: sin integraciones externas por ahora).

---

**Pendiente**: capturas de pantalla reales de cada paso, a agregar cuando exista una instancia de Strapi operativa (F1-01 completado).
**Actualizado**: 2026-07-24
