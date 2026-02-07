import { Polar } from '@polar-sh/sdk';
import { getURL } from '@/utils/get-url';

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
    return getURL('/dashboard/subscription?success=true');
}

export function getCheckoutCancelUrl() {
    return getURL('/pricing');
}
