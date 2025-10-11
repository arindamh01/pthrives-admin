import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Database schema constant
export const DB_SCHEMA = process.env.DATABASE_SCHEMA || 'pte'

// Check if we have valid environment variables
const hasValidConfig = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key'

// Client for browser-side operations
export const supabase = hasValidConfig ? createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: DB_SCHEMA
  }
}) : createClient('https://placeholder.supabase.co', 'placeholder-key')

// Admin client for server-side operations with elevated permissions
// Use service role key if available, otherwise fall back to anon key
export const supabaseAdmin = hasValidConfig ? createClient(
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
) : createClient('https://placeholder.supabase.co', 'placeholder-key')

// Check if we have service role key
export const hasServiceRoleKey = !!supabaseServiceKey

// Export the configuration status
export const isSupabaseConfigured = hasValidConfig

// Helper function to validate Supabase configuration at runtime
export const validateSupabaseConfig = () => {
  if (!hasValidConfig) {
    throw new Error('Supabase is not properly configured. Please check your environment variables.')
  }
  return true
}

