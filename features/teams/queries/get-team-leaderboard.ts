'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';

export type TeamLeaderboardEntry = {
    rank: number;
    team_id: string;
    name: string;
    slug: string;
    avatar_url: string | null;
    total_points: number;
    solve_count: number;
};

export async function getTeamLeaderboard(limit: number = 50, offset: number = 0): Promise<TeamLeaderboardEntry[]> {
    const supabase = await createSupabaseServerClient();

    const { data: teams, error } = await supabase
        .from('teams')
        .select('id, name, slug, avatar_url, total_points')
        .gt('total_points', 0)
        .order('total_points', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('Error fetching team leaderboard:', error);
        return [];
    }

    return (teams || []).map((team, index) => ({
        rank: offset + index + 1,
        team_id: team.id,
        name: team.name,
        slug: team.slug,
        avatar_url: team.avatar_url,
        total_points: team.total_points || 0,
        solve_count: 0 // We don't have a total_solves on teams yet, but points is the main metric
    }));
}
