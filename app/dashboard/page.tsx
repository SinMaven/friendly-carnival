import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
export const dynamic = 'force-dynamic'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { Flag, Trophy, Target, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch user profile stats
    const { data: profile } = await supabase
        .from('profiles')
        .select('username, total_points, total_solves, rank')
        .eq('id', user?.id)
        .single()

    const stats = [
        { label: 'Total Points', value: profile?.total_points || 0, icon: Zap },
        { label: 'Challenges Solved', value: profile?.total_solves || 0, icon: Flag },
        { label: 'Global Rank', value: profile?.rank ? `#${profile.rank}` : 'Unranked', icon: Trophy },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Welcome back{profile?.username ? `, ${profile.username}` : ''}!</h1>
                <p className="text-muted-foreground">Here&apos;s your progress overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Jump right into the action</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <Button asChild>
                        <Link href="/dashboard/challenges">
                            <Target className="mr-2 h-4 w-4" />
                            Browse Challenges
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/leaderboard">
                            <Trophy className="mr-2 h-4 w-4" />
                            View Leaderboard
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
