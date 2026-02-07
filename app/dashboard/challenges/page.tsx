import { Suspense } from 'react'
import { getChallenges, getTags } from '@/features/challenges/queries/get-challenges'
import { ChallengeCard } from '@/components/challenges/challenge-card'
import { ChallengeFilters } from '@/components/challenges/challenge-filters'
import { Skeleton } from '@/components/ui/skeleton'

interface ChallengesPageProps {
    searchParams: Promise<{
        difficulty?: string
        tag?: string
        search?: string
    }>
}

function ChallengesSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[220px] " />
            ))}
        </div>
    )
}

async function ChallengesGrid({ filters }: { filters: { difficulty?: string; tag?: string; search?: string } }) {
    const challenges = await getChallenges(filters)

    if (challenges.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No challenges found matching your filters.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
        </div>
    )
}

export default async function ChallengesPage({ searchParams }: ChallengesPageProps) {
    const params = await searchParams
    const tags = await getTags()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Challenges</h1>
                <p className="text-muted-foreground">
                    Test your skills with our collection of CTF challenges.
                </p>
            </div>

            <ChallengeFilters tags={tags} />

            <Suspense fallback={<ChallengesSkeleton />}>
                <ChallengesGrid filters={params} />
            </Suspense>
        </div>
    )
}
