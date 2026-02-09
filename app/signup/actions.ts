'use server'

import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { checkRateLimit } from '@/lib/ratelimit';
import { logUserEvent } from '@/lib/audit-logger';
import { AuditEventTypes } from '@/lib/audit-events';

// Validation schema
const signupSchema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(128, 'Password too long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

export async function signup(
    _prevState: unknown,
    formData: FormData
): Promise<{ error: string | null; success: boolean; email: string | null; }> {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const captchaToken = formData.get('captchaToken') as string
    const headerList = await headers()
    const origin = headerList.get('origin')

    // Get IP for rate limiting
    const forwardedFor = headerList.get('x-forwarded-for');
    const realIp = headerList.get('x-real-ip');
    const cfIp = headerList.get('cf-connecting-ip');
    const ip = cfIp || realIp || forwardedFor?.split(',')[0]?.trim() || 'unknown';

    // Rate limiting: 5 signup attempts per hour per IP
    const { success: rateLimitOk } = await checkRateLimit('standard', `signup:${ip}`);
    if (!rateLimitOk) {
        return { error: 'Too many signup attempts. Please try again later.', success: false, email: null }
    }

    // Validate input
    const validation = signupSchema.safeParse({ email, password });
    if (!validation.success) {
        const message = validation.error.issues[0]?.message || 'Invalid input';
        return { error: message, success: false, email: null }
    }

    // Default to a safe fallback if origin is missing
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin || 'http://localhost:3000'

    if (!email || !password) {
        return { error: 'Email and password are required', success: false, email: null }
    }

    // Initialize Supabase Client
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase.auth.signUp({
        email: validation.data.email,
        password: validation.data.password,
        options: {
            emailRedirectTo: `${siteUrl}/auth/callback`,
            captchaToken: captchaToken === 'development-token' ? undefined : captchaToken,
        },
    })

    // Check for "silent" duplicate registration (when email enumeration protection is on)
    if (data.user && data.user.identities && data.user.identities.length === 0) {
        return { error: 'This email is already registered. Please log in instead.', success: false, email: null }
    }

    if (error) {
        if (error.message.includes('already registered') || error.message.includes('unique constraint')) {
            return { error: 'This email is already registered. Please log in instead.', success: false, email: null }
        }
        return { error: error.message, success: false, email: null }
    }

    // Audit log
    if (data.user) {
        await logUserEvent(AuditEventTypes.USER.CREATED, {
            userId: data.user.id,
            payloadDiff: { email: validation.data.email },
        });
    }

    return { success: true, email: validation.data.email, error: null }
}
