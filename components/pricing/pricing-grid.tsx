'use client'

import { useState } from 'react'
import { PricingCard } from '@/components/pricing/pricing-card'
import { BillingIntervalToggle } from '@/components/pricing/billing-interval-toggle'
import type { ProductWithPrices } from '@/features/pricing/types'

interface PricingGridProps {
    products: ProductWithPrices[]
    currentPriceId?: string | null
}

export function PricingGrid({ products, currentPriceId }: PricingGridProps) {
    const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')

    // Determine which product is "popular" (usually the middle tier)
    const popularIndex = Math.floor(products.length / 2)

    return (
        <div className="space-y-8">
            <div className="flex justify-center">
                <BillingIntervalToggle
                    value={billingInterval}
                    onChange={setBillingInterval}
                />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
                {products.map((product, index) => (
                    <PricingCard
                        key={product.id}
                        product={product}
                        isPopular={index === popularIndex}
                        currentPriceId={currentPriceId}
                        billingInterval={billingInterval}
                    />
                ))}
            </div>
        </div>
    )
}
