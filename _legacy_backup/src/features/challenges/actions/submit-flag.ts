'use server';

import { headers } from 'next/headers';

import { createClient } from '@/libs/supabase/server';

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
    const supabase = await createClient();
    const headerList = await headers();
    const ip = headerList.get('x-forwarded-for') || 'unknown';
    const userAgent = headerList.get('user-agent') || 'unknown';

    // 1. Check authentication
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    if (!userId) {
        return { success: false, message: 'You must be logged in to submit flags' };
    }

    // 2. Check if already solved (Idempotency)
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

    // 3. Rate limiting (Anti-Bruteforce)
    // Max 10 attempts per minute per challenge
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { count: recentSubmissions } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('challenge_id', challengeId)
        .gte('created_at', oneMinuteAgo);

    if (recentSubmissions && recentSubmissions >= 10) {
        return {
            success: false,
            message: 'Too many attempts. Please wait a minute before trying again.'
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
        return { success: false, message: 'Incorrect flag. Try again!' };
    }

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

    // Record the solve
    const { error: solveError } = await supabase.from('solves').insert({
        user_id: userId,
        challenge_id: challengeId,
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
        return { success: false, message: 'Error recording solve. Please try again.' };
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
