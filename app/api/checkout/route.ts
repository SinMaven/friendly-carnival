import { Checkout } from '@polar-sh/nextjs';
import { getURL } from '@/utils/get-url';

/**
 * GET /api/checkout
 * 
 * Creates a Polar.sh checkout session
 * Query params:
 * - products: comma-separated product IDs
 * - customerId: optional customer ID
 * - customerEmail: optional email
 */
export const GET = Checkout({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    successUrl: getURL('/dashboard/subscription?success=true'),
    server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
});
