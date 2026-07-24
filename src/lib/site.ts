/**
 * Configuración global del sitio — Justicia Sana.
 * Portal del Comité de Convivencia Laboral, piloto Seccional Magdalena.
 */

export const site = {
  name: 'Justicia Sana — Comité de Convivencia Laboral',
  shortName: 'Justicia Sana',
  description:
    'Portal público del Comité de Convivencia Laboral de la Rama Judicial de Colombia — piloto Seccional Magdalena. Pedagogía, transparencia y prevención del acoso laboral.',
  url: 'https://justiciasana.sprintjudicial.com',
  lang: 'es',
} as const;

export interface NavLink {
  readonly label: string;
  readonly href: string;
}

export const navLinks: readonly NavLink[] = [
  { label: 'Inicio', href: '/' },
  { label: '¿Quiénes somos?', href: '/quienes-somos' },
  { label: 'Normativa', href: '/normativa' },
  { label: 'Canales de ayuda', href: '/canales-de-ayuda' },
] as const;
