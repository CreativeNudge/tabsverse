import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerSupabaseClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteHandlerSupabaseClient()
    const { id: groupId } = await params

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if group exists and is public (or user owns it)
    const { data: curation, error: fetchError } = await supabase
      .from('groups')
      .select('visibility, user_id')
      .eq('id', groupId)
      .single()

    if (fetchError || !curation) {
      return NextResponse.json({ error: 'Curation not found' }, { status: 404 })
    }

    if (curation.visibility !== 'public' && curation.user_id !== user.id) {
      return NextResponse.json({ error: 'Cannot like private curation' }, { status: 403 })
    }

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('group_likes')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single()

    if (existingLike) {
      return NextResponse.json({ error: 'Already liked' }, { status: 400 })
    }

    // Create like
    const { error: createError } = await supabase
      .from('group_likes')
      .insert({
        group_id: groupId,
        user_id: user.id
      })

    if (createError) {
      console.error('Error creating like:', createError)
      return NextResponse.json({ error: 'Failed to like curation' }, { status: 500 })
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteHandlerSupabaseClient()
    const { id: groupId } = await params

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Remove like
    const { error: deleteError } = await supabase
      .from('group_likes')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error removing like:', deleteError)
      return NextResponse.json({ error: 'Failed to unlike curation' }, { status: 500 })
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
