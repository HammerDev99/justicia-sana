# Strapi Integration — Justicia Sana

## API Base

- **URL**: definida por `STRAPI_URL` (ver `.env.example`; sugerido `https://cms.sprintjudicial.com` — a confirmar en F1-01, ver nota de convivencia con rugby-bello-site en `docs/DEPLOYMENT_STRAPI.md`)
- **Version**: Strapi v5
- **Auth**: Bearer token (read-only, generado en F1-03)
- **Format**: REST JSON

## Configuración

```env
# .env (NO commitear — ver .gitignore)
STRAPI_URL=https://cms.sprintjudicial.com
STRAPI_TOKEN=tu_token_read_only
```

Acceso en Astro (solo server-side, regla crítica 5 de `CLAUDE.md` — nunca al cliente):

```typescript
const STRAPI_URL = import.meta.env.STRAPI_URL;
const STRAPI_TOKEN = import.meta.env.STRAPI_TOKEN;
```

Verificado con `npm run build` usando un token de prueba: el valor no aparece en ningún archivo bajo `dist/` (SPEC-S02-F1-4).

## Formato de respuesta Strapi v5

### Collection Type

```json
{
  "data": [
    {
      "id": 1,
      "documentId": "abc123",
      "titulo": "Ley 1010 de 2006",
      "slug": "ley-1010-de-2006",
      "createdAt": "2026-07-24T...",
      "updatedAt": "2026-07-24T...",
      "publishedAt": "2026-07-24T..."
    }
  ],
  "meta": {
    "pagination": { "page": 1, "pageSize": 25, "pageCount": 1, "total": 5 }
  }
}
```

### Single Type

```json
{
  "data": {
    "id": 1,
    "documentId": "xyz789",
    "titulo_hero": "Justicia Sana",
    ...
  },
  "meta": {}
}
```

## Parámetros de Query

| Param        | Uso                      | Ejemplo                                       |
| ------------ | ------------------------ | --------------------------------------------- |
| `populate`   | Incluir relaciones/media | `?populate=*`                                 |
| `filters`    | Filtrar resultados       | `?filters[slug][$eq]=ley-1010-de-2006`        |
| `sort`       | Ordenar                  | `?sort=fecha_publicacion:desc`                |
| `pagination` | Paginar                  | `?pagination[page]=1&pagination[pageSize]=10` |
| `fields`     | Seleccionar campos       | `?fields[0]=titulo&fields[1]=slug`            |

## Cliente tipado (`src/lib/strapi.ts`)

3 funciones genéricas (patrón heredado literalmente de `rugby-bello-site/src/lib/strapi.ts`, la única otra integración Strapi de la organización):

- `fetchCollection<T>(endpoint, params?)` → `readonly T[]`
- `fetchSingle<T>(endpoint, params?)` → `T | null`
- `fetchBySlug<T>(endpoint, slug, params?)` → `T | null`

Y 11 funciones de dominio tipadas sobre los 9 content types (ver `docs/content-types/strapi-justicia-sana-content-types.md` para el contrato exacto de cada una): `fetchNormas`/`fetchNormaBySlug`, `fetchArticulos`/`fetchArticuloBySlug`, `fetchRecursosPedagogicos`, `fetchIntegrantesComite`, `fetchCapacitaciones`, `fetchComunicados`, `fetchCanalesAyuda`, `fetchQuienesSomos`, `fetchHome`.

## Degradación agraciada (regla obligatoria de este proyecto)

A diferencia de un requisito "nice to have", en `P01_PLAN_ESTRATEGICO.md` está como criterio de aceptación explícito: **"el build no se rompe si Strapi está caído"**. Por eso ninguna función del cliente lanza excepciones — todas atrapan error de red, HTTP no-ok y JSON inválido, devolviendo `[]`/`null` y registrando un `console.warn`:

```typescript
export async function fetchCollection<T>(
  endpoint: string,
  params?: FetchParams,
): Promise<readonly T[]> {
  const url = `${STRAPI_URL}/api/${endpoint}${buildQueryString(params)}`;
  try {
    const response = await fetch(url, { headers: buildHeaders() });
    if (!response.ok) {
      console.warn(`[strapi] ${endpoint} respondió ${response.status}`);
      return [];
    }
    const json = (await response.json()) as StrapiCollectionResponse<T>;
    return json.data ?? [];
  } catch (error) {
    console.warn(`[strapi] Falló el fetch de ${endpoint}:`, error);
    return [];
  }
}
```

Cubierto por 22 tests en `tests/unit/strapi.test.ts`: éxito, error HTTP, fallo de red, `data: null`, JSON inválido, y que cada función de dominio apunte al endpoint correcto.

## Imágenes

Aún no implementado (ningún componente de UI consume `StrapiMedia` todavía — eso es F2/F3). Cuando se implemente, seguir el mismo patrón de rugby-bello: si la URL de Strapi es relativa, prefijarla con `STRAPI_URL`; si ya es absoluta (CDN externo), usarla tal cual; fallback a un placeholder si es `null`.

## Content Types Reference

Ver definiciones completas en: `docs/content-types/strapi-justicia-sana-content-types.md`

## Estado

Cliente implementado y probado (F1-04, SPEC-S02-F1-4). La instancia real de Strapi (F1-01), sus content types creados en el Admin (F1-02 ejecución), roles (F1-03) y webhook (F1-05) siguen pendientes de acción humana en el VPS — ver `docs/DEPLOYMENT_STRAPI.md`. Hasta entonces, todo `fetch` real devolverá `[]`/`null` de forma segura (comportamiento verificado por diseño, no un bug).
