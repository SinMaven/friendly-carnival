export const dynamic = 'force-dynamic'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/account/profile-form'

export default async function ProfilePage() {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

    if (!profile) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Profile not found</p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Profile</h1>
                <p className="text-muted-foreground">Manage your public profile</p>
            </div>
            <ProfileForm profile={profile} />
        </div>
    )
}
