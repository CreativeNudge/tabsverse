/**
 * React Hook for Image Compression
 * Provides state management and utilities for image compression workflow
 * Based on proven Orate implementation patterns
 */

import { useState, useCallback } from 'react'
import { 
  compressCurationImage, 
  validateImageFile, 
  formatCompressionStats,
  type CompressionResult 
} from '../lib/services/image-compression'

interface UseImageCompressionState {
  isCompressing: boolean
  compressionResult: CompressionResult | null
  error: string | null
  previewUrl: string | null
}

interface UseImageCompressionReturn extends UseImageCompressionState {
  compressFile: (file: File) => Promise<CompressionResult | null>
  clearCompression: () => void
  getStats: () => ReturnType<typeof formatCompressionStats> | null
}

export function useImageCompression(): UseImageCompressionReturn {
  const [state, setState] = useState<UseImageCompressionState>({
    isCompressing: false,
    compressionResult: null,
    error: null,
    previewUrl: null
  })

  const compressFile = useCallback(async (file: File): Promise<CompressionResult | null> => {
    // Validate file first
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setState(prev => ({
        ...prev,
        error: validation.error || 'Invalid file',
        compressionResult: null,
        previewUrl: null
      }))
      return null
    }

    setState(prev => ({
      ...prev,
      isCompressing: true,
      error: null,
      previewUrl: null
    }))

    try {
      // Compress the image
      const result = await compressCurationImage(file)
      
      if (!result.success) {
        setState(prev => ({
          ...prev,
          isCompressing: false,
          error: result.error || 'Compression failed',
          compressionResult: null,
          previewUrl: null
        }))
        return null
      }

      // Create preview URL
      const previewUrl = result.compressedFile ? URL.createObjectURL(result.compressedFile) : null

      setState(prev => ({
        ...prev,
        isCompressing: false,
        compressionResult: result,
        previewUrl
      }))

      return result

    } catch (error) {
      setState(prev => ({
        ...prev,
        isCompressing: false,
        error: error instanceof Error ? error.message : 'Compression failed',
        compressionResult: null,
        previewUrl: null
      }))
      return null
    }
  }, [])

  const clearCompression = useCallback(() => {
    // Clean up preview URL to prevent memory leaks
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl)
    }

    setState({
      isCompressing: false,
      compressionResult: null,
      error: null,
      previewUrl: null
    })
  }, [state.previewUrl])

  const getStats = useCallback(() => {
    if (!state.compressionResult) return null
    return formatCompressionStats(state.compressionResult)
  }, [state.compressionResult])

  return {
    ...state,
    compressFile,
    clearCompression,
    getStats
  }
}
