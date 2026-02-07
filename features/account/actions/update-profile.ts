'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: {
    username: string;
    full_name: string;
    bio: string;
    website: string;
    github_handle: string;
}) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath('/dashboard/profile');
    revalidatePath('/dashboard');
    return { success: true, message: 'Profile updated successfully!' };
}
