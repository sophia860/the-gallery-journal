import { createClient } from '@supabase/supabase-js';

// Singleton Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  // Return existing instance if it exists
  if (supabaseClient) {
    return supabaseClient;
  }

  // Create new instance only if it doesn't exist
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing. Client not initialized.');
    // Return a dummy client or handle gracefully
    return null;
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return supabaseClient;
}

// Export the client getter as default
export default getSupabaseClient;
