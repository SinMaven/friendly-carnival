'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { nanoid } from 'nanoid'

export type TeamActionResult = {
    success: boolean
    message: string
    data?: any
}

/**
 * Creates a new team with the current user as captain.
 */
export async function createTeam(name: string): Promise<TeamActionResult> {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.id) {
        return { success: false, message: 'Unauthorized' }
    }

    // Check if user is already in a team
    const { data: existingMembership } = await supabase
        .from('team_members')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

    if (existingMembership) {
        return { success: false, message: 'You are already in a team' }
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Create team
    const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
            name,
            slug,
            captain_id: user.id,
        })
        .select()
        .single()

    if (teamError) {
        console.error('Team creation error:', teamError)
        return { success: false, message: 'Failed to create team' }
    }

    // Add user as team member
    const { error: memberError } = await supabase
        .from('team_members')
        .insert({
            team_id: team.id,
            user_id: user.id,
            role: 'captain',
        })

    if (memberError) {
        console.error('Member creation error:', memberError)
        // Rollback team creation
        await supabase.from('teams').delete().eq('id', team.id)
        return { success: false, message: 'Failed to add you to the team' }
    }

    revalidatePath('/dashboard/team')
    revalidatePath('/dashboard', 'layout')
    return { success: true, message: 'Team created successfully', data: team }
}

/**
 * Joins a team using an invite code.
 */
export async function joinTeam(inviteCode: string): Promise<TeamActionResult> {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.id) {
        return { success: false, message: 'Unauthorized' }
    }

    // Check if user is already in a team
    const { data: existingMembership } = await supabase
        .from('team_members')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

    if (existingMembership) {
        return { success: false, message: 'You are already in a team' }
    }

    // Find invite
    const { data: invite } = await supabase
        .from('team_invites')
        .select('id, team_id, expires_at, max_uses, uses')
        .eq('code', inviteCode)
        .maybeSingle()

    if (!invite) {
        return { success: false, message: 'Invalid invite code' }
    }

    // Check expiration
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
        return { success: false, message: 'Invite code has expired' }
    }

    // Check max uses
    if (invite.max_uses && invite.uses >= invite.max_uses) {
        return { success: false, message: 'Invite code has reached maximum uses' }
    }

    // Add user to team
    const { error: memberError } = await supabase
        .from('team_members')
        .insert({
            team_id: invite.team_id,
            user_id: user.id,
            role: 'member',
        })

    if (memberError) {
        console.error('Join team error:', memberError)
        return { success: false, message: 'Failed to join team' }
    }

    // Increment invite uses
    await supabase
        .from('team_invites')
        .update({ uses: invite.uses + 1 })
        .eq('id', invite.id)

    revalidatePath('/dashboard/team')
    revalidatePath('/dashboard', 'layout')
    return { success: true, message: 'Successfully joined the team' }
}

/**
 * Leaves the current team.
 */
export async function leaveTeam(): Promise<TeamActionResult> {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.id) {
        return { success: false, message: 'Unauthorized' }
    }

    // Get membership
    const { data: membership } = await supabase
        .from('team_members')
        .select('id, team_id, role')
        .eq('user_id', user.id)
        .single()

    if (!membership) {
        return { success: false, message: 'You are not in a team' }
    }

    // Captains cannot leave (must delete team or transfer ownership)
    if (membership.role === 'captain') {
        return { success: false, message: 'Captains cannot leave. Delete the team or transfer ownership.' }
    }

    // Remove from team
    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', membership.id)

    if (error) {
        console.error('Leave team error:', error)
        return { success: false, message: 'Failed to leave team' }
    }

    revalidatePath('/dashboard/team')
    revalidatePath('/dashboard', 'layout')
    return { success: true, message: 'Successfully left the team' }
}

/**
 * Generates a new invite code for the team.
 * Only captains can generate invite codes.
 */
export async function generateInviteCode(
    teamId: string,
    options?: { expiresInHours?: number; maxUses?: number }
): Promise<TeamActionResult> {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.id) {
        return { success: false, message: 'Unauthorized' }
    }

    // Verify user is team captain
    const { data: team } = await supabase
        .from('teams')
        .select('captain_id')
        .eq('id', teamId)
        .single()

    if (!team || team.captain_id !== user.id) {
        return { success: false, message: 'Only the team captain can generate invite codes' }
    }

    // Generate code
    const code = nanoid(8).toUpperCase()
    const expiresAt = options?.expiresInHours
        ? new Date(Date.now() + options.expiresInHours * 60 * 60 * 1000).toISOString()
        : null

    const { data: invite, error } = await supabase
        .from('team_invites')
        .insert({
            team_id: teamId,
            code,
            expires_at: expiresAt,
            max_uses: options?.maxUses || null,
            uses: 0,
        })
        .select()
        .single()

    if (error) {
        console.error('Generate invite error:', error)
        return { success: false, message: 'Failed to generate invite code' }
    }

    return { success: true, message: 'Invite code generated', data: invite }
}

