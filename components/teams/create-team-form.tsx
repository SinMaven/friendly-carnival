'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Users } from 'lucide-react'
import { createTeam } from '@/features/teams/actions/team-management'

export function CreateTeamForm() {
    const [isPending, startTransition] = useTransition()
    const [name, setName] = useState('')
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        startTransition(async () => {
            const result = await createTeam(name.trim())
            if (result.success) {
                setMessage({ type: 'success', text: result.message })
                setName('')
                // Full page reload to ensure server component re-renders with new team data
                window.location.href = '/dashboard/team'
            } else {
                setMessage({ type: 'error', text: result.message })
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Create a Team
                </CardTitle>
                <CardDescription>Start a new team and invite your friends</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="team-name">Team Name</Label>
                        <Input
                            id="team-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter team name..."
                        />
                    </div>

                    {message && (
                        <div className={`p-3  text-sm ${message.type === 'success'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-red-500/10 text-red-500'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <Button type="submit" disabled={isPending || !name.trim()}>
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Create Team
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
