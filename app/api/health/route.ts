import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 * 
 * Returns the current health status of the application.
 * Used for monitoring, load balancers, and uptime checks.
 * 
 * @returns {Promise<NextResponse>} Health status JSON
 */
export async function GET(): Promise<NextResponse> {
    const startTime = Date.now();
    const checks: Record<string, { status: 'ok' | 'error'; responseTime?: number; message?: string }> = {};
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    // Check database connectivity
    try {
        const dbStart = Date.now();
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        
        if (error) {
            throw error;
        }
        
        checks.database = {
            status: 'ok',
            responseTime: Date.now() - dbStart,
        };
    } catch (error) {
        checks.database = {
            status: 'error',
            message: error instanceof Error ? error.message : 'Database connection failed',
        };
        overallStatus = 'unhealthy';
    }

    // Check environment variables
    const requiredEnvVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
        'SUPABASE_SECRET_KEY',
    ];

    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingEnvVars.length > 0) {
        checks.environment = {
            status: 'error',
            message: `Missing required environment variables: ${missingEnvVars.join(', ')}`,
        };
        overallStatus = 'unhealthy';
    } else {
        checks.environment = {
            status: 'ok',
        };
    }

    const totalResponseTime = Date.now() - startTime;

    // If any check is slow, mark as degraded
    if (totalResponseTime > 1000) {
        overallStatus = overallStatus === 'healthy' ? 'degraded' : overallStatus;
    }

    const response = {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev',
        environment: process.env.NODE_ENV,
        responseTime: totalResponseTime,
        checks,
    };

    const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;

    return NextResponse.json(response, { 
        status: statusCode,
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
        },
    });
}

/**
 * HEAD request for lightweight health checks
 * Used by load balancers that only care about HTTP status
 */
export async function HEAD(): Promise<NextResponse> {
    try {
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        
        if (error) {
            return new NextResponse(null, { status: 503 });
        }
        
        return new NextResponse(null, { status: 200 });
    } catch {
        return new NextResponse(null, { status: 503 });
    }
}
