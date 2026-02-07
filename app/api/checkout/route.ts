import { NextRequest, NextResponse } from 'next/server';
import { polar, getCheckoutSuccessUrl } from '@/lib/polar';

/**
 * GET /api/checkout
 * 
 * Creates a Polar.sh checkout session
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const products = searchParams.get('products');

    if (!products) {
        return NextResponse.json({ error: 'No products specified' }, { status: 400 });
    }

    const accessToken = process.env.POLAR_ACCESS_TOKEN;
    if (!accessToken) {
        console.error('POLAR_ACCESS_TOKEN is not configured');
        return NextResponse.json({
            error: 'Payment system not configured. Please add POLAR_ACCESS_TOKEN to environment variables.'
        }, { status: 500 });
    }

    try {
        // The SDK expects a simple array of product IDs
        const productIds = products.split(',');

        // Use the SDK directly for more control/logging
        const result = await polar.checkouts.create({
            products: productIds,
            successUrl: getCheckoutSuccessUrl(),
        });

        // Redirect to Polar checkout
        return NextResponse.redirect(result.url);
    } catch (error: any) {
        console.error('Polar checkout error:', error);

        // Check for specific Polar errors
        if (error.status === 401) {
            return NextResponse.json({ error: 'Invalid Polar API Token' }, { status: 500 });
        }

        return NextResponse.json({
            error: error.message || 'Failed to create checkout session',
            detail: 'Ensure your Product IDs match your Polar environment (Sandbox vs Production)'
        }, { status: 500 });
    }
}
