'use server';

import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/ratelimit';
import { logContainerEvent } from '@/lib/audit-logger';
import { AuditEventTypes } from '@/lib/audit-events';

export type StopInstanceResult = {
    success: boolean;
    message: string;
};

// Validation schema
const instanceIdSchema = z.string().uuid('Invalid instance ID');

/**
 * Stops and removes a container instance.
 * Rate limited to prevent abuse.
 * 
 * @param instanceId - The UUID of the container instance
 * @returns {Promise<StopInstanceResult>} Result of the stop request
 */
export async function stopInstance(instanceId: string): Promise<StopInstanceResult> {
    // Validate input
    const validation = instanceIdSchema.safeParse(instanceId);
    if (!validation.success) {
        return { success: false, message: 'Invalid instance ID' };
    }

    const supabase = await createSupabaseServerClient();

    // 1. Auth Check
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    if (!userId) {
        return { success: false, message: 'Unauthorized' };
    }

    // 2. Rate limiting: 20 stops per hour per user
    const { success: rateLimitOk } = await checkRateLimit('relaxed', `container:stop:${userId}`);
    if (!rateLimitOk) {
        return { success: false, message: 'Too many stop attempts. Please try again later.' };
    }

    // 3. Verify Ownership and Existence
    const { data: instance } = await supabase
        .from('container_instances')
        .select('*')
        .eq('id', instanceId)
        .eq('user_id', userId)
        .single();

    if (!instance) {
        return { success: false, message: 'Instance not found or unauthorized.' };
    }

    // 4. Stop Logic (Mock for MVP)
    // In production, call orchestrator to kill task.

    // 5. Update DB Status
    const { error } = await supabase
        .from('container_instances')
        .update({
            status: 'stopped',
            connection_info: null, // Clear connection info
            expires_at: new Date().toISOString() // Expire immediately
        })
        .eq('id', instanceId);

    if (error) {
        console.error('Error stopping instance:', error);
        return { success: false, message: 'Failed to update instance status.' };
    }

    // 6. Audit log
    await logContainerEvent(AuditEventTypes.CONTAINER.STOPPED, {
        userId,
        containerId: instanceId,
        challengeId: instance.challenge_id,
    });

    return { success: true, message: 'Instance stopped successfully.' };
}
