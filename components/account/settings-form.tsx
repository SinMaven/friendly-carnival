'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Loader2, Save, Bell, Shield } from 'lucide-react'
import { updateSettings } from '@/features/account/actions/update-settings'

interface SettingsFormProps {
    initialSettings: {
        notification_email: boolean
        notification_solves: boolean
        notification_leaderboard: boolean
    }
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [isPending, startTransition] = useTransition()
    const [settings, setSettings] = useState(initialSettings)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const handleSave = () => {
        startTransition(async () => {
            const result = await updateSettings(settings)
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
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Change Password</p>
                            <p className="text-sm text-muted-foreground">Update your account password</p>
                        </div>
                        <Button variant="outline" size="sm" disabled>Change</Button>
                    </div>
                </CardContent>
            </Card>

            {message && (
                <div className={`p-3  text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isPending}>
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Settings
                </Button>
            </div>
        </div>
    )
}
