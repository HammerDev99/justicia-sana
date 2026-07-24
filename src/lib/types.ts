// ══════════════════════════════════════════════════════════════
// Strapi v5 Generic Types
// ══════════════════════════════════════════════════════════════

export interface StrapiMedia {
  readonly id: number;
  readonly url: string;
  readonly alternativeText: string | null;
  readonly width: number | null;
  readonly height: number | null;
}

export interface StrapiPagination {
  readonly page: number;
  readonly pageSize: number;
  readonly pageCount: number;
  readonly total: number;
}

export interface StrapiMeta {
  readonly pagination?: StrapiPagination;
}

export interface StrapiCollectionResponse<T> {
  readonly data: readonly T[];
  readonly meta: StrapiMeta;
}

export interface StrapiSingleResponse<T> {
  readonly data: T | null;
  readonly meta: StrapiMeta;
}

interface StrapiBaseEntity {
  readonly id: number;
  readonly documentId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedAt: string | null;
}

// ══════════════════════════════════════════════════════════════
// Content types del portal (ver docs/content-types/
// strapi-justicia-sana-content-types.md — contrato exacto)
// ══════════════════════════════════════════════════════════════

export type TipoNorma = 'Ley' | 'Resolución' | 'Decreto' | 'Circular' | 'Otro';
export type EstadoVigencia = 'Vigente' | 'Derogada' | 'Modificada';

export interface Norma extends StrapiBaseEntity {
  readonly titulo: string;
  readonly slug: string;
  readonly tipo_norma: TipoNorma;
  readonly numero: string;
  readonly anio: number;
  readonly resumen_lenguaje_claro: string;
  readonly texto_completo_url: string | null;
  readonly archivo_pdf: StrapiMedia | null;
  readonly estado_vigencia: EstadoVigencia;
  readonly fecha_expedicion: string | null;
  readonly orden_visualizacion: number;
}

export type CategoriaArticulo = 'Noticia' | 'Jurisprudencia' | 'Campaña';

export interface Articulo extends StrapiBaseEntity {
  readonly titulo: string;
  readonly slug: string;
  readonly categoria: CategoriaArticulo;
  readonly resumen: string;
  readonly cuerpo: string;
  readonly imagen_destacada: StrapiMedia | null;
  readonly fecha_publicacion: string;
  readonly autor: string | null;
}

export type TipoRecursoPedagogico = 'Infografía' | 'Folleto' | 'Video' | 'Guía';
export type TemaRecursoPedagogico =
  | 'Qué es acoso laboral'
  | 'Modalidades de acoso'
  | 'Cómo actuar (víctima)'
  | 'Cómo actuar (testigo)'
  | 'Otro';

export interface RecursoPedagogico extends StrapiBaseEntity {
  readonly titulo: string;
  readonly slug: string;
  readonly tipo_recurso: TipoRecursoPedagogico;
  readonly tema: TemaRecursoPedagogico;
  readonly descripcion: string;
  readonly archivo: StrapiMedia | null;
  readonly url_video: string | null;
  readonly orden_visualizacion: number;
}

export type RolComite =
  | 'Presidente/a'
  | 'Secretario/a'
  | 'Representante del empleador'
  | 'Representante de los empleados';

export interface IntegranteComite extends StrapiBaseEntity {
  readonly nombre: string;
  readonly rol: RolComite;
  readonly foto: StrapiMedia | null;
  readonly biografia_breve: string | null;
  readonly orden_visualizacion: number;
}

export type ModalidadCapacitacion = 'Presencial' | 'Virtual';

export interface Capacitacion extends StrapiBaseEntity {
  readonly titulo: string;
  readonly descripcion: string;
  readonly fecha: string;
  readonly modalidad: ModalidadCapacitacion;
  readonly enlace_inscripcion: string | null;
  readonly cupo_maximo: number | null;
}

export interface Comunicado extends StrapiBaseEntity {
  readonly titulo: string;
  readonly cuerpo: string;
  readonly fecha: string;
  readonly archivo_adjunto: StrapiMedia | null;
}

export type TipoCanalAyuda =
  'Atención psicológica' | 'Contacto del Comité' | 'Soporte técnico' | 'Otro';

export interface CanalAyuda extends StrapiBaseEntity {
  readonly nombre: string;
  readonly tipo_canal: TipoCanalAyuda;
  readonly telefono: string | null;
  readonly correo: string | null;
  readonly horario: string | null;
  readonly descripcion: string | null;
  readonly orden_visualizacion: number;
}

export interface QuienesSomos extends StrapiBaseEntity {
  readonly mision: string;
  readonly funciones: string;
  readonly reglamento_pdf: StrapiMedia | null;
}

export interface Home extends StrapiBaseEntity {
  readonly titulo_hero: string;
  readonly subtitulo_hero: string | null;
  readonly texto_bienvenida: string | null;
}
