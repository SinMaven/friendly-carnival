export const dynamic = 'force-dynamic'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AvatarUploader } from '@/components/account/avatar-uploader'
import { ChangePasswordForm } from '@/components/account/change-password-form'
import { DeleteAccountButton } from '@/components/account/delete-account-button'
import { MFASettings } from '@/components/account/mfa-settings'
import { ShareProfileButton } from '@/components/account/share-profile-button'
import { User, Shield, Trash2 } from 'lucide-react'

export default async function ProfilePage() {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Unauthorized</div>
    }

    // Get user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="max-w-2xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Profile</h1>
                    <p className="text-muted-foreground">Manage your account settings</p>
                </div>
                {profile?.username && (
                    <ShareProfileButton username={profile.username} />
                )}
            </div>

            {/* Profile Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile Information
                    </CardTitle>
                    <CardDescription>
                        Your public profile information
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <AvatarUploader
                        currentUrl={profile?.avatar_url}
                        fallback={profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    />

                    <div className="grid gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Username</label>
                            <p className="text-lg">{profile?.username || 'Not set'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <p className="text-lg">{user.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                            <p className="text-lg">
                                {new Date(user.created_at).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Security */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security
                    </CardTitle>
                    <CardDescription>
                        Manage your password and security settings
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ChangePasswordForm />
                    <Separator />
                    <MFASettings />
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <Trash2 className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                        Permanent actions that cannot be undone
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DeleteAccountButton userEmail={user.email || ''} />
                </CardContent>
            </Card>
        </div>
    )
}
