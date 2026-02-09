import { MetadataRoute } from 'next';

/**
 * Robots.txt Configuration
 * Controls web crawler access to the site
 */
export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ctfplatform.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/pricing',
                    '/help',
                    '/legal/privacy',
                    '/legal/terms',
                    '/legal/sla',
                    '/legal/security',
                ],
                disallow: [
                    '/dashboard',
                    '/api/',
                    '/auth/',
                    '/_next/',
                    '/admin/',
                ],
            },
            {
                // Allow Google to access everything public
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/dashboard', '/api/', '/auth/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
