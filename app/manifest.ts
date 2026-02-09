import { MetadataRoute } from 'next';

/**
 * Web App Manifest
 * Enables PWA (Progressive Web App) capabilities
 */
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'CTF Platform',
        short_name: 'CTF',
        description: 'Master cybersecurity through practice with real-world CTF challenges',
        start_url: '/dashboard',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#6366f1',
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/icon-maskable-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
        categories: ['education', 'security', 'games'],
        orientation: 'portrait',
        lang: 'en',
        dir: 'ltr',
    };
}
