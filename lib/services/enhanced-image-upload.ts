/**
 * Enhanced Image Upload Service for Tabsverse
 * Handles compression, upload, and automatic old image deletion
 */

import { compressCurationImage, formatCompressionStats, type CompressionResult, type CompressionStats } from './image-compression'

export interface ImageUploadResult {
  success: boolean
  url?: string
  error?: string
  compressionStats?: CompressionStats
  deletedOldImage?: boolean
}

/**
 * Extract file path from Supabase storage URL for deletion
 */
function extractFilePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    
    // Handle different URL formats
    if (pathParts.includes('curation-covers')) {
      const coverIndex = pathParts.findIndex(part => part === 'curation-covers')
      return pathParts.slice(coverIndex).join('/')
    }
    
    // Fallback: assume last two parts are folder/filename
    return pathParts.slice(-2).join('/')
  } catch (error) {
    console.error('Error extracting file path from URL:', url, error)
    return null
  }
}

/**
 * Delete image from Supabase storage
 */
async function deleteImageFromStorage(imageUrl: string): Promise<boolean> {
  try {
    const filePath = extractFilePathFromUrl(imageUrl)
    if (!filePath) {
      console.warn('Could not extract file path from URL:', imageUrl)
      return false
    }

    const response = await fetch('/api/delete-curation-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath })
    })

    if (!response.ok) {
      console.error('Failed to delete image from storage:', response.statusText)
      return false
    }

    const result = await response.json()
    return result.success
  } catch (error) {
    console.error('Error deleting image from storage:', error)
    return false
  }
}

/**
 * Upload curation image with automatic compression and old image deletion
 * @param file - Image file to upload
 * @param curationId - ID of curation (for editing existing curations)
 * @param currentImageUrl - Current image URL to delete (optional)
 */
export async function uploadCurationImage(
  file: File, 
  curationId?: string,
  currentImageUrl?: string
): Promise<ImageUploadResult> {
  try {
    let deletedOldImage = false

    // Step 1: Delete old image if provided
    if (currentImageUrl) {
      console.log('Deleting old image:', currentImageUrl)
      deletedOldImage = await deleteImageFromStorage(currentImageUrl)
      if (!deletedOldImage) {
        console.warn('Failed to delete old image, continuing with upload...')
      }
    }

    // Step 2: Compress the image
    const compressionResult: CompressionResult = await compressCurationImage(file)
    
    if (!compressionResult.success || !compressionResult.compressedFile) {
      return {
        success: false,
        error: compressionResult.error || 'Image compression failed'
      }
    }

    // Step 3: Upload compressed image to storage
    const formData = new FormData()
    formData.append('file', compressionResult.compressedFile)
    
    // Generate unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2)
    const fileName = `${timestamp}-${randomId}.jpg`
    formData.append('fileName', fileName)

    const response = await fetch('/api/upload-curation-image', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()
    
    if (!response.ok || !result.success) {
      // If upload failed but we deleted old image, this is a problem
      if (deletedOldImage) {
        console.error('CRITICAL: Upload failed after deleting old image!')
      }
      
      return {
        success: false,
        error: result.error || `Upload failed with status ${response.status}`
      }
    }

    // Step 4: Return success with compression stats
    return {
      success: true,
      url: result.url,
      compressionStats: formatCompressionStats(compressionResult),
      deletedOldImage
    }

  } catch (error) {
    return {
      success: false,
      error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Update curation image (edit existing curation)
 * Fetches current image URL, deletes it, uploads new one, updates database
 */
export async function updateCurationImage(
  curationId: string,
  newImageFile: File
): Promise<ImageUploadResult> {
  try {
    // Step 1: Get current curation data including image URL
    const curationResponse = await fetch(`/api/curations/${curationId}`)
    if (!curationResponse.ok) {
      return {
        success: false,
        error: 'Failed to fetch current curation data'
      }
    }

    const curationData = await curationResponse.json()
    const currentImageUrl = curationData.cover_image_url

    // Step 2: Upload new image (this will also delete the old one)
    const uploadResult = await uploadCurationImage(
      newImageFile,
      curationId,
      currentImageUrl
    )

    if (!uploadResult.success) {
      return uploadResult
    }

    // Step 3: Update curation in database with new image URL
    const updateResponse = await fetch(`/api/curations/${curationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        coverImageUrl: uploadResult.url
      })
    })

    if (!updateResponse.ok) {
      const updateResult = await updateResponse.json()
      return {
        success: false,
        error: updateResult.error || 'Failed to update curation with new image URL'
      }
    }

    return {
      success: true,
      url: uploadResult.url,
      compressionStats: uploadResult.compressionStats,
      deletedOldImage: uploadResult.deletedOldImage
    }

  } catch (error) {
    return {
      success: false,
      error: `Update failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Keep backward compatibility
export { uploadCurationImage as default }