/**
 * Updates team name.
 * Only captains can update team settings.
 */
export async function updateTeamName(teamId: string, name: string): Promise<TeamActionResult> {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.id) {
        return { success: false, message: 'Unauthorized' }
    }

    // Verify user is team captain
    const { data: team } = await supabase
        .from('teams')
        .select('captain_id')
        .eq('id', teamId)
        .single()

    if (!team || team.captain_id !== user.id) {
        return { success: false, message: 'Only the team captain can update team settings' }
    }

    // Generate new slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const { error } = await supabase
        .from('teams')
        .update({ name, slug })
        .eq('id', teamId)

    if (error) {
        console.error('Update team name error:', error)
        return { success: false, message: 'Failed to update team name' }
    }

    revalidatePath('/dashboard/team')
    revalidatePath('/dashboard', 'layout')
    return { success: true, message: 'Team name updated' }
}

/**
 * Deletes the team.
 * Only captains can delete the team.
 */
export async function deleteTeam(teamId: string): Promise<TeamActionResult> {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.id) {
        return { success: false, message: 'Unauthorized' }
    }

    // Verify user is team captain
    const { data: team } = await supabase
        .from('teams')
        .select('captain_id')
        .eq('id', teamId)
        .single()

    if (!team || team.captain_id !== user.id) {
        return { success: false, message: 'Only the team captain can delete the team' }
    }

    // Delete team (cascade will handle members and invites)
    const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId)

    if (error) {
        console.error('Delete team error:', error)
        return { success: false, message: 'Failed to delete team' }
    }

    revalidatePath('/dashboard/team')
    revalidatePath('/dashboard', 'layout')
    return { success: true, message: 'Team deleted' }
}

/**
 * Removes a member from the team.
 * Only captains can remove members. Captains cannot be removed.
 */
export async function removeMember(memberId: string, teamId: string): Promise<TeamActionResult> {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.id) {
        return { success: false, message: 'Unauthorized' }
    }

    // Verify user is team captain
    const { data: team } = await supabase
        .from('teams')
        .select('captain_id')
        .eq('id', teamId)
        .single()

    if (!team || team.captain_id !== user.id) {
        return { success: false, message: 'Only the team captain can remove members' }
    }

    // Get the member's user_id
    const { data: member } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('id', memberId)
        .single()

    if (!member) {
        return { success: false, message: 'Member not found' }
    }

    // Cannot remove the captain
    if (member.user_id === team.captain_id) {
        return { success: false, message: 'Cannot remove the team captain' }
    }

    // Remove member
    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId)

    if (error) {
        console.error('Remove member error:', error)
        return { success: false, message: 'Failed to remove member' }
    }

    revalidatePath('/dashboard/team')
    revalidatePath('/dashboard', 'layout')
    return { success: true, message: 'Member removed from team' }
}

/**
 * Transfers team ownership to another member.
 * Only captains can transfer ownership.
 * Uses admin client to ensure atomic-like updates without RLS interference.
 */
export async function transferOwnership(memberId: string, teamId: string): Promise<TeamActionResult> {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.id) {
        return { success: false, message: 'Unauthorized' }
    }

    if (!process.env.SUPABASE_SECRET_KEY) {
        console.error('SUPABASE_SECRET_KEY is not defined')
        return { success: false, message: 'Server configuration error' }
    }

    // Verify user is team captain
    const { data: team } = await supabase
        .from('teams')
        .select('captain_id')
        .eq('id', teamId)
        .single()

    if (!team || team.captain_id !== user.id) {
        return { success: false, message: 'Only the team captain can transfer ownership' }
    }

    // Verify member is in team
    const { data: member } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('id', memberId)
        .eq('team_id', teamId)
        .single()

    if (!member) {
        return { success: false, message: 'Member not found in team' }
    }

    if (member.user_id === user.id) {
        return { success: false, message: 'You are already the captain' }
    }

    // Use admin client for sensitive updates
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )

    // Update team captain
    const { error: teamError } = await supabaseAdmin
        .from('teams')
        .update({ captain_id: member.user_id })
        .eq('id', teamId)

    if (teamError) {
        console.error('Transfer ownership team update error:', teamError)
        return { success: false, message: 'Failed to transfer ownership' }
    }

    // Update roles
    // Promoted member -> captain
    await supabaseAdmin
        .from('team_members')
        .update({ role: 'captain' })
        .eq('id', memberId)

    // Old captain -> member
    // Find the old captain's member_id
    const { data: oldCaptainMember } = await supabaseAdmin
        .from('team_members')
        .select('id')
        .eq('user_id', user.id)
        .eq('team_id', teamId)
        .single()

    if (oldCaptainMember) {
        await supabaseAdmin
            .from('team_members')
            .update({ role: 'member' })
            .eq('id', oldCaptainMember.id)
    }

    revalidatePath('/dashboard/team')
    revalidatePath('/dashboard', 'layout')
    return { success: true, message: 'Ownership transferred successfully' }
}
