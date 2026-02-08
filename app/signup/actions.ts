'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function signup(prevState: any, formData: FormData): Promise<{ error: string | null; success: boolean; email: string | null; }> {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const captchaToken = formData.get('captchaToken') as string
    const headerList = await headers()
    const origin = headerList.get('origin')

    // Default to a safe fallback if origin is missing (e.g. strict server environment)
    // but usually in Next.js it's available.
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin || 'http://localhost:3000'

    if (!email || !password) {
        return { error: 'Email and password are required', success: false, email: null }
    }

    // Initialize Supabase Client
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${siteUrl}/auth/callback`,
            captchaToken,
        },
    })

    if (error) {
        if (error.message.includes('already registered') || error.message.includes('unique constraint')) {
            return { error: 'This email is already registered. Please log in instead.', success: false, email: null }
        }
        return { error: error.message, success: false, email: null }
    }

    return { success: true, email, error: null }
}
