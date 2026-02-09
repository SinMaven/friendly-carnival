'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Tables } from '@/lib/supabase/types';

/**
 * Extended challenge type that includes the related tags.
 * Columns from 'challenges' table are automatically included via Tables<'challenges'>.
 */
export type ChallengeWithTags = Tables<'challenges'> & {
    tags: Tables<'tags'>[];
    solved?: boolean;
    locked?: boolean;
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
    const supabase = await createSupabaseServerClient();
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

    // Get user's solved challenges and subscription if logged in
    let solvedChallengeIds: string[] = [];
    let userTier: 'free' | 'pro' | 'elite' = 'free';

    if (userId) {
        const { data: solves } = await supabase
            .from('solves')
            .select('challenge_id')
            .eq('user_id', userId);

        solvedChallengeIds = solves?.map(s => s.challenge_id) || [];

        // Check subscription
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('price_id, status')
            .eq('user_id', userId)
            .in('status', ['active', 'trialing'])
            .maybeSingle();

        if (subscription) {
            const PRO_PRICE_ID = 'af313f2d-e84e-4141-80ac-8ee93db480c2';
            const ELITE_PRICE_ID = 'e1c95e50-35ed-4f77-8681-58c550b7885f';

            if (subscription.price_id === ELITE_PRICE_ID) {
                userTier = 'elite';
            } else if (subscription.price_id === PRO_PRICE_ID) {
                userTier = 'pro';
            }
        }
    }

    const TIER_LEVELS = { free: 0, pro: 1, elite: 2 };

    // Transform data
    const result = (challenges || []).map(challenge => {
        const tags = challenge.challenge_tags?.map((ct: { tags: Tables<'tags'> }) => ct.tags) || [];

        // Filter by tag if specified
        if (filters?.tag) {
            const hasTag = tags.some((t: Tables<'tags'>) => t.slug === filters.tag);
            if (!hasTag) return null;
        }

        const tier = (challenge.tier || 'free') as keyof typeof TIER_LEVELS;
        const isLocked = TIER_LEVELS[userTier] < TIER_LEVELS[tier];

        return {
            ...challenge,
            challenge_tags: undefined,
            tags,
            solved: solvedChallengeIds.includes(challenge.id),
            locked: isLocked
        };
    }).filter(Boolean) as ChallengeWithTags[];

    return result;
}

export async function getTags(): Promise<Tables<'tags'>[]> {
    const supabase = await createSupabaseServerClient();

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
