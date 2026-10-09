/**
 * Configuración global del sitio — Justicia Sana.
 * Prototipo de portal informativo sobre convivencia laboral, propuesto para la Seccional Magdalena.
 */

export const site = {
  name: 'Justicia Sana — Comité de Convivencia Laboral',
  shortName: 'Justicia Sana',
  description:
    'Prototipo en evaluación de un portal informativo sobre convivencia laboral y prevención del acoso laboral en la Rama Judicial de Colombia, propuesto para la Seccional Magdalena. No es un canal oficial.',
  url: 'https://justiciasana.sprintjudicial.com',
  lang: 'es',
} as const;

/** Aviso visible en todas las páginas mientras no exista una autorización institucional formal. */
export const avisoPrototipo =
  'Prototipo en evaluación. Este sitio no es un canal oficial de la Rama Judicial ni del Comité de Convivencia Laboral, y no recibe quejas. Para presentar una queja, acude a los canales oficiales de la Rama Judicial.';

export interface NavLink {
  readonly label: string;
  readonly href: string;
}

export const navLinks: readonly NavLink[] = [
  { label: 'Inicio', href: '/' },
  { label: '¿Quiénes somos?', href: '/quienes-somos' },
  { label: 'Normativa', href: '/normativa' },
  { label: 'Material pedagógico', href: '/material-pedagogico' },
  { label: 'Noticias', href: '/noticias' },
  { label: 'Capacitaciones y comunicados', href: '/capacitaciones-y-comunicados' },
  { label: 'Canales de ayuda', href: '/canales-de-ayuda' },
] as const;
