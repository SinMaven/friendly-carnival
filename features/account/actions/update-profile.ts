'use server';

import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { checkRateLimit } from '@/lib/ratelimit';
import { logUserEvent } from '@/lib/audit-logger';
import { AuditEventTypes } from '@/lib/audit-events';

// Validation schema
const profileSchema = z.object({
    username: z.string()
        .min(1, 'Username is required')
        .max(30, 'Username must be under 30 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
    full_name: z.string()
        .max(50, 'Name must be under 50 characters')
        .regex(/^[\p{L}\s'-]+$/u, 'Name contains invalid characters')
        .optional()
        .or(z.literal('')),
    bio: z.string()
        .max(500, 'Bio must be under 500 characters')
        .optional()
        .or(z.literal('')),
    website: z.string()
        .max(100, 'Website URL too long')
        .url('Invalid website URL')
        .optional()
        .or(z.literal('')),
    github_handle: z.string()
        .max(39, 'GitHub username must be under 39 characters')
        .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/, 'Invalid GitHub username format')
        .optional()
        .or(z.literal('')),
});

export type UpdateProfileResult = {
    success: boolean;
    message: string;
};

export async function updateProfile(formData: {
    username: string;
    full_name: string;
    bio: string;
    website: string;
    github_handle: string;
}): Promise<UpdateProfileResult> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: 'Unauthorized' };
    }

    // Rate limiting: 10 profile updates per hour
    const { success: rateLimitOk } = await checkRateLimit('standard', `profile:update:${user.id}`);
    if (!rateLimitOk) {
        return { success: false, message: 'Too many profile updates. Please try again later.' };
    }

    // Validate input
    const validation = profileSchema.safeParse(formData);
    if (!validation.success) {
        const message = validation.error.issues[0]?.message || 'Invalid input';
        return { success: false, message };
    }

    // Sanitize data - remove empty strings for optional fields
    const sanitizedData = {
        username: validation.data.username.toLowerCase().trim(),
        full_name: validation.data.full_name?.trim() || null,
        bio: validation.data.bio?.trim() || null,
        website: validation.data.website?.trim() || null,
        github_handle: validation.data.github_handle?.trim() || null,
    };

    const { error } = await supabase
        .from('profiles')
        .update(sanitizedData)
        .eq('id', user.id);

    if (error) {
        if (error.code === '23505') {
            return { success: false, message: 'Username is already taken' };
        }
        console.error('Profile update error:', error);
        return { success: false, message: error.message };
    }

    // Audit log
    await logUserEvent(AuditEventTypes.USER.UPDATED, {
        userId: user.id,
        payloadDiff: sanitizedData,
    });

    revalidatePath('/dashboard/profile');
    revalidatePath('/dashboard');
    return { success: true, message: 'Profile updated successfully!' };
}
