import { supabase } from './supabase'

// Caracteres seguros para códigos (sin confusión entre O/0, I/1/l)
const SAFE_CHARS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'

/**
 * Genera un código alfanumérico corto y único para grupos
 * @param length Longitud del código (por defecto 6)
 * @returns Código único verificado
 */
export async function generateUniqueGroupCode(length: number = 6): Promise<string> {
    let attempts = 0
    const maxAttempts = 10

    while (attempts < maxAttempts) {
        // Generar código aleatorio
        let code = ''
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * SAFE_CHARS.length)
            code += SAFE_CHARS[randomIndex]
        }

        // Verificar si el código ya existe
        const { data, error } = await supabase
            .from('groups')
            .select('id')
            .eq('id', code)
            .single()

        // Si la tabla no existe, dar un error más claro
        if (error && error.code === '42P01') {
            throw new Error('La tabla de grupos no existe. Por favor, ejecuta el script SQL en Supabase primero.')
        }

        // Si no existe (error porque no se encontró), el código es válido
        if (error && error.code === 'PGRST116') {
            return code
        }

        // Si hay otro tipo de error, lanzarlo
        if (error && !data) {
            console.error('Error verificando código:', error)
            throw new Error(`Error al verificar el código: ${error.message}`)
        }

        attempts++
    }

    // Si después de 10 intentos no se genera un código único, aumentar la longitud
    if (length < 8) {
        return generateUniqueGroupCode(length + 1)
    }

    throw new Error('No se pudo generar un código único para el grupo después de múltiples intentos')
}

/**
 * Crea un nuevo grupo en la base de datos
 */
export async function createGroup(params: {
    name: string
    icon?: string
    creatorId: string
}) {
    const { name, icon, creatorId } = params

    // Generar código único
    const groupId = await generateUniqueGroupCode()

    // Crear el grupo
    const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
            id: groupId,
            name,
            icon: icon || '🎁',
            creator_id: creatorId,
            created_at: new Date().toISOString(),
        })
        .select()
        .single()

    if (groupError) throw groupError

    // Añadir al creador como miembro
    const { error: memberError } = await supabase
        .from('group_members')
        .insert({
            group_id: groupId,
            user_id: creatorId,
            role: 'admin',
            joined_at: new Date().toISOString(),
        })

    if (memberError) throw memberError



    return group
}

/**
 * Une a un usuario a un grupo existente
 */
export async function joinGroup(params: {
    groupCode: string
    userId: string
}) {
    const { groupCode, userId } = params

    // Normalizar el código a mayúsculas
    const normalizedCode = groupCode.trim().toUpperCase()

    // Verificar que el grupo existe
    const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('id, name, icon')
        .eq('id', normalizedCode)
        .single()

    if (groupError || !group) {
        throw new Error('Código incorrecto o grupo no encontrado')
    }

    // Verificar si el usuario ya es miembro
    const { data: existingMember } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', normalizedCode)
        .eq('user_id', userId)
        .single()

    // Si ya es miembro, devolver el grupo sin error
    if (existingMember) {
        return {
            group,
            alreadyMember: true
        }
    }

    // Añadir al usuario como miembro
    const { error: joinError } = await supabase
        .from('group_members')
        .insert({
            group_id: normalizedCode,
            user_id: userId,
            role: 'member',
            joined_at: new Date().toISOString(),
        })

    if (joinError) {
        console.error('Error al unirse al grupo:', joinError)
        throw new Error('No se pudo unir al grupo. Por favor, intenta de nuevo.')
    }



    return {
        group,
        alreadyMember: false
    }
}

/**
 * Genera el mensaje de invitación para compartir
 */
export function generateShareMessage(groupName: string, groupCode: string): string {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const deepLink = `${baseUrl}/groups/join?code=${groupCode}`

    return `¡Únete a mi grupo de regalos "${groupName}" en Muro de Deseos! 🎁\n\nUsa el código: ${groupCode}\no entra aquí: ${deepLink}`
}

/**
 * Comparte usando la Web Share API (si está disponible)
 */
export async function shareGroup(groupName: string, groupCode: string): Promise<boolean> {
    const message = generateShareMessage(groupName, groupCode)

    if (navigator.share) {
        try {
            await navigator.share({
                title: `Únete a ${groupName}`,
                text: message,
            })
            return true
        } catch (error) {
            // Usuario canceló o error

            return false
        }
    } else {
        // Fallback: copiar al portapapeles
        try {
            await navigator.clipboard.writeText(message)
            return true
        } catch (error) {
            console.error('Failed to copy to clipboard:', error)
            return false
        }
    }
}

/**
 * Actualiza el nombre de un grupo
 */
export async function updateGroupName(groupId: string, newName: string) {
    const { error } = await supabase
        .from('groups')
        .update({ name: newName })
        .eq('id', groupId)

    if (error) {
        console.error('Error updating group name:', error)
        throw new Error('No se pudo actualizar el nombre del grupo')
    }

    return true
}

/**
 * Elimina un grupo y todos sus miembros
 */
export async function deleteGroup(groupId: string) {
    // Primero eliminar los miembros (aunque ON DELETE CASCADE debería encargarse, es bueno ser explícito o manejarlo si no hay cascade)
    // Asumimos que hay ON DELETE CASCADE en la FK de group_members -> groups.
    // Si no, tendríamos que borrar miembros primero.
    // Vamos a intentar borrar el grupo directamente.

    const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId)

    if (error) {
        console.error('Error deleting group:', error)
        throw new Error('No se pudo eliminar el grupo')
    }

    return true
}

/**
 * Elimina un miembro de un grupo
 */
export async function removeMemberFromGroup(groupId: string, userId: string) {
    const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId)

    if (error) {
        console.error('Error removing member:', error)
        throw new Error('No se pudo eliminar al miembro del grupo')
    }

    return true
}

/**
 * Establece un apodo (alias) para un grupo para el usuario actual
 */
export async function setGroupAlias(groupId: string, userId: string, alias: string) {
    const { error } = await supabase
        .from('group_members')
        .update({ group_alias: alias })
        .eq('group_id', groupId)
        .eq('user_id', userId)

    if (error) {
        console.error('Error setting group alias:', error)
        throw new Error('No se pudo establecer el apodo del grupo')
    }

    return true
}

