'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type UploadAvatarResult = {
    success: boolean
    message: string
    url?: string
}

/**
 * Uploads an avatar image to Supabase Storage.
 * 
 * Security: Files are stored in a user-specific path within the avatars bucket.
 * The bucket should have public read access for avatars.
 */
export async function uploadAvatar(formData: FormData): Promise<UploadAvatarResult> {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.id) {
        return { success: false, message: 'Unauthorized' }
    }

    const file = formData.get('avatar') as File

    if (!file || file.size === 0) {
        return { success: false, message: 'No file provided' }
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
        return { success: false, message: 'Invalid file type. Allowed: JPG, PNG, WebP, GIF' }
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
        return { success: false, message: 'File too large. Maximum size is 2MB' }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
            upsert: true,
            contentType: file.type,
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
        return { success: false, message: 'Failed to update profile' }
    }

    revalidatePath('/dashboard/profile')
    revalidatePath('/dashboard')
    return { success: true, message: 'Avatar uploaded successfully', url: publicUrl }
}
