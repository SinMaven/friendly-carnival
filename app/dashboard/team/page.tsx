export const dynamic = 'force-dynamic'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CreateTeamForm } from '@/components/teams/create-team-form'
import { JoinTeamForm } from '@/components/teams/join-team-form'
import { InviteCodeGenerator } from '@/components/teams/invite-code-generator'
import { TeamMemberList } from '@/components/teams/team-member-list'
import { LeaveTeamButton } from '@/components/teams/leave-team-button'
import { TeamSettings } from '@/components/teams/team-settings'
import { Crown } from 'lucide-react'

export default async function TeamPage() {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Unauthorized</div>
    }

    // Get user's team membership
    const { data: membership } = await supabase
        .from('team_members')
        .select('team_id, role')
        .eq('user_id', user.id)
        .maybeSingle()

    let team = null
    const teamId = membership?.team_id

    if (teamId) {
        const { data: teamData } = await supabase
            .from('teams')
            .select('*')
            .eq('id', teamId)
            .single()

        team = teamData
    }

    const isCaptain = team?.captain_id === user.id

    // Get team members if in a team
    let members: { id: string, user_id: string, role: string, profile: any }[] = []
    let teamStats = { totalPoints: 0, totalSolves: 0 }

    if (team) {
        const { data } = await supabase
            .from('team_members')
            .select(`
                id,
                user_id,
                role,
                profiles (
                    id,
                    username,
                    avatar_url,
                    total_points,
                    total_solves
                )
            `)
            .eq('team_id', teamId)

        members = (data || []).map(m => ({
            id: m.id,
            user_id: m.user_id,
            role: m.role,
            profile: m.profiles
        }))

        // Calculate team stats
        teamStats = members.reduce((acc, m) => ({
            totalPoints: acc.totalPoints + (m.profile?.total_points || 0),
            totalSolves: acc.totalSolves + (m.profile?.total_solves || 0)
        }), { totalPoints: 0, totalSolves: 0 })
    }

    return (
        <div className="max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Team</h1>
                <p className="text-muted-foreground">Manage your team and members</p>
            </div>

            {team ? (
                <>
                    {/* Team Info Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={team.avatar_url} />
                                        <AvatarFallback className="text-xl">
                                            {team.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            {team.name}
                                            {isCaptain && (
                                                <Badge variant="secondary">
                                                    <Crown className="h-3 w-3 mr-1" />
                                                    Captain
                                                </Badge>
                                            )}
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            Created {new Date(team.created_at).toLocaleDateString()}
                                        </CardDescription>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3  bg-muted/50">
                                    <div className="text-2xl font-bold text-primary">{members.length}</div>
                                    <div className="text-sm text-muted-foreground">Members</div>
                                </div>
                                <div className="text-center p-3  bg-muted/50">
                                    <div className="text-2xl font-bold text-primary">{teamStats.totalPoints}</div>
                                    <div className="text-sm text-muted-foreground">Total Points</div>
                                </div>
                                <div className="text-center p-3  bg-muted/50">
                                    <div className="text-2xl font-bold text-primary">{teamStats.totalSolves}</div>
                                    <div className="text-sm text-muted-foreground">Total Solves</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Team Members */}
                    <TeamMemberList
                        members={members}
                        captainId={team.captain_id}
                        currentUserId={user.id}
                        teamId={teamId}
                    />

                    {/* Captain Controls */}
                    {isCaptain && (
                        <>
                            <InviteCodeGenerator teamId={teamId} />
                            <TeamSettings teamId={teamId} teamName={team.name} />
                        </>
                    )}

                    {/* Leave Team */}
                    {!isCaptain && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Leave Team</CardTitle>
                                <CardDescription>
                                    You will need an invite to rejoin
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <LeaveTeamButton />
                            </CardContent>
                        </Card>
                    )}
                </>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    <CreateTeamForm />
                    <JoinTeamForm />
                </div>
            )}
        </div>
    )
}
