import { render, screen } from '@testing-library/react'
import LoginPage from '@/app/(auth)/login/page'

// Mock de Suspense para evitar errores en tests
jest.mock('react', () => ({
    ...jest.requireActual('react'),
    Suspense: ({ children }: { children: React.ReactNode }) => children,
}))


jest.mock('next/link', () => {
    return ({ children, href }: any) => {
        return <a href={href}>{children}</a>;
    };
})


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
        // Busca un elemento que sea un link (<a>) y tenga el texto "Regístrate"
        const signupLink = screen.getByRole('link', { name: /regístrate/i })

        expect(signupLink).toBeInTheDocument()
        expect(signupLink).toHaveAttribute('href', '/signup')
    })
})
