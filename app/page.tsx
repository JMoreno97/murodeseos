import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-fondo-base dark:bg-gray-900 text-center px-4">
      <main className="max-w-4xl space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-muro-principal dark:text-white sm:text-6xl">
          Muro de <span className="text-deseo-acento">Deseos</span>
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
          Comparte tus sueños, organiza tus regalos y haz realidad los deseos de tus amigos.
          La forma más sencilla de gestionar tus listas de regalos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link
            href="/login"
            className="rounded-full bg-deseo-acento px-8 py-3.5 text-sm font-bold text-muro-principal shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deseo-acento transition-all"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-white dark:bg-gray-800 px-8 py-3.5 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Registrarse
          </Link>
        </div>
      </main>
    </div>
  );
}
