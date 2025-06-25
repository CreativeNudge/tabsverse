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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: groupId } = await params
    const body = await request.json()

    // Verify user owns this curation
    const { data: curation, error: fetchError } = await supabase
      .from('groups')
      .select('user_id, tab_count')
      .eq('id', groupId)
      .single()

    if (fetchError || !curation) {
      return NextResponse.json({ error: 'Curation not found' }, { status: 404 })
    }

    if (curation.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Extract domain from URL
    let domain = ''
    try {
      const url = new URL(body.url)
      domain = url.hostname
    } catch (e) {
      // Invalid URL, domain stays empty
    }

    // Get next position
    const nextPosition = curation.tab_count + 1

    // Create new tab
    const { data: newTab, error: createError } = await supabase
      .from('tabs')
      .insert({
        group_id: groupId,
        user_id: user.id,
        url: body.url,
        title: body.title,
        description: body.description,
        thumbnail_url: body.thumbnail_url,
        favicon_url: body.favicon_url,
        domain: domain,
        resource_type: body.resource_type || 'webpage',
        position: nextPosition,
        tags: body.tags || [],
        notes: body.notes,
        metadata: body.metadata || {}
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating tab:', createError)
      return NextResponse.json({ error: 'Failed to create tab' }, { status: 500 })
    }

    return NextResponse.json({ tab: newTab })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
