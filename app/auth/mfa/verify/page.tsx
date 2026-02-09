import { Suspense } from 'react'
import { MFAVerifyForm } from './mfa-verify-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

function MFAVerifySkeleton() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
                    <CardDescription>
                        Your account is protected. Please enter the code from your authenticator app.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    )
}

export default function MFAVerifyPage() {
    return (
        <Suspense fallback={<MFAVerifySkeleton />}>
            <MFAVerifyForm />
        </Suspense>
    )
}
