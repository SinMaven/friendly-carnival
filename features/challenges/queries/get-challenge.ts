'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Tables } from '@/lib/supabase/types';

import { ChallengeWithTags } from './get-challenges';

/**
 * Extended challenge details including assets, solve status, and container status.
 */
export type ChallengeDetail = Omit<ChallengeWithTags, 'container_image_ref'> & {
    assets: Tables<'challenge_assets'>[];
    solve_count: number;
    first_blood?: {
        username: string;
        solved_at: string;
    };
    // Module 4: Infrastructure
    requires_container: boolean;
    container_image_ref?: string | null;
    instance?: Tables<'container_instances'> | null;
    // Module 3: Gamification
    is_solved: boolean;
};

/**
 * Retrieves a single challenge by its slug, including all related metadata,
 * assets, user solve status, and active container instances.
 * 
 * @param slug - The unique slug of the challenge
 * @returns {Promise<ChallengeDetail | null>} The challenge details or null if not found
 */
export async function getChallenge(slug: string): Promise<ChallengeDetail | null> {
    const supabase = await createSupabaseServerClient();
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    // 1. Fetch challenge with tags and assets
    const { data: challenge, error } = await supabase
        .from('challenges')
        .select(`
            *,
            challenge_tags (
                tags (*)
            ),
            challenge_assets (*)
        `)
        .eq('slug', slug)
        .eq('state', 'published')
        .single();

    if (error || !challenge) {
        console.error('Error fetching challenge:', error);
        return null; // Handle 404 in UI
    }

    // 2. Check if user has solved this challenge (Gamification)
    let isSolved = false;
    if (userId) {
        const { data: solve } = await supabase
            .from('solves')
            .select('id')
            .eq('user_id', userId)
            .eq('challenge_id', challenge.id)
            .maybeSingle();

        isSolved = !!solve;
    }

    // 3. Check for active container instance (Infrastructure)
    let instance: Tables<'container_instances'> | null = null;
    if (userId && challenge.requires_container) {
        const { data: activeInstance } = await supabase
            .from('container_instances')
            .select('*')
            .eq('user_id', userId)
            .eq('challenge_id', challenge.id)
            // Only fetch valid instances (not expired or stopped) could be conditional, 
            // but fetching the latest record allows showing "expired" state in UI.
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        instance = activeInstance;
    }

    // 4. Get first blood info (Gamification)
    const { data: firstBlood } = await supabase
        .from('solves')
        .select(`
            solved_at,
            profiles (username)
        `)
        .eq('challenge_id', challenge.id)
        .eq('is_first_blood', true)
        .maybeSingle();

    // 5. Transform and Return
    const tags = challenge.challenge_tags?.map((ct: { tags: unknown }) => ct.tags) || [];
    const assets = challenge.challenge_assets || [];

    // Destructure to remove relations from spread
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        challenge_tags,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        challenge_assets: _assets,
        ...challengeData
    } = challenge;

    return {
        ...challengeData,
        tags,
        assets,
        solve_count: challengeData.solve_count || 0,
        first_blood: firstBlood ? {
            username: (firstBlood.profiles as unknown as { username: string })?.username || 'Unknown',
            solved_at: firstBlood.solved_at || '',
        } : undefined,

        // Expanded Fields
        is_solved: isSolved,
        solved: isSolved, // Backward compatibility
        requires_container: challengeData.requires_container || false,
        container_image_ref: challengeData.container_image_ref || null,
        instance,
    };
}
