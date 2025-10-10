import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Database schema constant
export const DB_SCHEMA = process.env.DATABASE_SCHEMA || 'pte'

// Client for browser-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: DB_SCHEMA
  }
})

// Admin client for server-side operations with elevated permissions
// Use service role key if available, otherwise fall back to anon key
export const supabaseAdmin = createClient(
  supabaseUrl, 
  supabaseServiceKey || supabaseAnonKey, 
  {
    db: {
      schema: DB_SCHEMA
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Check if we have service role key
export const hasServiceRoleKey = !!supabaseServiceKey

