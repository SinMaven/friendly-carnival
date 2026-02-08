'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, RefreshCw, LogOut, CheckCircle } from 'lucide-react'

export default function VerifyEmailPage() {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const router = useRouter()
    const supabase = createSupabaseBrowserClient()

    const handleResendEmail = () => {
        startTransition(async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user?.email) {
                setMessage({ type: 'error', text: 'No email address found.' })
                return
            }

            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: user.email,
                options: {
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
                },
            })

            if (error) {
                setMessage({ type: 'error', text: error.message })
            } else {
                setMessage({ type: 'success', text: 'Verification email sent! Check your inbox.' })
            }
        })
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const handleCheckVerification = () => {
        startTransition(async () => {
            // Force a session refresh to check if email was verified
            const { data: { user }, error } = await supabase.auth.getUser()

            if (error) {
                setMessage({ type: 'error', text: 'Failed to check verification status.' })
                return
            }

            if (user?.email_confirmed_at) {
                setMessage({ type: 'success', text: 'Email verified! Redirecting...' })
                setTimeout(() => {
                    router.push('/dashboard')
                    router.refresh()
                }, 1000)
            } else {
                setMessage({ type: 'error', text: 'Email not yet verified. Please check your inbox.' })
            }
        })
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Verify Your Email</CardTitle>
                    <CardDescription>
                        We&apos;ve sent a verification link to your email address.
                        Please click the link to verify your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {message && (
                        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-red-500/10 text-red-500'
                            }`}>
                            {message.type === 'success' && <CheckCircle className="h-4 w-4" />}
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Button
                            onClick={handleCheckVerification}
                            className="w-full"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <CheckCircle className="h-4 w-4 mr-2" />
                            )}
                            I&apos;ve Verified My Email
                        </Button>

                        <Button
                            onClick={handleResendEmail}
                            variant="outline"
                            className="w-full"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Mail className="h-4 w-4 mr-2" />
                            )}
                            Resend Verification Email
                        </Button>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleSignOut}
                        variant="ghost"
                        className="w-full text-muted-foreground"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
