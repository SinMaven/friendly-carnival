export const dynamic = 'force-dynamic'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/account/settings-form'

export default async function SettingsPage() {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
        .from('profiles')
        .select('notification_email, notification_solves, notification_leaderboard')
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

            <SettingsForm initialSettings={initialSettings} />
        </div>
    )
}

