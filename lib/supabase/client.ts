import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

// Create a function that returns a new client - this is safe
export const createClient = () => createClientComponentClient<Database>()

// DO NOT export a singleton client instance - this caused the original issues
// The Mail Collectly pattern is to always use createClient() or createClientComponentClient() directly