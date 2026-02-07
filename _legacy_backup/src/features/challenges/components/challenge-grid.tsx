"use client"

import { useState } from "react"
import { IoClose, IoFilter, IoSearch } from "react-icons/io5"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tables } from "@/libs/supabase/types"

import { Difficulty, difficultyConfig } from "../models/challenge"
import { ChallengeWithTags } from "../queries/get-challenges"

import { ChallengeCard } from "./challenge-card"

interface ChallengeGridProps {
    challenges: ChallengeWithTags[]
    tags: Tables<"tags">[]
}

export function ChallengeGrid({ challenges, tags }: ChallengeGridProps) {
    const [search, setSearch] = useState("")
    const [selectedDifficulty, setSelectedDifficulty] =
        useState<Difficulty | null>(null)
    const [selectedTag, setSelectedTag] = useState<string | null>(null)

    // Filter challenges
    const filteredChallenges = challenges.filter((challenge) => {
        // Search filter
        if (
            search &&
            !challenge.title.toLowerCase().includes(search.toLowerCase())
        ) {
            return false
        }
        // Difficulty filter
        if (selectedDifficulty && challenge.difficulty !== selectedDifficulty) {
            return false
        }
        // Tag filter
        if (selectedTag && !challenge.tags.some((t) => t.slug === selectedTag)) {
            return false
        }
        return true
    })

    const clearFilters = () => {
        setSearch("")
        setSelectedDifficulty(null)
        setSelectedTag(null)
    }

    const hasFilters = search || selectedDifficulty || selectedTag

    return (
        <div className="space-y-8">
            {/* Filters */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                {/* Search */}
                <div className="relative flex-1">
                    <IoSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search challenges..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-card border-border h-11"
                    />
                </div>

                {/* Difficulty filter */}
                <div className="flex flex-wrap gap-2">
                    {(Object.keys(difficultyConfig) as Difficulty[]).map((diff) => (
                        <Button
                            key={diff}
                            variant={selectedDifficulty === diff ? "default" : "outline"}
                            size="sm"
                            onClick={() =>
                                setSelectedDifficulty(
                                    selectedDifficulty === diff ? null : diff
                                )
                            }
                            className={`text-xs h-9 ${selectedDifficulty === diff ? "" : "text-muted-foreground"
                                }`}
                        >
                            {difficultyConfig[diff].label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-2 mr-2 text-sm text-muted-foreground">
                    <IoFilter className="h-4 w-4" />
                    <span>Tags:</span>
                </div>

                {tags.map((tag) => (
                    <button
                        key={tag.id}
                        onClick={() =>
                            setSelectedTag(selectedTag === tag.slug ? null : tag.slug)
                        }
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${selectedTag === tag.slug
                            ? "ring-2 ring-offset-2 ring-offset-background"
                            : "opacity-70 hover:opacity-100 hover:bg-muted"
                            }`}
                        style={{
                            backgroundColor:
                                selectedTag === tag.slug
                                    ? tag.color_hex || "hsl(var(--primary))"
                                    : "transparent",
                            color:
                                selectedTag === tag.slug
                                    ? "white"
                                    : tag.color_hex || "hsl(var(--primary))",
                            border: `1px solid ${tag.color_hex || "hsl(var(--border))"}`,
                        }}
                    >
                        {tag.name}
                    </button>
                ))}
                {hasFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-7 text-xs ml-2"
                    >
                        <IoClose className="mr-1 h-3 w-3" />
                        Clear
                    </Button>
                )}
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
                Found {filteredChallenges.length} challenge
                {filteredChallenges.length !== 1 ? "s" : ""}
            </div>

            {/* Grid */}
            {filteredChallenges.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredChallenges.map((challenge) => (
                        <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/30 py-16 text-center">
                    <p className="text-lg font-medium text-muted-foreground">
                        No challenges found
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground/60">
                        Try adjusting your filters
                    </p>
                    {hasFilters && (
                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="mt-4"
                        >
                            Clear all filters
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}
