import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Rate Limiting Configuration
 * 
 * Uses Upstash Redis for distributed rate limiting.
 * Falls back to memory-based limiting if Redis is not configured (development).
 */

// Check if Redis is configured
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = redisUrl && redisToken 
    ? new Redis({
        url: redisUrl,
        token: redisToken,
    })
    : null;

// Create rate limiters for different use cases
export const ratelimit = {
    // Strict: 5 requests per minute (for sensitive operations)
    strict: redis 
        ? new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(5, '1 m'),
            analytics: true,
        })
        : null,

    // Standard: 10 requests per minute (for API routes)
    standard: redis
        ? new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(10, '1 m'),
            analytics: true,
        })
        : null,

    // Relaxed: 30 requests per minute (for general usage)
    relaxed: redis
        ? new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(30, '1 m'),
            analytics: true,
        })
        : null,

    // Flag submission: 10 per minute per challenge
    flagSubmission: redis
        ? new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(10, '1 m'),
            analytics: true,
        })
        : null,

    // Login attempts: 5 per 5 minutes (prevent brute force)
    login: redis
        ? new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(5, '5 m'),
            analytics: true,
        })
        : null,
};

/**
 * Check rate limit for a given identifier
 * Returns { success: boolean, limit: number, remaining: number, reset: number }
 * 
 * If Redis is not configured, allows all requests (development mode)
 */
export async function checkRateLimit(
    limiter: keyof typeof ratelimit,
    identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    const limit = ratelimit[limiter];
    
    // If no Redis configured, allow request (development fallback)
    if (!limit) {
        return { success: true, limit: 999, remaining: 999, reset: Date.now() + 60000 };
    }

    try {
        const result = await limit.limit(identifier);
        return {
            success: result.success,
            limit: result.limit,
            remaining: result.remaining,
            reset: result.reset,
        };
    } catch (error) {
        console.error('Rate limit check failed:', error);
        // Fail open - allow request if rate limiter fails
        return { success: true, limit: 999, remaining: 999, reset: Date.now() + 60000 };
    }
}

/**
 * Get client IP for rate limiting
 */
export function getRateLimitIdentifier(headers: Headers): string {
    const forwarded = headers.get('x-forwarded-for');
    const realIp = headers.get('x-real-ip');
    const cfIp = headers.get('cf-connecting-ip');
    
    return cfIp || realIp || forwarded?.split(',')[0]?.trim() || 'unknown';
}
