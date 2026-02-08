import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin, hash } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    const errorCode = searchParams.get('error_code')

    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard'

    // Handle OAuth errors passed as query params
    if (error || errorCode) {
        const errorParams = new URLSearchParams()
        if (error) errorParams.set('error', error)
        if (errorCode) errorParams.set('error_code', errorCode)
        if (errorDescription) errorParams.set('error_description', errorDescription)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?${errorParams.toString()}`)
    }

    if (code) {
        const supabase = await createSupabaseServerClient()
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (!exchangeError) {
            return NextResponse.redirect(`${origin}${next}`)
        }

        // Pass exchange error details to error page
        const errorParams = new URLSearchParams()
        errorParams.set('error', 'exchange_failed')
        errorParams.set('error_description', exchangeError.message)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?${errorParams.toString()}`)
    }

    // No code and no error - something went wrong
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=missing_code`)
}

