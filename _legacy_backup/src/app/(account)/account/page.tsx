import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getSession } from "@/features/account/queries/get-session"
import { getSubscription } from "@/features/account/queries/get-subscription"
import { PricingCard } from "@/features/pricing/components/price-card"
import { getProducts } from "@/features/pricing/queries/get-products"
import { Price, ProductWithPrices } from "@/features/pricing/types"

export default async function AccountPage() {
  const [session, subscription, products] = await Promise.all([
    getSession(),
    getSubscription(),
    getProducts(),
  ])

  if (!session) {
    redirect("/login")
  }

  let userProduct: ProductWithPrices | undefined
  let userPrice: Price | undefined

  if (subscription) {
    for (const product of products) {
      for (const price of product.prices) {
        if (price.id === subscription.price_id) {
          userProduct = product
          userPrice = price
        }
      }
    }
  }

  return (
    <section className="container max-w-3xl py-12 lg:py-16">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
          Account Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your subscription and account details.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Your Plan</CardTitle>
            <CardDescription>
              Current subscription status and billing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userProduct && userPrice ? (
              <PricingCard product={userProduct} price={userPrice} />
            ) : (
              <div className="rounded-lg border border-dashed border-border p-8 text-center bg-muted/20">
                <p className="text-muted-foreground">
                  You don&apos;t have an active subscription
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end border-t border-border bg-muted/20 pt-6">
            {subscription ? (
              <Button variant="outline" asChild>
                <Link href="/manage-subscription">Manage subscription</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/pricing">Start a subscription</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
