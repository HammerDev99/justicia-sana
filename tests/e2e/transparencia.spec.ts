import { test, expect } from '@playwright/test';

test.describe('F4 — /transparencia-y-cifras con degradación agraciada (SIRAL inalcanzable)', () => {
  test('responde 200 con header y footer', async ({ page }) => {
    const response = await page.goto('/transparencia-y-cifras');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('está enlazada desde la navegación principal', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: /principal/i });
    const hrefs = await nav
      .getByRole('link')
      .evaluateAll((links) => links.map((l) => (l as HTMLAnchorElement).getAttribute('href')));

    expect(hrefs).toContain('/transparencia-y-cifras');
  });

  test('muestra el placeholder de contenido en preparación cuando SIRAL no tiene datos', async ({
    page,
  }) => {
    await page.goto('/transparencia-y-cifras');
    await expect(page.getByText('Sección en preparación')).toBeVisible();
  });

  test('cero errores de consola', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/transparencia-y-cifras');
    expect(errors).toEqual([]);
  });
});
