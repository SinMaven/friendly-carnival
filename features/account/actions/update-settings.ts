'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateSettings(settings: {
    notification_email: boolean;
    notification_solves: boolean;
    notification_leaderboard: boolean;
}) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const { error } = await supabase
        .from('profiles')
        .update(settings)
        .eq('id', user.id);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath('/dashboard/settings');
    return { success: true, message: 'Settings updated successfully!' };
}
