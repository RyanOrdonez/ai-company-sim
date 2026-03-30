import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _admin: SupabaseClient | null = null;

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing ${key} environment variable`);
  return val;
}

// Server-side client uses the service role key (bypasses RLS for admin operations)
export function getSupabaseAdmin(): SupabaseClient {
  if (!_admin) {
    _admin = createClient(getEnv('SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));
  }
  return _admin;
}

// Create a client scoped to a specific user's JWT (respects RLS)
export function supabaseForUser(accessToken: string): SupabaseClient {
  return createClient(getEnv('SUPABASE_URL'), getEnv('SUPABASE_ANON_KEY'), {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}
