import { test, expect } from '@playwright/test';
import packageJson from '../package.json';

test.describe('Novedades (What\'s New Modal)', () => {
    // Nota: La autenticación ya viene dada por el auth.setup.ts (global setup)
    // El estado base (user.json) NO tiene 'lastSeenVersion' seteado.

    test('debería aparecer para un usuario nuevo (sin historial)', async ({ page }) => {
        // Navegar a la home. Como no tenemos 'lastSeenVersion', el modal debe salir.
        await page.goto('/');

        // Verificar que el modal aparece
        await expect(page.getByRole('dialog')).toBeVisible();
        await expect(page.getByText('Novedades')).toBeVisible();
        await expect(page.getByText(`v${packageJson.version}`)).toBeVisible();
    });

    test('debería cerrarse y guardar la versión en localStorage', async ({ page }) => {
        await page.goto('/');

        // Verificar y cerrar
        const modal = page.getByRole('dialog');
        await expect(modal).toBeVisible();

        await page.getByRole('button', { name: '¡Entendido!' }).click();
        await expect(modal).not.toBeVisible();

        // Verificar localStorage
        const storedVersion = await page.evaluate(() => localStorage.getItem('lastSeenVersion'));
        expect(storedVersion).toBe(packageJson.version);

        // Verificar persistencia al recargar
        await page.reload();
        await expect(modal).not.toBeVisible();
    });

    test('no debería aparecer si ya se ha visto la versión actual', async ({ page }) => {
        // Inyectamos el valor en localStorage ANTES de que cargue la página
        await page.addInitScript((version) => {
            window.localStorage.setItem('lastSeenVersion', version);
        }, packageJson.version);

        await page.goto('/');
        await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('debería aparecer si la versión guardada es anterior', async ({ page }) => {
        // Inyectamos una versión vieja
        await page.addInitScript(() => {
            window.localStorage.setItem('lastSeenVersion', '0.0.0');
        });

        await page.goto('/');
        await expect(page.getByRole('dialog')).toBeVisible();
    });
});
