'use client'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity } from 'lucide-react'

interface SolveHistoryGraphProps {
    solves: {
        created_at: string
        challenge: {
            points: number
        } | null
    }[]
}

export function SolveHistoryGraph({ solves }: SolveHistoryGraphProps) {
    // Process data for the chart
    const data = solves.reduce((acc, solve) => {
        const date = new Date(solve.created_at).toLocaleDateString()
        const points = solve.challenge?.points || 0
        const lastPoints = acc.length > 0 ? acc[acc.length - 1].points : 0

        // If same date, update the last entry
        if (acc.length > 0 && acc[acc.length - 1].date === date) {
            acc[acc.length - 1].points += points
        } else {
            acc.push({
                date,
                points: lastPoints + points
            })
        }
        return acc
    }, [] as { date: string; points: number }[])

    // Ensure we start from 0 if needed or just show the progression
    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Solve History
                    </CardTitle>
                    <CardDescription>Track your progress over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No solves yet. Start solving challenges to see your progress!
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Solve History
                </CardTitle>
                <CardDescription>Cumulative points gained over time</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: 'var(--radius)',
                                    color: 'hsl(var(--foreground))'
                                }}
                                itemStyle={{ color: 'hsl(var(--primary))' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="points"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
