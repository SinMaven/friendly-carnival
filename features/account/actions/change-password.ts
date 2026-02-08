'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

export type ChangePasswordResult = {
    success: boolean
    message: string
}

/**
 * Changes the user's password.
 * 
 * Security: This uses Supabase's updateUser method which requires the user
 * to be authenticated. The password is validated on the client and server.
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

    // Validate passwords match
    if (newPassword !== confirmPassword) {
        return { success: false, message: 'Passwords do not match' }
    }

    // Validate password length
    if (newPassword.length < 8) {
        return { success: false, message: 'Password must be at least 8 characters' }
    }

    // Update password
    const { error } = await supabase.auth.updateUser({
        password: newPassword
    })

    if (error) {
        console.error('Password change error:', error)
        return { success: false, message: error.message }
    }

    return { success: true, message: 'Password updated successfully' }
}
