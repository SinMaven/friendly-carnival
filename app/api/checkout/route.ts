import { Checkout } from '@polar-sh/nextjs';

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
    successUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/subscription?success=true`,
    server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
});
