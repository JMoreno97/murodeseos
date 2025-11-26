'use client'

export function WishListTab() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
                    📝
                </div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3">
                    Tu carta a los Reyes Magos
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-lg">
                    (o al amigo invisible)
                </p>
                <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                        ✨ Próximamente podrás crear y gestionar tu lista de deseos aquí
                    </p>
                </div>
            </div>
        </div>
    );
}
