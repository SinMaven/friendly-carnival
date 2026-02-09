'use server';

import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/ratelimit';
import { createNotification } from '@/lib/notifications';
import { revalidatePath } from 'next/cache';

const unlockSchema = z.object({
  hintId: z.string().uuid(),
  challengeId: z.string().uuid(),
});

export type UnlockResult = {
  success: boolean;
  message: string;
  content?: string;
  pointsDeducted?: number;
};

/**
 * Unlock a hint for the current user
 * Deducts points from user's total
 */
export async function unlockHint(
  hintId: string,
  challengeId: string
): Promise<UnlockResult> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Unauthorized' };
  }

  // Validate input
  const validation = unlockSchema.safeParse({ hintId, challengeId });
  if (!validation.success) {
    return { success: false, message: 'Invalid hint or challenge ID' };
  }

  // Rate limiting: 10 unlock attempts per minute
  const { success: rateLimitOk } = await checkRateLimit('standard', `hints:unlock:${user.id}`);
  if (!rateLimitOk) {
    return { success: false, message: 'Too many requests. Please try again later.' };
  }

  try {
    const { data: result, error } = await supabase.rpc('unlock_hint', {
      p_user_id: user.id,
      p_hint_id: hintId,
    });

    if (error) {
      console.error('Error unlocking hint:', error);
      return { success: false, message: 'Failed to unlock hint' };
    }

    // The function returns a table, so we get the first row
    const unlockResult = result?.[0];

    if (!unlockResult?.success) {
      return { 
        success: false, 
        message: unlockResult?.message || 'Failed to unlock hint' 
      };
    }

    // Revalidate the challenge page to show updated points
    revalidatePath(`/dashboard/challenges/${challengeId}`);

    // Create notification for hint unlock
    if (unlockResult.points_deducted > 0) {
      await createNotification({
        userId: user.id,
        type: 'system_announcement',
        title: 'Hint Unlocked',
        message: `You spent ${unlockResult.points_deducted} points to unlock a hint.`,
        challengeId,
        data: { points_deducted: unlockResult.points_deducted },
      });
    }

    return {
      success: true,
      message: unlockResult.message,
      content: unlockResult.content,
      pointsDeducted: unlockResult.points_deducted,
    };
  } catch (error) {
    console.error('Error in unlockHint:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}
