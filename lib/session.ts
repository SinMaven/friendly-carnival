
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { User } from '@supabase/supabase-js'

export async function requireUser(): Promise<User> {
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login')
    }

    if (!user.email_confirmed_at) {
        redirect('/auth/verify-email')
    }

    return user
}
