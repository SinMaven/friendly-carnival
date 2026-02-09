/**
 * Audit Event Types and Utilities
 * 
 * This module defines all auditable events in the system and provides
 * utilities for consistent audit logging across the application.
 */

export const AuditEventTypes = {
    // Authentication Events
    AUTH: {
        LOGIN: 'auth.login',
        LOGOUT: 'auth.logout',
        LOGIN_FAILED: 'auth.login_failed',
        MFA_ENABLED: 'auth.mfa_enabled',
        MFA_DISABLED: 'auth.mfa_disabled',
        MFA_CHALLENGE: 'auth.mfa_challenge',
        MFA_CHALLENGE_FAILED: 'auth.mfa_challenge_failed',
        PASSWORD_CHANGED: 'auth.password_changed',
        PASSWORD_RESET_REQUESTED: 'auth.password_reset_requested',
        PASSWORD_RESET_COMPLETED: 'auth.password_reset_completed',
        OAUTH_LOGIN: 'auth.oauth_login',
        SESSION_REFRESHED: 'auth.session_refreshed',
    },
    // User Account Events
    USER: {
        CREATED: 'user.created',
        UPDATED: 'user.updated',
        DELETED: 'user.deleted',
        EMAIL_CHANGED: 'user.email_changed',
        AVATAR_UPDATED: 'user.avatar_updated',
        SETTINGS_CHANGED: 'user.settings_changed',
    },
    // Challenge Events
    CHALLENGE: {
        VIEWED: 'challenge.viewed',
        ATTEMPTED: 'challenge.attempted',
        SOLVED: 'challenge.solved',
        SOLVE_FAILED: 'challenge.solve_failed',
        FLAG_SUBMITTED: 'challenge.flag_submitted',
        ASSET_DOWNLOADED: 'challenge.asset_downloaded',
        HINT_REQUESTED: 'challenge.hint_requested',
    },
    // Container Events
    CONTAINER: {
        STARTED: 'container.started',
        STOPPED: 'container.stopped',
        EXPIRED: 'container.expired',
        RESET_REQUESTED: 'container.reset_requested',
    },
    // Team Events
    TEAM: {
        CREATED: 'team.created',
        UPDATED: 'team.updated',
        DELETED: 'team.deleted',
        MEMBER_JOINED: 'team.member_joined',
        MEMBER_LEFT: 'team.member_left',
        MEMBER_REMOVED: 'team.member_removed',
        OWNERSHIP_TRANSFERRED: 'team.ownership_transferred',
        INVITE_SENT: 'team.invite_sent',
        INVITE_ACCEPTED: 'team.invite_accepted',
        INVITE_REVOKED: 'team.invite_revoked',
    },
    // Subscription/Billing Events
    BILLING: {
        SUBSCRIPTION_CREATED: 'billing.subscription_created',
        SUBSCRIPTION_UPDATED: 'billing.subscription_updated',
        SUBSCRIPTION_CANCELLED: 'billing.subscription_cancelled',
        SUBSCRIPTION_RENEWED: 'billing.subscription_renewed',
        SUBSCRIPTION_EXPIRED: 'billing.subscription_expired',
        PAYMENT_SUCCEEDED: 'billing.payment_succeeded',
        PAYMENT_FAILED: 'billing.payment_failed',
        INVOICE_GENERATED: 'billing.invoice_generated',
        CHECKOUT_INITIATED: 'billing.checkout_initiated',
        CHECKOUT_COMPLETED: 'billing.checkout_completed',
        CUSTOMER_PORTAL_ACCESSED: 'billing.customer_portal_accessed',
    },
    // Admin Events
    ADMIN: {
        CHALLENGE_CREATED: 'admin.challenge_created',
        CHALLENGE_UPDATED: 'admin.challenge_updated',
        CHALLENGE_DELETED: 'admin.challenge_deleted',
        CHALLENGE_PUBLISHED: 'admin.challenge_published',
        USER_PROMOTED: 'admin.user_promoted',
        USER_DEMOTED: 'admin.user_demoted',
        USER_BANNED: 'admin.user_banned',
        USER_UNBANNED: 'admin.user_unbanned',
        SYSTEM_SETTINGS_CHANGED: 'admin.system_settings_changed',
    },
    // API Token Events
    API_TOKEN: {
        CREATED: 'api_token.created',
        REVOKED: 'api_token.revoked',
        USED: 'api_token.used',
        ROTATED: 'api_token.rotated',
    },
    // Security Events
    SECURITY: {
        SUSPICIOUS_ACTIVITY: 'security.suspicious_activity',
        RATE_LIMIT_EXCEEDED: 'security.rate_limit_exceeded',
        IP_BLOCKED: 'security.ip_blocked',
        IP_UNBLOCKED: 'security.ip_unblocked',
        DATA_EXPORTED: 'security.data_exported',
        DATA_IMPORTED: 'security.data_imported',
    },
} as const;

