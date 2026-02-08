'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, UserPlus } from 'lucide-react'
import { joinTeam } from '@/features/teams/actions/team-management'

interface JoinTeamFormProps {
    initialCode?: string
}

export function JoinTeamForm({ initialCode = '' }: JoinTeamFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [code, setCode] = useState(initialCode)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!code.trim()) return

        startTransition(async () => {
            const result = await joinTeam(code.trim())
            if (result.success) {
                setMessage({ type: 'success', text: result.message })
                router.refresh()
            } else {
                setMessage({ type: 'error', text: result.message })
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Join a Team
                </CardTitle>
                <CardDescription>Enter an invite code to join an existing team</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="invite-code">Invite Code</Label>
                        <Input
                            id="invite-code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter invite code..."
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

                    <Button type="submit" disabled={isPending || !code.trim()}>
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Join Team
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
