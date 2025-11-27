import { render, screen } from '@testing-library/react'
import { GroupCard } from '@/components/GroupCard'

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

    it('renders group information correctly', () => {
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

    it('shows admin actions when user is admin', () => {
        render(
            <GroupCard
                group={mockGroup}
                isAdmin={true}
                onShare={jest.fn()}
                onRename={jest.fn()}
                onDelete={jest.fn()}
            />
        )

        // Verificar que aparecen las opciones de admin
        const adminButton = screen.getByRole('button', { name: /opciones/i })
        expect(adminButton).toBeInTheDocument()
    })

    it('does not show admin actions when user is not admin', () => {
        render(
            <GroupCard
                group={mockGroup}
                isAdmin={false}
                onShare={jest.fn()}
                onRename={jest.fn()}
                onDelete={jest.fn()}
            />
        )

        // Verificar que NO aparecen las opciones de admin
        const adminButton = screen.queryByRole('button', { name: /opciones/i })
        expect(adminButton).not.toBeInTheDocument()
    })
})
