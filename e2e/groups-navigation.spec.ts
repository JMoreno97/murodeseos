import { test, expect } from '@playwright/test'
import { E2E_CONFIG } from './config'

test.describe('Navegación de Grupos', () => {
    test.beforeEach(async ({ page }) => {
        // Login antes de cada test con usuario E2E
        await page.goto('http://localhost:3000/login')

        // Esperar a que el formulario esté listo
        await page.waitForSelector('input[name="email"]', { state: 'visible' })

        // Rellenar credenciales del usuario E2E
        await page.fill('input[name="email"]', E2E_CONFIG.user.email)
        await page.fill('input[name="password"]', E2E_CONFIG.user.password)

        // Enviar formulario
        await page.click('button[type="submit"]')

        // Esperar a la redirección a la home (el usuario ya tiene perfil completo)
        await page.waitForURL('http://localhost:3000/', { timeout: 10000 })

        // Verificar que estamos en la home
        await expect(page).toHaveURL('http://localhost:3000/')
    })

    test('Carga la pestaña de grupos directamente usando el parámetro URL', async ({ page }) => {
        await page.goto('http://localhost:3000/?tab=groups')

        // Verificar que el título "Mis grupos" es visible
        // Esto confirma que el componente GroupsTab está renderizado
        await expect(page.getByRole('heading', { name: 'Mis grupos' })).toBeVisible()

        // Verificar que el botón de crear grupo es visible
        await expect(page.locator('a[title="Crear grupo"]')).toBeVisible()
    })

    test('El botón "Unirse a grupo" está visible y navega correctamente', async ({ page }) => {
        // Ir a la pestaña de grupos
        await page.goto('http://localhost:3000/?tab=groups')

        // Buscar el botón de unirse (el morado) por su atributo title
        const joinButton = page.locator('a[title="Unirse a grupo"]')
        await expect(joinButton).toBeVisible()
        await joinButton.click()

        // Verificar URL de destino
        await expect(page).toHaveURL(/.*\/groups\/join/)

        // Verificar título de la página de destino (usando el nuevo sentence case)
        await expect(page.getByRole('heading', { name: /unirse a un grupo/i })).toBeVisible()
    })

    test('El botón "Volver" desde la página de Unirse regresa a la pestaña de grupos', async ({ page }) => {
        // Navegar primero a la pestaña de grupos desde la home
        await page.goto('http://localhost:3000/?tab=groups')
        await expect(page.getByRole('heading', { name: 'Mis grupos' })).toBeVisible()

        // Hacer clic en el botón de unirse
        await page.locator('a[title="Unirse a grupo"]').click()
        await expect(page).toHaveURL(/.*\/groups\/join/)

        // Clic en volver
        await page.getByText('← Volver').click()

        // Verificar que volvemos a la home con el tab de grupos
        await expect(page).toHaveURL(/.*\/\?tab=groups/)

        // Verificar que visualmente estamos en la pestaña de grupos
        await expect(page.getByRole('heading', { name: 'Mis grupos' })).toBeVisible()
    })

    test('El botón "Volver" desde la página de Crear regresa a la pestaña de grupos', async ({ page }) => {
        // Navegar primero a la pestaña de grupos desde la home
        await page.goto('http://localhost:3000/?tab=groups')
        await expect(page.getByRole('heading', { name: 'Mis grupos' })).toBeVisible()

        // Hacer clic en el botón de crear
        await page.locator('a[title="Crear grupo"]').click()
        await expect(page).toHaveURL(/.*\/groups\/create/)

        // Clic en volver
        await page.getByText('← Volver').click()

        // Verificar que volvemos a la home con el tab de grupos
        await expect(page).toHaveURL(/.*\/\?tab=groups/)

        // Verificar que visualmente estamos en la pestaña de grupos
        await expect(page.getByRole('heading', { name: 'Mis grupos' })).toBeVisible()
    })
})
