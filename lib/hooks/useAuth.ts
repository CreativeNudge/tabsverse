import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

// Simple auth hook - NO CONTEXT PROVIDER (like Mail Collectly)
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const supabase = createClientComponentClient<Database>()
    
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    
    getInitialSession()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    
    return () => subscription.unsubscribe()
  }, []) // Empty dependency array - no dynamic dependencies
  
  return { user, loading }
}

// Auth utility functions (like Mail Collectly)
export const signOut = async () => {
  const supabase = createClientComponentClient<Database>()
  return supabase.auth.signOut()
}

export const signIn = async (email: string, password: string) => {
  const supabase = createClientComponentClient<Database>()
  return supabase.auth.signInWithPassword({ email, password })
}

export const signUp = async (email: string, password: string, fullName: string) => {
  const supabase = createClientComponentClient<Database>()
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  })
}