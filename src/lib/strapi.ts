import type {
  StrapiCollectionResponse,
  StrapiSingleResponse,
  StrapiMedia,
  Norma,
  Articulo,
  RecursoPedagogico,
  IntegranteComite,
  Capacitacion,
  Comunicado,
  CanalAyuda,
  QuienesSomos,
  Home,
} from './types';

// ══════════════════════════════════════════════════════════════
// Config (server-side only — nunca llega al cliente, regla crítica 5)
// ══════════════════════════════════════════════════════════════

const STRAPI_URL = import.meta.env.STRAPI_URL ?? 'https://cms.sprintjudicial.com';
const STRAPI_TOKEN = import.meta.env.STRAPI_TOKEN ?? '';

// ══════════════════════════════════════════════════════════════
// Generic fetch helpers
// ══════════════════════════════════════════════════════════════

interface FetchParams {
  readonly populate?: string;
  readonly filters?: Record<string, string>;
  readonly sort?: string;
  readonly pagination?: { page?: number; pageSize?: number };
  readonly fields?: readonly string[];
}

function buildQueryString(params?: FetchParams): string {
  if (!params) return '';

  const parts: string[] = [];

  if (params.populate) {
    parts.push(`populate=${encodeURIComponent(params.populate)}`);
  }

  if (params.filters) {
    for (const [key, value] of Object.entries(params.filters)) {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }

  if (params.sort) {
    parts.push(`sort=${encodeURIComponent(params.sort)}`);
  }

  if (params.pagination) {
    if (params.pagination.page != null) {
      parts.push(`pagination[page]=${params.pagination.page}`);
    }
    if (params.pagination.pageSize != null) {
      parts.push(`pagination[pageSize]=${params.pagination.pageSize}`);
    }
  }

  if (params.fields) {
    params.fields.forEach((field, i) => {
      parts.push(`fields[${i}]=${encodeURIComponent(field)}`);
    });
  }

  return parts.length > 0 ? `?${parts.join('&')}` : '';
}

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }
  return headers;
}

/**
 * Degradación agraciada obligatoria: nunca lanza. Ante fallo de red, HTTP
 * no-ok o JSON inválido, registra un warning y devuelve `[]` — así el build
 * del sitio no se rompe si Strapi está caído (P01, criterio de aceptación).
 */
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

/** Misma degradación agraciada que `fetchCollection`, para single types. */
export async function fetchSingle<T>(endpoint: string, params?: FetchParams): Promise<T | null> {
  const url = `${STRAPI_URL}/api/${endpoint}${buildQueryString(params)}`;

  try {
    const response = await fetch(url, { headers: buildHeaders() });

    if (!response.ok) {
      console.warn(`[strapi] ${endpoint} respondió ${response.status}`);
      return null;
    }

    const json = (await response.json()) as StrapiSingleResponse<T>;
    return json.data ?? null;
  } catch (error) {
    console.warn(`[strapi] Falló el fetch de ${endpoint}:`, error);
    return null;
  }
}

export async function fetchBySlug<T>(
  endpoint: string,
  slug: string,
  params?: FetchParams,
): Promise<T | null> {
  const mergedParams: FetchParams = {
    populate: '*',
    ...params,
    filters: {
      ...params?.filters,
      'filters[slug][$eq]': slug,
    },
  };

  const items = await fetchCollection<T>(endpoint, mergedParams);
  return items[0] ?? null;
}

// ══════════════════════════════════════════════════════════════
// Funciones de dominio tipadas — ver docs/content-types/
// strapi-justicia-sana-content-types.md para el contrato exacto
// ══════════════════════════════════════════════════════════════

export async function fetchNormas(params?: FetchParams): Promise<readonly Norma[]> {
  return fetchCollection<Norma>('normas', {
    populate: '*',
    sort: 'orden_visualizacion:asc',
    ...params,
  });
}

export async function fetchNormaBySlug(slug: string): Promise<Norma | null> {
  return fetchBySlug<Norma>('normas', slug);
}

export async function fetchArticulos(params?: FetchParams): Promise<readonly Articulo[]> {
  return fetchCollection<Articulo>('articulos', {
    populate: '*',
    sort: 'fecha_publicacion:desc',
    ...params,
  });
}

export async function fetchArticuloBySlug(slug: string): Promise<Articulo | null> {
  return fetchBySlug<Articulo>('articulos', slug);
}

export async function fetchRecursosPedagogicos(
  params?: FetchParams,
): Promise<readonly RecursoPedagogico[]> {
  return fetchCollection<RecursoPedagogico>('recursos-pedagogicos', {
    populate: '*',
    sort: 'orden_visualizacion:asc',
    ...params,
  });
}

export async function fetchIntegrantesComite(
  params?: FetchParams,
): Promise<readonly IntegranteComite[]> {
  return fetchCollection<IntegranteComite>('integrantes-comite', {
    populate: '*',
    sort: 'orden_visualizacion:asc',
    ...params,
  });
}

export async function fetchCapacitaciones(params?: FetchParams): Promise<readonly Capacitacion[]> {
  return fetchCollection<Capacitacion>('capacitaciones', {
    populate: '*',
    sort: 'fecha:asc',
    ...params,
  });
}

export async function fetchComunicados(params?: FetchParams): Promise<readonly Comunicado[]> {
  return fetchCollection<Comunicado>('comunicados', {
    populate: '*',
    sort: 'fecha:desc',
    ...params,
  });
}

export async function fetchCanalesAyuda(params?: FetchParams): Promise<readonly CanalAyuda[]> {
  return fetchCollection<CanalAyuda>('canales-ayuda', {
    populate: '*',
    sort: 'orden_visualizacion:asc',
    ...params,
  });
}

export async function fetchQuienesSomos(): Promise<QuienesSomos | null> {
  return fetchSingle<QuienesSomos>('quienes-somos', { populate: '*' });
}

export async function fetchHome(): Promise<Home | null> {
  return fetchSingle<Home>('home', { populate: '*' });
}

/**
 * Convención documentada en agent_docs/strapi_integration.md: el proveedor
 * local de Strapi devuelve URLs relativas ("/uploads/x.pdf"), que hay que
 * prefijar con STRAPI_URL. Un proveedor externo (CDN) ya devuelve absoluta.
 */
export function getStrapiMediaUrl(media: StrapiMedia): string {
  return media.url.startsWith('http') ? media.url : `${STRAPI_URL}${media.url}`;
}

/**
 * Los campos de texto libre en Strapi (url_video, enlace_inscripcion) los
 * escribe un editor humano y aceptan cualquier string. Astro escapa el
 * contenido del atributo `href`, pero no valida su esquema — sin este
 * chequeo, un valor como "javascript:..." se ejecutaría al hacer clic si
 * una cuenta editora de Strapi es comprometida. Solo se permite http(s);
 * cualquier otro esquema se descarta (no se renderiza el enlace).
 */
export function isEnlaceSeguro(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
