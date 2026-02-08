import { CustomerPortal } from "@polar-sh/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * GET /api/customer-portal
 * 
 * Redirects authenticated users to their Polar customer portal.
 * Users can view orders, subscriptions, and manage their billing.
 */
export const GET = CustomerPortal({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    getCustomerId: async (_request) => {
        // Get the authenticated user
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('Not authenticated');
        }

        // Get the subscription with Polar customer info
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('polar_customer_id')
            .eq('user_id', user.id)
            .maybeSingle();

        if (!subscription?.polar_customer_id) {
            throw new Error('No Polar customer found');
        }

        return subscription.polar_customer_id;
    },
    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/subscription`,
    server: (process.env.POLAR_SERVER as 'sandbox' | 'production') || 'production',
});
