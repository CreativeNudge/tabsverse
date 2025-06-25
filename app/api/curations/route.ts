import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database'

// Constants for validation
const MAX_USER_TAGS = 6
const FREE_TIER_CURATION_LIMIT = 5

// Centralized auth utility for Next.js 15 compatibility
async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient<Database>({ 
    cookies: () => cookieStore 
  } as any) // Type assertion for Next.js 15 compatibility
  
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error, supabase }
}

// Create new curation
export async function POST(request: NextRequest) {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure user profile exists (create if doesn't exist)
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existingProfile && profileCheckError?.code === 'PGRST116') {
      // User profile doesn't exist, create it
      const { error: createProfileError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          username: null, // Can be set later by user
        })
      
      if (createProfileError) {
        console.error('Error creating user profile:', createProfileError)
        return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
      }
    } else if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      console.error('Error checking user profile:', profileCheckError)
      return NextResponse.json({ error: 'Failed to verify user profile' }, { status: 500 })
    }

    const body = await request.json()
    const { title, description, visibility, tags, primary_category, secondary_category, coverImageUrl } = body

    // Validate required fields
    if (!title || title.trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Validate required category
    if (!primary_category) {
      return NextResponse.json({ error: 'Primary category is required' }, { status: 400 })
    }

    // Validate categories are different if secondary is provided
    if (secondary_category && secondary_category === primary_category) {
      return NextResponse.json({ error: 'Secondary category must be different from primary category' }, { status: 400 })
    }

    // Check user's current curation count (free tier limit: 5)
    const { count: currentCount, error: countError } = await supabase
      .from('groups')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (countError) {
      console.error('Error checking curation count:', countError)
      return NextResponse.json({ error: 'Failed to check curation limit' }, { status: 500 })
    }

    // Enforce free tier limit
    if (currentCount && currentCount >= FREE_TIER_CURATION_LIMIT) {
      return NextResponse.json({ 
        error: `Free tier limit reached. You can create up to ${FREE_TIER_CURATION_LIMIT} curations.` 
      }, { status: 400 })
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')          // Replace spaces with hyphens
      .replace(/-+/g, '-')           // Replace multiple hyphens with single
      .trim('-')                     // Remove leading/trailing hyphens

    // Ensure slug uniqueness for this user
    let finalSlug = slug
    let counter = 1
    while (true) {
      const { data: existingGroup } = await supabase
        .from('groups')
        .select('id')
        .eq('user_id', user.id)
        .eq('slug', finalSlug)
        .single()

      if (!existingGroup) break
      finalSlug = `${slug}-${counter}`
      counter++
    }

    // Process and validate tags
    let processedTags: string[] = []
    if (tags && typeof tags === 'string') {
      processedTags = tags
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0 && tag.length <= 50) // Individual tag length limit
        .slice(0, MAX_USER_TAGS) // Enforce maximum tag count
    }
    
    // Validate tag count
    if (processedTags.length > MAX_USER_TAGS) {
      return NextResponse.json({ 
        error: `Maximum ${MAX_USER_TAGS} tags allowed` 
      }, { status: 400 })
    }

    // Create the curation
    const { data: newGroup, error: insertError } = await supabase
      .from('groups')
      .insert({
        user_id: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        slug: finalSlug,
        cover_image_url: coverImageUrl || null,
        visibility: visibility || 'private',
        primary_category: primary_category,
        secondary_category: secondary_category || null,
        tags: processedTags,
        settings: {
          allow_comments: true,
          display_style: 'grid',
          personality: 'creative' // Default personality for backward compatibility
        }
      })
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

    if (insertError) {
      console.error('Error creating curation:', insertError)
      return NextResponse.json({ error: 'Failed to create curation' }, { status: 500 })
    }

    // TODO: User stats update
    // Future enhancement: Update user statistics when we implement the users table
    // This could be done via database triggers or periodic batch updates for better performance
    // For MVP, stats are calculated on-demand from the groups table

    return NextResponse.json({ 
      success: true, 
      curation: newGroup,
      message: 'Curation created successfully!'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Get user's curations
export async function GET(request: NextRequest) {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure user profile exists (create if doesn't exist)
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existingProfile && profileCheckError?.code === 'PGRST116') {
      // User profile doesn't exist, create it
      const { error: createProfileError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          username: null,
        })
      
      if (createProfileError) {
        console.error('Error creating user profile:', createProfileError)
        return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
      }
    }

    const { searchParams } = new URL(request.url)
    const visibilityParam = searchParams.get('visibility') // 'private', 'public', or null for all
    
    // Validate visibility parameter
    const validVisibilities = ['private', 'public'] as const
    const visibility = validVisibilities.includes(visibilityParam as any) 
      ? (visibilityParam as 'private' | 'public')
      : null

    let query = supabase
      .from('groups')
      .select(`
        *,
        user:users (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (visibility) {
      query = query.eq('visibility', visibility)
    }

    const { data: curations, error } = await query

    if (error) {
      console.error('Error fetching curations:', error)
      return NextResponse.json({ error: 'Failed to fetch curations' }, { status: 500 })
    }

    return NextResponse.json({ curations })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}