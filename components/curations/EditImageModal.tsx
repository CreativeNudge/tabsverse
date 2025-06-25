'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, RefreshCw, Sparkles, Upload, AlertCircle, X } from 'lucide-react'
import { updateCurationImage, type ImageUploadResult } from '@/lib/services/enhanced-image-upload'

interface EditImageModalProps {
  isOpen: boolean
  onClose: () => void
  curationId: string
  curationTitle: string
  onImageUpdated: (newImageUrl: string) => void
}

export default function EditImageModal({
  isOpen,
  onClose,
  curationId,
  curationTitle,
  onImageUpdated
}: EditImageModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: string
    compressedSize: string
    savings: string
  } | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.')
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB.')
      return
    }

    setSelectedFile(file)
    setError(null)

    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    // Clear the input so same file can be selected again
    e.target.value = ''
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setError(null)
    setCompressionStats(null)
  }

  const handleSaveChanges = async () => {
    if (!selectedFile) {
      setError('Please select an image to upload.')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const result: ImageUploadResult = await updateCurationImage(curationId, selectedFile)

      if (result.success && result.url) {
        // Show compression stats
        if (result.compressionStats) {
          setCompressionStats(result.compressionStats)
        }

        // Notify parent component of the update
        onImageUpdated(result.url)

        // Optional: Show success message
        console.log(`Image updated! ${result.compressionStats ? 
          `Compressed from ${result.compressionStats.originalSize} to ${result.compressionStats.compressedSize} (${result.compressionStats.savings} smaller)` : 
          ''} ${result.deletedOldImage ? '• Old image deleted' : ''}`)

        // Close modal after short delay to show stats
        setTimeout(() => {
          onClose()
          handleCloseReset()
        }, 1500)
      } else {
        setError(result.error || 'Upload failed')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCloseReset = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setError(null)
    setCompressionStats(null)
    setIsUploading(false)
  }

  const handleClose = () => {
    if (!isUploading) {
      onClose()
      handleCloseReset()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col animate-fade-in">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-stone-50 to-amber-50/30 px-8 py-6 border-b border-stone-200 flex-shrink-0 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-800">Edit Cover Image</h2>
              <p className="text-stone-600 mt-1 text-sm">Update the cover image for "{curationTitle}"</p>
            </div>
            <button 
              onClick={handleClose}
              disabled={isUploading}
              className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-stone-600" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-8 space-y-6">
          {/* Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-3">
              New Cover Image
            </label>
            
            {selectedFile && previewUrl ? (
              // Image Preview
              <div className="space-y-4">
                <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-stone-200 group">
                  <Image 
                    src={previewUrl} 
                    alt="Preview" 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  {/* Remove overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      disabled={isUploading}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Compression Stats Display */}
                {compressionStats && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-green-800 text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-medium">Image Optimized!</span>
                    </div>
                    <div className="text-green-700 text-sm mt-1">
                      Compressed from {compressionStats.originalSize} to {compressionStats.compressedSize} 
                      <span className="font-medium"> ({compressionStats.savings} smaller)</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Upload Area
              <label className={`w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                isUploading
                  ? 'border-blue-300 bg-blue-50/30'
                  : 'border-stone-300 hover:border-orange-300 hover:bg-orange-50/30'
              }`}>
                {isUploading ? (
                  <>
                    <RefreshCw className="w-6 h-6 text-blue-500 mb-2 animate-spin" />
                    <span className="text-sm text-blue-600 font-medium">Updating image...</span>
                    <span className="text-xs text-blue-500 mt-1">
                      Compressing to 600×600 • Deleting old image
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-stone-400 mb-2" />
                    <span className="text-sm text-stone-500 font-medium">Click to upload new image</span>
                    <span className="text-xs text-stone-400 mt-1">
                      JPG, PNG, WebP up to 10MB • Auto-resized to 600×600
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            )}

            {/* Error Display */}
            {error && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3">
                <div className="flex items-center gap-2 text-red-800 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">Upload Failed</span>
                </div>
                <div className="text-red-700 text-sm mt-1">
                  {error}
                </div>
              </div>
            )}


          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 px-8 py-6 border-t border-stone-200 flex items-center justify-between flex-shrink-0 rounded-b-3xl">
          <button 
            onClick={handleClose}
            disabled={isUploading}
            className="px-6 py-3 text-stone-600 hover:text-stone-800 font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleSaveChanges}
            disabled={isUploading || !selectedFile}
            className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-500 flex items-center gap-3 disabled:opacity-50 ${
              isUploading 
                ? 'bg-gradient-to-r from-[#31a9d6] to-[#000d85] text-white scale-105' 
                : 'bg-gradient-to-r from-[#af0946] to-[#dc8c35] hover:from-[#31a9d6] hover:to-[#000d85] text-white hover:scale-105'
            } shadow-lg hover:shadow-xl`}
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}