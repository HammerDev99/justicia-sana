import { describe, it, expect } from 'vitest';
import { site, navLinks } from '../../src/lib/site';

describe('configuración del sitio', () => {
  it('define la URL de producción del piloto', () => {
    expect(site.url).toBe('https://justiciasana.sprintjudicial.com');
  });

  it('define nombre e idioma institucionales', () => {
    expect(site.name).toContain('Justicia Sana');
    expect(site.lang).toBe('es');
  });

  it('expone enlaces de navegación con href absolutos internos', () => {
    expect(navLinks.length).toBeGreaterThan(0);
    for (const link of navLinks) {
      expect(link.href.startsWith('/')).toBe(true);
      expect(link.label.length).toBeGreaterThan(0);
    }
  });
});
