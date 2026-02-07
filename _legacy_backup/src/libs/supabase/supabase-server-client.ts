// ref: https://github.com/vercel/next.js/blob/canary/examples/with-supabase/utils/supabase/server.ts
// Updated to support new Supabase API key system (publishable keys)

import { cookies } from 'next/headers';

import { Database } from '@/libs/supabase/types';
import { getEnvVar } from '@/utils/get-env-var';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
/**
 * Get the appropriate public API key.
 * Supports both new publishable keys (sb_publishable_...) and legacy anon keys.
 */
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Get the appropriate public API key.
 * Supports both new publishable keys (sb_publishable_...) and legacy anon keys.
 */
function getPublicApiKey(): string {
  // Prefer new publishable key format if available
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (publishableKey) {
    return publishableKey;
  }
  // Fall back to legacy anon key
  return getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export async function createSupabaseServerClient(): Promise<SupabaseClient<Database, 'public'>> {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
    getPublicApiKey(),
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  ) as unknown as SupabaseClient<Database, 'public'>;
}
