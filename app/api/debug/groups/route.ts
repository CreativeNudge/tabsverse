import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerSupabaseClient()

    // Get all groups with their IDs and basic info for debugging
    const { data: groups, error } = await supabase
      .from('groups')
      .select('id, title, user_id, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching groups for debug:', error)
      return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 })
    }

    return NextResponse.json({ 
      groups,
      count: groups?.length || 0
    })

  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
