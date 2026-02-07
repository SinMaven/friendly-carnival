'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { TablesInsert } from '@/libs/supabase/types';

/**
 * logs an audit event to the database.
 * This should be called by sensitive actions (login, payment, config change).
 * 
 * @param event - The audit event data
 */
export async function logAuditEvent(event: {
    event_type: string;
    actor_id?: string;
    target_resource_id?: string;
    payload_diff?: any;
    severity?: 'info' | 'warning' | 'critical';
    ip_address?: string;
}): Promise<void> {
    // We use the admin client because audit_logs usually have strict RLS (no public insert).

    try {
        await supabaseAdminClient.from('audit_logs').insert({
            event_type: event.event_type,
            actor_id: event.actor_id,
            target_resource_id: event.target_resource_id,
            payload_diff: event.payload_diff,
            severity: event.severity || 'info',
            ip_address: event.ip_address as any, // Type casting for INET
        });
    } catch (error) {
        console.error('Failed to log audit event:', error);
        // Do not throw, auditing failure shouldn't crash the app flow usually
    }
}
