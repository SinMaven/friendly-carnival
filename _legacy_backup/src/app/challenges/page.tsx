import Link from "next/link"
import { IoFlag, IoFlame, IoTrophy } from "react-icons/io5"

import { Card, CardContent } from "@/components/ui/card"
import { ChallengeGrid } from "@/features/challenges/components/challenge-grid"
import {
    getChallenges,
    getTags,
} from "@/features/challenges/queries/get-challenges"

export const dynamic = "force-dynamic"

export default async function ChallengesPage() {
    const [challenges, tags] = await Promise.all([getChallenges(), getTags()])

    // Stats
    const totalChallenges = challenges.length
    const solvedChallenges = challenges.filter((c) => c.solved).length
    const totalPoints = challenges.reduce(
        (sum, c) =>
            c.solved ? sum + (c.current_points || c.initial_points || 0) : sum,
        0
    )

    return (
        <div className="py-8 lg:py-12 space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                        Challenges
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Test your skills. Capture the flags. Climb the leaderboard.
                    </p>
                </div>

                {/* Quick stats */}
                <div className="flex flex-wrap gap-4">
                    <Card className="border-border bg-card/50">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                                <IoFlag className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-xs font-medium text-muted-foreground">
                                    Solved
                                </div>
                                <div className="font-bold text-foreground">
                                    {solvedChallenges}/{totalChallenges}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-card/50">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                                <IoFlame className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-xs font-medium text-muted-foreground">
                                    Points
                                </div>
                                <div className="font-bold text-foreground">
                                    {totalPoints.toLocaleString()}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Link href="/leaderboard">
                        <Card className="border-border bg-card/50 transition-colors hover:bg-muted/50 hover:border-primary/50">
                            <CardContent className="flex items-center gap-3 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
                                    <IoTrophy className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-muted-foreground">
                                        View
                                    </div>
                                    <div className="font-bold text-foreground">Leaderboard</div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>

            {/* Challenge Grid */}
            <ChallengeGrid challenges={challenges} tags={tags} />
        </div>
    )
}
