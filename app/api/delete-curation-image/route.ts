import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database'

// Centralized auth utility for Next.js 15 compatibility
async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient<Database>({ 
    cookies: () => cookieStore 
  } as any)
  
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error, supabase }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser()
    if (authError || !user) {
      return NextResponse.json({ 
        success: false,
        error: 'Authentication required' 
      }, { status: 401 })
    }

    const body = await request.json()
    const { filePath } = body

    if (!filePath) {
      return NextResponse.json({ 
        success: false,
        error: 'File path required' 
      }, { status: 400 })
    }

    // Delete file from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from('curation-images')
      .remove([filePath])

    if (deleteError) {
      console.error('Storage delete error:', deleteError)
      return NextResponse.json({ 
        success: false,
        error: `Delete failed: ${deleteError.message}` 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    })

  } catch (error) {
    console.error('Delete API error:', error)
    return NextResponse.json({ 
      success: false,
      error: `Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}