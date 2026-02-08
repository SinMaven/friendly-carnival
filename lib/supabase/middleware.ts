import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that don't require authentication at all
const publicRoutes = ['/login', '/signup', '/auth', '/pricing', '/', '/api/webhook']

// Routes that are allowed even if email is not verified (but user is logged in)
// We generally want to allow them to access the homepage, but force verification for app features.
const unverifiedAllowedRoutes = ['/auth/verify-email', '/auth/callback', '/auth/signout', '/login', '/signup', '/']

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, {
                            ...options,
                            // Ensure proper session persistence
                            maxAge: 60 * 60 * 24 * 30, // 30 days
                            sameSite: 'lax',
                            secure: process.env.NODE_ENV === 'production',
                        })
                    )
                },
            },
        }
    )

    // specific to Next.js 15 / Supabase SSR:
    // Do not run Supabase code on static routes
    if (request.nextUrl.pathname.startsWith('/_next')) {
        return supabaseResponse
    }

    // IMPORTANT: getUser() refreshes the session if needed
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    // Check if route is public
    const isPublicRoute = publicRoutes.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    )

    // 1. No user and trying to access protected route
    if (!user && !isPublicRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        // Add ?next= param to redirect back after login
        url.searchParams.set('next', pathname)
        return NextResponse.redirect(url)
    }


    // 2. User exists but email not verified
    if (user && !user.email_confirmed_at) {
        const isAllowedForUnverified = unverifiedAllowedRoutes.some(route =>
            pathname === route || pathname.startsWith(`${route}/`)
        )

        if (!isAllowedForUnverified) {
            // Force redirect to verify-email page
            const url = request.nextUrl.clone()
            url.pathname = '/auth/verify-email'
            // Keep the return URL? Maybe, but usually verification flow is fixed.
            return NextResponse.redirect(url)
        }
    }

    // 3. Authenticated user on auth pages (login/signup) -> redirect to dashboard
    if (user && (pathname === '/login' || pathname === '/signup')) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
