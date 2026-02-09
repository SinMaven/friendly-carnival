'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';


export type LeaderboardEntry = {
    rank: number;
    user_id: string;
    username: string;
    avatar_url: string | null;
    total_points: number;
    total_solves: number;
    last_solve_at: string | null;
};

export async function getLeaderboard(limit: number = 50, offset: number = 0): Promise<LeaderboardEntry[]> {
    const supabase = await createSupabaseServerClient();

    // Get profiles ordered by points
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, total_points, total_solves, last_solve_at')
        .gt('total_points', 0)
        .order('total_points', { ascending: false })
        .order('total_solves', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }

    // Transform to leaderboard entries
    interface ProfileData {
        id: string
        username: string
        avatar_url: string | null
        total_points: number | null
        total_solves: number | null
        last_solve_at: string | null
    }
    return (profiles || []).map((profile, index) => {
        const p = profile as unknown as ProfileData
        return {
            rank: offset + index + 1,
            user_id: p.id,
            username: p.username,
            avatar_url: p.avatar_url,
            total_points: p.total_points || 0,
            total_solves: p.total_solves || 0,
            last_solve_at: p.last_solve_at || null,
        }
    });
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
