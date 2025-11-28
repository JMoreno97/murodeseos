import { test, expect } from '@playwright/test'

test.describe('Flujo de Creación de Grupo', () => {
    test.beforeEach(async ({ page }) => {
        // Navegar a la página de inicio
        await page.goto('http://localhost:3000')
    })

    test('Un usuario puede crear un grupo exitosamente y ser redirigido al detalle', async ({ page }) => {
        // 1. Verificar que estamos en la Home
        await expect(page).toHaveURL('http://localhost:3000/')

        // 2. Hacer clic en el botón "Crear Grupo"
        // Puede estar como "Crear Grupo", "Nuevo Grupo", o "+" dependiendo del diseño
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

        // 5. Seleccionar un icono (opcional, pero probar la interacción)
        const emojiButtons = page.locator('button:has-text("🎉")')
        if (await emojiButtons.count() > 0) {
            await emojiButtons.first().click()
        }

        // 6. Enviar el formulario
        const submitButton = page.locator('button[type="submit"]:has-text("Crear"), button:has-text("Crear y Compartir")')
        await expect(submitButton).toBeVisible()
        await submitButton.click()

        // 7. Esperar a que se complete la creación
        // Puede mostrar un modal de éxito o redirigir directamente
        // Verificamos dos posibles escenarios:

        // Escenario A: Se muestra una pantalla de éxito con el código del grupo
        const successMessage = page.locator('text=/Grupo Creado|¡Éxito!|Creado con éxito/i')

        if (await successMessage.isVisible({ timeout: 5000 }).catch(() => false)) {
            // Si hay pantalla de éxito, verificar que muestra el código
            const groupCodeElement = page.locator('text=/[A-Z0-9]{6,8}/')
            await expect(groupCodeElement).toBeVisible()

            // Hacer clic en "Continuar" o navegar al grupo
            const continueButton = page.locator('button:has-text("Continuar"), a:has-text("Ver grupo")')

            if (await continueButton.isVisible({ timeout: 3000 }).catch(() => false)) {
                await continueButton.first().click()
            }
        }

        // 8. Verificar redirección (puede ser a Home o al detalle del grupo)
        // Esperar a que la URL cambie
        await page.waitForURL(/\/($|groups\/)/, { timeout: 10000 })

        // Verificar que NO estamos más en /groups/create
        await expect(page).not.toHaveURL(/\/groups\/create/)

        // 9. Verificar que el grupo aparece (si estamos en Home)
        const currentUrl = page.url()

        if (currentUrl.includes('/groups/') && !currentUrl.includes('/create')) {
            // Estamos en la página de detalle del grupo
            await expect(page.locator('h1, h2, h3').first()).toBeVisible()
        } else {
            // Estamos en Home, verificar que el grupo aparece en la lista
            const groupCard = page.locator(`text="${groupName}"`)
            await expect(groupCard).toBeVisible({ timeout: 5000 })
        }
    })

    test('El formulario de creación valida el nombre mínimo', async ({ page }) => {
        // Navegar a la página de creación
        await page.goto('http://localhost:3000/groups/create')

        // Intentar enviar con nombre muy corto
        const groupNameInput = page.locator('input#groupName, input[name="groupName"], input[placeholder*="Grupo"]')
        await groupNameInput.fill('AB') // Menos de 3 caracteres

        const submitButton = page.locator('button[type="submit"]')

        // El botón debe estar deshabilitado o mostrar error de validación HTML5
        const isDisabled = await submitButton.isDisabled()

        if (!isDisabled) {
            // Si no está deshabilitado, probar a enviar y verificar validación HTML5
            await submitButton.click()

            // La URL no debe cambiar (no debe enviarse)
            await page.waitForTimeout(1000)
            await expect(page).toHaveURL(/\/groups\/create/)
        }

        // Ahora poner un nombre válido
        await groupNameInput.fill('Grupo Válido')

        // El botón debe estar habilitado
        await expect(submitButton).toBeEnabled({ timeout: 2000 })
    })

    test('Permite seleccionar diferentes iconos para el grupo', async ({ page }) => {
        await page.goto('http://localhost:3000/groups/create')

        // Verificar que hay iconos disponibles
        const emojiButtons = page.locator('button:has-text("🎁"), button:has-text("🎉"), button:has-text("🎄")')
        await expect(emojiButtons.first()).toBeVisible()

        // Contar cuántos iconos hay
        const emojiCount = await emojiButtons.count()
        expect(emojiCount).toBeGreaterThan(0)

        // Seleccionar un icono diferente al predeterminado
        if (emojiCount > 1) {
            const secondEmoji = emojiButtons.nth(1)
            await secondEmoji.click()

            // Verificar que el icono tiene la clase de "seleccionado"
            await expect(secondEmoji).toHaveClass(/border-deseo-acento|bg-deseo-acento|scale-110/)
        }
    })
})
