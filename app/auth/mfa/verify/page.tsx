'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Loader2, ShieldCheck } from 'lucide-react'

export default function MFAVerifyPage() {
    const [isPending, startTransition] = useTransition()
    const [code, setCode] = useState('')
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const next = searchParams.get('next') || '/dashboard'
    const supabase = createSupabaseBrowserClient()

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (code.length !== 6) return

        startTransition(async () => {
            // 1. Get current factors to find the TOTP factor ID
            const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors()

            if (factorsError) {
                setError(factorsError.message)
                return
            }

            const totpFactor = factors.all.find(f => f.factor_type === 'totp' && f.status === 'verified')

            if (!totpFactor) {
                setError('No verified MFA factor found. Please contact support.')
                return
            }

            // 2. Challenge and verify
            const { error } = await supabase.auth.mfa.challengeAndVerify({
                factorId: totpFactor.id,
                code,
            })

            if (error) {
                setError(error.message)
            } else {
                router.push(next)
                router.refresh()
            }
        })
    }

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
                <CardContent>
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Authentication Code</Label>
                            <Input
                                id="code"
                                type="text"
                                className="text-center text-lg tracking-widest"
                                placeholder="000000"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                                autoFocus
                                required
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <p>{error}</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isPending || code.length !== 6}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                'Verify'
                            )}
                        </Button>

                        <div className="text-center">
                            <Button
                                variant="link"
                                type="button"
                                className="text-xs text-muted-foreground"
                                onClick={async () => {
                                    await supabase.auth.signOut()
                                    router.push('/login')
                                }}
                            >
                                Sign out and try a different account
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
