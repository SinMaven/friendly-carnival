import { Polar } from '@polar-sh/sdk';

/**
 * Polar.sh client for server-side operations
 * Uses POLAR_ACCESS_TOKEN from environment
 */
export const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
});

/**
 * Helper to get the organization ID
 */
export const POLAR_ORGANIZATION_ID = process.env.POLAR_ORGANIZATION_ID!;

/**
 * Helper to construct checkout URLs
 */
export function getCheckoutSuccessUrl() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return `${baseUrl}/dashboard/subscription?success=true`;
}

export function getCheckoutCancelUrl() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return `${baseUrl}/pricing`;
}
