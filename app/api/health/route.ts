import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export const dynamic = 'force-dynamic';

// Initialize Redis if credentials available
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    database: {
      status: 'connected' | 'disconnected';
      latencyMs: number;
      error?: string;
    };
    redis: {
      status: 'connected' | 'disconnected' | 'not_configured';
      latencyMs?: number;
      error?: string;
    };
  };
  metrics?: {
    totalUsers?: number;
    activeContainers?: number;
    recentSolves?: number;
  };
}

export async function GET() {
  const startTime = Date.now();
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    services: {
      database: {
        status: 'disconnected',
        latencyMs: 0,
      },
      redis: {
        status: redis ? 'disconnected' : 'not_configured',
      },
    },
  };

  // Check database connection
  try {
    const dbStart = Date.now();
    const supabase = await createSupabaseServerClient();
    
    // Try to get counts for metrics
    const [{ count: userCount }, { count: containerCount }, { count: solveCount }] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('container_instances').select('*', { count: 'exact', head: true }).eq('status', 'running'),
      supabase.from('solves').select('*', { count: 'exact', head: true }).gte('solved_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    ]);

    health.services.database = {
      status: 'connected',
      latencyMs: Date.now() - dbStart,
    };
    
    health.metrics = {
      totalUsers: userCount || 0,
      activeContainers: containerCount || 0,
      recentSolves: solveCount || 0,
    };
  } catch (error) {
    health.services.database = {
      status: 'disconnected',
      latencyMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    health.status = 'unhealthy';
  }

  // Check Redis connection
  if (redis) {
    try {
      const redisStart = Date.now();
      await redis.ping();
      health.services.redis = {
        status: 'connected',
        latencyMs: Date.now() - redisStart,
      };
    } catch (error) {
      health.services.redis = {
        status: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      // Redis is optional, so only mark as degraded
      if (health.status === 'healthy') {
        health.status = 'degraded';
      }
    }
  }

  const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;
  
  return NextResponse.json(health, { 
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Health-Status': health.status,
    },
  });
}
