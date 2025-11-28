import { generateUniqueGroupCode } from '@/lib/group-utils'

// Mock de Supabase
jest.mock('@/lib/supabase', () => ({
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    single: jest.fn(() => ({
                        data: null,
                        error: { code: 'PGRST116' } // Código no encontrado
                    }))
                }))
            }))
        }))
    }
}))

describe('generateUniqueGroupCode', () => {
    it('genera un código con la longitud correcta por defecto (6 caracteres)', async () => {
        const code = await generateUniqueGroupCode()
        expect(code).toHaveLength(6)
    })

    it('genera un código con la longitud especificada', async () => {
        const customLength = 8
        const code = await generateUniqueGroupCode(customLength)
        expect(code).toHaveLength(customLength)
    })

    it('genera un código solo con caracteres alfanuméricos seguros', async () => {
        const code = await generateUniqueGroupCode()
        // Debe contener solo caracteres de SAFE_CHARS (sin O, 0, I, 1, l)
        const safeCharsRegex = /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]+$/
        expect(code).toMatch(safeCharsRegex)
    })

    it('genera códigos únicos en diferentes llamadas', async () => {
        const code1 = await generateUniqueGroupCode()
        const code2 = await generateUniqueGroupCode()
        const code3 = await generateUniqueGroupCode()

        // Aunque no es garantía 100% de unicidad, la probabilidad de colisión es muy baja
        expect(code1).not.toBe(code2)
        expect(code2).not.toBe(code3)
        expect(code1).not.toBe(code3)
    })

    it('no contiene caracteres confusos (O, 0, I, 1, l)', async () => {
        const code = await generateUniqueGroupCode()
        // Verificar que NO contiene caracteres confusos
        expect(code).not.toMatch(/[O0I1l]/)
    })

    it('genera solo caracteres en mayúsculas', async () => {
        const code = await generateUniqueGroupCode()
        expect(code).toBe(code.toUpperCase())
    })
})
