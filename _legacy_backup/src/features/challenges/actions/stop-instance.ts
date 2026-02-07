'use server';

import { createClient } from '@/libs/supabase/server';

export type StopInstanceResult = {
    success: boolean;
    message: string;
};

/**
 * Stops and removes a container instance.
 * 
 * @param instanceId - The UUID of the container instance
 * @returns {Promise<StopInstanceResult>} Result of the stop request
 */
export async function stopInstance(instanceId: string): Promise<StopInstanceResult> {
    const supabase = await createClient();

    // 1. Auth Check
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    if (!userId) {
        return { success: false, message: 'Unauthorized' };
    }

    // 2. Verify Ownership and Existence
    const { data: instance } = await supabase
        .from('container_instances')
        .select('*')
        .eq('id', instanceId)
        .eq('user_id', userId)
        .single();

    if (!instance) {
        return { success: false, message: 'Instance not found or unauthorized.' };
    }

    // 3. Stop Logic (Mock for MVP)
    // In production, call orchestrator to kill task.

    // 4. Update DB Status
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

    return { success: true, message: 'Instance stopped successfully.' };
}
