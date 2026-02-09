'use server'

import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { checkRateLimit } from '@/lib/ratelimit';
import { logAuthEvent, logSecurityEvent } from '@/lib/audit-logger';
import { AuditEventTypes } from '@/lib/audit-events';

// Validation schemas
const factorIdSchema = z.string().uuid('Invalid factor ID');
const mfaCodeSchema = z.string().length(6, 'Code must be 6 digits').regex(/^\d+$/, 'Code must contain only numbers');

export async function enrollMFA() {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Rate limiting: 5 enroll attempts per hour
    const { success: rateLimitOk } = await checkRateLimit('standard', `mfa:enroll:${user.id}`);
    if (!rateLimitOk) {
        await logSecurityEvent(AuditEventTypes.SECURITY.RATE_LIMIT_EXCEEDED, {
            userId: user.id,
            payloadDiff: { context: 'mfa_enroll' },
        });
        return { error: 'Too many attempts. Please try again later.' }
    }

    const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
    })

    if (error) {
        return { error: error.message }
    }

    return { data }
}

export async function verifyMFA(factorId: string, code: string) {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Rate limiting: 10 verify attempts per 5 minutes
    const { success: rateLimitOk } = await checkRateLimit('login', `mfa:verify:${user.id}`);
    if (!rateLimitOk) {
        await logSecurityEvent(AuditEventTypes.SECURITY.RATE_LIMIT_EXCEEDED, {
            userId: user.id,
            payloadDiff: { context: 'mfa_verify' },
        });
        return { error: 'Too many attempts. Please try again later.' }
    }

    // Validate inputs
    const factorValidation = factorIdSchema.safeParse(factorId);
    if (!factorValidation.success) {
        return { error: 'Invalid factor ID' }
    }

    const codeValidation = mfaCodeSchema.safeParse(code);
    if (!codeValidation.success) {
        return { error: codeValidation.error.issues[0].message }
    }

    const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code,
    })

    if (error) {
        await logAuthEvent(AuditEventTypes.AUTH.MFA_CHALLENGE_FAILED, {
            userId: user.id,
            payloadDiff: { factor_id: factorId },
        });
        return { error: error.message }
    }

    // Audit log
    await logAuthEvent(AuditEventTypes.AUTH.MFA_ENABLED, {
        userId: user.id,
        payloadDiff: { factor_id: factorId },
    });

    revalidatePath('/dashboard/profile')
    return { success: true }
}

export async function unenrollMFA(factorId: string) {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Rate limiting: 5 unenroll attempts per hour
    const { success: rateLimitOk } = await checkRateLimit('standard', `mfa:unenroll:${user.id}`);
    if (!rateLimitOk) {
        await logSecurityEvent(AuditEventTypes.SECURITY.RATE_LIMIT_EXCEEDED, {
            userId: user.id,
            payloadDiff: { context: 'mfa_unenroll' },
        });
        return { error: 'Too many attempts. Please try again later.' }
    }

    // Validate factor ID
    const factorValidation = factorIdSchema.safeParse(factorId);
    if (!factorValidation.success) {
        return { error: 'Invalid factor ID' }
    }

    const { error } = await supabase.auth.mfa.unenroll({
        factorId,
    })

    if (error) {
        return { error: error.message }
    }

    // Audit log
    await logAuthEvent(AuditEventTypes.AUTH.MFA_DISABLED, {
        userId: user.id,
        payloadDiff: { factor_id: factorId },
    });

    revalidatePath('/dashboard/profile')
    return { success: true }
}

export async function getMFAFactors() {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { data, error } = await supabase.auth.mfa.listFactors()

    if (error) {
        return { error: error.message }
    }

    return { data }
}
