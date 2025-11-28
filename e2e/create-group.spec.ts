import { test, expect } from '@playwright/test'

test.describe('Flujo de Creación de Grupo', () => {
    test.setTimeout(60000)
    test.beforeEach(async ({ page }) => {
        console.log('Iniciando login...')
        // 1. Ir a la página de login
        await page.goto('http://localhost:3000/login')

        // Esperar a que el formulario sea visible
        await page.waitForSelector('form', { state: 'visible' })

        // 2. Rellenar credenciales
        console.log('Rellenando credenciales...')
        await page.fill('input[name="email"]', 'juan@test.com')
        await page.fill('input[name="password"]', 'Test123!')

        // 3. Enviar formulario
        console.log('Enviando formulario...')
        await page.click('button[type="submit"]')

        // 4. Esperar a ser redirigido a la home
        console.log('Esperando redirección...')
        try {
            await page.waitForURL('http://localhost:3000/', { timeout: 15000 })
        } catch (e) {
            console.log('Timeout esperando redirección. URL actual:', page.url())
            // Capturar texto de error si existe
            const errorText = await page.locator('.text-urgencia-coral').textContent().catch(() => 'No error text found')
            console.log('Mensaje de error en pantalla:', errorText)
            throw e
        }

        // Verificar que estamos logueados
        console.log('Login exitoso, verificando URL...')
        await expect(page).toHaveURL('http://localhost:3000/')
    })

    test('Un usuario puede crear un grupo exitosamente y ser redirigido al detalle', async ({ page }) => {
        // 1. Verificar que estamos en la Home
        await expect(page).toHaveURL('http://localhost:3000/')

        // 2. Hacer clic en el botón "Crear Grupo"
        const createGroupButton = page.locator('a[href*="/groups/create"], button:has-text("Crear Grupo"), a:has-text("Crear Nuevo Grupo")')
        await expect(createGroupButton.first()).toBeVisible({ timeout: 10000 })
        await createGroupButton.first().click()

        // 3. Verificar que estamos en la página de creación de grupo
        await expect(page).toHaveURL(/\/groups\/create/)
        await expect(page.locator('h1')).toContainText(/Crear.*Grupo/i)

        // 4. Rellenar el formulario
        const groupName = `Test Grupo ${Date.now()}`
        const groupNameInput = page.locator('input#groupName, input[name="groupName"], input[placeholder*="Grupo"]')
        await expect(groupNameInput).toBeVisible()
        await groupNameInput.fill(groupName)

        // 5. Seleccionar un icono (opcional)
        const emojiButtons = page.locator('button:has-text("🎉")')
        if (await emojiButtons.count() > 0) {
            await emojiButtons.first().click()
        }

        // 6. Enviar el formulario
        const submitButton = page.locator('button[type="submit"]:has-text("Crear"), button:has-text("Crear y Compartir")')
        await expect(submitButton).toBeVisible()
        await submitButton.click()

        // 7. Esperar a que se complete la creación
        const successMessage = page.locator('text=/Grupo Creado|¡Éxito!|Creado con éxito/i')

        // Intentar detectar éxito o redirección
        try {
            await Promise.race([
                successMessage.waitFor({ state: 'visible', timeout: 5000 }),
                page.waitForURL(/\/($|groups\/)/, { timeout: 10000 })
            ])
        } catch (e) {
            console.log('No se detectó éxito inmediato, verificando estado actual...')
        }

        if (await successMessage.isVisible().catch(() => false)) {
            // Si hay pantalla de éxito, verificar código y continuar
            const groupCodeElement = page.locator('text=/[A-Z0-9]{6,8}/')
            await expect(groupCodeElement).toBeVisible()

            const continueButton = page.locator('button:has-text("Continuar"), a:has-text("Ver grupo")')
            if (await continueButton.isVisible().catch(() => false)) {
                await continueButton.first().click()
            }
        }

        // 8. Verificar redirección final
        await page.waitForURL(/\/($|groups\/)/, { timeout: 10000 })
        await expect(page).not.toHaveURL(/\/groups\/create/)

        // 9. Verificar que el grupo aparece
        const currentUrl = page.url()
        if (currentUrl.includes('/groups/') && !currentUrl.includes('/create')) {
            await expect(page.locator('h1, h2, h3').first()).toBeVisible()
        } else {
            const groupCard = page.locator(`text="${groupName}"`)
            await expect(groupCard).toBeVisible({ timeout: 5000 })
        }
    })

    test('El formulario de creación valida el nombre mínimo', async ({ page }) => {
        await page.goto('http://localhost:3000/groups/create')

        const groupNameInput = page.locator('input#groupName, input[name="groupName"]')
        await groupNameInput.fill('AB')

        const submitButton = page.locator('button[type="submit"]')

        // Verificar si está deshabilitado o si al hacer clic no navega
        const isDisabled = await submitButton.isDisabled()

        if (!isDisabled) {
            await submitButton.click()
            await page.waitForTimeout(1000)
            await expect(page).toHaveURL(/\/groups\/create/)
        } else {
            expect(isDisabled).toBe(true)
        }

        await groupNameInput.fill('Grupo Válido')
        await expect(submitButton).toBeEnabled({ timeout: 2000 })
    })

    test('Permite seleccionar diferentes iconos para el grupo', async ({ page }) => {
        await page.goto('http://localhost:3000/groups/create')

        const emojiButtons = page.locator('button:has-text("🎁"), button:has-text("🎉")')
        await expect(emojiButtons.first()).toBeVisible()

        const emojiCount = await emojiButtons.count()
        if (emojiCount > 1) {
            const secondEmoji = emojiButtons.nth(1)
            await secondEmoji.click()
            await expect(secondEmoji).toHaveClass(/border-deseo-acento|bg-deseo-acento|scale-110/)
        }
    })
})
