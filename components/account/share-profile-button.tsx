'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Check } from 'lucide-react'

interface ShareProfileButtonProps {
    username: string
}

export function ShareProfileButton({ username }: ShareProfileButtonProps) {
    const [copied, setCopied] = useState(false)

    const handleShare = async () => {
        const profileUrl = `${window.location.origin}/profile/${username}`

        try {
            // Try native share API first (works on mobile)
            if (navigator.share) {
                await navigator.share({
                    title: `${username}'s Profile`,
                    url: profileUrl,
                })
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(profileUrl)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            }
        } catch {
            // Fallback for older browsers
            await navigator.clipboard.writeText(profileUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2"
        >
            {copied ? (
                <>
                    <Check className="h-4 w-4" />
                    Copied!
                </>
            ) : (
                <>
                    <Share2 className="h-4 w-4" />
                    Share Profile
                </>
            )}
        </Button>
    )
}
