'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Tables } from '@/lib/supabase/types';

export type LeaderboardEntry = {
    rank: number;
    user_id: string;
    username: string;
    avatar_url: string | null;
    total_points: number;
    total_solves: number;
    last_solve_at: string | null;
};

export async function getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    const supabase = await createSupabaseServerClient();

    // Get profiles ordered by points
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, total_points, total_solves')
        .gt('total_points', 0)
        .order('total_points', { ascending: false })
        .order('total_solves', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }

    // Get last solve time for each user
    const userIds = profiles?.map((p: { id: string }) => p.id) || [];

    let lastSolves: Record<string, string> = {};
    if (userIds.length > 0) {
        const { data: solves } = await supabase
            .from('solves')
            .select('user_id, solved_at')
            .in('user_id', userIds)
            .order('solved_at', { ascending: false });

        // Get last solve per user
        for (const solve of solves || []) {
            if (!lastSolves[solve.user_id]) {
                lastSolves[solve.user_id] = solve.solved_at || '';
            }
        }
    }

    // Transform to leaderboard entries
    return (profiles || []).map((profile: any, index: number) => ({
        rank: index + 1,
        user_id: profile.id,
        username: profile.username,
        avatar_url: profile.avatar_url,
        total_points: profile.total_points || 0,
        total_solves: profile.total_solves || 0,
        last_solve_at: lastSolves[profile.id] || null,
    }));
}

export async function getUserStats(userId: string) {
    const supabase = await createSupabaseServerClient();

    // Get profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

    if (!profile) return null;

    // Get user's solves with challenge info
    const { data: solves } = await supabase
        .from('solves')
        .select(`
      *,
      challenges (id, title, slug, difficulty)
    `)
        .eq('user_id', userId)
        .order('solved_at', { ascending: false });

    // Calculate rank
    const { count: betterPlayers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gt('total_points', profile.total_points || 0);

    return {
        profile,
        solves: solves || [],
        rank: (betterPlayers || 0) + 1,
    };
}
