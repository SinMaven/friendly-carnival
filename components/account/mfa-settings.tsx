'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Loader2, Trash2, CheckCircle2 } from 'lucide-react'
import { enrollMFA, verifyMFA, unenrollMFA, getMFAFactors } from '@/features/account/actions/mfa'
import { useQRCode } from 'next-qrcode'

interface Factor {
    id: string
    factor_type: string
    status: string
    created_at: string
}

interface EnrollData {
    id: string
    totp: {
        uri: string
    }
}

export function MFASettings() {
    const [factors, setFactors] = useState<Factor[]>([])
    const [loading, setLoading] = useState(true)
    const [enrolling, setEnrolling] = useState(false)
    const [enrollData, setEnrollData] = useState<EnrollData | null>(null)
    const [verifyCode, setVerifyCode] = useState('')
    const [verifying, setVerifying] = useState(false)
    const { Canvas } = useQRCode()

    const loadFactors = useCallback(async () => {
        setLoading(true)
        const result = await getMFAFactors()
        if (result.data) {
            setFactors(result.data.all || [])
        }
        setLoading(false)
    }, [])

    // Load factors on mount using a flag to prevent cascading renders
    const [hasLoaded, setHasLoaded] = useState(false)
    useEffect(() => {
        if (!hasLoaded) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setHasLoaded(true)
            // Defer the async loading to avoid setState during render
            const timer = setTimeout(() => {
                loadFactors()
            }, 0)
            return () => clearTimeout(timer)
        }
    }, [hasLoaded, loadFactors])

    const handleEnroll = async () => {
        setEnrolling(true)
        const result = await enrollMFA()
        if (result.data) {
            setEnrollData(result.data)
        }
        setEnrolling(false)
    }

    const handleVerify = async () => {
        if (!enrollData || !verifyCode) return
        setVerifying(true)
        const result = await verifyMFA(enrollData.id, verifyCode)
        if (result.success) {
            setEnrollData(null)
            setVerifyCode('')
            await loadFactors()
        } else {
            alert('Verification failed. Please try again.')
        }
        setVerifying(false)
    }

    const handleUnenroll = async (factorId: string) => {
        if (!confirm("Are you sure you want to disable this authentication method?")) return
        setLoading(true)
        await unenrollMFA(factorId)
        await loadFactors()
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Multi-Factor Authentication
                </CardTitle>
                <CardDescription>
                    Protect your account with an extra layer of security
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {loading ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        {/* List Factors */}
                        {factors.length > 0 && (
                            <div className="space-y-2">
                                <Label>Active Authentication Methods</Label>
                                {factors.map((factor) => (
                                    <div key={factor.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            <div>
                                                <p className="font-medium capitalize">{factor.factor_type}</p>
                                                <p className="text-xs text-muted-foreground">Added on {new Date(factor.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => handleUnenroll(factor.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Enrollment Flow */}
                        {!enrollData ? (
                            <Button onClick={handleEnroll} disabled={enrolling}>
                                {enrolling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Add Authentication Method
                            </Button>
                        ) : (
                            <div className="space-y-4 border p-4 rounded-lg">
                                <h3 className="font-medium">Scan QR Code</h3>
                                <div className="flex justify-center bg-white p-4 rounded w-fit mx-auto">
                                    <Canvas
                                        text={enrollData.totp.uri}
                                        options={{
                                            errorCorrectionLevel: 'M',
                                            margin: 3,
                                            scale: 4,
                                            width: 200,
                                            color: {
                                                dark: '#000000FF',
                                                light: '#FFFFFFFF',
                                            },
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Enter Verification Code</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={verifyCode}
                                            onChange={(e) => setVerifyCode(e.target.value)}
                                            placeholder="123456"
                                            maxLength={6}
                                        />
                                        <Button onClick={handleVerify} disabled={verifying || verifyCode.length !== 6}>
                                            {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
                                        </Button>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setEnrollData(null)}>Cancel</Button>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}
