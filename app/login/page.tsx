'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, Loader2 } from 'lucide-react'
import { OAuthButtons } from '@/components/auth/oauth-buttons'
import { TurnstileCaptcha, TurnstileCaptchaRef } from '@/components/auth/turnstile-captcha'

export default function LoginPage() {
    const [isPending, startTransition] = useTransition()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [captchaToken, setCaptchaToken] = useState<string | null>(null)

    const router = useRouter()
    const captchaRef = useRef<TurnstileCaptchaRef>(null)
    const supabase = createSupabaseBrowserClient()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Check captcha if Turnstile is enabled
        const hasTurnstile = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
        if (hasTurnstile && !captchaToken) {
            setError('Please complete the captcha verification')
            return
        }

        startTransition(async () => {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
                options: {
                    captchaToken: (captchaToken && captchaToken !== 'development-token') ? captchaToken : undefined,
                },
            })

            if (error) {
                setError(error.message)
                captchaRef.current?.reset()
                setCaptchaToken(null)
            } else {
                router.push('/dashboard')
                router.refresh()
            }
        })
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Welcome back</CardTitle>
                    <CardDescription>
                        Login to your account to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <OAuthButtons mode="login" />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-sm text-primary underline-offset-4 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="flex justify-center">
                            <TurnstileCaptcha
                                ref={captchaRef}
                                onVerify={(token) => {
                                    setCaptchaToken(token)
                                    setError(null)
                                }}
                                onError={() => setError('Captcha verification failed')}
                                onExpire={() => setCaptchaToken(null)}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
