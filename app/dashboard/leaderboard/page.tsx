import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table'
import { getLeaderboard } from '@/features/challenges/queries/get-leaderboard'
import { Trophy } from 'lucide-react'

export default async function LeaderboardPage() {
    const leaderboard = await getLeaderboard()

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <Trophy className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">Leaderboard</h1>
                </div>
                <p className="text-muted-foreground">
                    Top hackers ranked by points earned
                </p>
            </div>

            {leaderboard.length > 0 ? (
                <LeaderboardTable entries={leaderboard} />
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    No players on the leaderboard yet. Be the first!
                </div>
            )}
        </div>
    )
}
