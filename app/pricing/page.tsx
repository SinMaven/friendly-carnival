import { Navbar } from '@/components/navbar'
import { PricingGrid } from '@/components/pricing/pricing-grid'
import { getProducts } from '@/features/pricing/queries/get-products'
import { getSubscription } from '@/features/account/queries/get-subscription'
import { CreditCard } from 'lucide-react'

export default async function PricingPage() {
    const products = await getProducts()
    const subscription = await getSubscription()

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="container mx-auto py-16 max-w-6xl px-4">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <CreditCard className="h-8 w-8 text-primary" />
                        <h1 className="text-4xl font-bold">Pricing</h1>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Choose the plan that fits your needs. Upgrade anytime to unlock more features.
                    </p>
                </div>

                {products.length > 0 ? (
                    <PricingGrid
                        products={products}
                        currentPriceId={subscription?.price_id}
                    />
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        No pricing plans available at the moment.
                    </div>
                )}
            </div>
        </div>
    )
}
