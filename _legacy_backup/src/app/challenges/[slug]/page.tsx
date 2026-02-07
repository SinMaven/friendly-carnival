import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    IoArrowBack,
    IoDownload,
    IoFlame,
    IoPeople,
    IoTime,
    IoTrophy
} from 'react-icons/io5';

import { FlagSubmitForm } from '@/features/challenges/components/flag-submit-form';
import { Difficulty,difficultyConfig } from '@/features/challenges/models/challenge';
import { getChallenge } from '@/features/challenges/queries/get-challenge';

export const dynamic = 'force-dynamic';

interface ChallengePageProps {
    params: Promise<{ slug: string }>;
}

export default async function ChallengePage({ params }: ChallengePageProps) {
    const { slug } = await params;
    const challenge = await getChallenge(slug);

    if (!challenge) {
        notFound();
    }

    const difficulty = challenge.difficulty as Difficulty;
    const config = difficultyConfig[difficulty];

    return (
        <div className="mx-auto max-w-4xl py-8">
            {/* Back button */}
            <Link
                href="/challenges"
                className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
            >
                <IoArrowBack className="h-4 w-4" />
                Back to Challenges
            </Link>

            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-bold text-white">{challenge.title}</h1>
                    <span className={`rounded-md border px-2 py-1 text-xs font-medium ${config.color}`}>
                        {config.label}
                    </span>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {challenge.tags.map(tag => (
                        <span
                            key={tag.id}
                            className="rounded-full px-3 py-1 text-sm font-medium"
                            style={{
                                backgroundColor: `${tag.color_hex}20`,
                                color: tag.color_hex || '#6366f1',
                                border: `1px solid ${tag.color_hex}40`,
                            }}
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>

                {/* Stats row */}
                <div className="mt-6 flex flex-wrap gap-6 text-sm text-zinc-400">
                    <div className="flex items-center gap-2">
                        <IoFlame className="h-5 w-5 text-orange-500" />
                        <span className="font-semibold text-white">
                            {challenge.current_points || challenge.initial_points} pts
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <IoPeople className="h-5 w-5" />
                        <span>{challenge.solve_count} solve{challenge.solve_count !== 1 ? 's' : ''}</span>
                    </div>
                    {challenge.first_blood && (
                        <div className="flex items-center gap-2 text-red-400">
                            <IoTrophy className="h-5 w-5" />
                            <span>First blood: {challenge.first_blood.username}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <IoTime className="h-5 w-5" />
                        <span>
                            {new Date(challenge.created_at || '').toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div
                    className="prose prose-invert prose-zinc max-w-none prose-headings:text-white prose-p:text-zinc-300 prose-a:text-indigo-400 prose-code:rounded prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-indigo-300 prose-pre:bg-zinc-800"
                    dangerouslySetInnerHTML={{
                        __html: challenge.description_markdown
                            .replace(/^# /gm, '<h2 class="text-xl font-bold mb-4">')
                            .replace(/^## /gm, '<h3 class="text-lg font-semibold mb-3">')
                            .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="rounded-lg overflow-x-auto p-4 my-4"><code>$2</code></pre>')
                            .replace(/`([^`]+)`/g, '<code>$1</code>')
                            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n\n/g, '</p><p class="mb-4">')
                            .replace(/^(?!<)(.+)$/gm, '<p class="mb-4">$1</p>')
                    }}
                />
            </div>

            {/* Downloads */}
            {challenge.assets.length > 0 && (
                <div className="mb-8">
                    <h2 className="mb-4 text-lg font-semibold text-white">Downloads</h2>
                    <div className="flex flex-wrap gap-3">
                        {challenge.assets.map(asset => (
                            <a
                                key={asset.id}
                                href={asset.storage_path}
                                download={asset.filename}
                                className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-indigo-500 hover:text-white"
                            >
                                <IoDownload className="h-4 w-4" />
                                {asset.filename}
                                {asset.file_size_bytes && (
                                    <span className="text-xs text-zinc-500">
                                        ({Math.round(asset.file_size_bytes / 1024)}KB)
                                    </span>
                                )}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Flag submission */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h2 className="mb-4 text-lg font-semibold text-white">Submit Flag</h2>
                <FlagSubmitForm
                    challengeId={challenge.id}
                    alreadySolved={challenge.solved}
                />
            </div>
        </div>
    );
}
