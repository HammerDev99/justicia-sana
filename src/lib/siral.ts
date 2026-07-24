// ══════════════════════════════════════════════════════════════
// Cliente tipado del endpoint público de SIRAL (F4-02)
// Contrato: SIRAL_System GET /api/v1/estadisticas/publicas (F4-01/SIRAL-B)
// Sin token — endpoint público, rol PUBLICO, sin JWT.
// ══════════════════════════════════════════════════════════════

const SIRAL_API_URL = import.meta.env.SIRAL_API_URL ?? 'https://api.siral.sprintjudicial.com';

export interface ConteoCategoria {
  readonly categoria: string;
  readonly cantidad: number;
}

export interface EstadisticasSeccional {
  readonly seccional_id: number;
  readonly seccional_nombre: string;
  readonly total_quejas: number;
  readonly por_estado: readonly ConteoCategoria[];
  readonly por_tipo_conducta: readonly ConteoCategoria[];
  readonly tiempo_promedio_resolucion_dias: number | null;
}

export interface EstadisticasPublicas {
  readonly total_quejas: number;
  readonly por_estado: readonly ConteoCategoria[];
  readonly por_tipo_conducta: readonly ConteoCategoria[];
  readonly por_trimestre: readonly ConteoCategoria[];
  readonly tiempo_promedio_resolucion_dias: number | null;
  readonly por_seccional: readonly EstadisticasSeccional[];
}

/**
 * Degradación agraciada obligatoria: nunca lanza. Ante fallo de red, HTTP
 * no-ok o JSON inválido, registra un warning y devuelve `null` — el build
 * del sitio no se rompe si la API de SIRAL está caída o aún sin desplegar
 * (mismo patrón que fetchCollection/fetchSingle de src/lib/strapi.ts).
 */
export async function fetchEstadisticasPublicas(): Promise<EstadisticasPublicas | null> {
  const url = `${SIRAL_API_URL}/api/v1/estadisticas/publicas`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`[siral] estadisticas/publicas respondió ${response.status}`);
      return null;
    }

    return (await response.json()) as EstadisticasPublicas;
  } catch (error) {
    console.warn('[siral] Falló el fetch de estadisticas/publicas:', error);
    return null;
  }
}
