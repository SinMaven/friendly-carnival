'use server';

import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/ratelimit';

const deleteSchema = z.object({
  notificationId: z.string().uuid(),
});

export type DeleteResult = {
  success: boolean;
  message: string;
};

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<DeleteResult> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Unauthorized' };
  }

  // Rate limiting: 30 deletes per minute
  const { success: rateLimitOk } = await checkRateLimit('standard', `notifications:delete:${user.id}`);
  if (!rateLimitOk) {
    return { success: false, message: 'Too many requests' };
  }

  // Validate input
  const validation = deleteSchema.safeParse({ notificationId });
  if (!validation.success) {
    return { success: false, message: 'Invalid notification ID' };
  }

  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', user.id); // Ensure user can only delete their own

    if (error) {
      console.error('Error deleting notification:', error);
      return { success: false, message: 'Failed to delete notification' };
    }

    return { success: true, message: 'Notification deleted' };
  } catch (error) {
    console.error('Error in deleteNotification:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}

/**
 * Delete all read notifications
 */
export async function deleteReadNotifications(): Promise<DeleteResult> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Unauthorized' };
  }

  // Rate limiting: 5 bulk deletes per hour
  const { success: rateLimitOk } = await checkRateLimit('strict', `notifications:deleteall:${user.id}`);
  if (!rateLimitOk) {
    return { success: false, message: 'Too many requests' };
  }

  try {
    const { error, count } = await supabase
      .from('notifications')
      .delete({ count: 'exact' })
      .eq('user_id', user.id)
      .eq('is_read', true);

    if (error) {
      console.error('Error deleting read notifications:', error);
      return { success: false, message: 'Failed to delete notifications' };
    }

    return { success: true, message: `${count || 0} notifications deleted` };
  } catch (error) {
    console.error('Error in deleteReadNotifications:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}
