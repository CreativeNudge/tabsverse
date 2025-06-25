/**
 * Image Compression Service for Tabsverse
 * Automatically compresses images to 600x600 square format
 * Targets 500KB max file size with quality optimization
 * Based on proven Orate implementation patterns
 */

export interface CompressionResult {
  compressedFile: File
  originalSize: number
  compressedSize: number
  savings: number // percentage savings
  compressionRatio: number
}

export interface CompressionOptions {
  targetSize: number // target dimensions (600x600)
  quality: number // initial quality (0.8)
  maxFileSize: number // target file size in bytes (500KB)
  format: 'jpeg' | 'webp'
}

const DEFAULT_OPTIONS: CompressionOptions = {
  targetSize: 600,
  quality: 0.8,
  maxFileSize: 500 * 1024, // 500KB
  format: 'jpeg'
}

/**
 * Validates uploaded image file
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please upload a JPG, PNG, WebP, or GIF image'
    }
  }

  // Check file size (10MB max for upload)
  const maxUploadSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxUploadSize) {
    return {
      isValid: false,
      error: 'Image must be smaller than 10MB'
    }
  }

  return { isValid: true }
}

/**
 * Compresses image to square format with size optimization
 */
export async function compressImage(
  file: File,
  options: Partial<CompressionOptions> = {}
): Promise<CompressionResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      try {
        // Set canvas to square dimensions
        canvas.width = opts.targetSize
        canvas.height = opts.targetSize

        // Calculate crop dimensions to center the image
        const size = Math.min(img.width, img.height)
        const x = (img.width - size) / 2
        const y = (img.height - size) / 2

        // Draw cropped and resized image
        if (ctx) {
          // Fill with white background (in case of transparency)
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, opts.targetSize, opts.targetSize)
          
          // Draw the image centered and cropped to square
          ctx.drawImage(
            img,
            x, y, size, size, // source crop
            0, 0, opts.targetSize, opts.targetSize // destination
          )
        }

        // Convert to blob with quality optimization
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'))
              return
            }

            // If still too large, reduce quality iteratively
            if (blob.size > opts.maxFileSize && opts.quality > 0.1) {
              const newOptions = { ...opts, quality: opts.quality - 0.1 }
              compressImage(file, newOptions).then(resolve).catch(reject)
              return
            }

            // Create compressed file
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '.jpg'), // Always save as JPG
              { type: 'image/jpeg' }
            )

            // Calculate savings
            const savings = Math.round(((file.size - blob.size) / file.size) * 100)
            const compressionRatio = Math.round((blob.size / file.size) * 100) / 100

            resolve({
              compressedFile,
              originalSize: file.size,
              compressedSize: blob.size,
              savings,
              compressionRatio
            })
          },
          `image/${opts.format}`,
          opts.quality
        )
      } catch (error) {
        reject(new Error(`Compression failed: ${error}`))
      }
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    // Load the image
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * Get compression statistics for user display
 */
export function getCompressionStats(result: CompressionResult) {
  return {
    originalSize: formatFileSize(result.originalSize),
    compressedSize: formatFileSize(result.compressedSize),
    savings: `${result.savings}%`,
    savingsAmount: formatFileSize(result.originalSize - result.compressedSize)
  }
}
