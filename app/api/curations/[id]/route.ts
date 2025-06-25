import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

// Auth helper compatible with Next.js 15
async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient<Database>({ 
    cookies: () => cookieStore 
  } as any)
  
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error, supabase }
}

// GET - Fetch curation details with tabs
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: groupId } = await params

    // Get curation with user info
    const { data: curation, error: curationError } = await supabase
      .from('groups')
      .select(`
        *,
        users!groups_user_id_fkey (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('id', groupId)
      .single()

    if (curationError || !curation) {
      return NextResponse.json({ error: 'Curation not found' }, { status: 404 })
    }

    // Check if user can view this curation
    const canView = curation.visibility === 'public' || curation.user_id === user.id
    if (!canView) {
      return NextResponse.json({ error: 'Curation not found' }, { status: 404 })
    }

    // Get tabs for this curation
    const { data: tabs, error: tabsError } = await supabase
      .from('tabs')
      .select('*')
      .eq('group_id', groupId)
      .order('position', { ascending: true })

    if (tabsError) {
      console.error('Error fetching tabs:', tabsError)
      return NextResponse.json({ error: 'Failed to fetch tabs' }, { status: 500 })
    }

    // Format the response
    const response = {
      ...curation,
      user: curation.users,
      tabs: tabs || []
    }

    // Remove the users field by destructuring (TypeScript-safe)
    const { users, ...finalResponse } = response

    return NextResponse.json(finalResponse)

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete curation and all its tabs
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: groupId } = await params

    // Verify user owns this curation
    const { data: curation, error: fetchError } = await supabase
      .from('groups')
      .select('user_id, title, tab_count')
      .eq('id', groupId)
      .single()

    if (fetchError || !curation) {
      return NextResponse.json({ error: 'Curation not found' }, { status: 404 })
    }

    if (curation.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete the curation (this will cascade delete all tabs due to foreign key constraints)
    const { error: deleteError } = await supabase
      .from('groups')
      .delete()
      .eq('id', groupId)

    if (deleteError) {
      console.error('Error deleting curation:', deleteError)
      return NextResponse.json({ error: 'Failed to delete curation' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: `Curation "${curation.title}" and ${curation.tab_count} tabs deleted successfully`
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
