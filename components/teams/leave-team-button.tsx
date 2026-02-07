'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2, LogOut } from 'lucide-react'
import { leaveTeam } from '@/features/teams/actions/team-management'

export function LeaveTeamButton() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleLeave = () => {
        if (!confirm('Are you sure you want to leave the team?')) return

        startTransition(async () => {
            const result = await leaveTeam()
            if (result.success) {
                router.refresh()
            }
        })
    }

    return (
        <Button variant="destructive" onClick={handleLeave} disabled={isPending}>
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
                <LogOut className="h-4 w-4 mr-2" />
            )}
            Leave Team
        </Button>
    )
}
