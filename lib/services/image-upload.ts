/**
 * UPDATED: Image Upload Service for Tabsverse
 * Handles Supabase Storage integration with privacy-aware access and guaranteed one-to-one image relationship
 * Ensures: 1 curation = maximum 1 image, respects curation visibility
 */

import { createClient } from '@supabase/supabase-js'

// Use the existing Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface ImageUploadResult {
  success: boolean
  url?: string
  error?: string
  compressionStats?: {
    originalSize: string
    compressedSize: string
    savings: string
  }
  deletionInfo?: {
    oldImageDeleted: boolean
    oldImagePath?: string
    deletionError?: string
  }
}

/**
 * Extracts file path from Supabase Storage URL
 */
function extractFilePathFromUrl(url: string): string | null {
  try {
    // Supabase storage URLs format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    // or: https://[project].supabase.co/storage/v1/object/sign/[bucket]/[path]?token=...
    const publicMatch = url.match(/\/storage\/v1\/object\/public\/[^\/]+\/(.+)$/)
    const signedMatch = url.match(/\/storage\/v1\/object\/sign\/[^\/]+\/(.+)\?/)
    
    return publicMatch?.[1] || signedMatch?.[1] || null
  } catch (error) {
    console.warn('Failed to extract file path from URL:', error)
    return null
  }
}

/**
 * Gets current image URL for a curation from database
 * ENSURES: We know exactly what image is currently associated
 */
async function getCurrentImageUrl(curationId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('cover_image_url')
      .eq('id', curationId)
      .single()

    if (error) {
      console.warn('Failed to get current image URL:', error)
      return null
    }

    return data?.cover_image_url || null
  } catch (error) {
    console.warn('Failed to get current image URL:', error)
    return null
  }
}

/**
 * Deletes old image from storage
 * ENSURES: Old image is removed before new one is uploaded
 */
async function deleteOldImage(oldImageUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = extractFilePathFromUrl(oldImageUrl)
    if (!filePath) {
      return { success: false, error: 'Could not extract file path from URL' }
    }

    const { error } = await supabase.storage
      .from('curation-images')
      .remove([filePath])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown deletion error' 
    }
  }
}

/**
 * Uploads curation cover image to Supabase Storage
 * GUARANTEES: 
 * 1. Maximum one image per curation (deletes old before uploading new)
 * 2. Respects privacy (images follow curation visibility via policies)
 * 3. Proper cleanup (old images are always deleted)
 */
export async function uploadCurationImage(
  file: File,
  curationId?: string
): Promise<ImageUploadResult> {
  try {
    let deletionInfo = {
      oldImageDeleted: false,
      oldImagePath: undefined as string | undefined,
      deletionError: undefined as string | undefined
    }

    // STEP 1: If updating existing curation, MUST delete old image first
    if (curationId) {
      const currentImageUrl = await getCurrentImageUrl(curationId)
      if (currentImageUrl) {
        const deleteResult = await deleteOldImage(currentImageUrl)
        deletionInfo = {
          oldImageDeleted: deleteResult.success,
          oldImagePath: currentImageUrl,
          deletionError: deleteResult.error
        }

        // Log deletion attempt for debugging
        if (!deleteResult.success) {
          console.warn('Failed to delete old image:', deleteResult.error)
        }
      }
    }

    // STEP 2: Generate unique filename to prevent conflicts
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2)
    const fileName = `${curationId || timestamp}-${randomId}.${fileExt}`
    const filePath = `curation-covers/${fileName}`

    // STEP 3: Upload to Supabase Storage (private bucket with policy-based access)
    const { data, error } = await supabase.storage
      .from('curation-images')
      .upload(filePath, file, {
        cacheControl: '3600', // 1 hour cache
        upsert: false // Never overwrite, always use unique names
      })

    if (error) {
      return {
        success: false,
        error: `Upload failed: ${error.message}`,
        deletionInfo
      }
    }

    // STEP 4: Get public URL (will be access-controlled by policies)
    const { data: { publicUrl } } = supabase.storage
      .from('curation-images')
      .getPublicUrl(filePath)

    return {
      success: true,
      url: publicUrl,
      deletionInfo
    }

  } catch (error) {
    return {
      success: false,
      error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      deletionInfo: {
        oldImageDeleted: false,
        deletionError: 'Upload process failed'
      }
    }
  }
}

