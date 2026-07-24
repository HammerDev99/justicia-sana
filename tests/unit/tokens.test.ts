import { describe, it, expect } from 'vitest';
import { contrastRatio, brand, meetsAA } from '../../src/lib/tokens';

describe('contrastRatio', () => {
  it('devuelve 21 para negro sobre blanco (contraste máximo)', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });

  it('devuelve 1 para dos colores idénticos', () => {
    expect(contrastRatio('#123456', '#123456')).toBeCloseTo(1, 5);
  });

  it('es simétrico respecto al orden de los argumentos', () => {
    const a = contrastRatio('#1b3a5b', '#ffffff');
    const b = contrastRatio('#ffffff', '#1b3a5b');
    expect(a).toBeCloseTo(b, 5);
  });

  it('lanza error ante un color hex inválido', () => {
    expect(() => contrastRatio('#zzz', '#ffffff')).toThrow();
  });
});

describe('meetsAA', () => {
  it('aprueba un par con contraste >= 4.5 (texto normal)', () => {
    expect(meetsAA(contrastRatio(brand.ink, brand.surface))).toBe(true);
  });

  it('rechaza un par con contraste < 4.5', () => {
    expect(meetsAA(3.2)).toBe(false);
  });
});

describe('tokens de marca institucional (WCAG AA)', () => {
  it('el texto principal sobre la superficie cumple AA (>= 4.5)', () => {
    expect(contrastRatio(brand.ink, brand.surface)).toBeGreaterThanOrEqual(4.5);
  });

  it('el texto sobre el color primario cumple AA (>= 4.5)', () => {
    expect(contrastRatio(brand.onPrimary, brand.primary)).toBeGreaterThanOrEqual(4.5);
  });

  it('expone la paleta de marca como valores hex válidos', () => {
    for (const value of Object.values(brand)) {
      expect(value).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });
});
