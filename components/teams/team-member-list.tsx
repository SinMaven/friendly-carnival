'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Crown, Loader2, UserMinus, Users, MoreVertical, ShieldCheck } from 'lucide-react'
import { removeMember, transferOwnership } from '@/features/teams/actions/team-management'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

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
    teamId: string
}

export function TeamMemberList({ members, captainId, currentUserId, teamId }: TeamMemberListProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const isCaptain = currentUserId === captainId
    const [memberToPromote, setMemberToPromote] = useState<TeamMember | null>(null)

    const handleRemove = (memberId: string) => {
        startTransition(async () => {
            // ... existing remove logic
            const result = await removeMember(memberId, teamId)
            if (result.success) {
                router.refresh()
            }
        })
    }

    const handlePromote = () => {
        if (!memberToPromote) return
        startTransition(async () => {
            const result = await transferOwnership(memberToPromote.id, teamId)
            if (result.success) {
                router.refresh()
            }
            setMemberToPromote(null)
        })
    }

    return (
        <>
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
                            className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm"
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
                                <Badge variant={member.role === 'captain' ? 'default' : 'secondary'}>
                                    {member.role}
                                </Badge>
                                {isCaptain && member.user_id !== currentUserId && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setMemberToPromote(member)}>
                                                <ShieldCheck className="h-4 w-4 mr-2" />
                                                Promote to Captain
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => handleRemove(member.id)}
                                                className="text-destructive focus:text-destructive"
                                            >
                                                <UserMinus className="h-4 w-4 mr-2" />
                                                Remove Member
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <AlertDialog open={!!memberToPromote} onOpenChange={(open) => !open && setMemberToPromote(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Transfer Team Ownership</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to promote <strong>{memberToPromote?.profile.username}</strong> to captain?
                            You will become a regular member and lose administrative privileges.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePromote}>
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Promote
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
