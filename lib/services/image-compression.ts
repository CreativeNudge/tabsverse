/**
 * Image Compression Service for Tabsverse
 * Handles automatic compression to 600×600 square format
 * Inspired by working Orate implementation
 */

export interface CompressionResult {
  success: boolean
  compressedFile?: File
  originalSize: number
  compressedSize: number
  savings: number // Percentage saved
  error?: string
}

export interface CompressionStats {
  originalSize: string
  compressedSize: string
  savings: string // Formatted percentage
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * Validate image file before compression
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'
    }
  }
  
  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Maximum size is 10MB.'
    }
  }
  
  return { valid: true }
}

/**
 * Compress image to 600×600 square format
 * Centers and crops image to maintain aspect ratio
 */
export async function compressCurationImage(file: File): Promise<CompressionResult> {
  const originalSize = file.size
  
  try {
    // Validate file first
    const validation = validateImageFile(file)
    if (!validation.valid) {
      return {
        success: false,
        originalSize,
        compressedSize: 0,
        savings: 0,
        error: validation.error
      }
    }

    return new Promise((resolve) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        resolve({
          success: false,
          originalSize,
          compressedSize: 0,
          savings: 0,
          error: 'Canvas not supported'
        })
        return
      }

      img.onload = () => {
        // Set canvas to 600×600 square
        canvas.width = 600
        canvas.height = 600

        // Calculate crop dimensions for center alignment
        const { sx, sy, sWidth, sHeight } = calculateCropDimensions(
          img.width,
          img.height,
          600,
          600
        )

        // Draw cropped and scaled image
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 600, 600)

        // Convert to blob with progressive quality reduction
        let quality = 0.8 // Start with 80% quality
        const targetSize = 500 * 1024 // Target 500KB

        const tryCompress = (currentQuality: number) => {
          canvas.toBlob((blob) => {
            if (!blob) {
              resolve({
                success: false,
                originalSize,
                compressedSize: 0,
                savings: 0,
                error: 'Compression failed'
              })
              return
            }

            // If size is acceptable or quality is too low, accept result
            if (blob.size <= targetSize || currentQuality <= 0.3) {
              const compressedSize = blob.size
              const savings = ((originalSize - compressedSize) / originalSize) * 100
              
              // Create compressed file
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                type: 'image/jpeg'
              })

              resolve({
                success: true,
                compressedFile,
                originalSize,
                compressedSize,
                savings: Math.max(0, savings)
              })
            } else {
              // Try with lower quality
              tryCompress(currentQuality - 0.1)
            }
          }, 'image/jpeg', currentQuality)
        }

        tryCompress(quality)
      }

      img.onerror = () => {
        resolve({
          success: false,
          originalSize,
          compressedSize: 0,
          savings: 0,
          error: 'Failed to load image'
        })
      }

      // Load image
      img.src = URL.createObjectURL(file)
    })

  } catch (error) {
    return {
      success: false,
      originalSize,
      compressedSize: 0,
      savings: 0,
      error: error instanceof Error ? error.message : 'Unknown compression error'
    }
  }
}

/**
 * Calculate crop dimensions for center-aligned square crop
 */
function calculateCropDimensions(
  imageWidth: number,
  imageHeight: number,
  targetWidth: number,
  targetHeight: number
) {
  const imageAspect = imageWidth / imageHeight
  const targetAspect = targetWidth / targetHeight

  let sx = 0, sy = 0, sWidth = imageWidth, sHeight = imageHeight

  if (imageAspect > targetAspect) {
    // Image is wider than target - crop width
    sWidth = imageHeight * targetAspect
    sx = (imageWidth - sWidth) / 2
  } else {
    // Image is taller than target - crop height
    sHeight = imageWidth / targetAspect
    sy = (imageHeight - sHeight) / 2
  }

  return { sx, sy, sWidth, sHeight }
}

/**
 * Format compression result for user display
 */
export function formatCompressionStats(result: CompressionResult): CompressionStats {
  return {
    originalSize: formatFileSize(result.originalSize),
    compressedSize: formatFileSize(result.compressedSize),
    savings: `${result.savings.toFixed(1)}%`
  }
}