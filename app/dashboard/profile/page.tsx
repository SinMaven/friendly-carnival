export const dynamic = 'force-dynamic'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ProfileForm } from '@/components/account/profile-form'
import { ShareProfileButton } from '@/components/account/share-profile-button'
import { Trophy, Flag, Crosshair, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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

    // Get team membership
    const { data: teamMembership } = await supabase
        .from('team_members')
        .select('role, teams(name, slug, avatar_url)')
        .eq('user_id', user.id)
        .maybeSingle()

    const team = teamMembership?.teams ? (teamMembership.teams as unknown as { name: string; slug: string; avatar_url: string | null }) : null

    return (
        <div className="max-w-2xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Profile</h1>
                    <p className="text-muted-foreground">Manage your public profile information</p>
                </div>
                {profile?.username && (
                    <ShareProfileButton username={profile.username} />
                )}
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Rank
                        </CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">#{profile?.rank || '-'}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Points
                        </CardTitle>
                        <Crosshair className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{profile?.total_points || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Solves
                        </CardTitle>
                        <Flag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{profile?.total_solves || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Team Info */}
            {team && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Team
                        </CardTitle>
                        <CardDescription>
                            You are a member of <strong>{team.name}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={team.avatar_url || undefined} />
                                    <AvatarFallback>{team.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-lg">{team.name}</p>
                                    <p className="text-sm text-muted-foreground capitalize">{teamMembership?.role}</p>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/team">View Team</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            <ProfileForm
                user={{
                    id: user.id,
                    username: profile?.username || '',
                    full_name: profile?.full_name,
                    avatar_url: profile?.avatar_url,
                    bio: profile?.bio,
                    website: profile?.website
                }}
            />
        </div>
    )
}
