'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Loader2, Trash2 } from 'lucide-react'
import { deleteAccount } from '@/features/account/actions/delete-account'

interface DeleteAccountButtonProps {
    userEmail: string
}

export function DeleteAccountButton({ userEmail }: DeleteAccountButtonProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [confirmEmail, setConfirmEmail] = useState('')
    const [error, setError] = useState<string | null>(null)

    const handleDelete = () => {
        if (confirmEmail !== userEmail) {
            setError('Email does not match')
            return
        }

        startTransition(async () => {
            const result = await deleteAccount(confirmEmail)

            if (result.success) {
                router.push('/')
            } else {
                setError(result.message)
            }
        })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3">
                        <span>
                            This action cannot be undone. This will permanently delete your
                            account and remove all associated data.
                            <br /><br />
                            Type <strong>{userEmail}</strong> to confirm.
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                    value={confirmEmail}
                    onChange={(e) => {
                        setConfirmEmail(e.target.value)
                        setError(null)
                    }}
                    placeholder="Enter your email to confirm"
                />
                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setConfirmEmail('')}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={confirmEmail !== userEmail || isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Deleting...
                            </>
                        ) : (
                            'Delete Account'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
