'use client'
import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save, Bell, Shield, User, Trash2 } from 'lucide-react'
import { updateSettings } from '@/features/account/actions/update-settings'
import { AvatarUploader } from './avatar-uploader'
import { ChangePasswordForm } from './change-password-form'
import { MFASettings } from './mfa-settings'
import { DeleteAccountButton } from './delete-account-button'

interface SettingsFormProps {
    initialSettings: {
        notification_email: boolean
        notification_solves: boolean
        notification_leaderboard: boolean
    }
    user: {
        id: string
        email: string
        avatar_url?: string | null
        full_name?: string | null
        username: string
        bio?: string | null
        website?: string | null
        mfa_enabled: boolean
    }
}

export function SettingsForm({ initialSettings, user }: SettingsFormProps) {
    const [isPending, startTransition] = useTransition()
    const [settings, setSettings] = useState(initialSettings)
    const [profileData, setProfileData] = useState({
        username: user.username,
        full_name: user.full_name || '',
        email: user.email,
        bio: user.bio || '',
        website: user.website || '',
    })
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const handleSave = () => {
        startTransition(async () => {
            const result = await updateSettings({ ...settings, ...profileData })
            if (!result.success) {
                setMessage({ type: 'error', text: result.message })
            } else {
                setMessage({ type: 'success', text: result.message })
                setTimeout(() => setMessage(null), 3000)
            }
        })
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile
                    </CardTitle>
                    <CardDescription>Manage your public profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Profile Picture</Label>
                        <AvatarUploader
                            currentUrl={user.avatar_url}
                            fallback={user.email.charAt(0).toUpperCase()}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="Username"
                                value={profileData.username}
                                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                                id="full_name"
                                placeholder="Full Name"
                                value={profileData.full_name}
                                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email Address"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">Changing your email will require verification.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            placeholder="Tell us about yourself..."
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            className="resize-none"
                            rows={3}
                        />
                        <p className="text-xs text-muted-foreground">Brief description for your profile.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                            id="website"
                            type="url"
                            placeholder="https://yourwebsite.com"
                            value={profileData.website}
                            onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                    </CardTitle>
                    <CardDescription>Configure how you receive updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive updates via email</p>
                        </div>
                        <Switch
                            id="email-notifications"
                            checked={settings.notification_email}
                            onCheckedChange={(checked) => setSettings({ ...settings, notification_email: checked })}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="solve-notifications">Solve Alerts</Label>
                            <p className="text-sm text-muted-foreground">Get notified when you solve a challenge</p>
                        </div>
                        <Switch
                            id="solve-notifications"
                            checked={settings.notification_solves}
                            onCheckedChange={(checked) => setSettings({ ...settings, notification_solves: checked })}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="leaderboard-notifications">Leaderboard Updates</Label>
                            <p className="text-sm text-muted-foreground">Get notified about ranking changes</p>
                        </div>
                        <Switch
                            id="leaderboard-notifications"
                            checked={settings.notification_leaderboard}
                            onCheckedChange={(checked) => setSettings({ ...settings, notification_leaderboard: checked })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security
                    </CardTitle>
                    <CardDescription>Manage your security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Change Password</p>
                            <p className="text-sm text-muted-foreground">Update your account password</p>
                        </div>
                        <ChangePasswordForm />
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                        <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                        <div className="border rounded-lg p-0 overflow-hidden">
                            <MFASettings />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {message && (
                <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isPending}>
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Notifications
                </Button>
            </div>

            <Card className="border-destructive/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <Trash2 className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Delete Account</p>
                            <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                        </div>
                        <DeleteAccountButton userEmail={user.email} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
