import Link from "next/link"
import { IoArrowBack, IoFlag, IoTrophy } from "react-icons/io5"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LeaderboardTable } from "@/features/challenges/components/leaderboard-table"
import { getLeaderboard } from "@/features/challenges/queries/get-leaderboard"
import { createClient } from "@/libs/supabase/server"

export const dynamic = "force-dynamic"

export default async function LeaderboardPage() {
    const supabase = await createClient()
    const { data: session } = await supabase.auth.getSession()
    const currentUserId = session?.session?.user?.id

    const entries = await getLeaderboard(100)

    // Calculate some stats
    const totalPlayers = entries.length
    const totalSolves = entries.reduce((sum, e) => sum + e.total_solves, 0)

    return (
        <div className="py-8 lg:py-12 space-y-8">
            {/* Back link */}
            <Button variant="ghost" size="sm" asChild className="pl-0 hover:bg-transparent hover:text-primary">
                <Link href="/challenges" className="gap-2">
                    <IoArrowBack className="h-4 w-4" />
                    Back to Challenges
                </Link>
            </Button>

            {/* Header */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                    <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                        <IoTrophy className="h-8 w-8 text-yellow-500" />
                        Hall of Fame
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        The best hackers. The most flags. The fierce competition.
                    </p>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-4">
                    <Card className="border-border bg-card/50">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <div className="absolute h-3 w-3 rounded-full bg-green-500 ring-2 ring-background top-0 right-0 animate-pulse" />
                                <IoTrophy className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <div className="text-xs font-medium text-muted-foreground">
                                    Active Players
                                </div>
                                <div className="font-bold text-foreground">{totalPlayers}</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-card/50">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                                <IoFlag className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-xs font-medium text-muted-foreground">
                                    Total Solves
                                </div>
                                <div className="font-bold text-foreground">{totalSolves}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Leaderboard table */}
            <LeaderboardTable entries={entries} currentUserId={currentUserId} />
        </div>
    )
}
