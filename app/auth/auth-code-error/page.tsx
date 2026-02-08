'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, ArrowLeft, Mail, Key, RefreshCw } from 'lucide-react'

// Error type definitions with user-friendly messages
const ERROR_MESSAGES: Record<string, { title: string; description: string; action?: string; actionLink?: string }> = {
    // Multiple accounts with same email
    'multiple accounts': {
        title: 'Account Already Exists',
        description: 'An account with this email already exists using a different sign-in method. Please sign in with your original method (email/password or the OAuth provider you first used).',
        action: 'Sign in with Email',
        actionLink: '/login',
    },
    'linking domain': {
        title: 'Account Already Exists',
        description: 'An account with this email already exists using a different sign-in method. Please sign in with your original method (email/password or the OAuth provider you first used).',
        action: 'Sign in with Email',
        actionLink: '/login',
    },
    // Email not confirmed
    'email not confirmed': {
        title: 'Email Not Verified',
        description: 'Please verify your email address before signing in. Check your inbox for a verification link.',
        action: 'Resend Verification',
        actionLink: '/auth/verify-email',
    },
    // Invalid or expired link
    'invalid': {
        title: 'Invalid Link',
        description: 'This link is invalid or has expired. Please request a new one.',
        action: 'Try Again',
        actionLink: '/login',
    },
    'expired': {
        title: 'Link Expired',
        description: 'This link has expired. Please request a new one.',
        action: 'Try Again',
        actionLink: '/login',
    },
    // OAuth errors
    'access_denied': {
        title: 'Access Denied',
        description: 'You cancelled the sign-in process or denied access. Please try again if this was unintentional.',
        action: 'Try Again',
        actionLink: '/login',
    },
    'server_error': {
        title: 'Authentication Error',
        description: 'There was a problem with the authentication service. This may be due to an account conflict. Try signing in with a different method.',
        action: 'Sign in with Email',
        actionLink: '/login',
    },
    // Rate limiting
    'rate limit': {
        title: 'Too Many Attempts',
        description: 'Too many sign-in attempts. Please wait a few minutes before trying again.',
    },
    // Default fallback
    'default': {
        title: 'Authentication Error',
        description: 'Something went wrong during authentication. Please try again.',
        action: 'Back to Login',
        actionLink: '/login',
    },
}

function getErrorInfo(errorDescription: string | null, errorCode: string | null) {
    const searchText = (errorDescription || errorCode || '').toLowerCase()

    // Check each error key against the search text
    for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
        if (key !== 'default' && searchText.includes(key)) {
            return value
        }
    }

    return ERROR_MESSAGES.default
}

export default function AuthCodeErrorPage() {
    const [errorInfo, setErrorInfo] = useState(ERROR_MESSAGES.default)
    const [rawError, setRawError] = useState<string | null>(null)

    useEffect(() => {
        // Parse error from URL hash (OAuth errors come in hash)
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash)

        // Also check query params
        const searchParams = new URLSearchParams(window.location.search)

        const errorCode = params.get('error_code') || params.get('error') || searchParams.get('error')
        const errorDescription = params.get('error_description') || searchParams.get('error_description')

        // Decode the error description (it may be double-encoded)
        const decodedDescription = errorDescription
            ? decodeURIComponent(decodeURIComponent(errorDescription))
            : null

        setRawError(decodedDescription || errorCode)
        setErrorInfo(getErrorInfo(decodedDescription, errorCode))
    }, [])

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                    </div>
                    <CardTitle className="text-2xl">{errorInfo.title}</CardTitle>
                    <CardDescription className="text-base">
                        {errorInfo.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Helpful tips for account conflicts */}
                    {errorInfo.title === 'Account Already Exists' && (
                        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                            <p className="text-sm font-medium">How to resolve this:</p>
                            <ul className="text-sm text-muted-foreground space-y-2">
                                <li className="flex items-start gap-2">
                                    <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span>If you signed up with email, use <strong>email/password</strong> to log in</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Key className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span>If you forgot your password, use <strong>Forgot Password</strong> to reset it</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <RefreshCw className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span>You can link OAuth providers later in account settings</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                    {errorInfo.action && errorInfo.actionLink && (
                        <Button asChild className="w-full">
                            <Link href={errorInfo.actionLink}>{errorInfo.action}</Link>
                        </Button>
                    )}
                    <Button variant="ghost" asChild className="w-full">
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Home
                        </Link>
                    </Button>

                    {/* Debug info for development */}
                    {process.env.NODE_ENV === 'development' && rawError && (
                        <details className="w-full text-xs text-muted-foreground">
                            <summary className="cursor-pointer">Debug Info</summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                                {rawError}
                            </pre>
                        </details>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
