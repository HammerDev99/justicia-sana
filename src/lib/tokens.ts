/**
 * Design tokens institucionales — Justicia Sana.
 *
 * Paleta alineada con la identidad de la Rama Judicial (azules institucionales)
 * validada para cumplir WCAG AA (contraste >= 4.5:1 en texto normal).
 */

/** Paleta de marca. Todos los pares (ink/surface, onPrimary/primary) cumplen AA — ver tests. */
export const brand = {
  primary: '#1b3a5b',
  onPrimary: '#ffffff',
  ink: '#1a1a1a',
  surface: '#ffffff',
  surfaceAlt: '#f4f6f8',
  accent: '#0f6b4c',
  onAccent: '#ffffff',
  danger: '#8a1f1f',
} as const;

export type BrandToken = keyof typeof brand;

/** Umbral WCAG AA para texto normal (<18pt regular / <14pt bold). */
const AA_NORMAL_TEXT_THRESHOLD = 4.5;

/**
 * Convierte un color hex (#rrggbb) a componentes RGB normalizados [0,1].
 * Lanza error si el formato no es un hex de 6 dígitos válido.
 */
function hexToRgb(hex: string): readonly [number, number, number] {
  const match = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (!match) {
    throw new Error(`Color hex inválido: "${hex}". Se espera formato #rrggbb.`);
  }
  const value = match[1];
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  return [r, g, b] as const;
}

/** Aplica la corrección gamma sRGB a un canal normalizado, según la fórmula WCAG 2.x. */
function linearizeChannel(channel: number): number {
  return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}

/** Luminancia relativa de un color hex, según la fórmula WCAG 2.x. */
function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(linearizeChannel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Ratio de contraste WCAG entre dos colores hex (1:1 a 21:1). Simétrico
 * respecto al orden de los argumentos.
 */
export function contrastRatio(colorA: string, colorB: string): number {
  const luminanceA = relativeLuminance(colorA);
  const luminanceB = relativeLuminance(colorB);
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
}

/** True si el ratio cumple WCAG AA para texto normal (>= 4.5:1). */
export function meetsAA(ratio: number): boolean {
  return ratio >= AA_NORMAL_TEXT_THRESHOLD;
}
