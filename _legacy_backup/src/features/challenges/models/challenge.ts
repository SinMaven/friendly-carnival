import { z } from 'zod';

// Challenge schemas
export const challengeSchema = z.object({
    id: z.string().uuid(),
    slug: z.string(),
    title: z.string(),
    description_markdown: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard', 'insane']),
    state: z.enum(['draft', 'published', 'deprecated']),
    author_id: z.string().uuid().nullable(),
    is_dynamic_scoring: z.boolean().nullable(),
    initial_points: z.number().nullable(),
    min_points: z.number().nullable(),
    current_points: z.number().nullable(),
    solve_count: z.number().nullable(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable(),
});

export const tagSchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    color_hex: z.string().nullable(),
});

export const challengeAssetSchema = z.object({
    id: z.string().uuid(),
    challenge_id: z.string().uuid(),
    storage_path: z.string(),
    filename: z.string(),
    file_hash: z.string().nullable(),
    file_size_bytes: z.number().nullable(),
    download_count: z.number().nullable(),
});

// Input validation schemas
export const submitFlagSchema = z.object({
    challengeId: z.string().uuid(),
    flag: z.string().min(1, 'Flag cannot be empty').max(500, 'Flag too long'),
});

export const challengeFiltersSchema = z.object({
    difficulty: z.enum(['easy', 'medium', 'hard', 'insane']).optional(),
    tag: z.string().optional(),
    search: z.string().optional(),
});

// Difficulty metadata
export const difficultyConfig = {
    easy: {
        label: 'Easy',
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        points: '50-100',
    },
    medium: {
        label: 'Medium',
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        points: '100-300',
    },
    hard: {
        label: 'Hard',
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        points: '250-500',
    },
    insane: {
        label: 'Insane',
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        points: '400-1000',
    },
} as const;

export type Difficulty = keyof typeof difficultyConfig;
export type Challenge = z.infer<typeof challengeSchema>;
export type Tag = z.infer<typeof tagSchema>;
export type ChallengeAsset = z.infer<typeof challengeAssetSchema>;
