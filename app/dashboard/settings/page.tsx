export const dynamic = 'force-dynamic'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/account/settings-form'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('notification_email, notification_solves, notification_leaderboard, avatar_url, full_name, username, bio, website, mfa_enabled')
        .eq('id', user?.id)
        .single()

    const initialSettings = {
        notification_email: profile?.notification_email ?? true,
        notification_solves: profile?.notification_solves ?? true,
        notification_leaderboard: profile?.notification_leaderboard ?? false,
    }

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences</p>
            </div>

            <SettingsForm
                initialSettings={initialSettings}
                user={{
                    id: user.id,
                    email: user.email!,
                    avatar_url: profile?.avatar_url,
                    full_name: profile?.full_name,
                    username: profile?.username || 'User',
                    bio: profile?.bio,
                    website: profile?.website,
                    mfa_enabled: profile?.mfa_enabled || false
                }}
            />
        </div>
    )
}

