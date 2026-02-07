'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import type { ProductWithPrices } from '@/features/pricing/types'

interface PricingCardProps {
    product: ProductWithPrices
    isPopular?: boolean
    currentPriceId?: string | null
    billingInterval: 'month' | 'year'
}

export function PricingCard({
    product,
    isPopular,
    currentPriceId,
    billingInterval
}: PricingCardProps) {
    const [isLoading, setIsLoading] = useState(false)

    const price = product.prices.find(p => p.interval === billingInterval) || product.prices[0]
    const isCurrentPlan = currentPriceId === price?.id

    const handleSubscribe = async () => {
        if (!price?.id || isCurrentPlan) return

        setIsLoading(true)

        // Redirect to Polar checkout
        // The product ID should match the Polar product ID
        const polarProductId = (product.metadata as { polar_product_id?: string })?.polar_product_id || price.id

        window.location.href = `/api/checkout?products=${polarProductId}`
    }

    const features = (product.metadata as { features?: string })?.features?.split(',') || []

    return (
        <Card className={cn(
            'relative flex flex-col',
            isPopular && 'border-primary shadow-lg scale-105'
        )}>
            {isPopular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                </Badge>
            )}
            <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="mb-6">
                    <span className="text-4xl font-bold">
                        ${((price?.unit_amount || 0) / 100).toFixed(0)}
                    </span>
                    <span className="text-muted-foreground">
                        /{billingInterval}
                    </span>
                </div>
                <ul className="space-y-2">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary" />
                            {feature.trim()}
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    variant={isPopular ? 'default' : 'outline'}
                    onClick={handleSubscribe}
                    disabled={isLoading || isCurrentPlan}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isCurrentPlan ? (
                        'Current Plan'
                    ) : (
                        'Subscribe'
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
