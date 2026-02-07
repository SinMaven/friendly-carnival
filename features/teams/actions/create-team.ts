'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Tables } from '@/lib/supabase/types';
import { revalidatePath } from 'next/cache';

export type CreateTeamResult = {
    success: boolean;
    message: string;
    team?: Tables<'teams'>;
};

/**
 * Creates a new team with the current user as captain and owner.
 * 
 * @param name - The display name of the team
 * @param slug - The unique URL-friendly slug
 * @returns {Promise<CreateTeamResult>} Result of team creation
 */
export async function createTeam(name: string, slug: string): Promise<CreateTeamResult> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) return { success: false, message: 'Unauthorized' };

    // Check if user is already in a team
    // Note: We might want allow multiple teams in future, but specs usually imply one active team for CTF
    const { data: existingMember } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .maybeSingle();

    if (existingMember) {
        return { success: false, message: 'You are already in a team.' };
    }

    // Create Team
    const { data: team, error: createError } = await supabase
        .from('teams')
        .insert({
            name,
            slug,
            captain_id: user.id
        })
        .select()
        .single();

    if (createError) {
        if (createError.code === '23505') { // Unique violation
            return { success: false, message: 'Team name or slug already taken.' };
        }
        console.error('Error creating team:', createError);
        return { success: false, message: 'Failed to create team.' };
    }

    // Add Creator as Owner
    const { error: memberError } = await supabase
        .from('team_members')
        .insert({
            team_id: team.id,
            user_id: user.id,
            role: 'owner'
        });

    if (memberError) {
        console.error('Error adding team member:', memberError);
        return { success: true, message: 'Team created but failed to join automatically.', team };
    }

    revalidatePath('/dashboard/team');
    return { success: true, message: 'Team created successfully.', team };
}