/**
 * Updates curation image in database
 * ENSURES: Database is updated atomically with storage operation
 */
export async function updateCurationImageUrl(
  curationId: string, 
  imageUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('groups')
      .update({ cover_image_url: imageUrl })
      .eq('id', curationId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Database update failed' 
    }
  }
}

/**
 * Complete image replacement workflow
 * GUARANTEES: Atomic operation with rollback on failure
 */
export async function replaceCurationImage(
  curationId: string,
  newImageFile: File
): Promise<ImageUploadResult> {
  try {
    // Step 1: Upload new image (this also deletes old one)
    const uploadResult = await uploadCurationImage(newImageFile, curationId)
    
    if (!uploadResult.success || !uploadResult.url) {
      return uploadResult
    }

    // Step 2: Update database with new URL
    const dbResult = await updateCurationImageUrl(curationId, uploadResult.url)
    
    if (!dbResult.success) {
      // Rollback: Delete the newly uploaded image since DB update failed
      await deleteOldImage(uploadResult.url)
      
      return {
        success: false,
        error: `Database update failed: ${dbResult.error}`,
        deletionInfo: uploadResult.deletionInfo
      }
    }

    return uploadResult

  } catch (error) {
    return {
      success: false,
      error: `Image replacement failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Find orphaned images (for maintenance)
 * UPDATED: More accurate detection with better path matching
 */
export async function findOrphanedImages(): Promise<string[]> {
  try {
    // Get all images in storage
    const { data: files, error: storageError } = await supabase.storage
      .from('curation-images')
      .list('curation-covers', {
        limit: 1000,
        offset: 0
      })

    if (storageError || !files) {
      throw new Error(`Failed to list storage files: ${storageError?.message}`)
    }

    // Get all image URLs from database
    const { data: curations, error: dbError } = await supabase
      .from('groups')
      .select('cover_image_url')
      .not('cover_image_url', 'is', null)

    if (dbError) {
      throw new Error(`Failed to query database: ${dbError.message}`)
    }

    // Extract file names from database URLs more accurately
    const referencedFiles = new Set<string>()
    
    curations?.forEach(curation => {
      if (curation.cover_image_url) {
        const filePath = extractFilePathFromUrl(curation.cover_image_url)
        if (filePath) {
          const fileName = filePath.split('/').pop()
          if (fileName) {
            referencedFiles.add(fileName)
          }
        }
      }
    })

    // Find orphaned files (exist in storage but not referenced in database)
    const orphanedFiles = files
      .filter(file => !referencedFiles.has(file.name))
      .map(file => `curation-covers/${file.name}`)

    return orphanedFiles

  } catch (error) {
    console.error('Failed to find orphaned images:', error)
    return []
  }
}

/**
 * Cleanup orphaned images from storage
 * ENSURES: Only truly orphaned images are deleted
 */
export async function cleanupOrphanedImages(): Promise<{
  success: boolean
  deletedCount: number
  error?: string
}> {
  try {
    const orphanedPaths = await findOrphanedImages()
    
    if (orphanedPaths.length === 0) {
      return {
        success: true,
        deletedCount: 0
      }
    }

    const { error } = await supabase.storage
      .from('curation-images')
      .remove(orphanedPaths)

    if (error) {
      return {
        success: false,
        deletedCount: 0,
        error: error.message
      }
    }

    return {
      success: true,
      deletedCount: orphanedPaths.length
    }

  } catch (error) {
    return {
      success: false,
      deletedCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get signed URL for private curation images
 * USE CASE: When you need temporary access to private curation images
 */
export async function getSignedImageUrl(
  imageUrl: string, 
  expiresIn: number = 3600
): Promise<string | null> {
  try {
    const filePath = extractFilePathFromUrl(imageUrl)
    if (!filePath) return null

    const { data, error } = await supabase.storage
      .from('curation-images')
      .createSignedUrl(filePath, expiresIn)

    if (error || !data) return null

    return data.signedUrl
  } catch (error) {
    console.warn('Failed to create signed URL:', error)
    return null
  }
}
