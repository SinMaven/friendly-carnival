import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CheckCircle2, Zap, Users } from 'lucide-react'
import type { Tables } from '@/lib/supabase/types'

type Challenge = Tables<'challenges'> & {
    tags: Tables<'tags'>[]
    solved?: boolean
}

const difficultyColors = {
    easy: 'bg-green-500/10 text-green-500 border-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    hard: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    insane: 'bg-red-500/10 text-red-500 border-red-500/20',
}

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
    return (
        <Card className={cn(
            'group transition-all hover:shadow-lg hover:border-primary/50',
            challenge.solved && 'border-green-500/30 bg-green-500/5'
        )}>
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
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {challenge.title}
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
                <Button size="sm" variant="ghost" asChild>
                    <Link href={`/dashboard/challenges/${challenge.slug}`}>
                        View Challenge
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
