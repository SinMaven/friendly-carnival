'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/ratelimit';

export type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  challenge_id?: string;
  team_id?: string;
  actor_id?: string;
  data: Record<string, unknown>;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  priority: number;
};

export type GetNotificationsResult = {
  notifications: Notification[];
  unreadCount: number;
  hasMore: boolean;
};

/**
 * Get notifications for the current user
 */
export async function getNotifications(
  options: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
  } = {}
): Promise<GetNotificationsResult> {
  const { limit = 20, offset = 0, unreadOnly = false } = options;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { notifications: [], unreadCount: 0, hasMore: false };
  }

  // Rate limiting: 60 requests per minute
  const { success: rateLimitOk } = await checkRateLimit('relaxed', `notifications:get:${user.id}`);
  if (!rateLimitOk) {
    return { notifications: [], unreadCount: 0, hasMore: false };
  }

  try {
    // Get unread count
    const { data: unreadCount, error: countError } = await supabase.rpc(
      'get_unread_notification_count',
      { p_user_id: user.id }
    );

    if (countError) {
      console.error('Error getting unread count:', countError);
    }

    // Build query
    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data: notifications, error, count } = await query;

    if (error) {
      console.error('Error fetching notifications:', error);
      return { notifications: [], unreadCount: unreadCount || 0, hasMore: false };
    }

    return {
      notifications: notifications as Notification[] || [],
      unreadCount: unreadCount || 0,
      hasMore: (count || 0) > offset + limit,
    };
  } catch (error) {
    console.error('Error in getNotifications:', error);
    return { notifications: [], unreadCount: 0, hasMore: false };
  }
}
