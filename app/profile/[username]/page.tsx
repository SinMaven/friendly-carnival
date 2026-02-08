import { createSupabaseServerClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Flag, Trophy, Zap, Calendar } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
    const supabase = await createSupabaseServerClient()
    const { username } = await params

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

    if (!profile) {
        notFound()
    }

    return (
        <div className="container mx-auto py-10 max-w-4xl space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="text-4xl">
                        {profile.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold">{profile.username}</h1>
                    <p className="text-muted-foreground max-w-md">
                        {profile.bio || 'This user has not written a bio yet.'}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Joined {new Date(profile.created_at).toLocaleDateString()}
                        </div>
                        {profile.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                Website
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Rank</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">#{profile.rank || 'N/A'}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Points</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{profile.total_points || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Solves</CardTitle>
                        <Flag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{profile.total_solves || 0}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
