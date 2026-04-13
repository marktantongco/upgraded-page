import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side client using anon key (safe for server-side API routes)
// For admin operations, use SUPABASE_SERVICE_ROLE_KEY instead
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with service role key (bypasses RLS)
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : supabase;
