'use server';

import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { checkRateLimit } from '@/lib/ratelimit';
import { logUserEvent, AuditEventTypes } from '@/lib/audit-logger';

// Validation schema
const settingsSchema = z.object({
    notification_email: z.boolean().optional(),
    notification_solves: z.boolean().optional(),
    notification_leaderboard: z.boolean().optional(),
    bio: z.string().max(500, 'Bio must be under 500 characters').optional(),
    website: z.union([
        z.string().url('Invalid website URL').max(100, 'Website URL too long'),
        z.string().length(0),
        z.literal(''),
    ]).optional(),
    username: z.string()
        .min(1, 'Username is required')
        .max(30, 'Username must be under 30 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
        .optional(),
    full_name: z.string()
        .max(50, 'Name must be under 50 characters')
        .regex(/^[\p{L}\s'-]+$/u, 'Name contains invalid characters')
        .optional()
        .or(z.literal('')),
    email: z.string().email('Invalid email format').optional(),
});

export type UpdateSettingsResult = {
    success: boolean;
    message: string;
};

export async function updateSettings(settings: {
    notification_email?: boolean;
    notification_solves?: boolean;
    notification_leaderboard?: boolean;
    bio?: string;
    website?: string;
    username?: string;
    full_name?: string;
    email?: string;
}): Promise<UpdateSettingsResult> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: 'Unauthorized' };
    }

    // Rate limiting: 20 settings updates per hour per user
    const { success: rateLimitOk } = await checkRateLimit('relaxed', `settings:update:${user.id}`);
    if (!rateLimitOk) {
        return { success: false, message: 'Too many settings updates. Please try again later.' };
    }

    // Validate input
    const validation = settingsSchema.safeParse(settings);
    if (!validation.success) {
        const message = validation.error.issues[0]?.message || 'Invalid input';
        return { success: false, message };
    }

    const { email, ...updates } = validation.data;

    // Remove undefined and empty string values for profile updates
    const profileUpdates = Object.fromEntries(
        Object.entries(updates).filter(([, v]) => v !== undefined && v !== '')
    );
    
    let message = 'Settings updated successfully!';
    let emailChanged = false;

    // Update email if changed
    if (email && email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email });
        if (emailError) {
            return { success: false, message: `Email update failed: ${emailError.message}` };
        }
        message = 'Settings updated! Please check your new email for a confirmation link.';
        emailChanged = true;
    }

    // Only update profile if there are changes
    if (Object.keys(profileUpdates).length > 0) {
        const { error } = await supabase
            .from('profiles')
            .update(profileUpdates)
            .eq('id', user.id);

        if (error) {
            if (error.code === '23505') {
                return { success: false, message: 'Username is already taken' };
            }
            console.error('Settings update error:', error);
            return { success: false, message: error.message };
        }
    }

    // Audit log
    await logUserEvent(AuditEventTypes.USER.SETTINGS_CHANGED, {
        userId: user.id,
        payloadDiff: { ...profileUpdates, email_changed: emailChanged },
    });

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/profile');
    return { success: true, message };
}
