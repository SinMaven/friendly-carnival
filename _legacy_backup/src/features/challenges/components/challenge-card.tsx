"use client"

import Link from "next/link"
import { IoCheckmarkCircle, IoFlame, IoLockClosed } from "react-icons/io5"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Difficulty, difficultyConfig } from "../models/challenge"
import { ChallengeWithTags } from "../queries/get-challenges"

interface ChallengeCardProps {
    challenge: ChallengeWithTags
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
    const difficulty = challenge.difficulty as Difficulty
    const config = difficultyConfig[difficulty]

    return (
        <Link href={`/challenges/${challenge.slug}`}>
            <Card className="group relative h-full overflow-hidden border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                {/* Solved indicator */}
                {challenge.solved && (
                    <div className="absolute right-3 top-3 z-10">
                        <IoCheckmarkCircle className="h-6 w-6 text-green-500" />
                    </div>
                )}

                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                            {challenge.title}
                        </CardTitle>
                    </div>
                </CardHeader>

                <CardContent className="pb-4">
                    <div className="flex flex-wrap gap-2">
                        {challenge.tags.map((tag) => (
                            <Badge
                                key={tag.id}
                                variant="outline"
                                className="font-medium"
                                style={{
                                    backgroundColor: `${tag.color_hex}10`,
                                    color: tag.color_hex || "hsl(var(--primary))",
                                    borderColor: `${tag.color_hex}30`,
                                }}
                            >
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t border-border/50 bg-muted/20 p-4">
                    <Badge
                        variant="secondary"
                        className={`${config.color} bg-background border border-border`}
                    >
                        {config.label}
                    </Badge>

                    <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <IoFlame className="h-4 w-4 text-orange-500" />
                            {challenge.current_points || challenge.initial_points} pts
                        </span>
                        <span className="flex items-center gap-1">
                            <IoLockClosed className="h-4 w-4" />
                            {challenge.solve_count || 0}
                        </span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}
