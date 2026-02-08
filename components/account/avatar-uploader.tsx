'use client'

import { useState, useRef, useTransition } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Loader2, Camera } from 'lucide-react'
import { uploadAvatar } from '@/features/account/actions/upload-avatar'

interface AvatarUploaderProps {
    currentUrl?: string | null
    fallback: string
}

export function AvatarUploader({ currentUrl, fallback }: AvatarUploaderProps) {
    const [isPending, startTransition] = useTransition()
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Create preview
        const objectUrl = URL.createObjectURL(file)
        setPreviewUrl(objectUrl)

        // Upload file
        const formData = new FormData()
        formData.append('avatar', file)

        startTransition(async () => {
            const result = await uploadAvatar(formData)
            setMessage({
                type: result.success ? 'success' : 'error',
                text: result.message
            })

            if (result.success && result.url) {
                // Add cache-busting parameter for immediate display
                const cacheBustedUrl = `${result.url}?t=${Date.now()}`
                setPreviewUrl(cacheBustedUrl)
            } else {
                setPreviewUrl(null)
            }

            setTimeout(() => setMessage(null), 3000)
        })
    }

    const displayUrl = previewUrl || currentUrl || undefined

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="relative group">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={displayUrl} />
                        <AvatarFallback className="text-2xl">{fallback}</AvatarFallback>
                    </Avatar>
                    {isPending && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isPending}
                    >
                        <Camera className="h-4 w-4 mr-2" />
                        Change Avatar
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        JPG, PNG, WebP or GIF. Max 2MB.
                    </p>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
            />

            {message && (
                <div className={`p-3 rounded-lg text-sm ${message.type === 'success'
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-red-500/10 text-red-500'
                    }`}>
                    {message.text}
                </div>
            )}
        </div>
    )
}
