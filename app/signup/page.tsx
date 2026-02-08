'use client'

import { useState, useRef, useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { OAuthButtons } from '@/components/auth/oauth-buttons'
import { TurnstileCaptcha, TurnstileCaptchaRef } from '@/components/auth/turnstile-captcha'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { signup } from './actions'

const initialState = {
    error: null,
    success: false,
    email: null
}

export default function SignupPage() {
    const [state, formAction, isPending] = useActionState(signup, initialState)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [captchaToken, setCaptchaToken] = useState<string | null>(null)
    const captchaRef = useRef<TurnstileCaptchaRef>(null)
    const router = useRouter()

    useEffect(() => {
        if (state?.error) {
            captchaRef.current?.reset()
            setCaptchaToken(null)
        }
    }, [state])

    // If success, show confirmation UI
    if (state?.success) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <Card className="w-full max-w-sm">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl">Check Your Email</CardTitle>
                        <CardDescription>
                            We&apos;ve sent a verification link to <strong>{state.email || email}</strong>.
                            Please click the link to verify your account.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex flex-col gap-2">
                        <Button onClick={() => router.push('/login')} className="w-full">
                            Go to Login
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => { window.location.reload() }}
                            className="w-full"
                        >
                            Use Different Email
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>
                        Create an account to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* OAuth Providers */}
                    <OAuthButtons mode="signup" />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    {/* Email/Password Form */}
                    <form action={formAction} className="grid gap-4">
                        {state?.error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <span>{typeof state.error === 'string' ? state.error : JSON.stringify(state.error)}</span>
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Must be at least 6 characters
                            </p>
                        </div>

                        {/* Hidden input for Turnstile token */}
                        <input type="hidden" name="captchaToken" value={captchaToken || ''} />

                        {/* Turnstile Captcha */}
                        <TurnstileCaptcha
                            ref={captchaRef}
                            onVerify={(token) => setCaptchaToken(token)}
                            onError={() => setCaptchaToken(null)}
                            onExpire={() => setCaptchaToken(null)}
                        />

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
