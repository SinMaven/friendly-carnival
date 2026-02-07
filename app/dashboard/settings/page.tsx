'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Settings, Bell, Shield, Palette } from 'lucide-react'

export default function SettingsPage() {
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [solveNotifications, setSolveNotifications] = useState(true)
    const [leaderboardNotifications, setLeaderboardNotifications] = useState(false)

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences</p>
            </div>

            {/* Notifications */}
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
                            <p className="text-sm text-muted-foreground">
                                Receive updates via email
                            </p>
                        </div>
                        <Switch
                            id="email-notifications"
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="solve-notifications">Solve Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                                Get notified when you solve a challenge
                            </p>
                        </div>
                        <Switch
                            id="solve-notifications"
                            checked={solveNotifications}
                            onCheckedChange={setSolveNotifications}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="leaderboard-notifications">Leaderboard Updates</Label>
                            <p className="text-sm text-muted-foreground">
                                Get notified about ranking changes
                            </p>
                        </div>
                        <Switch
                            id="leaderboard-notifications"
                            checked={leaderboardNotifications}
                            onCheckedChange={setLeaderboardNotifications}
                        />
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
                    <CardDescription>Manage your security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Change Password</p>
                            <p className="text-sm text-muted-foreground">
                                Update your account password
                            </p>
                        </div>
                        <Button variant="outline" size="sm">
                            Change
                        </Button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-muted-foreground">
                                Add an extra layer of security
                            </p>
                        </div>
                        <Button variant="outline" size="sm">
                            Enable
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Delete Account</p>
                            <p className="text-sm text-muted-foreground">
                                Permanently delete your account and all data
                            </p>
                        </div>
                        <Button variant="destructive" size="sm">
                            Delete
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
