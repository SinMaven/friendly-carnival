'use server'

import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/ratelimit';
import { logAuthEvent, logSecurityEvent } from '@/lib/audit-logger';
import { AuditEventTypes } from '@/lib/audit-events';

export type ChangePasswordResult = {
    success: boolean
    message: string
}

// Validation schema
const changePasswordSchema = z.object({
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password too long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

/**
 * Changes the user's password.
 * 
 * Security: This uses Supabase's updateUser method which requires the user
 * to be authenticated. Rate limited to 3 attempts per hour.
 */
export async function changePassword(
    newPassword: string,
    confirmPassword: string
): Promise<ChangePasswordResult> {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.id) {
        return { success: false, message: 'Unauthorized' }
    }

    // Rate limiting: 3 password changes per hour per user
    const { success: rateLimitOk } = await checkRateLimit('strict', `password:change:${user.id}`);
    if (!rateLimitOk) {
        await logSecurityEvent(AuditEventTypes.SECURITY.RATE_LIMIT_EXCEEDED, {
            userId: user.id,
            payloadDiff: { context: 'password_change' },
        });
        return { success: false, message: 'Too many password change attempts. Please try again later.' }
    }

    // Validate input
    const validation = changePasswordSchema.safeParse({ newPassword, confirmPassword });
    if (!validation.success) {
        const message = validation.error.issues[0]?.message || 'Invalid input';
        return { success: false, message };
    }

    // Update password
    const { error } = await supabase.auth.updateUser({
        password: newPassword
    })

    if (error) {
        console.error('Password change error:', error)
        await logAuthEvent(AuditEventTypes.AUTH.LOGIN_FAILED, {
            userId: user.id,
            payloadDiff: { context: 'password_change_failed', error: error.message },
        });
        return { success: false, message: error.message }
    }

    // Audit log
    await logAuthEvent(AuditEventTypes.AUTH.PASSWORD_CHANGED, {
        userId: user.id,
    });

    return { success: true, message: 'Password updated successfully' }
}
