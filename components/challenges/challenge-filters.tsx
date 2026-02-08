'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'
import { useState, useTransition, useCallback } from 'react'
import type { Tables } from '@/lib/supabase/types'

const difficulties = ['easy', 'medium', 'hard', 'insane'] as const

export function ChallengeFilters({ tags }: { tags: Tables<'tags'>[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const currentDifficulty = searchParams.get('difficulty')
    const currentTag = searchParams.get('tag')
    const currentSearch = searchParams.get('search') || ''

    const [searchValue, setSearchValue] = useState(currentSearch)

    const updateParams = useCallback((key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        startTransition(() => {
            router.push(`/dashboard/challenges?${params.toString()}`)
        })
    }, [router, searchParams])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        updateParams('search', searchValue || null)
    }

    const clearFilters = () => {
        setSearchValue('')
        startTransition(() => {
            router.push('/dashboard/challenges')
        })
    }

    const hasFilters = currentDifficulty || currentTag || currentSearch

    return (
        <div className="space-y-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search challenges..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button type="submit" disabled={isPending}>
                    Search
                </Button>
            </form>

            {/* Difficulty Filter */}
            <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground py-1">Difficulty:</span>
                {difficulties.map((difficulty) => (
                    <Button
                        key={difficulty}
                        variant={currentDifficulty === difficulty ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateParams('difficulty', currentDifficulty === difficulty ? null : difficulty)}
                        className="capitalize"
                    >
                        {difficulty}
                    </Button>
                ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground py-1">Tags:</span>
                {tags.map((tag) => (
                    <Badge
                        key={tag.id}
                        variant={currentTag === tag.slug ? 'default' : 'outline'}
                        className={cn(
                            'cursor-pointer transition-colors',
                            currentTag === tag.slug ? '' : 'hover:bg-primary/10'
                        )}
                        onClick={() => updateParams('tag', currentTag === tag.slug ? null : tag.slug)}
                    >
                        {tag.name}
                    </Badge>
                ))}
            </div>

            {/* Clear Filters */}
            {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Clear filters
                </Button>
            )}
        </div>
    )
}
