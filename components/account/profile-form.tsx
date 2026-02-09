'use client'
import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save, User } from 'lucide-react'
import { updateSettings } from '@/features/account/actions/update-settings'
import { AvatarUploader } from './avatar-uploader'

interface ProfileFormProps {
    user: {
        id: string
        username: string
        full_name?: string | null
        avatar_url?: string | null
        bio?: string | null
        website?: string | null
    }
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState({
        username: user.username,
        full_name: user.full_name || '',
        bio: user.bio || '',
        website: user.website || '',
    })
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const handleSave = () => {
        startTransition(async () => {
            const result = await updateSettings({
                username: formData.username,
                full_name: formData.full_name,
                bio: formData.bio,
                website: formData.website,
            })

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
                        Public Profile
                    </CardTitle>
                    <CardDescription>Manage how others see you on the platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Profile Picture</Label>
                        <AvatarUploader
                            currentUrl={user.avatar_url}
                            fallback={user.username.charAt(0).toUpperCase()}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                                id="full_name"
                                placeholder="Full Name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            placeholder="Tell us about yourself..."
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={isPending}>
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Save Profile
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
