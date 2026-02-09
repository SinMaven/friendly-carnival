'use server';

import { headers } from 'next/headers';
import { z } from 'zod';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { logChallengeEvent, logSecurityEvent } from '@/lib/audit-logger';
import { AuditEventTypes } from '@/lib/audit-events';
import { checkRateLimit } from '@/lib/ratelimit';

// Input validation schema
const submitFlagSchema = z.object({
    challengeId: z.string().uuid('Invalid challenge ID'),
    flag: z.string().min(1, 'Flag is required').max(500, 'Flag is too long'),
});

// SHA-256 hash function using Web Crypto API
async function sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export type SubmitFlagResult = {
    success: boolean;
    message: string;
    points_awarded?: number;
    is_first_blood?: boolean;
    already_solved?: boolean;
};

/**
 * Submits a flag for a challenge, verifies it securely, and awards points.
 * 
 * @param challengeId - The UUID of the challenge
 * @param flag - The candidate flag string
 * @returns {Promise<SubmitFlagResult>} The result of the submission
 */
export async function submitFlag(
    challengeId: string,
    flag: string
): Promise<SubmitFlagResult> {
    // Validate inputs
    const validation = submitFlagSchema.safeParse({ challengeId, flag });
    if (!validation.success) {
        return {
            success: false,
            message: validation.error.issues.map((e: { message: string }) => e.message).join(', ')
        };
    }

    const supabase = await createSupabaseServerClient();
    const headerList = await headers();
    const ip = headerList.get('x-forwarded-for') || 'unknown';
    const userAgent = headerList.get('user-agent') || 'unknown';

    // 1. Check authentication
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    if (!userId) {
        return { success: false, message: 'You must be logged in to submit flags' };
    }

    // 2. Redis-based rate limiting (primary)
    const { success: rateLimitOk } = await checkRateLimit('flagSubmission', `flag:${userId}:${challengeId}`);
    if (!rateLimitOk) {
        await logSecurityEvent(AuditEventTypes.SECURITY.RATE_LIMIT_EXCEEDED, {
            userId,
            payloadDiff: {
                context: 'flag_submission_redis',
                challenge_id: challengeId,
            },
        });
        return {
            success: false,
            message: 'Too many attempts. Please wait a minute before trying again.'
        };
    }

    // 3. Check if already solved (Idempotency)
    const { data: existingSolve } = await supabase
        .from('solves')
        .select('id')
        .eq('user_id', userId)
        .eq('challenge_id', challengeId)
        .maybeSingle();

    if (existingSolve) {
        return {
            success: false,
            message: 'You have already solved this challenge!',
            already_solved: true
        };
    }

    // 4. Verify Flag (Secure RPC)
    const normalizedFlag = flag.trim();
    const flagHash = await sha256(normalizedFlag);

    // Call secure Postgres function to verify flag without exposing hash comparison logic
    const { data: isValid, error: rpcError } = await supabase.rpc('verify_flag', {
        p_challenge_id: challengeId,
        p_flag_hash: flagHash,
    });

    if (rpcError) {
        console.error('Error verifying flag:', rpcError);
        return { success: false, message: 'System error verifying flag.' };
    }

    // 5. Audit Log (Submissions)
    // We log every attempt for security monitoring
    await supabase.from('submissions').insert({
        user_id: userId,
        challenge_id: challengeId,
        input_payload: '[REDACTED]', // Never log actual wrong flags to prevent leak analysis
        is_correct: !!isValid,
        ip_address: ip,     // Module 5: Audit & Compliance
        user_agent: userAgent, // Module 5: Audit & Compliance
    });

    if (!isValid) {
        // Log failed attempt
        await logChallengeEvent(AuditEventTypes.CHALLENGE.SOLVE_FAILED, {
            userId,
            challengeId,
            payloadDiff: { flag_submitted: true },
        });
        return { success: false, message: 'Incorrect flag. Try again!' };
    }

    // 5.5. Get User Team (for team scoring)
    const { data: teamMember } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', userId)
        .maybeSingle();

    const teamId = teamMember?.team_id;

    // 6. Award Points (Game Logic)
    // Fetch current challenge state for points
    const { data: challenge } = await supabase
        .from('challenges')
        .select('current_points, initial_points')
        .eq('id', challengeId)
        .single();

    const pointsAwarded = challenge?.current_points || challenge?.initial_points || 100;

    // Check for First Blood race condition
    const { count: solveCount } = await supabase
        .from('solves')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challengeId);

    const isFirstBlood = solveCount === 0;

    // Log successful solve
    await logChallengeEvent(AuditEventTypes.CHALLENGE.SOLVED, {
        userId,
        challengeId,
        payloadDiff: {
            points_awarded: pointsAwarded,
            is_first_blood: isFirstBlood,
        },
    });

    // Record the solve
    const { error: solveError } = await supabase.from('solves').insert({
        user_id: userId,
        challenge_id: challengeId,
        team_id: teamId, // Add team context
        points_awarded: pointsAwarded,
        is_first_blood: isFirstBlood,
    });

    if (solveError) {
        // Handle potential race condition on unique constraint (user_id, challenge_id)
        if (solveError.code === '23505') {
            return {
                success: false,
                message: 'You have already solved this challenge!',
                already_solved: true
            };
        }
        console.error('Error recording solve:', solveError);
        return { success: false, message: `Error recording solve: ${solveError.message || 'Unknown error'}. Code: ${solveError.code}` };
    }


    return {
        success: true,
        message: isFirstBlood
            ? `🩸 FIRST BLOOD! You earned ${pointsAwarded} points!`
            : `Correct! You earned ${pointsAwarded} points!`,
        points_awarded: pointsAwarded,
        is_first_blood: isFirstBlood,
    };
}
