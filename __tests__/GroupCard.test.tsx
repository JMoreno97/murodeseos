import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { GroupCard } from '@/components/GroupCard'

// Mock de useRouter
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        back: jest.fn(),
    }),
}))

describe('GroupCard', () => {
    const mockGroup = {
        id: 'TEST123',
        name: 'Grupo de Prueba',
        icon: '🎁',
        members: [
            { id: '1', name: 'Usuario 1', avatar: '👤' },
            { id: '2', name: 'Usuario 2', avatar: '😊' },
        ],
    }

    it('muestra correctamente el título del grupo', () => {
        render(
            <GroupCard
                group={mockGroup}
                isAdmin={false}
                onShare={jest.fn()}
                onRename={jest.fn()}
                onDelete={jest.fn()}
            />
        )

        expect(screen.getByText('Grupo de Prueba')).toBeInTheDocument()
        expect(screen.getByText('🎁')).toBeInTheDocument()
        expect(screen.getByText('2 participantes')).toBeInTheDocument()
    })

    it('trunca la lista de participantes cuando son más de 3', () => {
        const groupWithManyMembers = {
            ...mockGroup,
            members: [
                { id: '1', name: 'Usuario 1', avatar: '👤' },
                { id: '2', name: 'Usuario 2', avatar: '😊' },
                { id: '3', name: 'Usuario 3', avatar: '🎅' },
                { id: '4', name: 'Usuario 4', avatar: '🎄' },
                { id: '5', name: 'Usuario 5', avatar: '⭐' },
            ],
        }

        render(
            <GroupCard
                group={groupWithManyMembers}
                isAdmin={false}
                onShare={jest.fn()}
                onRename={jest.fn()}
                onDelete={jest.fn()}
            />
        )

        // Verificar que solo se muestran los primeros 3 participantes
        expect(screen.getByText('Usuario 1')).toBeInTheDocument()
        expect(screen.getByText('Usuario 2')).toBeInTheDocument()
        expect(screen.getByText('Usuario 3')).toBeInTheDocument()

        // Verificar que NO se muestran los restantes directamente
        expect(screen.queryByText('Usuario 4')).not.toBeInTheDocument()
        expect(screen.queryByText('Usuario 5')).not.toBeInTheDocument()

        // Verificar que se muestra el indicador de "... y X más"
        expect(screen.getByText('... y 2 más')).toBeInTheDocument()
    })

    it('muestra el botón de "Eliminar grupo" cuando isAdmin es true', async () => {
        render(
            <GroupCard
                group={mockGroup}
                isAdmin={true}
                onShare={jest.fn()}
                onRename={jest.fn()}
                onDelete={jest.fn()}
            />
        )

        // Hacer clic en el botón de opciones de admin
        const adminButton = screen.getByRole('button', { name: /opciones/i })
        expect(adminButton).toBeInTheDocument()

        fireEvent.click(adminButton)

        // Esperar a que aparezca el menú desplegable
        await waitFor(() => {
            expect(screen.getByText('Eliminar grupo')).toBeInTheDocument()
            expect(screen.getByText('Cambiar nombre')).toBeInTheDocument()
        })
    })

    it('NO muestra opciones de admin cuando isAdmin es false', () => {
        render(
            <GroupCard
                group={mockGroup}
                isAdmin={false}
                onShare={jest.fn()}
                onRename={jest.fn()}
                onDelete={jest.fn()}
            />
        )

        // Verificar que NO aparece el botón de opciones de admin
        const adminButton = screen.queryByRole('button', { name: /opciones/i })
        expect(adminButton).not.toBeInTheDocument()
    })

    it('muestra todos los participantes cuando son 3 o menos', () => {
        render(
            <GroupCard
                group={mockGroup}
                isAdmin={false}
                onShare={jest.fn()}
                onRename={jest.fn()}
                onDelete={jest.fn()}
            />
        )

        // Verificar que se muestran todos los miembros sin truncar
        expect(screen.getByText('Usuario 1')).toBeInTheDocument()
        expect(screen.getByText('Usuario 2')).toBeInTheDocument()

        // Verificar que NO se muestra el indicador de "más"
        expect(screen.queryByText(/y \d+ más/)).not.toBeInTheDocument()
    })

    it('llama a onShare cuando se hace clic en el botón de compartir', () => {
        const mockOnShare = jest.fn()

        render(
            <GroupCard
                group={mockGroup}
                isAdmin={false}
                onShare={mockOnShare}
                onRename={jest.fn()}
                onDelete={jest.fn()}
            />
        )

        const shareButton = screen.getByRole('button', { name: /compartir/i })
        fireEvent.click(shareButton)

        expect(mockOnShare).toHaveBeenCalledWith('TEST123')
    })
})