export type AuditEventType = 
    | typeof AuditEventTypes.AUTH[keyof typeof AuditEventTypes.AUTH]
    | typeof AuditEventTypes.USER[keyof typeof AuditEventTypes.USER]
    | typeof AuditEventTypes.CHALLENGE[keyof typeof AuditEventTypes.CHALLENGE]
    | typeof AuditEventTypes.CONTAINER[keyof typeof AuditEventTypes.CONTAINER]
    | typeof AuditEventTypes.TEAM[keyof typeof AuditEventTypes.TEAM]
    | typeof AuditEventTypes.BILLING[keyof typeof AuditEventTypes.BILLING]
    | typeof AuditEventTypes.ADMIN[keyof typeof AuditEventTypes.ADMIN]
    | typeof AuditEventTypes.API_TOKEN[keyof typeof AuditEventTypes.API_TOKEN]
    | typeof AuditEventTypes.SECURITY[keyof typeof AuditEventTypes.SECURITY];

export type SeverityLevel = 'info' | 'warning' | 'critical';

/**
 * Maps event types to their default severity levels
 */
export function getEventSeverity(eventType: AuditEventType): SeverityLevel {
    const criticalEvents: string[] = [
        AuditEventTypes.AUTH.LOGIN_FAILED,
        AuditEventTypes.AUTH.MFA_CHALLENGE_FAILED,
        AuditEventTypes.AUTH.PASSWORD_RESET_COMPLETED,
        AuditEventTypes.USER.DELETED,
        AuditEventTypes.BILLING.PAYMENT_FAILED,
        AuditEventTypes.ADMIN.USER_BANNED,
        AuditEventTypes.ADMIN.USER_UNBANNED,
        AuditEventTypes.SECURITY.SUSPICIOUS_ACTIVITY,
        AuditEventTypes.SECURITY.RATE_LIMIT_EXCEEDED,
        AuditEventTypes.SECURITY.IP_BLOCKED,
    ];
    
    const warningEvents: string[] = [
        AuditEventTypes.AUTH.PASSWORD_CHANGED,
        AuditEventTypes.AUTH.MFA_ENABLED,
        AuditEventTypes.AUTH.MFA_DISABLED,
        AuditEventTypes.TEAM.OWNERSHIP_TRANSFERRED,
        AuditEventTypes.BILLING.SUBSCRIPTION_CANCELLED,
        AuditEventTypes.ADMIN.CHALLENGE_DELETED,
        AuditEventTypes.ADMIN.USER_PROMOTED,
        AuditEventTypes.ADMIN.USER_DEMOTED,
    ];
    
    if (criticalEvents.includes(eventType)) return 'critical';
    if (warningEvents.includes(eventType)) return 'warning';
    return 'info';
}

/**
 * Determines if an event type should be logged
 * Some high-frequency events might be sampled in production
 */
export function shouldLogEvent(eventType: AuditEventType): boolean {
    // All events are logged by default
    // In production, you might want to sample certain high-frequency events
    const sampledEvents: string[] = [
        AuditEventTypes.CHALLENGE.VIEWED,
        AuditEventTypes.AUTH.SESSION_REFRESHED,
    ];
    
    if (sampledEvents.includes(eventType)) {
        // Sample 10% of these events in production
        return Math.random() < 0.1;
    }
    
    return true;
}

/**
 * Retention periods for different severity levels (in days)
 */
export const RETENTION_PERIODS = {
    info: 90,      // 3 months
    warning: 365,  // 1 year
    critical: 2555, // 7 years
} as const;

/**
 * Gets the retention period for a given severity level
 */
export function getRetentionPeriod(severity: SeverityLevel): number {
    return RETENTION_PERIODS[severity];
}
