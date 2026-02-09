'use server';

import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/ratelimit';

const getHintsSchema = z.object({
  challengeId: z.string().uuid(),
});

export type Hint = {
  id: string;
  order_index: number;
  cost_points: number;
  is_unlocked: boolean;
  content: string | null;
  unlocked_at: string | null;
};

export type GetHintsResult = {
  success: boolean;
  message: string;
  hints?: Hint[];
  totalCost?: number;
};

/**
 * Get hints for a challenge
 * Returns all hints with their unlock status for the current user
 */
export async function getChallengeHints(challengeId: string): Promise<GetHintsResult> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Unauthorized' };
  }

  // Validate input
  const validation = getHintsSchema.safeParse({ challengeId });
  if (!validation.success) {
    return { success: false, message: 'Invalid challenge ID' };
  }

  // Rate limiting: 60 requests per minute
  const { success: rateLimitOk } = await checkRateLimit('relaxed', `hints:get:${user.id}`);
  if (!rateLimitOk) {
    return { success: false, message: 'Too many requests' };
  }

  try {
    const { data: hints, error } = await supabase.rpc('get_challenge_hints', {
      p_user_id: user.id,
      p_challenge_id: challengeId,
    });

    if (error) {
      console.error('Error fetching hints:', error);
      return { success: false, message: 'Failed to fetch hints' };
    }

    const totalCost = (hints as Hint[] || []).reduce((sum, h) => 
      h.is_unlocked ? sum : sum + h.cost_points, 0
    );

    return {
      success: true,
      message: 'Hints retrieved successfully',
      hints: hints as Hint[] || [],
      totalCost,
    };
  } catch (error) {
    console.error('Error in getChallengeHints:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}
