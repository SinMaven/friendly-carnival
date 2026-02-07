'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Square, Terminal, Copy, Check, Loader2, Clock } from 'lucide-react'
import { startInstance } from '@/features/challenges/actions/start-instance'
import { stopInstance } from '@/features/challenges/actions/stop-instance'
import type { Tables } from '@/lib/supabase/types'

interface ContainerControlsProps {
    challengeId: string
    instance?: Tables<'container_instances'> | null
}

export function ContainerControls({ challengeId, instance }: ContainerControlsProps) {
    const [currentInstance, setCurrentInstance] = useState(instance)
    const [isPending, startTransition] = useTransition()
    const [copied, setCopied] = useState<string | null>(null)

    const connectionInfo = currentInstance?.connection_info as {
        ssh_cmd?: string
        password?: string
        http_url?: string
    } | null

    const handleStart = () => {
        startTransition(async () => {
            const result = await startInstance(challengeId)
            if (result.success && result.instance) {
                setCurrentInstance(result.instance)
            }
        })
    }

    const handleStop = () => {
        if (!currentInstance) return
        startTransition(async () => {
            const result = await stopInstance(currentInstance.id)
            if (result.success) {
                setCurrentInstance(null)
            }
        })
    }

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text)
        setCopied(key)
        setTimeout(() => setCopied(null), 2000)
    }

    const isRunning = currentInstance?.status === 'running'
    const isProvisioning = currentInstance?.status === 'provisioning'

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    Container Instance
                </CardTitle>
                <CardDescription>
                    This challenge requires a dedicated environment
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Status & Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Badge variant={isRunning ? 'default' : isProvisioning ? 'secondary' : 'outline'}>
                            {isRunning ? 'Running' : isProvisioning ? 'Provisioning...' : 'Stopped'}
                        </Badge>
                        {currentInstance?.expires_at && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Expires: {new Date(currentInstance.expires_at).toLocaleTimeString()}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {!isRunning && !isProvisioning ? (
                            <Button onClick={handleStart} disabled={isPending} size="sm">
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <Play className="h-4 w-4 mr-1" />
                                        Start
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button onClick={handleStop} disabled={isPending} variant="destructive" size="sm">
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <Square className="h-4 w-4 mr-1" />
                                        Stop
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Connection Info */}
                {isRunning && connectionInfo && (
                    <div className="space-y-3 pt-4 border-t">
                        {connectionInfo.ssh_cmd && (
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">SSH Command</label>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 bg-muted p-2 rounded text-sm font-mono truncate">
                                        {connectionInfo.ssh_cmd}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => copyToClipboard(connectionInfo.ssh_cmd!, 'ssh')}
                                    >
                                        {copied === 'ssh' ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                        {connectionInfo.password && (
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Password</label>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 bg-muted p-2 rounded text-sm font-mono">
                                        {connectionInfo.password}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => copyToClipboard(connectionInfo.password!, 'pass')}
                                    >
                                        {copied === 'pass' ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                        {connectionInfo.http_url && (
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Web URL</label>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={connectionInfo.http_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-muted p-2 rounded text-sm font-mono text-primary hover:underline truncate"
                                    >
                                        {connectionInfo.http_url}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
