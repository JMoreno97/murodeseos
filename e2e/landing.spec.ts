import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
    test('should display landing page for non-authenticated users', async ({ page }) => {
        await page.goto('/')

        // Verificar que aparece el título principal
        await expect(page.getByRole('heading', { name: /muro de deseos/i })).toBeVisible()

        // Verificar que aparecen los botones de login y signup
        await expect(page.getByRole('link', { name: /iniciar sesión/i })).toBeVisible()
        await expect(page.getByRole('link', { name: /registrarse/i })).toBeVisible()
    })

    test('should navigate to login page', async ({ page }) => {
        await page.goto('/')

        // Click en el botón de login
        await page.getByRole('link', { name: /iniciar sesión/i }).click()

        // Verificar que estamos en la página de login
        await expect(page).toHaveURL(/\/login/)
        await expect(page.getByRole('heading', { name: /bienvenido de nuevo/i })).toBeVisible()
    })

    test('should navigate to signup page', async ({ page }) => {
        await page.goto('/')

        // Click en el botón de registro
        await page.getByRole('link', { name: /registrarse/i }).click()

        // Verificar que estamos en la página de signup
        await expect(page).toHaveURL(/\/signup/)
        await expect(page.getByRole('heading', { name: /crear una cuenta/i })).toBeVisible()
    })
})
