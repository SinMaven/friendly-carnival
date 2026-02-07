// Admin client for server-side operations (bypasses RLS)
// Updated to support new Supabase API key system

import type { Database } from '@/lib/supabase/types';
import { getEnvVar } from '@/utils/get-env-var';
import { createClient } from '@supabase/supabase-js';

/**
 * Get the secret API key.
 * Supports both new secret key (SUPABASE_SECRET_KEY) and legacy service role key.
 */
function getSecretApiKey(): string {
  // Prefer new secret key format if available
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (secretKey) {
    return secretKey;
  }
  // Fall back to legacy service role key
  return getEnvVar(process.env.SUPABASE_SERVICE_ROLE_KEY, 'SUPABASE_SERVICE_ROLE_KEY');
}

export const supabaseAdminClient = createClient<Database>(
  getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
  getSecretApiKey()
);
