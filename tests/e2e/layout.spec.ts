import { test, expect } from '@playwright/test';

test.describe('PageLayout — Header/Footer en todas las páginas', () => {
  test('el header y el footer aparecen en home, quienes-somos, normativa y canales-de-ayuda', async ({
    page,
  }) => {
    for (const path of ['/', '/quienes-somos', '/normativa', '/canales-de-ayuda']) {
      await page.goto(path);
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.getByRole('contentinfo')).toBeVisible();
    }
  });

  test('el enlace de la página actual tiene aria-current="page"', async ({ page }) => {
    await page.goto('/quienes-somos');
    const activeLink = page.getByRole('navigation', { name: /principal/i }).getByRole('link', {
      name: '¿Quiénes somos?',
    });
    await expect(activeLink).toHaveAttribute('aria-current', 'page');
  });

  test('cero errores de consola en las páginas nuevas', async ({ page }) => {
    for (const path of ['/quienes-somos', '/normativa', '/canales-de-ayuda']) {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      await page.goto(path);
      expect(errors).toEqual([]);
    }
  });
});

test.describe('F0-A resuelto — navegación principal sin 404', () => {
  test('los 4 enlaces de navLinks responden 200', async ({ page, request }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: /principal/i });
    const hrefs = await nav
      .getByRole('link')
      .evaluateAll((links) => links.map((l) => (l as HTMLAnchorElement).getAttribute('href')));

    expect(hrefs.length).toBeGreaterThanOrEqual(4);
    for (const href of hrefs) {
      const response = await request.get(href as string);
      expect(response.status(), `${href} debería responder 200`).toBe(200);
    }
  });
});

test.describe('Seguridad — canales-de-ayuda sin datos fabricados', () => {
  test('la página no contiene ningún patrón de teléfono ni correo electrónico', async ({
    page,
  }) => {
    await page.goto('/canales-de-ayuda');
    const bodyText = await page.locator('body').innerText();

    // Sin direcciones de correo
    expect(bodyText).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.-]+/);
    // Sin secuencias que parezcan números telefónicos (7+ dígitos consecutivos, con o sin separadores)
    expect(bodyText).not.toMatch(/(\+?\d[\s-]?){7,}/);
  });

  test('muestra un mensaje explícito de contenido en preparación', async ({ page }) => {
    await page.goto('/canales-de-ayuda');
    await expect(page.getByText(/preparaci[oó]n/i)).toBeVisible();
  });
});

test.describe('NormaTable — /normativa', () => {
  test('lista las normas citadas en CLAUDE.md (sin inventar contenido)', async ({ page }) => {
    await page.goto('/normativa');
    await expect(page.getByText('Ley 1010 de 2006')).toBeVisible();
    await expect(page.getByText(/Resolución 3461 de 2025/)).toBeVisible();
    await expect(page.getByText('Ley 1581 de 2012')).toBeVisible();
  });
});

test.describe('Accordion — funciona sin JavaScript (details/summary nativo)', () => {
  test('el contenido se revela al hacer clic en el resumen, sin scripts', async ({ page }) => {
    await page.goto('/');
    const details = page.locator('details').first();
    await expect(details).toHaveJSProperty('open', false);
    await details.locator('summary').click();
    await expect(details).toHaveJSProperty('open', true);
  });
});

test.describe('Home — accesos rápidos con Card', () => {
  test('las 3 tarjetas de acceso rápido siguen presentes', async ({ page }) => {
    await page.goto('/');
    const section = page.getByRole('region', { name: /accesos r[aá]pidos/i });
    await expect(section.getByRole('link')).toHaveCount(3);
  });

  test('incluye un aviso (Callout) de que las quejas se radican en SIRAL, no aquí', async ({
    page,
  }) => {
    await page.goto('/');
    const callout = page.getByRole('note');
    await expect(callout).toBeVisible();
    await expect(callout).toContainText('SIRAL');
  });
});
