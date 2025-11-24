'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // TODO: Implement signup logic
        console.log('Signup attempt:', email)
        setTimeout(() => setLoading(false), 1000)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-fondo-base dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-muro-principal dark:text-white">
                        Crear una cuenta
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Únete a Muro de Deseos hoy
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    {error && (
                        <div className="rounded-md bg-urgencia-coral/10 p-4 border border-urgencia-coral/20">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-urgencia-coral">
                                        Error de registro
                                    </h3>
                                    <div className="mt-2 text-sm text-urgencia-coral/90">
                                        <p>{error}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Correo electrónico
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                                    placeholder="tu@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Contraseña
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center rounded-lg bg-deseo-acento px-4 py-2.5 text-sm font-bold text-muro-principal shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deseo-acento disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            {loading ? 'Creando cuenta...' : 'Registrarse'}
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                        ¿Ya tienes una cuenta?{' '}
                        <Link href="/login" className="font-medium text-muro-principal hover:text-deseo-acento dark:text-gray-300 dark:hover:text-deseo-acento transition-colors">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
