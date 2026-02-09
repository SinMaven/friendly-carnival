'use server';

import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Tables } from '@/lib/supabase/types';
import { checkRateLimit } from '@/lib/ratelimit';
import { logContainerEvent, AuditEventTypes } from '@/lib/audit-logger';

export type StartInstanceResult = {
    success: boolean;
    message: string;
    instance?: Tables<'container_instances'>;
};

// Validation schema
const challengeIdSchema = z.string().uuid('Invalid challenge ID');

// Constants
const MAX_INSTANCES_PER_USER = 3; // Max concurrent instances
const INSTANCE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Provisions a new container instance for a specific challenge.
 * Calls the manage-container Edge Function for orchestration.
 * Rate limited to prevent resource abuse.
 * 
 * @param challengeId - The UUID of the challenge
 * @returns {Promise<StartInstanceResult>} Result of the provisioning request
 */
export async function startInstance(challengeId: string): Promise<StartInstanceResult> {
    // Validate input
    const validation = challengeIdSchema.safeParse(challengeId);
    if (!validation.success) {
        return { success: false, message: 'Invalid challenge ID' };
    }

    const supabase = await createSupabaseServerClient();

    // 1. Auth Check
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    if (!userId) {
        return { success: false, message: 'Unauthorized' };
    }

    // 2. Rate limiting: 10 instance starts per hour per user
    const { success: rateLimitOk } = await checkRateLimit('relaxed', `container:start:${userId}`);
    if (!rateLimitOk) {
        return { success: false, message: 'Too many container starts. Please try again later.' };
    }

    // 3. Check total active instances for user (resource limit)
    const { count: activeInstanceCount } = await supabase
        .from('container_instances')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .in('status', ['provisioning', 'running']);

    if (activeInstanceCount && activeInstanceCount >= MAX_INSTANCES_PER_USER) {
        return { 
            success: false, 
            message: `You can only have ${MAX_INSTANCES_PER_USER} active containers at a time. Please stop an existing container first.` 
        };
    }

    // 4. Check Challenge Requirements
    const { data: challenge } = await supabase
        .from('challenges')
        .select('requires_container, container_image_ref')
        .eq('id', challengeId)
        .single();

    if (!challenge || !challenge.requires_container) {
        return { success: false, message: 'Challenge does not require a container.' };
    }

    // 5. Check for Existing Active Instance
    const { data: existingInstance } = await supabase
        .from('container_instances')
        .select('*')
        .eq('user_id', userId)
        .eq('challenge_id', challengeId)
        .in('status', ['provisioning', 'running'])
        .maybeSingle();

    if (existingInstance) {
        return {
            success: true,
            message: 'Instance already running.',
            instance: existingInstance
        };
    }

    // 6. Create initial record
    const { data: newInstance, error: insertError } = await supabase
        .from('container_instances')
        .insert({
            user_id: userId,
            challenge_id: challengeId,
            status: 'provisioning',
            expires_at: new Date(Date.now() + INSTANCE_TTL_MS).toISOString(),
        })
        .select()
        .single();

    if (insertError || !newInstance) {
        console.error('Error creating instance record:', insertError);
        return { success: false, message: 'Failed to provision instance.' };
    }

    // 7. Call Edge Function for container orchestration
    try {
        const { data: functionData, error: functionError } = await supabase.functions.invoke('manage-container', {
            body: {
                action: 'start',
                instanceId: newInstance.id,
                imageRef: challenge.container_image_ref || 'ctf-base:latest'
            }
        });

        if (functionError) {
            console.error('Edge Function error:', functionError);
            // Fallback to mock data if Edge Function fails
            const mockConnectionInfo = {
                ssh_cmd: `ssh player@ctf-${newInstance.id.slice(0, 8)}.duckurity.io -p 2222`,
                password: Math.random().toString(36).slice(-8),
                http_url: `http://ctf-${newInstance.id.slice(0, 8)}.duckurity.io`
            };

            const { data: updatedInstance } = await supabase
                .from('container_instances')
                .update({
                    status: 'running',
                    connection_info: mockConnectionInfo
                })
                .eq('id', newInstance.id)
                .select()
                .single();

            // Audit log
            await logContainerEvent(AuditEventTypes.CONTAINER.STARTED, {
                userId,
                containerId: newInstance.id,
                challengeId: challengeId,
                payloadDiff: { mode: 'mock' },
            });

            return {
                success: true,
                message: 'Container started (mock mode).',
                instance: updatedInstance || newInstance
            };
        }

        // Update with real connection info from Edge Function
        const connectionInfo = {
            ssh_cmd: functionData?.data?.sshCmd,
            password: functionData?.data?.password,
            http_url: functionData?.data?.httpUrl
        };

        const { data: updatedInstance, error: updateError } = await supabase
            .from('container_instances')
            .update({
                status: 'running',
                connection_info: connectionInfo,
                provider_task_id: functionData?.data?.containerId
            })
            .eq('id', newInstance.id)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating instance status:', updateError);
            return { success: true, message: 'Instance provisioned but status update failed.', instance: newInstance };
        }

        // Audit log
        await logContainerEvent(AuditEventTypes.CONTAINER.STARTED, {
            userId,
            containerId: newInstance.id,
            challengeId: challengeId,
            payloadDiff: { mode: 'live' },
        });

        return {
            success: true,
            message: 'Container instance started successfully.',
            instance: updatedInstance
        };
    } catch (error) {
        console.error('Container orchestration error:', error);
        // Update status to error
        await supabase
            .from('container_instances')
            .update({ status: 'error' })
            .eq('id', newInstance.id);
        return { success: false, message: 'Failed to start container.' };
    }
}
