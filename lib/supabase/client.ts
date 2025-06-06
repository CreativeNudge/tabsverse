import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

// Client-side Supabase client for use in Client Components only
export const createClient = () => createClientComponentClient<Database>()

// Browser client for client-side usage
export const supabase = createClient()
