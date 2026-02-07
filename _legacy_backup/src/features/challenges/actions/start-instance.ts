'use server';

import { createClient } from '@/libs/supabase/server';
import { Tables } from '@/libs/supabase/types';

export type StartInstanceResult = {
    success: boolean;
    message: string;
    instance?: Tables<'container_instances'>;
};

/**
 * Provisions a new container instance for a specific challenge.
 * 
 * @param challengeId - The UUID of the challenge
 * @returns {Promise<StartInstanceResult>} Result of the provisioning request
 */
export async function startInstance(challengeId: string): Promise<StartInstanceResult> {
    const supabase = await createClient();

    // 1. Auth Check
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    if (!userId) {
        return { success: false, message: 'Unauthorized' };
    }

    // 2. Check Challenge Requirements
    const { data: challenge } = await supabase
        .from('challenges')
        .select('requires_container, container_image_ref')
        .eq('id', challengeId)
        .single();

    if (!challenge || !challenge.requires_container) {
        return { success: false, message: 'Challenge does not require a container.' };
    }

    // 3. Check for Existing Active Instance
    const { data: existingInstance } = await supabase
        .from('container_instances')
        .select('*')
        .eq('user_id', userId)
        .eq('challenge_id', challengeId)
        // Check for non-terminal states
        .in('status', ['provisioning', 'running'])
        .maybeSingle();

    if (existingInstance) {
        return {
            success: true,
            message: 'Instance already running.',
            instance: existingInstance
        };
    }

    // 4. Provisioning Logic (Mock for MVP)
    // In production, this would call an external orchestrator (e.g., AWS ECS, K8s API)

    // Create initial record
    const { data: newInstance, error: insertError } = await supabase
        .from('container_instances')
        .insert({
            user_id: userId,
            challenge_id: challengeId,
            status: 'provisioning',
            provider_task_id: `mock-${Date.now()}`,
            expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour TTL
        })
        .select()
        .single();

    if (insertError || !newInstance) {
        console.error('Error creating instance record:', insertError);
        return { success: false, message: 'Failed to provision instance.' };
    }

    // SIMULATE ORCHESTRATION DELAY & SUCCESS
    // In a real async flow, the external system would webhook back to update this.
    // For this synchronous MVP, we just update it immediately.

    // Generate mock connection info
    const mockConnectionInfo = {
        ssh_cmd: `ssh player@ctf-box-${newInstance.id.slice(0, 8)}.duckurity.io -p 2222`,
        password: Math.random().toString(36).slice(-8),
        http_url: `http://ctf-box-${newInstance.id.slice(0, 8)}.duckurity.io`
    };

    const { data: updatedInstance, error: updateError } = await supabase
        .from('container_instances')
        .update({
            status: 'running',
            connection_info: mockConnectionInfo
        })
        .eq('id', newInstance.id)
        .select()
        .single();

    if (updateError) {
        console.error('Error updating instance status:', updateError);
        return { success: true, message: 'Instance provisioned but status update failed.', instance: newInstance };
    }

    return {
        success: true,
        message: 'Container instance started successfully.',
        instance: updatedInstance
    };
}
