'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Flag, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { submitFlag } from '@/features/challenges/actions/submit-flag'

interface FlagSubmitFormProps {
    challengeId: string
    isSolved: boolean
}

export function FlagSubmitForm({ challengeId, isSolved }: FlagSubmitFormProps) {
    const router = useRouter()
    const [flag, setFlag] = useState('')
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
    const [isPending, startTransition] = useTransition()

    if (isSolved) {
        return (
            <Card className="border-green-500/30 bg-green-500/5">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Challenge Completed!</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        You&apos;ve already solved this challenge.
                    </p>
                </CardContent>
            </Card>
        )
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!flag.trim()) return

        startTransition(async () => {
            const response = await submitFlag(challengeId, flag.trim())
            setResult(response)
            if (response.success) {
                setFlag('')
                router.refresh() // Refresh to update UI
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Flag className="h-5 w-5" />
                    Submit Flag
                </CardTitle>
                <CardDescription>
                    Enter the flag to solve this challenge
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="flag{...}"
                            value={flag}
                            onChange={(e) => setFlag(e.target.value)}
                            disabled={isPending}
                            className="font-mono"
                        />
                        <Button type="submit" disabled={isPending || !flag.trim()}>
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </div>

                    {result && (
                        <div className={`flex items-center gap-2 p-3  ${result.success
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-red-500/10 text-red-500'
                            }`}>
                            {result.success ? (
                                <CheckCircle2 className="h-4 w-4" />
                            ) : (
                                <XCircle className="h-4 w-4" />
                            )}
                            <span className="text-sm">{result.message}</span>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    )
}
