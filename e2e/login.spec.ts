import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login')
    })

    test('should display login form', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /bienvenido de nuevo/i })).toBeVisible()
        await expect(page.getByLabel(/correo electrónico/i)).toBeVisible()
        await expect(page.getByLabel(/contraseña/i)).toBeVisible()
        await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible()
    })

    test('should show validation error for invalid email', async ({ page }) => {
        // Ingresar un email inválido
        await page.getByLabel(/correo electrónico/i).fill('invalid-email')
        await page.getByLabel(/correo electrónico/i).blur()

        // Verificar que aparece el mensaje de error
        await expect(page.getByText(/introduce un correo electrónico válido/i)).toBeVisible()
    })

    test('should navigate to signup page from login', async ({ page }) => {
        // Click en el enlace de registro
        await page.getByRole('link', { name: /regístrate/i }).click()

        // Verificar que estamos en la página de signup
        await expect(page).toHaveURL(/\/signup/)
    })

    test('should show error for empty credentials', async ({ page }) => {
        // Intentar hacer login sin credenciales
        await page.getByRole('button', { name: /iniciar sesión/i }).click()

        // Los campos requeridos deben mostrar validación del navegador
        const emailInput = page.getByLabel(/correo electrónico/i)
        await expect(emailInput).toHaveAttribute('required', '')
    })
})
