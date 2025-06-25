/**
 * SIMPLIFIED: Image Upload Service for Tabsverse
 * Using createRouteHandlerClient for proper server-side auth
 */

import { createClient } from '@supabase/supabase-js'

export interface ImageUploadResult {
  success: boolean
  url?: string
  error?: string
}

/**
 * Uploads curation cover image to Supabase Storage
 * Using API route for server-side authentication
 */
export async function uploadCurationImage(file: File): Promise<ImageUploadResult> {
  try {
    // Use FormData to send to our API route
    const formData = new FormData()
    formData.append('file', file)
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2)
    const fileName = `${timestamp}-${randomId}.${fileExt}`
    formData.append('fileName', fileName)

    // Send to our API route that handles authentication properly
    const response = await fetch('/api/upload-curation-image', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()
    
    if (!response.ok || !result.success) {
      return {
        success: false,
        error: result.error || `Upload failed with status ${response.status}`
      }
    }

    return {
      success: true,
      url: result.url
    }

  } catch (error) {
    return {
      success: false,
      error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Placeholder functions for backward compatibility
// These can be implemented later if needed for admin features
export async function findOrphanedImages(): Promise<string[]> {
  console.warn('findOrphanedImages not implemented in simplified version')
  return []
}

export async function cleanupOrphanedImages(): Promise<{
  success: boolean
  deletedCount: number
  error?: string
}> {
  console.warn('cleanupOrphanedImages not implemented in simplified version')
  return {
    success: true,
    deletedCount: 0
  }
}
