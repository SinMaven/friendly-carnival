'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile'

export interface TurnstileCaptchaRef {
    reset: () => void
}

interface TurnstileCaptchaProps {
    onVerify: (token: string) => void
    onError?: () => void
    onExpire?: () => void
}

export const TurnstileCaptcha = forwardRef<TurnstileCaptchaRef, TurnstileCaptchaProps>(
    function TurnstileCaptcha({ onVerify, onError, onExpire }, ref) {
        const turnstileRef = useRef<TurnstileInstance>(null)

        useImperativeHandle(ref, () => ({
            reset: () => {
                turnstileRef.current?.reset()
            },
        }))

        const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

        // Development fallback - auto verify with a test token
        if (!siteKey || siteKey === 'YOUR_TURNSTILE_SITE_KEY') {
            // In development, simulate successful verification
            if (typeof window !== 'undefined') {
                setTimeout(() => onVerify('development-token'), 500)
            }
            return (
                <div className="p-4 border rounded-lg bg-muted/50 text-sm text-muted-foreground">
                    Captcha disabled in development mode
                </div>
            )
        }

        return (
            <Turnstile
                ref={turnstileRef}
                siteKey={siteKey}
                onSuccess={onVerify}
                onError={onError}
                onExpire={onExpire}
                options={{
                    theme: 'dark',
                }}
            />
        )
    }
)
