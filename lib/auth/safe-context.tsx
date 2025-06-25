'use client'

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function SafeAuthProvider({ children }: { children: React.ReactNode }) {
  console.log('🔧 SafeAuthProvider: Initializing (should see ONCE per app start)')
  
  // ✅ STABLE CLIENT - created once only
  const [supabase] = useState(() => {
    console.log('🔧 Creating Supabase client (should see ONCE)')
    return createClient()
  })
  
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [authSetupCount, setAuthSetupCount] = useState(0)

  // ✅ CIRCUIT BREAKER - prevent runaway auth setup
  const canSetupAuth = useCallback(() => {
    if (authSetupCount >= 3) {
      console.error('🚨 AUTH CIRCUIT BREAKER: Too many auth setup attempts')
      return false
    }
    return true
  }, [authSetupCount])

  useEffect(() => {
    if (!canSetupAuth()) {
      console.error('❌ Auth setup blocked by circuit breaker')
      return
    }

    console.log('🔧 SafeAuthProvider: Setting up auth listener (should see ONCE)')
    setAuthSetupCount(prev => prev + 1)
    
    let mounted = true
    
    const setupAuth = async () => {
      console.log('📡 AUTH API CALL: Getting initial session')
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ AUTH ERROR:', error)
        }
        
        if (!mounted) {
          console.log('⚠️ Component unmounted during auth setup')
          return
        }
        
        console.log('✅ Initial session loaded:', session ? 'User logged in' : 'No user')
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (error) {
        console.error('❌ AUTH SETUP ERROR:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    setupAuth()

    console.log('🔧 Setting up auth state change listener')
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) {
        console.log('⚠️ Auth state change ignored - component unmounted')
        return
      }
      
      console.log('🔄 Auth state changed:', event, session ? 'User present' : 'No user')
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      console.log('🧹 SafeAuthProvider: Cleaning up auth listener')
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, canSetupAuth]) // ✅ supabase is stable, canSetupAuth is memoized

  // ✅ MEMOIZED AUTH FUNCTIONS - prevent recreation
  const signIn = useCallback(async (email: string, password: string) => {
    console.log('📡 AUTH API CALL: Sign in attempt')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        console.error('❌ Sign in error:', error.message)
        return { error: error.message }
      }
      console.log('✅ Sign in successful')
      return {}
    } catch (error) {
      console.error('❌ Sign in exception:', error)
      return { error: 'An unexpected error occurred' }
    }
  }, [supabase])

  const signUp = useCallback(async (email: string, password: string) => {
    console.log('📡 AUTH API CALL: Sign up attempt')
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        console.error('❌ Sign up error:', error.message)
        return { error: error.message }
      }
      console.log('✅ Sign up successful')
      return {}
    } catch (error) {
      console.error('❌ Sign up exception:', error)
      return { error: 'An unexpected error occurred' }
    }
  }, [supabase])

  const signOut = useCallback(async () => {
    console.log('📡 AUTH API CALL: Sign out attempt')
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('❌ Sign out error:', error.message)
      } else {
        console.log('✅ Sign out successful')
      }
    } catch (error) {
      console.error('❌ Sign out exception:', error)
    }
  }, [supabase])

  // ✅ MEMOIZED VALUE - prevents object recreation causing infinite renders
  const value = useMemo(() => ({
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }), [user, session, loading, signIn, signUp, signOut])

  console.log('🔄 SafeAuthProvider render:', { 
    hasUser: !!user, 
    loading, 
    authSetupCount,
    userStable: user === value.user // Should always be true
  })

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ✅ DEVELOPMENT ONLY - Auth monitoring
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  let authRenderCount = 0
  let lastRenderTime = Date.now()
  
  const originalConsoleLog = console.log
  console.log = function(...args) {
    if (args[0]?.includes?.('SafeAuthProvider render')) {
      authRenderCount++
      const now = Date.now()
      const timeSinceLastRender = now - lastRenderTime
      lastRenderTime = now
      
      if (authRenderCount > 10) {
        console.error('🚨 EMERGENCY: Too many auth renders detected!', { 
          authRenderCount, 
          timeSinceLastRender 
        })
        alert('DEVELOPMENT EMERGENCY: Auth provider rendering too frequently!')
      }
    }
    originalConsoleLog.apply(this, args)
  }
}
