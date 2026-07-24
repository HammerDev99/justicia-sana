import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchEstadisticasPublicas } from '../../src/lib/siral';

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

const ESTADISTICAS_EJEMPLO = {
  total_quejas: 3,
  por_estado: [{ categoria: 'RECIBIDA', cantidad: 3 }],
  por_tipo_conducta: [{ categoria: 'MALTRATO_LABORAL', cantidad: 3 }],
  por_trimestre: [{ categoria: '2026-T1', cantidad: 3 }],
  tiempo_promedio_resolucion_dias: 7.5,
  por_seccional: [
    {
      seccional_id: 1,
      seccional_nombre: 'Magdalena',
      total_quejas: 3,
      por_estado: [{ categoria: 'RECIBIDA', cantidad: 3 }],
      por_tipo_conducta: [{ categoria: 'MALTRATO_LABORAL', cantidad: 3 }],
      tiempo_promedio_resolucion_dias: 7.5,
    },
  ],
};

describe('fetchEstadisticasPublicas (F4-02)', () => {
  it('devuelve las estadísticas en éxito', async () => {
    vi.stubGlobal('fetch', mockFetchResponse(ESTADISTICAS_EJEMPLO));

    const result = await fetchEstadisticasPublicas();
    expect(result).toEqual(ESTADISTICAS_EJEMPLO);
  });

  it('llama al endpoint público sin token de autenticación', async () => {
    const mockFetch = mockFetchResponse(ESTADISTICAS_EJEMPLO);
    vi.stubGlobal('fetch', mockFetch);

    await fetchEstadisticasPublicas();

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('/api/v1/estadisticas/publicas');
    const calledOptions = mockFetch.mock.calls[0][1];
    expect(calledOptions).toBeUndefined();
  });

  it('degrada a null ante un error HTTP (nunca lanza) — build no se rompe', async () => {
    vi.stubGlobal('fetch', mockFetchResponse({}, false, 503));

    await expect(fetchEstadisticasPublicas()).resolves.toBeNull();
  });

  it('degrada a null si la red falla (nunca lanza)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('SIRAL API inalcanzable')));

    await expect(fetchEstadisticasPublicas()).resolves.toBeNull();
  });

  it('degrada a null ante un JSON inválido en la respuesta', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error('invalid json')),
      }),
    );

    await expect(fetchEstadisticasPublicas()).resolves.toBeNull();
  });
});
