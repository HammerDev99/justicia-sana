import { describe, it, expect } from 'vitest';
import { site, navLinks, avisoPrototipo } from '../../src/lib/site';

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

  it('no enlaza una página para radicar quejas', () => {
    expect(navLinks.some((link) => link.href === '/radicar-una-queja')).toBe(false);
  });

  it('declara que el sitio es un prototipo y no un canal oficial', () => {
    expect(avisoPrototipo).toMatch(/prototipo/i);
    expect(avisoPrototipo).toMatch(/no es un canal oficial/i);
    expect(site.description).toMatch(/prototipo/i);
  });
});
