import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getSubscription } from '@/features/account/queries/get-subscription'
import { CreditCard, ExternalLink, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default async function SubscriptionPage() {
    const subscription = await getSubscription()

    const isActive = subscription?.status === 'active'

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Subscription</h1>
                <p className="text-muted-foreground">Manage your billing and subscription</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            <CardTitle>Current Plan</CardTitle>
                        </div>
                        <Badge variant={isActive ? 'default' : 'secondary'}>
                            {subscription?.status || 'No Plan'}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {subscription ? (
                        <>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Plan</span>
                                    <span className="font-medium">
                                        {(subscription as any).product?.name || 'Unknown Plan'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Status</span>
                                    <span className="flex items-center gap-1">
                                        {isActive && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                        {subscription.status}
                                    </span>
                                </div>
                                {subscription.current_period_end && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Renews</span>
                                        <span>{new Date(subscription.current_period_end).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {subscription.cancel_at_period_end && (
                                    <div className="p-3  bg-yellow-500/10 text-yellow-500 text-sm">
                                        Your subscription will cancel at the end of the current period.
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button variant="outline" asChild>
                                    <a href="/api/create-portal-link" target="_blank">
                                        Manage Subscription
                                        <ExternalLink className="h-4 w-4 ml-2" />
                                    </a>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-muted-foreground mb-4">
                                You don&apos;t have an active subscription.
                            </p>
                            <Button asChild>
                                <Link href="/pricing">View Plans</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
