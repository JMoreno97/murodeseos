import { render, screen } from '@testing-library/react'
import LoginPage from '@/app/(auth)/login/page'

// Mock de Suspense para evitar errores en tests
jest.mock('react', () => ({
    ...jest.requireActual('react'),
    Suspense: ({ children }: { children: React.ReactNode }) => children,
}))

describe('LoginPage', () => {
    it('renders login form', () => {
        render(<LoginPage />)

        // Verificar que los elementos principales están presentes
        expect(screen.getByText('Bienvenido de nuevo')).toBeInTheDocument()
        expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
    })

    it('shows link to signup page', () => {
        render(<LoginPage />)

        const signupLink = screen.getByText(/regístrate/i)
        expect(signupLink).toBeInTheDocument()
        expect(signupLink.closest('a')).toHaveAttribute('href', '/signup')
    })
})
