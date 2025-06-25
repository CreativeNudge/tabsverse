import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'

// Centralized auth utility for Next.js 15 compatibility
async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient<Database>({ 
    cookies: () => cookieStore 
  } as any) // Type assertion for Next.js 15 compatibility
  
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error, supabase }
}

export async function GET() {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's current group count
    const { count: currentCount, error: countError } = await supabase
      .from('groups')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (countError) {
      console.error('Error checking group count:', countError)
      return NextResponse.json({ error: 'Failed to check group limit' }, { status: 500 })
    }

    const count = currentCount || 0
    const limit = 5 // Free tier limit

    return NextResponse.json({
      canCreate: count < limit,
      count,
      limit,
      remaining: limit - count
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
