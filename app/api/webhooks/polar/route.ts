import { Webhooks } from '@polar-sh/supabase';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * POST /api/webhooks/polar
 * 
 * Handles Polar.sh webhook events using the official Supabase integration.
 */
export const POST = Webhooks({
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

    // Handle new subscription
    onSubscriptionCreated: async (payload) => {
        console.log('Subscription created:', payload.data.id);

        const supabase = await createSupabaseServerClient();
        const email = payload.data.customer?.email;

        if (!email) {
            console.error('No customer email in subscription payload');
            return;
        }

        // Find user by email
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single();

        if (!profile) {
            console.error('No profile found for email:', email);
            return;
        }

        // Find the local product that matches this Polar product
        const { data: product } = await supabase
            .from('products')
            .select('id')
            .eq('metadata->>polar_product_id', payload.data.productId)
            .maybeSingle();

        let priceId = null;
        if (product) {
            const { data: price } = await supabase
                .from('prices')
                .select('id')
                .eq('product_id', product.id)
                .maybeSingle();
            priceId = price?.id;
        }

        // Update subscription status
        await supabase
            .from('subscriptions')
            .upsert({
                user_id: profile.id,
                polar_subscription_id: payload.data.id,
                polar_product_id: payload.data.productId,
                polar_customer_id: payload.data.customerId, // Store customer ID for portal access
                price_id: priceId,
                status: 'active',
                current_period_start: payload.data.currentPeriodStart,
                current_period_end: payload.data.currentPeriodEnd,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id'
            });

        console.log('Subscription saved for user:', profile.id);
    },

    // Handle subscription becoming active
    onSubscriptionActive: async (payload) => {
        console.log('Subscription active:', payload.data.id);

        const supabase = await createSupabaseServerClient();

        await supabase
            .from('subscriptions')
            .update({
                status: 'active',
                updated_at: new Date().toISOString()
            })
            .eq('polar_subscription_id', payload.data.id);
    },

    // Handle subscription updates
    onSubscriptionUpdated: async (payload) => {
        console.log('Subscription updated:', payload.data.id);

        const supabase = await createSupabaseServerClient();

        await supabase
            .from('subscriptions')
            .update({
                status: payload.data.status === 'active' ? 'active' : 'canceled',
                current_period_end: payload.data.currentPeriodEnd,
                updated_at: new Date().toISOString()
            })
            .eq('polar_subscription_id', payload.data.id);
    },

    // Handle cancellations
    onSubscriptionCanceled: async (payload) => {
        console.log('Subscription canceled:', payload.data.id);

        const supabase = await createSupabaseServerClient();

        await supabase
            .from('subscriptions')
            .update({
                status: 'canceled',
                canceled_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('polar_subscription_id', payload.data.id);
    },

    // Handle subscription revoked (e.g., payment failed)
    onSubscriptionRevoked: async (payload) => {
        console.log('Subscription revoked:', payload.data.id);

        const supabase = await createSupabaseServerClient();

        await supabase
            .from('subscriptions')
            .update({
                status: 'revoked',
                updated_at: new Date().toISOString()
            })
            .eq('polar_subscription_id', payload.data.id);
    },

    // Handle order paid (for one-time purchases)
    onOrderPaid: async (payload) => {
        console.log('Order paid:', payload.data.id);
        // Handle one-time purchase logic here if needed
    }
});
