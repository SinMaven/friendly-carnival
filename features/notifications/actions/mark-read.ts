'use server';

import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/ratelimit';

const markReadSchema = z.object({
  notificationIds: z.array(z.string().uuid()).optional(),
});

export type MarkReadResult = {
  success: boolean;
  message: string;
  count?: number;
};

/**
 * Mark notifications as read
 * If notificationIds is not provided, marks all as read
 */
export async function markNotificationsAsRead(
  notificationIds?: string[]
): Promise<MarkReadResult> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Unauthorized' };
  }

  // Rate limiting: 50 mark-read actions per minute
  const { success: rateLimitOk } = await checkRateLimit('standard', `notifications:markread:${user.id}`);
  if (!rateLimitOk) {
    return { success: false, message: 'Too many requests' };
  }

  // Validate input
  const validation = markReadSchema.safeParse({ notificationIds });
  if (!validation.success) {
    return { success: false, message: 'Invalid notification IDs' };
  }

  try {
    // Call the database function
    const { data: count, error } = await supabase.rpc('mark_notifications_as_read', {
      p_user_id: user.id,
      p_notification_ids: notificationIds || null,
    });

    if (error) {
      console.error('Error marking notifications as read:', error);
      return { success: false, message: 'Failed to update notifications' };
    }

    return {
      success: true,
      message: notificationIds 
        ? `${count} notification(s) marked as read`
        : 'All notifications marked as read',
      count: count || 0,
    };
  } catch (error) {
    console.error('Error in markNotificationsAsRead:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}
