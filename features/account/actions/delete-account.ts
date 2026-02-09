'use server'

import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { checkRateLimit } from '@/lib/ratelimit';
import { logSecurityEvent, logUserEvent } from '@/lib/audit-logger';
import { AuditEventTypes } from '@/lib/audit-events';

export type DeleteAccountResult = {
    success: boolean
    message: string
}

// Email validation schema
const emailSchema = z.string().email('Invalid email format');

/**
 * Permanently deletes a user account.
 * 
 * Security: This uses the Supabase Admin API to delete the user.
 * The SUPABASE_SECRET_KEY (service role key) is required for this operation.
 * Email confirmation is required to prevent accidental deletion.
 * Rate limited to 3 attempts per day.
 */
export async function deleteAccount(
    confirmEmail: string
): Promise<DeleteAccountResult> {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.id) {
        return { success: false, message: 'Unauthorized' }
    }

    // Rate limiting: 3 account deletion attempts per day per user
    const { success: rateLimitOk } = await checkRateLimit('strict', `account:delete:${user.id}`);
    if (!rateLimitOk) {
        await logSecurityEvent(AuditEventTypes.SECURITY.RATE_LIMIT_EXCEEDED, {
            userId: user.id,
            payloadDiff: { context: 'account_deletion' },
        });
        return { success: false, message: 'Too many deletion attempts. Please try again later.' }
    }

    // Validate email format
    const emailValidation = emailSchema.safeParse(confirmEmail);
    if (!emailValidation.success) {
        return { success: false, message: 'Invalid email format' }
    }

    // Verify email confirmation
    if (confirmEmail !== user.email) {
        return { success: false, message: 'Email confirmation does not match' }
    }

    if (!process.env.SUPABASE_SECRET_KEY) {
        console.error('SUPABASE_SECRET_KEY is not defined')
        return { success: false, message: 'Server configuration error. Please contact support.' }
    }

    // Audit log before deletion
    await logUserEvent(AuditEventTypes.USER.DELETED, {
        userId: user.id,
        payloadDiff: { email: user.email },
    });

    // Use admin client for user deletion
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )

    // Delete the user using admin API
    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    if (error) {
        console.error('Account deletion error:', error)
        return { success: false, message: error.message || 'Failed to delete account' }
    }

    // Clear session cookies
    const cookieStore = await cookies()
    cookieStore.getAll().forEach(cookie => {
        if (cookie.name.includes('supabase')) {
            cookieStore.delete(cookie.name)
        }
    })

    return { success: true, message: 'Account deleted successfully' }
}
