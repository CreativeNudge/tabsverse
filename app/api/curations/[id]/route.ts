import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerSupabaseClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteHandlerSupabaseClient()
    const { id } = await params

    // Get the curation with user info and all its tabs
    const { data: curation, error: curationError } = await supabase
      .from('groups')
      .select(`
        *,
        user:users (
          id,
          username,
          full_name,
          avatar_url
        ),
        tabs (
          *
        )
      `)
      .eq('id', id)
      .single()

    if (curationError) {
      console.error('Error fetching curation:', curationError)
      return NextResponse.json({ error: 'Curation not found' }, { status: 404 })
    }

    if (!curation) {
      return NextResponse.json({ error: 'Curation not found' }, { status: 404 })
    }

    // Sort tabs by position
    if (curation.tabs) {
      curation.tabs.sort((a: any, b: any) => a.position - b.position)
    }

    // Check if current user has liked this curation
    const { data: { user } } = await supabase.auth.getUser()
    let isLiked = false
    
    if (user) {
      const { data: likeData } = await supabase
        .from('group_likes')
        .select('id')
        .eq('group_id', id)
        .eq('user_id', user.id)
        .single()
      
      isLiked = !!likeData
    }

    // Track view (if not the owner)
    if (user && user.id !== curation.user_id) {
      // Insert view record (will auto-increment view_count via trigger)
      await supabase
        .from('group_views')
        .insert({
          group_id: id,
          viewer_id: user.id,
          user_agent: request.headers.get('user-agent'),
          referrer: request.headers.get('referer')
        })
    }

    return NextResponse.json({
      curation: {
        ...curation,
        isLiked
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteHandlerSupabaseClient()
    const { id } = await params
    const body = await request.json()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user owns this curation
    const { data: curation, error: fetchError } = await supabase
      .from('groups')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !curation) {
      return NextResponse.json({ error: 'Curation not found' }, { status: 404 })
    }

    if (curation.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update curation
    const { data: updatedCuration, error: updateError } = await supabase
      .from('groups')
      .update({
        title: body.title,
        description: body.description,
        visibility: body.visibility,
        tags: body.tags,
        cover_image_url: body.cover_image_url,
        settings: body.settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        user:users (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .single()

    if (updateError) {
      console.error('Error updating curation:', updateError)
      return NextResponse.json({ error: 'Failed to update curation' }, { status: 500 })
    }

    return NextResponse.json({ curation: updatedCuration })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteHandlerSupabaseClient()
    const { id } = await params

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user owns this curation
    const { data: curation, error: fetchError } = await supabase
      .from('groups')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !curation) {
      return NextResponse.json({ error: 'Curation not found' }, { status: 404 })
    }

    if (curation.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete curation (cascade will handle tabs, likes, comments, views)
    const { error: deleteError } = await supabase
      .from('groups')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting curation:', deleteError)
      return NextResponse.json({ error: 'Failed to delete curation' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
