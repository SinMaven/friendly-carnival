'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Crown, Loader2, UserMinus, Users } from 'lucide-react'
import { removeMember } from '@/features/teams/actions/team-management'

interface TeamMember {
    id: string
    user_id: string
    role: string
    profile: {
        username: string
        avatar_url: string | null
        total_points: number
    }
}

interface TeamMemberListProps {
    members: TeamMember[]
    captainId: string
    currentUserId: string
}

export function TeamMemberList({ members, captainId, currentUserId }: TeamMemberListProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const isCaptain = currentUserId === captainId

    const handleRemove = (memberId: string) => {
        startTransition(async () => {
            const result = await removeMember(memberId)
            if (result.success) {
                router.refresh()
            }
        })
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Members ({members.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="flex items-center justify-between p-3  bg-muted/50"
                    >
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={member.profile.avatar_url || undefined} />
                                <AvatarFallback>
                                    {member.profile.username?.charAt(0).toUpperCase() || '?'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{member.profile.username}</span>
                                    {member.user_id === captainId && (
                                        <Crown className="h-4 w-4 text-yellow-500" />
                                    )}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {member.profile.total_points} points
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>
                                {member.role}
                            </Badge>
                            {isCaptain && member.user_id !== currentUserId && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemove(member.id)}
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <UserMinus className="h-4 w-4 text-destructive" />
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
