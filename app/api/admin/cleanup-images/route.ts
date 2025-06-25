/**
 * Admin API for Image Cleanup
 * GET: Check for orphaned images
 * POST: Run cleanup process
 */

import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { findOrphanedImages, cleanupOrphanedImages } from '@/lib/services/image-upload'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find orphaned images without deleting
    const orphanedImages = await findOrphanedImages()

    return NextResponse.json({
      success: true,
      orphanedCount: orphanedImages.length,
      orphanedImages: orphanedImages.map(path => ({
        path,
        filename: path.split('/').pop()
      }))
    })

  } catch (error) {
    console.error('Cleanup check failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Run cleanup process
    const result = await cleanupOrphanedImages()

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully cleaned up ${result.deletedCount} orphaned images`,
      deletedCount: result.deletedCount
    })

  } catch (error) {
    console.error('Cleanup failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
