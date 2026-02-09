'use server';

import { supabaseAdminClient } from './supabase/admin';

export type NotificationType = 
  | 'first_blood'
  | 'challenge_solved'
  | 'achievement_unlocked'
  | 'team_invite'
  | 'team_joined'
  | 'system_announcement'
  | 'level_up'
  | 'streak_milestone';

interface CreateNotificationOptions {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  challengeId?: string;
  teamId?: string;
  achievementId?: string;
  actorId?: string;
  data?: Record<string, unknown>;
  priority?: number;
  dedupKey?: string;
}

/**
 * Create a notification for a user
 * Uses admin client to bypass RLS
 */
export async function createNotification(options: CreateNotificationOptions): Promise<boolean> {
  try {
    // Use type assertion to bypass TypeScript checking for new tables
    const { error } = await (supabaseAdminClient as any).from('notifications').insert({
      user_id: options.userId,
      type: options.type,
      title: options.title,
      message: options.message,
      challenge_id: options.challengeId,
      team_id: options.teamId,
      achievement_id: options.achievementId,
      actor_id: options.actorId,
      data: options.data || {},
      priority: options.priority || 0,
      dedup_key: options.dedupKey,
    });

    if (error) {
      console.error('Error creating notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in createNotification:', error);
    return false;
  }
}

/**
 * Create first blood notification for challenge author and admins
 */
export async function createFirstBloodNotification(
  challengeId: string,
  challengeTitle: string,
  solverId: string,
  solverUsername: string
): Promise<void> {
  // Notify challenge author if exists
  const { data: challenge } = await (supabaseAdminClient as any)
    .from('challenges')
    .select('author_id, title')
    .eq('id', challengeId)
    .single();

  if (challenge?.author_id && challenge.author_id !== solverId) {
    await createNotification({
      userId: challenge.author_id,
      type: 'first_blood',
      title: 'First Blood on Your Challenge!',
      message: `${solverUsername} got first blood on "${challengeTitle}"`,
      challengeId,
      actorId: solverId,
      priority: 5,
    });
  }
}

/**
 * Create team invite notification
 */
export async function createTeamInviteNotification(
  userId: string,
  teamId: string,
  teamName: string,
  inviterId: string,
  inviterUsername: string
): Promise<void> {
  await createNotification({
    userId,
    type: 'team_invite',
    title: 'Team Invitation',
    message: `${inviterUsername} invited you to join ${teamName}`,
    teamId,
    actorId: inviterId,
    priority: 3,
  });
}

/**
 * Create achievement unlocked notification
 */
export async function createAchievementNotification(
  userId: string,
  achievementId: string,
  achievementName: string,
  achievementDescription: string
): Promise<void> {
  await createNotification({
    userId,
    type: 'achievement_unlocked',
    title: 'Achievement Unlocked!',
    message: achievementDescription,
    achievementId,
    priority: 4,
  });
}
