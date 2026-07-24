import { test, expect } from '@playwright/test';

test.describe('Página de inicio — walking skeleton', () => {
  test('carga con título institucional y encabezado principal', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Justicia Sana/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('expone navegación accesible con enlaces principales', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: /principal/i });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link')).not.toHaveCount(0);
  });

  test('el enlace "saltar al contenido" es el primer elemento enfocable', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: /saltar al contenido/i });
    await expect(skipLink).toBeFocused();
  });

  test('no hay errores de consola en la carga', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    expect(errors).toEqual([]);
  });
});
