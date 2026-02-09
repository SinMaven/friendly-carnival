import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CheckCircle2, Zap, Users, Lock } from 'lucide-react'
import type { Tables } from '@/lib/supabase/types'

type Challenge = Tables<'challenges'> & {
    tags: Tables<'tags'>[]
    solved?: boolean
    locked?: boolean
}

const difficultyColors = {
    easy: 'bg-green-500/10 text-green-500 border-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    hard: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    insane: 'bg-red-500/10 text-red-500 border-red-500/20',
}

const tierColors = {
    free: 'border-transparent',
    pro: 'border-blue-500/50 bg-blue-500/5',
    elite: 'border-purple-500/50 bg-purple-500/5',
}

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
    return (
        <Card className={cn(
            'group transition-all hover:shadow-lg hover:border-primary/50 relative overflow-hidden',
            challenge.solved && 'border-green-500/30 bg-green-500/5',
            challenge.tier !== 'free' && tierColors[challenge.tier],
            challenge.locked && 'opacity-75 grayscale-[0.5]'
        )}>
            {/* Tier Badge */}
            {challenge.tier !== 'free' && (
                <div className={cn(
                    "absolute top-0 right-0 px-2 py-0.5 text-[10px] uppercase font-bold text-white rounded-bl-lg z-10",
                    challenge.tier === 'pro' && "bg-blue-500",
                    challenge.tier === 'elite' && "bg-purple-500",
                )}>
                    {challenge.tier}
                </div>
            )}

            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge
                                variant="outline"
                                className={cn('text-xs uppercase', difficultyColors[challenge.difficulty])}
                            >
                                {challenge.difficulty}
                            </Badge>
                            {challenge.solved && (
                                <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-500">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Solved
                                </Badge>
                            )}
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center gap-2">
                            {challenge.title}
                            {challenge.locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                        </CardTitle>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-lg font-bold text-primary">
                            <Zap className="h-4 w-4" />
                            {challenge.current_points || challenge.initial_points}
                        </div>
                        <div className="text-xs text-muted-foreground">points</div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {challenge.description_markdown?.slice(0, 150)}...
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                    {challenge.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag.id} variant="secondary" className="text-xs">
                            {tag.name}
                        </Badge>
                    ))}
                    {challenge.tags?.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                            +{challenge.tags.length - 3}
                        </Badge>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-3 border-t flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {challenge.solve_count || 0} solves
                </div>

                {challenge.locked ? (
                    <Button size="sm" variant="outline" asChild>
                        <Link href="/pricing">
                            Unlock
                        </Link>
                    </Button>
                ) : (
                    <Button size="sm" variant="ghost" asChild>
                        <Link href={`/dashboard/challenges/${challenge.slug}`}>
                            View Challenge
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
