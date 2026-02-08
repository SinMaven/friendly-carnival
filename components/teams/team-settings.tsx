'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Loader2, Settings, Trash2 } from 'lucide-react'
import { updateTeamName, deleteTeam } from '@/features/teams/actions/team-management'

interface TeamSettingsProps {
    teamId: string
    teamName: string
}

export function TeamSettings({ teamId, teamName }: TeamSettingsProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [isDeleting, setIsDeleting] = useState(false)
    const [newName, setNewName] = useState(teamName)
    const [confirmName, setConfirmName] = useState('')
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const handleUpdateName = () => {
        if (!newName.trim() || newName === teamName) return

        startTransition(async () => {
            const result = await updateTeamName(teamId, newName.trim())
            setMessage({
                type: result.success ? 'success' : 'error',
                text: result.message
            })
            if (result.success) {
                router.refresh()
            }
            setTimeout(() => setMessage(null), 3000)
        })
    }

    const handleDeleteTeam = async () => {
        if (confirmName !== teamName) return

        setIsDeleting(true)
        const result = await deleteTeam(teamId)

        if (result.success) {
            router.refresh()
        } else {
            setMessage({ type: 'error', text: result.message })
            setIsDeleting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Team Settings
                </CardTitle>
                <CardDescription>
                    Manage your team settings
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Update Team Name */}
                <div className="space-y-3">
                    <Label htmlFor="team-name">Team Name</Label>
                    <div className="flex gap-2">
                        <Input
                            id="team-name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Enter team name"
                            maxLength={50}
                        />
                        <Button
                            onClick={handleUpdateName}
                            disabled={isPending || !newName.trim() || newName === teamName}
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Save'
                            )}
                        </Button>
                    </div>
                </div>

                {message && (
                    <div className={`p-3 rounded-lg text-sm ${message.type === 'success'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Danger Zone */}
                <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium text-destructive mb-2">Danger Zone</h4>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Team
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Team</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the team
                                    and remove all members. Type <strong>{teamName}</strong> to confirm.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <Input
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                                placeholder="Type team name to confirm"
                            />
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setConfirmName('')}>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteTeam}
                                    disabled={confirmName !== teamName || isDeleting}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {isDeleting ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : null}
                                    Delete Team
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    )
}
