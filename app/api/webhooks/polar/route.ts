import { Webhooks } from '@polar-sh/nextjs';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * POST /api/webhooks/polar
 * 
 * Handles Polar.sh webhook events
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
                .maybeSingle(); // For now just getting the first active price
            priceId = price?.id;
        }

        // Fallback: If we can't find by metadata, just store the Polar IDs
        // but ideally we want the price_id for the join in getSubscription

        // Update subscription status
        await supabase
            .from('subscriptions')
            .upsert({
                user_id: profile.id,
                polar_subscription_id: payload.data.id,
                polar_product_id: payload.data.productId,
                price_id: priceId, // Link to local prices table
                status: 'active',
                current_period_start: payload.data.currentPeriodStart,
                current_period_end: payload.data.currentPeriodEnd,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id'
            });

        console.log('Subscription saved for user:', profile.id);
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
    }
});
