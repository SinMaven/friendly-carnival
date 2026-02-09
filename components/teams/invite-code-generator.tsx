'use client'

import { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Copy, Check, Loader2, Link2 } from 'lucide-react'
import { generateInviteCode } from '@/features/teams/actions/team-management'

interface InviteCodeGeneratorProps {
    teamId: string
}

export function InviteCodeGenerator({ teamId }: InviteCodeGeneratorProps) {
    const [isPending, startTransition] = useTransition()
    const [code, setCode] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleGenerate = () => {
        startTransition(async () => {
            const result = await generateInviteCode(teamId)
            if (result.success && result.data?.code) {
                setCode(result.data.code)
                setError(null)
            } else {
                setError(result.message)
            }
        })
    }

    const handleCopy = async () => {
        if (!code) return
        const inviteUrl = `${window.location.origin}/dashboard/team/join?code=${code}`
        await navigator.clipboard.writeText(inviteUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Link2 className="h-5 w-5" />
                    Invite Members
                </CardTitle>
                <CardDescription>Generate a link to invite new members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {code ? (
                    <div className="flex gap-2">
                        <Input
                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard/team/join?code=${code}`}
                            readOnly
                            className="font-mono text-sm"
                        />
                        <Button variant="outline" size="icon" onClick={handleCopy}>
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                ) : (
                    <Button onClick={handleGenerate} disabled={isPending} className="w-full">
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Generate Invite Link
                    </Button>
                )}
                {error && <p className="text-sm text-red-500">{error}</p>}
                {code && (
                    <p className="text-xs text-muted-foreground">
                        Link expires in 7 days. Can be used once.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
