import { CustomerPortal } from "@polar-sh/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/ratelimit';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/customer-portal
 * 
 * Redirects authenticated users to their Polar customer portal.
 * Users can view orders, subscriptions, and manage their billing.
 */
const customerPortalHandler = CustomerPortal({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    getCustomerId: async () => {
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

export async function GET(request: NextRequest) {
    // Rate limiting: 10 requests per minute
    const identifier = getRateLimitIdentifier(request.headers);
    const { success: rateLimitOk } = await checkRateLimit('standard', `portal:${identifier}`);
    
    if (!rateLimitOk) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { 
                status: 429,
                headers: { 'Retry-After': '60' }
            }
        );
    }

    try {
        return await customerPortalHandler(request);
    } catch (error) {
        console.error('Customer Portal Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
