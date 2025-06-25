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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; tabId: string }> }
) {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: groupId, tabId } = await params

    // Verify user owns the curation that contains this tab
    const { data: curation, error: curationError } = await supabase
      .from('groups')
      .select('user_id')
      .eq('id', groupId)
      .single()

    if (curationError || !curation) {
      return NextResponse.json({ error: 'Curation not found' }, { status: 404 })
    }

    if (curation.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get tab info before deletion
    const { data: tab, error: tabFetchError } = await supabase
      .from('tabs')
      .select('title, url')
      .eq('id', tabId)
      .eq('group_id', groupId)
      .single()

    if (tabFetchError || !tab) {
      return NextResponse.json({ error: 'Tab not found' }, { status: 404 })
    }

    // Delete the tab (triggers will automatically update group tab_count)
    const { error: deleteError } = await supabase
      .from('tabs')
      .delete()
      .eq('id', tabId)
      .eq('group_id', groupId)

    if (deleteError) {
      console.error('Error deleting tab:', deleteError)
      return NextResponse.json({ error: 'Failed to delete tab' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: `Tab "${tab.title}" deleted successfully`
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
