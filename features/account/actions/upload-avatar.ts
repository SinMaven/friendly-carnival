'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { checkRateLimit } from '@/lib/ratelimit';
import { logUserEvent } from '@/lib/audit-logger';
import { AuditEventTypes } from '@/lib/audit-events';

export type UploadAvatarResult = {
    success: boolean
    message: string
    url?: string
}

// File validation constants
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * Uploads an avatar image to Supabase Storage.
 * 
 * Security: Files are stored in a user-specific path within the avatars bucket.
 * The bucket should have public read access for avatars.
 * Rate limited to 10 uploads per hour per user.
 */
export async function uploadAvatar(formData: FormData): Promise<UploadAvatarResult> {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.id) {
        return { success: false, message: 'Unauthorized' }
    }

    // Rate limiting: 10 avatar uploads per hour per user
    const { success: rateLimitOk } = await checkRateLimit('relaxed', `avatar:upload:${user.id}`);
    if (!rateLimitOk) {
        return { success: false, message: 'Too many upload attempts. Please try again later.' }
    }

    const file = formData.get('avatar') as File

    if (!file || file.size === 0) {
        return { success: false, message: 'No file provided' }
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
        return { success: false, message: 'Invalid file type. Allowed: JPG, PNG, WebP, GIF' }
    }

    // Validate file size (max 2MB)
    if (file.size > MAX_FILE_SIZE) {
        return { success: false, message: 'File too large. Maximum size is 2MB' }
    }

    // Validate filename (prevent path traversal)
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileExt = sanitizedFileName.split('.').pop()?.toLowerCase();

    // Whitelist allowed extensions
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (!fileExt || !allowedExts.includes(fileExt)) {
        return { success: false, message: 'Invalid file extension' }
    }

    // Generate unique filename with user ID as folder
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const fileName = `${user.id}/${timestamp}-${randomSuffix}.${fileExt}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
            upsert: true,
            contentType: file.type,
            cacheControl: '3600',
        })

    if (uploadError) {
        console.error('Upload error:', uploadError)
        return { success: false, message: 'Failed to upload avatar' }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

    if (updateError) {
        console.error('Profile update error:', updateError)
        // Attempt to clean up uploaded file
        await supabase.storage.from('avatars').remove([fileName]);
        return { success: false, message: 'Failed to update profile' }
    }

    // Audit log
    await logUserEvent(AuditEventTypes.USER.AVATAR_UPDATED, {
        userId: user.id,
    });

    revalidatePath('/dashboard/profile')
    revalidatePath('/dashboard')
    return { success: true, message: 'Avatar uploaded successfully', url: publicUrl }
}
