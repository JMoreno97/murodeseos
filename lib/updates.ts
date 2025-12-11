export interface AppUpdate {
    version: string;
    date: string;
    changes: string[];
}

export const updates: AppUpdate[] = [
    {
        version: '0.1.0',
        date: '2025-12-11',
        changes: [
            '✨ Ahora puedes ver el historial de cambios de la aplicación.',
            '🚀 Mejora en la velocidad de carga de los grupos.',
            '🐛 Corregidos errores menores en la visualización de listas.',
        ],
    },
];

export function getLatestUpdate(): AppUpdate {
    return updates[0];
}
