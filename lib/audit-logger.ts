'use server';

import { headers } from 'next/headers';
import { supabaseAdminClient } from '@/lib/supabase/admin';
import { AuditEventTypes, type AuditEventType, getEventSeverity, shouldLogEvent } from '@/lib/audit-events';

/**
 * Enhanced Audit Logger
 * 
 * Provides comprehensive audit logging with automatic IP capture,
 * severity classification, and retention management.
 */

/**
 * Captures request context (IP, User-Agent) from headers
 */
async function getRequestContext(): Promise<{ ip?: string; userAgent?: string }> {
    try {
        const headersList = await headers();
        
        // Get IP address from various header sources
        const forwardedFor = headersList.get('x-forwarded-for');
        const realIp = headersList.get('x-real-ip');
        const cfConnectingIp = headersList.get('cf-connecting-ip');
        
        const ip = cfConnectingIp || realIp || forwardedFor?.split(',')[0]?.trim() || 'unknown';
        
        // Get user agent
        const userAgent = headersList.get('user-agent') || undefined;
        
        return { ip, userAgent };
    } catch {
        // Headers might not be available in all contexts
        return {};
    }
}

/**
 * Logs an audit event with automatic context capture
 */
export async function logAuditEvent(
    eventType: AuditEventType,
    options: {
        actorId?: string;
        targetResourceId?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        payloadDiff?: any;
        severity?: 'info' | 'warning' | 'critical';
    } = {}
): Promise<void> {
    // Check if this event should be logged (sampling)
    if (!shouldLogEvent(eventType)) {
        return;
    }

    const {
        actorId,
        targetResourceId,
        payloadDiff,
        severity = getEventSeverity(eventType),
    } = options;

    // Capture request context
    const { ip, userAgent } = await getRequestContext();

    try {
        await supabaseAdminClient.from('audit_logs').insert({
            event_type: eventType,
            actor_id: actorId,
            target_resource_id: targetResourceId,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            payload_diff: payloadDiff as any,
            severity,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ip_address: ip as any,
            user_agent: userAgent,
        });
    } catch (error) {
        console.error('Failed to log audit event:', error);
        // Don't throw - audit failure shouldn't crash the application
        // In production, you might want to send this to a fallback logging service
    }
}

/**
 * Logs authentication events
 */
export async function logAuthEvent(
    eventType: typeof AuditEventTypes.AUTH[keyof typeof AuditEventTypes.AUTH],
    options: {
        userId?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        payloadDiff?: any;
    } = {}
): Promise<void> {
    await logAuditEvent(eventType, {
        actorId: options.userId,
        payloadDiff: options.payloadDiff,
    });
}

/**
 * Logs user account events
 */
export async function logUserEvent(
    eventType: typeof AuditEventTypes.USER[keyof typeof AuditEventTypes.USER],
    options: {
        userId: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        payloadDiff?: any;
    }
): Promise<void> {
    await logAuditEvent(eventType, {
        actorId: options.userId,
        targetResourceId: options.userId,
        payloadDiff: options.payloadDiff,
    });
}

/**
 * Logs challenge-related events
 */
export async function logChallengeEvent(
    eventType: typeof AuditEventTypes.CHALLENGE[keyof typeof AuditEventTypes.CHALLENGE],
    options: {
        userId: string;
        challengeId: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        payloadDiff?: any;
    }
): Promise<void> {
    await logAuditEvent(eventType, {
        actorId: options.userId,
        targetResourceId: options.challengeId,
        payloadDiff: options.payloadDiff,
    });
}

/**
 * Logs team-related events
 */
export async function logTeamEvent(
    eventType: typeof AuditEventTypes.TEAM[keyof typeof AuditEventTypes.TEAM],
    options: {
        userId: string;
        teamId: string;
        targetUserId?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        payloadDiff?: any;
    }
): Promise<void> {
    await logAuditEvent(eventType, {
        actorId: options.userId,
        targetResourceId: options.teamId,
        payloadDiff: {
            ...options.payloadDiff,
            target_user_id: options.targetUserId,
        },
    });
}

/**
 * Logs billing/subscription events
 */
export async function logBillingEvent(
    eventType: typeof AuditEventTypes.BILLING[keyof typeof AuditEventTypes.BILLING],
    options: {
        userId: string;
        subscriptionId?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        payloadDiff?: any;
    }
): Promise<void> {
    await logAuditEvent(eventType, {
        actorId: options.userId,
        targetResourceId: options.subscriptionId,
        payloadDiff: options.payloadDiff,
    });
}

/**
 * Logs container instance events
 */
export async function logContainerEvent(
    eventType: typeof AuditEventTypes.CONTAINER[keyof typeof AuditEventTypes.CONTAINER],
    options: {
        userId: string;
        containerId: string;
        challengeId: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        payloadDiff?: any;
    }
): Promise<void> {
    await logAuditEvent(eventType, {
        actorId: options.userId,
        targetResourceId: options.containerId,
        payloadDiff: {
            ...options.payloadDiff,
            challenge_id: options.challengeId,
        },
    });
}

/**
 * Logs security events
 */
export async function logSecurityEvent(
    eventType: typeof AuditEventTypes.SECURITY[keyof typeof AuditEventTypes.SECURITY],
    options: {
        userId?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        payloadDiff?: any;
    } = {}
): Promise<void> {
    await logAuditEvent(eventType, {
        actorId: options.userId,
        severity: 'critical',
        payloadDiff: options.payloadDiff,
    });
}

// Re-export event types for convenience
export { AuditEventTypes };
