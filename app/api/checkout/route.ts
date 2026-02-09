import { Checkout } from "@polar-sh/supabase";
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * GET /api/checkout
 * 
 * Creates a Polar.sh checkout session using the official Supabase integration.
 * Injects user_id into metadata for webhook processing.
 * 
 * Query Params:
 * - products: Product ID(s) to checkout (required)
 * - customerId: Polar customer ID (optional)
 * - customerEmail: Customer email for pre-fill (optional)
 * - customerName: Customer name for pre-fill (optional)
 */
const checkoutHandler = Checkout({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/subscription?success=true`,
    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing`,
    server: (process.env.POLAR_SERVER as 'sandbox' | 'production') || 'production',
    theme: "dark",
});

export async function GET(request: Request) {
    if (!process.env.POLAR_ACCESS_TOKEN) {
        console.error('Missing POLAR_ACCESS_TOKEN');
        return new Response('Configuration Error', { status: 500 });
    }

    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        let req = request;

        // If user is logged in, attach their ID to the checkout metadata
        // This allows the webhook to associate the subscription with the user
        if (user) {
            const url = new URL(request.url);

            // Get existing metadata or init empty
            let metadata = {};
            try {
                const existingMeta = url.searchParams.get('metadata');
                if (existingMeta) {
                    metadata = JSON.parse(existingMeta);
                }
            } catch (e) {
                console.warn('Failed to parse existing metadata', e);
            }

            // check if customerEmail is passed, if not inject user email
            if (!url.searchParams.has('customerEmail') && user.email) {
                url.searchParams.set('customerEmail', user.email);
            }

            // Inject user_id
            metadata = {
                ...metadata,
                user_id: user.id
            };

            url.searchParams.set('metadata', JSON.stringify(metadata));

            // Create a new request with the updated URL
            // We need to clone the original request but change the URL
            req = new Request(url.toString(), {
                headers: request.headers,
                method: request.method,
                // body: request.body, // GET requests usually don't have body
                // signals, etc
            });
        }

        return await checkoutHandler(req);
    } catch (error) {
        console.error('Polar Checkout Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
