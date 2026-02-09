'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateSettings(settings: {
    notification_email?: boolean;
    notification_solves?: boolean;
    notification_leaderboard?: boolean;
    bio?: string;
    website?: string;
    username?: string;
    full_name?: string;
    email?: string;
}) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const { email, ...updates } = settings;

    // Remove undefined values
    const profileUpdates = Object.fromEntries(
        Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    let message = 'Settings updated successfully!';

    // Update email if changed
    if (email && email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email });
        if (emailError) {
            return { success: false, message: `Email update failed: ${emailError.message}` };
        }
        message = 'Settings updated! Please check your new email for a confirmation link.';
    }

    const { error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath('/dashboard/settings');
    return { success: true, message };
}
