'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export type DeleteAccountResult = {
    success: boolean
    message: string
}

/**
 * Permanently deletes a user account.
 * 
 * Security: This uses the Supabase Admin API to delete the user.
 * The SUPABASE_SECRET_KEY (service role key) is required for this operation.
 * Email confirmation is required to prevent accidental deletion.
 */
export async function deleteAccount(
    confirmEmail: string
): Promise<DeleteAccountResult> {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.id) {
        return { success: false, message: 'Unauthorized' }
    }

    // Verify email confirmation
    if (confirmEmail !== user.email) {
        return { success: false, message: 'Email confirmation does not match' }
    }

    if (!process.env.SUPABASE_SECRET_KEY) {
        console.error('SUPABASE_SECRET_KEY is not defined')
        return { success: false, message: 'Server configuration error. Please contact support.' }
    }

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
