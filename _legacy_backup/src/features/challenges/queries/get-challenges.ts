'use server';

import { createClient } from '@/libs/supabase/server';
import { Tables } from '@/libs/supabase/types';

/**
 * Extended challenge type that includes the related tags.
 * Columns from 'challenges' table are automatically included via Tables<'challenges'>.
 */
export type ChallengeWithTags = Tables<'challenges'> & {
    tags: Tables<'tags'>[];
    solved?: boolean;
};

/**
 * Retrieves a list of challenges based on optional filters.
 * 
 * @param filters - Optional filters for difficulty, tag slug, and search term
 * @returns {Promise<ChallengeWithTags[]>} List of challenges matching the criteria
 */
export async function getChallenges(filters?: {
    difficulty?: string;
    tag?: string;
    search?: string;
}): Promise<ChallengeWithTags[]> {
    const supabase = await createClient();
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    // Build query for challenges with tags
    let query = supabase
        .from('challenges')
        .select(`
      *,
      challenge_tags (
        tags (*)
      )
    `)
        .eq('state', 'published')
        .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty as "easy" | "medium" | "hard" | "insane");
    }

    if (filters?.search) {
        query = query.ilike('title', `%${filters.search}%`);
    }

    const { data: challenges, error } = await query;

    if (error) {
        console.error('Error fetching challenges:', error);
        return [];
    }

    // Get user's solved challenges if logged in
    let solvedChallengeIds: string[] = [];
    if (userId) {
        const { data: solves } = await supabase
            .from('solves')
            .select('challenge_id')
            .eq('user_id', userId);

        solvedChallengeIds = solves?.map(s => s.challenge_id) || [];
    }

    // Transform data
    const result = (challenges || []).map(challenge => {
        const tags = challenge.challenge_tags?.map((ct: { tags: Tables<'tags'> }) => ct.tags) || [];

        // Filter by tag if specified
        if (filters?.tag) {
            const hasTag = tags.some(t => t.slug === filters.tag);
            if (!hasTag) return null;
        }

        return {
            ...challenge,
            challenge_tags: undefined,
            tags,
            solved: solvedChallengeIds.includes(challenge.id),
        };
    }).filter(Boolean) as ChallengeWithTags[];

    return result;
}

export async function getTags(): Promise<Tables<'tags'>[]> {
    const supabase = await createClient();

    const { data: tags, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching tags:', error);
        return [];
    }

    return tags || [];
}
