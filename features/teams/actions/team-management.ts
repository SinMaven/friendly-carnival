'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';

export type CreateInviteResult = {
    success: boolean;
    message: string;
    code?: string;
};

export async function createInvite(teamId: string): Promise<CreateInviteResult> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
        return { success: false, message: 'Unauthorized' };
    }

    // Check if user is team captain
    const { data: team } = await supabase
        .from('teams')
        .select('captain_id')
        .eq('id', teamId)
        .single();

    if (!team || team.captain_id !== user.id) {
        return { success: false, message: 'Only team captains can create invites' };
    }

    // Generate unique invite code
    const code = nanoid(10);

    const { error } = await supabase
        .from('team_invites')
        .insert({
            team_id: teamId,
            code,
            created_by: user.id,
        });

    if (error) {
        console.error('Error creating invite:', error);
        return { success: false, message: 'Failed to create invite' };
    }

    return { success: true, message: 'Invite created', code };
}

export async function joinTeamByCode(code: string): Promise<{ success: boolean; message: string }> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
        return { success: false, message: 'Unauthorized' };
    }

    // Check if already in a team
    const { data: existingMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

    if (existingMember) {
        return { success: false, message: 'You are already in a team' };
    }

    // Find invite
    const { data: invite, error: inviteError } = await supabase
        .from('team_invites')
        .select('*')
        .eq('code', code)
        .single();

    if (inviteError || !invite) {
        return { success: false, message: 'Invalid invite code' };
    }

    // Check expiration
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
        return { success: false, message: 'Invite has expired' };
    }

    // Check max uses
    if (invite.max_uses && invite.uses >= invite.max_uses) {
        return { success: false, message: 'Invite has reached max uses' };
    }

    // Add user to team
    const { error: joinError } = await supabase
        .from('team_members')
        .insert({
            team_id: invite.team_id,
            user_id: user.id,
            role: 'member',
        });

    if (joinError) {
        console.error('Error joining team:', joinError);
        return { success: false, message: 'Failed to join team' };
    }

    // Increment invite uses
    await supabase
        .from('team_invites')
        .update({ uses: invite.uses + 1 })
        .eq('id', invite.id);

    revalidatePath('/dashboard/team');
    return { success: true, message: 'Successfully joined team!' };
}

export async function leaveTeam(): Promise<{ success: boolean; message: string }> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
        return { success: false, message: 'Unauthorized' };
    }

    // Check if user is team captain
    const { data: team } = await supabase
        .from('teams')
        .select('id, captain_id')
        .eq('captain_id', user.id)
        .maybeSingle();

    if (team) {
        return { success: false, message: 'Team captains cannot leave. Transfer ownership first.' };
    }

    // Remove from team
    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('user_id', user.id);

    if (error) {
        console.error('Error leaving team:', error);
        return { success: false, message: 'Failed to leave team' };
    }

    revalidatePath('/dashboard/team');
    return { success: true, message: 'Left team successfully' };
}

export async function removeMember(memberId: string): Promise<{ success: boolean; message: string }> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
        return { success: false, message: 'Unauthorized' };
    }

    // Get member's team and verify captain
    const { data: member } = await supabase
        .from('team_members')
        .select('team_id, user_id')
        .eq('id', memberId)
        .single();

    if (!member) {
        return { success: false, message: 'Member not found' };
    }

    const { data: team } = await supabase
        .from('teams')
        .select('captain_id')
        .eq('id', member.team_id)
        .single();

    if (!team || team.captain_id !== user.id) {
        return { success: false, message: 'Only captains can remove members' };
    }

    if (member.user_id === user.id) {
        return { success: false, message: 'Cannot remove yourself' };
    }

    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

    if (error) {
        console.error('Error removing member:', error);
        return { success: false, message: 'Failed to remove member' };
    }

    revalidatePath('/dashboard/team');
    return { success: true, message: 'Member removed' };
}
