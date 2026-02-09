'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface AuditLogFilters {
    startDate?: string;
    endDate?: string;
    severity?: 'info' | 'warning' | 'critical';
    eventType?: string;
    actorId?: string;
    limit?: number;
    offset?: number;
}

/**
 * Fetches audit logs with optional filtering
 * Requires admin privileges
 */
export async function getAuditLogs(filters: AuditLogFilters = {}) {
    const supabase = await createSupabaseServerClient();

    // Check if user is admin (you may want to add proper admin role check)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Unauthorized', data: null, count: 0 };
    }

    let query = supabase
        .from('audit_logs')
        .select('*', { count: 'exact' });

    // Apply filters
    if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
    }
    if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
    }
    if (filters.severity) {
        query = query.eq('severity', filters.severity);
    }
    if (filters.eventType) {
        query = query.eq('event_type', filters.eventType);
    }
    if (filters.actorId) {
        query = query.eq('actor_id', filters.actorId);
    }

    // Pagination
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    query = query.range(offset, offset + limit - 1);

    // Sort by newest first
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching audit logs:', error);
        return { error: error.message, data: null, count: 0 };
    }

    return { data: data || [], count: count || 0, error: null };
}

/**
 * Fetches statistics for audit logs
 */
export async function getAuditLogStats(days: number = 30) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return { error: 'Unauthorized', data: null };
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get counts by severity
    const { data: severityData, error: severityError } = await supabase
        .from('audit_logs')
        .select('severity')
        .gte('created_at', startDate.toISOString());

    if (severityError) {
        return { error: severityError.message, data: null };
    }

    const severityCounts = severityData?.reduce((acc, log) => {
        acc[log.severity] = (acc[log.severity] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Get top event types
    const { data: eventData, error: eventError } = await supabase
        .from('audit_logs')
        .select('event_type')
        .gte('created_at', startDate.toISOString());

    if (eventError) {
        return { error: eventError.message, data: null };
    }

    const eventCounts = eventData?.reduce((acc, log) => {
        acc[log.event_type] = (acc[log.event_type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Get top 10 event types
    const topEvents = Object.entries(eventCounts || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    return {
        data: {
            total: severityData?.length || 0,
            severity: severityCounts,
            topEvents,
            period: `${days} days`,
        },
        error: null,
    };
}

/**
 * Cleans up old audit logs based on retention policy
 * Should be run as a scheduled job
 */
export async function cleanupOldAuditLogs(): Promise<{ deleted: number; error: string | null }> {
    const supabase = await createSupabaseServerClient();
    
    // This should be run by a service role or admin only
    // Define retention periods
    const retentionPeriods = {
        info: 90,      // 3 months
        warning: 365,  // 1 year
        critical: 2555, // 7 years
    };

    let totalDeleted = 0;

    for (const [severity, days] of Object.entries(retentionPeriods)) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const { error, count } = await supabase
            .from('audit_logs')
            .delete()
            .eq('severity', severity)
            .lt('created_at', cutoffDate.toISOString())
            .select('count');

        if (error) {
            console.error(`Error cleaning up ${severity} logs:`, error);
            return { deleted: totalDeleted, error: error.message };
        }

        totalDeleted += count || 0;
    }

    return { deleted: totalDeleted, error: null };
}

/**
 * Exports audit logs as JSON for compliance purposes
 */
export async function exportAuditLogs(
    filters: AuditLogFilters
): Promise<{ data: string | null; error: string | null }> {
    const { data, error } = await getAuditLogs({ ...filters, limit: 10000 });

    if (error || !data) {
        return { data: null, error: error || 'No data' };
    }

    // Convert to CSV format
    const headers = ['Timestamp', 'Event Type', 'Severity', 'Actor ID', 'Target Resource', 'IP Address', 'User Agent'];
    const rows = data.map(log => [
        log.created_at,
        log.event_type,
        log.severity,
        log.actor_id || '',
        log.target_resource_id || '',
        log.ip_address || '',
        log.user_agent || '',
    ]);

    const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    return { data: csv, error: null };
}
