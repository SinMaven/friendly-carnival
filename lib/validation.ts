import { z } from 'zod';

/**
 * Input Validation Schemas
 * 
 * Uses Zod for type-safe input validation across all server actions.
 * All user inputs should be validated before processing.
 */

// Common patterns
export const uuidSchema = z.string().uuid('Invalid ID format');
export const slugSchema = z.string()
    .min(1, 'Slug is required')
    .max(100, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens');

// Auth schemas
export const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(128, 'Password too long'),
    captchaToken: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const passwordResetSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export const passwordUpdateSchema = z.object({
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password too long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Challenge schemas
export const submitFlagSchema = z.object({
    challengeId: uuidSchema,
    flag: z.string()
        .min(1, 'Flag cannot be empty')
        .max(500, 'Flag too long')
        .trim(),
});

// Team schemas
export const createTeamSchema = z.object({
    name: z.string()
        .min(1, 'Team name is required')
        .max(100, 'Team name too long')
        .trim()
        .regex(/^[\w\s-]+$/, 'Team name contains invalid characters'),
});

export const joinTeamSchema = z.object({
    inviteCode: z.string()
        .min(1, 'Invite code is required')
        .max(20, 'Invalid invite code format')
        .trim(),
});

export const updateTeamSchema = z.object({
    name: z.string()
        .min(1, 'Team name is required')
        .max(100, 'Team name too long')
        .trim(),
});

// Profile schemas
export const updateProfileSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username too long')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    fullName: z.string()
        .max(255, 'Name too long')
        .optional()
        .nullable(),
    bio: z.string()
        .max(500, 'Bio too long')
        .optional()
        .nullable(),
    website: z.string()
        .url('Invalid URL')
        .max(255, 'URL too long')
        .optional()
        .nullable()
        .or(z.literal('')),
    githubHandle: z.string()
        .max(50, 'GitHub handle too long')
        .regex(/^[a-zA-Z0-9-]*$/, 'Invalid GitHub handle')
        .optional()
        .nullable(),
});

export const updateSettingsSchema = z.object({
    themePreference: z.enum(['light', 'dark', 'system']).optional(),
    notificationEmail: z.boolean().optional(),
    notificationSolves: z.boolean().optional(),
    notificationLeaderboard: z.boolean().optional(),
});

// Container schemas
export const containerActionSchema = z.object({
    challengeId: uuidSchema,
});

// MFA schemas
export const mfaVerifySchema = z.object({
    code: z.string()
        .length(6, 'Code must be 6 digits')
        .regex(/^\d+$/, 'Code must contain only digits'),
});

// API Token schemas
export const createApiTokenSchema = z.object({
    name: z.string()
        .min(1, 'Token name is required')
        .max(100, 'Token name too long'),
    scopes: z.array(z.string()).optional(),
});

// Type exports
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type PasswordUpdateInput = z.infer<typeof passwordUpdateSchema>;
export type SubmitFlagInput = z.infer<typeof submitFlagSchema>;
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type JoinTeamInput = z.infer<typeof joinTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type ContainerActionInput = z.infer<typeof containerActionSchema>;
export type MfaVerifyInput = z.infer<typeof mfaVerifySchema>;
export type CreateApiTokenInput = z.infer<typeof createApiTokenSchema>;

/**
 * Validate input against a schema
 * Returns validated data or throws error
 */
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    
    if (!result.success) {
        const errors = result.error.issues.map((e) => `${String(e.path)}: ${e.message}`).join(', ');
        throw new Error(`Validation failed: ${errors}`);
    }
    
    return result.data;
}

/**
 * Validate input and return result object
 * Returns { success: true, data: T } or { success: false, errors: string[] }
 */
export function validateInputSafe<T>(schema: z.ZodSchema<T>, data: unknown): 
    | { success: true; data: T }
    | { success: false; errors: string[] } {
    const result = schema.safeParse(data);
    
    if (!result.success) {
        const errors = result.error.issues.map(e => `${String(e.path)}: ${e.message}`);
        return { success: false, errors };
    }
    
    return { success: true, data: result.data };
}
