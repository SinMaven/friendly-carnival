import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getChallenge } from '@/features/challenges/queries/get-challenge'
import { FlagSubmitForm } from '@/components/challenges/flag-submit-form'
import { ContainerControls } from '@/components/challenges/container-controls'
import { AssetList } from '@/components/challenges/asset-list'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ArrowLeft, Zap, Users, Trophy, Clock } from 'lucide-react'

interface ChallengePageProps {
    params: Promise<{ slug: string }>
}

const difficultyColors = {
    easy: 'bg-green-500/10 text-green-500 border-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    hard: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    insane: 'bg-red-500/10 text-red-500 border-red-500/20',
}

export default async function ChallengePage({ params }: ChallengePageProps) {
    const { slug } = await params
    const challenge = await getChallenge(slug)

    if (!challenge) {
        notFound()
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/challenges">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Challenges
                </Link>
            </Button>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header */}
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge
                                variant="outline"
                                className={cn('uppercase', difficultyColors[challenge.difficulty])}
                            >
                                {challenge.difficulty}
                            </Badge>
                            {challenge.tags?.map((tag) => (
                                <Badge key={tag.id} variant="secondary">
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                        <h1 className="text-3xl font-bold mb-2">{challenge.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Zap className="h-4 w-4 text-primary" />
                                {challenge.current_points || challenge.initial_points} points
                            </span>
                            <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {challenge.solve_count} solves
                            </span>
                        </div>
                    </div>

                    <Separator />

                    {/* Description - Now using safe markdown rendering */}
                    <MarkdownRenderer content={challenge.description_markdown} />

                    {/* Assets */}
                    <AssetList assets={challenge.assets} />

                    {/* Container Controls */}
                    {challenge.requires_container && (
                        <ContainerControls
                            challengeId={challenge.id}
                            instance={challenge.instance}
                        />
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Flag Submit */}
                    <FlagSubmitForm
                        challengeId={challenge.id}
                        isSolved={challenge.is_solved}
                    />

                    {/* First Blood */}
                    {challenge.first_blood && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-yellow-500" />
                                    First Blood
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium">{challenge.first_blood.username}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(challenge.first_blood.solved_at).toLocaleDateString()}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
