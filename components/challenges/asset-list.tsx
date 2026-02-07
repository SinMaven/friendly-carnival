import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileText } from 'lucide-react'
import type { Tables } from '@/lib/supabase/types'

function formatBytes(bytes: number | null): string {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

interface AssetListProps {
    assets: Tables<'challenge_assets'>[]
}

export function AssetList({ assets }: AssetListProps) {
    if (!assets || assets.length === 0) {
        return null
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Challenge Files
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
                            className="flex items-center justify-between p-3  border bg-muted/50"
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">{asset.filename}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatBytes(asset.file_size_bytes)}
                                        {asset.download_count ? ` • ${asset.download_count} downloads` : ''}
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <a href={asset.storage_path} download={asset.filename}>
                                    <Download className="h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
