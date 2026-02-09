import { Webhooks } from '@polar-sh/supabase';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

/**
 * POST /api/webhooks/polar
 * 
 * Handles Polar.sh webhook events using the official Supabase integration.
 * Uses Service Role Key to bypass RLS and access auth.users.
 */
export const POST = Webhooks({
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

    // Handle new subscription
    onSubscriptionCreated: async (payload) => {
        console.log('Subscription created:', payload.data.id);

        let userId = payload.data.metadata?.user_id;

        // Fallback: Find user by email if no user_id in metadata
        if (!userId) {
            const email = payload.data.customer?.email;
            if (email) {
                // Determine user ID from email using Admin API
                const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
                const user = users.find(u => u.email === email);
                if (user) {
                    userId = user.id;
                } else {
                    console.error('No user found for email:', email);
                }
            } else {
                console.error('No customer email or user_id in subscription payload');
            }
        }

        if (!userId) {
            console.error('Could not determine user for subscription:', payload.data.id);
            return;
        }

        // Find match in profiles (to ensure they have a profile too)
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .single();

        if (!profile) {
            console.error('No profile found for user:', userId);
            return;
        }

        // Find the local product that matches this Polar product
        const { data: product } = await supabaseAdmin
            .from('products')
            .select('id')
            .eq('metadata->>polar_product_id', payload.data.productId)
            .maybeSingle();

        let priceId = null;
        if (product) {
            const { data: price } = await supabaseAdmin
                .from('prices')
                .select('id')
                .eq('product_id', product.id)
                .maybeSingle();
            priceId = price?.id;
        }

        // Update subscription status
        await supabaseAdmin
            .from('subscriptions')
            .upsert({
                user_id: userId,
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

        console.log('Subscription saved for user:', userId);
    },

    // Handle subscription becoming active
    onSubscriptionActive: async (payload) => {
        console.log('Subscription active:', payload.data.id);

        await supabaseAdmin
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
        const status = payload.data.status === 'active' ? 'active' : 'canceled';

        // Find the local product that matches this Polar product (in case upgrade occurred)
        const { data: product } = await supabaseAdmin
            .from('products')
            .select('id')
            .eq('metadata->>polar_product_id', payload.data.productId)
            .maybeSingle();

        let priceId = null;
        if (product) {
            const { data: price } = await supabaseAdmin
                .from('prices')
                .select('id')
                .eq('product_id', product.id)
                .maybeSingle();
            priceId = price?.id;
        }

        const updateData: {
            status: string;
            current_period_end: string | null;
            updated_at: string;
            price_id?: string;
            polar_product_id?: string;
        } = {
            status,
            current_period_end: payload.data.currentPeriodEnd ? payload.data.currentPeriodEnd.toISOString() : null,
            updated_at: new Date().toISOString()
        };

        if (priceId) {
            updateData.price_id = priceId;
            updateData.polar_product_id = payload.data.productId;
        }

        await supabaseAdmin
            .from('subscriptions')
            .update(updateData)
            .eq('polar_subscription_id', payload.data.id);
    },


    // Handle cancellations
    onSubscriptionCanceled: async (payload) => {
        console.log('Subscription canceled:', payload.data.id);

        await supabaseAdmin
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

        await supabaseAdmin
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
