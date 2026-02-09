import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table'
import { getLeaderboard } from '@/features/challenges/queries/get-leaderboard'
import { getTeamLeaderboard } from '@/features/teams/queries/get-team-leaderboard'
import { Trophy } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function LeaderboardPage() {
    const leaderboard = await getLeaderboard()
    const teamLeaderboard = await getTeamLeaderboard()

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <Trophy className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">Leaderboard</h1>
                </div>
                <p className="text-muted-foreground">
                    Top hackers and teams ranked by points
                </p>
            </div>

            <Tabs defaultValue="hackers" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="hackers">Hackers</TabsTrigger>
                    <TabsTrigger value="teams">Teams</TabsTrigger>
                </TabsList>

                <TabsContent value="hackers" className="mt-6">
                    {leaderboard.length > 0 ? (
                        <LeaderboardTable entries={leaderboard} />
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            No players on the leaderboard yet. Be the first!
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="teams" className="mt-6">
                    {teamLeaderboard.length > 0 ? (
                        <LeaderboardTable entries={teamLeaderboard.map(t => ({
                            rank: t.rank,
                            user_id: t.team_id, // Reuse component prop but this is team_id
                            username: t.name,
                            avatar_url: t.avatar_url,
                            total_points: t.total_points,
                            total_solves: t.solve_count,
                            last_solve_at: null
                        }))} />
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            No teams on the leaderboard yet. Create one!
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
