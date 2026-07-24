import { test, expect } from '@playwright/test';

const paginasNuevas = [
  '/material-pedagogico',
  '/noticias',
  '/capacitaciones-y-comunicados',
  '/radicar-una-queja',
] as const;

test.describe('F3 — páginas nuevas con degradación agraciada (Strapi inalcanzable)', () => {
  test('las 4 páginas nuevas responden 200 con header y footer', async ({ page }) => {
    for (const path of paginasNuevas) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} debería responder 200`).toBe(200);
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.getByRole('contentinfo')).toBeVisible();
    }
  });

  test('las 4 páginas nuevas están enlazadas desde la navegación principal', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: /principal/i });
    const hrefs = await nav
      .getByRole('link')
      .evaluateAll((links) => links.map((l) => (l as HTMLAnchorElement).getAttribute('href')));

    for (const path of paginasNuevas) {
      expect(hrefs, `${path} debería estar en navLinks`).toContain(path);
    }
  });

  test('material-pedagogico, noticias y capacitaciones-y-comunicados muestran el placeholder de contenido en preparación cuando Strapi no tiene datos', async ({
    page,
  }) => {
    for (const path of ['/material-pedagogico', '/noticias', '/capacitaciones-y-comunicados']) {
      await page.goto(path);
      await expect(page.getByText('Sección en preparación')).toBeVisible();
    }
  });

  test('cero errores de consola en las páginas nuevas', async ({ page }) => {
    for (const path of paginasNuevas) {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      await page.goto(path);
      expect(errors).toEqual([]);
    }
  });
});

test.describe('/quienes-somos — fallback estático cuando Strapi no tiene datos', () => {
  test('sigue mostrando el contenido estático auditado (Objetivo) en vez de una sección vacía', async ({
    page,
  }) => {
    await page.goto('/quienes-somos');
    await expect(page.getByRole('heading', { name: 'Objetivo' })).toBeVisible();
    await expect(page.getByText(/nómina de integrantes/i)).toBeVisible();
  });
});

test.describe('/radicar-una-queja — sin fabricar el plazo de la Resolución 3461/2025', () => {
  /**
   * Existe una discrepancia sin resolver entre "≤65 días" (CLAUDE.md de
   * justicia-sana) y "6 meses" (CLAUDE.md de SIRAL_System) para el plazo de
   * la Resolución 3461/2025 (hallazgo F2-J, AUDIT_03) — no se resuelve por
   * inferencia. Esta página no debe citar ninguna cifra de plazo mientras
   * el propietario no confirme el texto oficial de la norma.
   */
  test('no cita un número de días ni de meses como plazo', async ({ page }) => {
    await page.goto('/radicar-una-queja');
    const texto = await page.getByRole('main').innerText();

    expect(texto).not.toMatch(/\d+\s*d[ií]as/i);
    expect(texto).not.toMatch(/\d+\s*meses/i);
  });

  test('aclara que las quejas no son anónimas y menciona SIRAL', async ({ page }) => {
    await page.goto('/radicar-una-queja');
    const main = page.getByRole('main');
    await expect(main).toContainText('SIRAL');
    await expect(main).toContainText(/no son anónimas/i);
  });
});

test.describe('/noticias/[slug] — 0 artículos hoy, 0 páginas de detalle generadas', () => {
  test('la ruta dinámica no genera una página rota', async ({ request }) => {
    const response = await request.get('/noticias/articulo-inexistente');
    expect(response.status()).toBe(404);
  });
});
