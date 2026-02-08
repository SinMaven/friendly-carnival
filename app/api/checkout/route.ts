import { Checkout } from "@polar-sh/supabase";

/**
 * GET /api/checkout
 * 
 * Creates a Polar.sh checkout session using the official Supabase integration.
 * 
 * Query Params:
 * - products: Product ID(s) to checkout (required)
 * - customerId: Polar customer ID (optional)
 * - customerEmail: Customer email for pre-fill (optional)
 * - customerName: Customer name for pre-fill (optional)
 */
export const GET = Checkout({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/subscription?success=true`,
    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing`,
    server: (process.env.POLAR_SERVER as 'sandbox' | 'production') || 'production',
    theme: "dark",
});
