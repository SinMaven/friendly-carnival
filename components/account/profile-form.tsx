'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Save } from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/types'

interface ProfileFormProps {
    profile: Tables<'profiles'>
}

export function ProfileForm({ profile }: ProfileFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        website: profile.website || '',
        github_handle: profile.github_handle || '',
    })
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const supabase = createSupabaseBrowserClient()

        startTransition(async () => {
            const { error } = await supabase
                .from('profiles')
                .update(formData)
                .eq('id', profile.id)

            if (error) {
                setMessage({ type: 'error', text: error.message })
            } else {
                setMessage({ type: 'success', text: 'Profile updated successfully!' })
                router.refresh() // Refresh to show updated data
            }
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your public profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={profile.avatar_url || undefined} />
                            <AvatarFallback className="text-2xl">
                                {profile.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{profile.username}</p>
                            <p className="text-sm text-muted-foreground">
                                Rank #{profile.rank || 'Unranked'} • {profile.total_points || 0} points
                            </p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                                id="full_name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Tell us about yourself..."
                            rows={3}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                type="url"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="github_handle">GitHub Handle</Label>
                            <Input
                                id="github_handle"
                                value={formData.github_handle}
                                onChange={(e) => setFormData({ ...formData, github_handle: e.target.value })}
                                placeholder="username"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`p-3  text-sm ${message.type === 'success'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-red-500/10 text-red-500'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Changes
                    </Button>
                </CardContent>
            </Card>
        </form>
    )
}
