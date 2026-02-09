'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function enrollMFA() {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
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

    const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/profile')
    return { success: true }
}

export async function unenrollMFA(factorId: string) {
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase.auth.mfa.unenroll({
        factorId,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/profile')
    return { success: true }
}

export async function getMFAFactors() {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.mfa.listFactors()

    if (error) {
        return { error: error.message }
    }

    return { data }
}
