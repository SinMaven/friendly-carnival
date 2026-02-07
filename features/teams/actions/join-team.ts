'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type JoinTeamResult = {
    success: boolean;
    message: string;
};

/**
 * joins an existing team.
 * 
 * @param teamId - The UUID of the team
 * @returns {Promise<JoinTeamResult>} Result of join request
 */
export async function joinTeam(teamId: string): Promise<JoinTeamResult> {
    const supabase = await createSupabaseServerClient();
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    if (!userId) return { success: false, message: 'Unauthorized' };

    // 1. Check if user is already in a team
    const { data: existingMember } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', userId)
        .maybeSingle();

    if (existingMember) {
        return { success: false, message: 'You are already in a team.' };
    }

    // 2. Simple Open Join Logic (For MVP, assuming open teams or explicit invite requirement omitted)
    // In a real CTF, we'd check for an invite code or password.
    // Spec didn't mention invite codes in `Teams` table, so assuming open or logic handled elsewhere.
    // Let's implement standard open join.

    const { error } = await supabase
        .from('team_members')
        .insert({
            team_id: teamId,
            user_id: userId,
            role: 'member'
        });

    if (error) {
        console.error('Error joining team:', error);
        return { success: false, message: 'Failed to join team.' };
    }

    revalidatePath('/dashboard/team');
    return { success: true, message: 'Joined team successfully.' };
}
