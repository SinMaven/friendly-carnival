import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award } from 'lucide-react'

type LeaderboardEntry = {
    rank: number
    username: string
    avatar_url?: string | null
    total_points: number
    total_solves: number
}

const rankIcons = {
    1: <Trophy className="h-5 w-5 text-yellow-500" />,
    2: <Medal className="h-5 w-5 text-gray-400" />,
    3: <Award className="h-5 w-5 text-amber-600" />,
}

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
    return (
        <div className=" border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                        <TableHead className="text-right">Solves</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entries.map((entry) => (
                        <TableRow key={entry.username}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    {rankIcons[entry.rank as keyof typeof rankIcons] || (
                                        <span className="w-5 text-center text-muted-foreground">
                                            {entry.rank}
                                        </span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={entry.avatar_url || undefined} />
                                        <AvatarFallback>
                                            {entry.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{entry.username}</span>
                                    {entry.rank <= 3 && (
                                        <Badge variant="secondary" className="text-xs">
                                            Top {entry.rank}
                                        </Badge>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-right font-mono font-bold text-primary">
                                {entry.total_points.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                                {entry.total_solves}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
