import { IoFlame, IoTime, IoTrophy } from "react-icons/io5"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { LeaderboardEntry } from "../queries/get-leaderboard"

interface LeaderboardTableProps {
    entries: LeaderboardEntry[]
    currentUserId?: string
}

function getRankDisplay(rank: number) {
    switch (rank) {
        case 1:
            return <span className="text-2xl">🥇</span>
        case 2:
            return <span className="text-2xl">🥈</span>
        case 3:
            return <span className="text-2xl">🥉</span>
        default:
            return (
                <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
            )
    }
}

function formatTimeAgo(dateString: string | null): string {
    if (!dateString) return "Never"

    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
}

export function LeaderboardTable({
    entries,
    currentUserId,
}: LeaderboardTableProps) {
    if (entries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center bg-card/30">
                <IoTrophy className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground">
                    No rankings yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground/60">
                    Be the first to solve a challenge!
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[100px]">Rank</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead className="text-center">
                            <span className="flex items-center justify-center gap-1">
                                <IoFlame className="h-4 w-4 text-orange-500" />
                                Points
                            </span>
                        </TableHead>
                        <TableHead className="hidden text-center sm:table-cell">
                            Solves
                        </TableHead>
                        <TableHead className="hidden text-right md:table-cell">
                            <span className="flex items-center justify-end gap-1">
                                <IoTime className="h-4 w-4" />
                                Last Solve
                            </span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entries.map((entry) => (
                        <TableRow
                            key={entry.user_id}
                            className={
                                entry.user_id === currentUserId ? "bg-primary/10 hover:bg-primary/15" : ""
                            }
                        >
                            <TableCell className="font-medium">
                                <div className="flex w-12 items-center justify-center">
                                    {getRankDisplay(entry.rank)}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    {entry.avatar_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={entry.avatar_url}
                                            alt={entry.username}
                                            className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
                                        />
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary ring-2 ring-border">
                                            {entry.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <div
                                            className={`font-medium ${entry.user_id === currentUserId
                                                    ? "text-primary"
                                                    : "text-foreground"
                                                }`}
                                        >
                                            {entry.username}
                                            {entry.user_id === currentUserId && (
                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    (you)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <span className="text-lg font-bold text-primary">
                                    {entry.total_points.toLocaleString()}
                                </span>
                            </TableCell>
                            <TableCell className="hidden text-center text-muted-foreground sm:table-cell">
                                {entry.total_solves}
                            </TableCell>
                            <TableCell className="hidden text-right text-sm text-muted-foreground md:table-cell">
                                {formatTimeAgo(entry.last_solve_at)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
