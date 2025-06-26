'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Plus, Link, Globe, FileText, Video, FileImage, Download, Sparkles, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { fetchUrlMetadata, type UrlMetadata } from '@/lib/utils/urlMetadata'

// Constants for validation
const MAX_USER_TAGS = 6

interface AddTabModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (tabData: {
    url: string
    title: string
    description?: string
    resource_type: string
    tags: string[]
    notes?: string
    thumbnail_url?: string
    favicon_url?: string
    metadata?: any
  }) => Promise<void>
  isLoading?: boolean
}

const resourceTypes = [
  { value: 'webpage', label: 'Web Page', icon: Globe },
  { value: 'document', label: 'Document', icon: FileText },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'image', label: 'Image', icon: FileImage },
  { value: 'pdf', label: 'PDF', icon: Download },
]

export default function AddTabModal({ isOpen, onClose, onAdd, isLoading }: AddTabModalProps) {
  // Form state
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    resource_type: 'webpage',
    tags: '',
    notes: ''
  })

  // Auto-detection state
  const [metadata, setMetadata] = useState<UrlMetadata | null>(null)
  const [fetchingMetadata, setFetchingMetadata] = useState(false)
  const [metadataError, setMetadataError] = useState<string | null>(null)
  
  // UI state
  const [simpleMode, setSimpleMode] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [titleManuallyEdited, setTitleManuallyEdited] = useState(false)

  // Parse and validate tags
  const parsedTags = useMemo(() => {
    if (!formData.tags.trim()) return []
    return formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .slice(0, MAX_USER_TAGS) // Enforce limit
  }, [formData.tags])

  const tagLimitExceeded = parsedTags.length >= MAX_USER_TAGS

  // Auto-fetch metadata when URL changes (with debouncing)
  useEffect(() => {
    // Always clear metadata when URL changes
    setMetadata(null)
    setMetadataError(null)
    
    // Reset manual editing flag if the domain changes significantly
    const currentDomain = (() => {
      try {
        return new URL(formData.url).hostname
      } catch {
        return ''
      }
    })()
    
    const previousDomain = (() => {
      try {
        return metadata ? new URL(metadata.domain).hostname : ''
      } catch {
        return metadata?.domain || ''
      }
    })()
    
    if (currentDomain && previousDomain && currentDomain !== previousDomain) {
      setTitleManuallyEdited(false)
    }
    
    if (!formData.url) {
      return
    }

    // Simple URL validation
    let isValidUrl = false
    try {
      new URL(formData.url)
      isValidUrl = true
    } catch {
      return
    }

    if (!isValidUrl) return

    // Debounce the metadata fetch
    const timeoutId = setTimeout(async () => {
      setFetchingMetadata(true)
      setMetadataError(null)
      
      try {
        const urlMetadata = await fetchUrlMetadata(formData.url)
        setMetadata(urlMetadata)
        
        // Auto-populate form fields ONLY if they are still empty or match previous auto-filled values
        setFormData(prev => ({
          ...prev,
          // Only update title if it hasn't been manually edited
          title: !titleManuallyEdited && (!prev.title || prev.title === metadata?.title) ? urlMetadata.title : prev.title,
          // Only update description if it's empty or matches old metadata
          description: !prev.description || prev.description === metadata?.description ? urlMetadata.description : prev.description,
          // Reset resource type to detected type if it was auto-detected before
          resource_type: prev.resource_type === metadata?.resourceType || prev.resource_type === 'webpage' ? urlMetadata.resourceType : prev.resource_type,
          // Only update tags if they're empty or match old auto-suggested tags
          tags: !prev.tags || prev.tags === metadata?.suggestedTags.join(', ') ? urlMetadata.suggestedTags.join(', ') : prev.tags
        }))
      } catch (error) {
        setMetadataError(error instanceof Error ? error.message : 'Failed to fetch metadata')
      } finally {
        setFetchingMetadata(false)
      }
    }, 1000) // 1 second debounce

    return () => clearTimeout(timeoutId)
  }, [formData.url]) // Remove metadata dependency to avoid infinite loops

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    const newErrors: Record<string, string> = {}
    
    if (!formData.url.trim()) {
      newErrors.url = 'URL is required'
    } else {
      try {
        new URL(formData.url)
      } catch {
        newErrors.url = 'Please enter a valid URL'
      }
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) {
      return
    }

    try {
      await onAdd({
        url: formData.url.trim(), // Always use the current form URL
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        resource_type: formData.resource_type,
        tags: parsedTags, // Use validated parsed tags
        notes: formData.notes.trim() || undefined,
        // Pass image data from metadata for tab cards (if metadata matches current URL)
        thumbnail_url: metadata?.thumbnail || undefined,
        favicon_url: metadata?.favicon || undefined,
        // Save metadata for future reference (if metadata matches current URL)
        metadata: metadata ? {
          confidence: metadata.confidence,
          domain: metadata.domain,
          extractedAt: new Date().toISOString()
        } : undefined
      })
      
      // Reset form
      setFormData({
        url: '',
        title: '',
        description: '',
        resource_type: 'webpage',
        tags: '',
        notes: ''
      })
      setMetadata(null)
      setErrors({})
      setTitleManuallyEdited(false)
      onClose()
    } catch (error) {
      console.error('Error adding tab:', error)
    }
  }

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        url: '',
        title: '',
        description: '',
        resource_type: 'webpage',
        tags: '',
        notes: ''
      })
      setMetadata(null)
      setMetadataError(null)
      setSimpleMode(true)
      setErrors({})
      setTitleManuallyEdited(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-fade-in">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-stone-50 to-amber-50/30 px-8 py-6 border-b border-stone-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-800">Add Tab</h2>
              <p className="text-stone-600 mt-1">Save a digital discovery to this curation</p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
            >
              <Plus className="w-5 h-5 text-stone-600 rotate-45" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          <form id="add-tab-form" onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* URL Input */}
            <div>
              <label htmlFor="url" className="block text-sm font-semibold text-stone-700 mb-2">
                URL *
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="url"
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com"
                  className={`w-full pl-10 pr-12 py-3 border rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white transition-all text-stone-700 placeholder-stone-400 ${
                    errors.url ? 'border-red-300' : 'border-stone-200'
                  }`}
                  autoFocus
                />
                {/* Loading/Status Indicator */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {fetchingMetadata && (
                    <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                  )}
                  {metadata && !fetchingMetadata && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  {metadataError && !fetchingMetadata && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
              {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url}</p>}
              {metadataError && <p className="mt-1 text-sm text-red-600">{metadataError}</p>}
            </div>

            {/* Auto-detected Preview */}
            {metadata && !fetchingMetadata && (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100">
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  {metadata.thumbnail && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
                      <Image 
                        src={metadata.thumbnail} 
                        alt="Page thumbnail"
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                        onError={() => {
                          // Handle error gracefully - the div will show gray background
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <p className="text-orange-800 font-medium text-sm">Auto-detected</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        metadata.confidence === 'high' ? 'bg-green-100 text-green-700' :
                        metadata.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {metadata.confidence} confidence
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="font-medium text-stone-800 text-sm line-clamp-2">
                        {metadata.title}
                      </p>
                      {metadata.description && (
                        <p className="text-stone-600 text-xs line-clamp-2">
                          {metadata.description}
                        </p>
                      )}
                      
                      {/* Auto-detected tags and type */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                          {resourceTypes.find(t => t.value === metadata.resourceType)?.label || metadata.resourceType}
                        </span>
                        {metadata.suggestedTags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Toggle for Simple/Detailed Mode */}
            <div className="flex items-center justify-between">
              <button 
                type="button"
                onClick={() => setSimpleMode(!simpleMode)}
                className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-800 font-medium transition-colors"
              >
                {simpleMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {simpleMode ? 'Show more options' : 'Show fewer options'}
              </button>
              
              {simpleMode && metadata && (
                <p className="text-xs text-stone-500">
                  We'll use the auto-detected information
                </p>
              )}
            </div>

            {/* Form Fields - Show based on mode */}
            <div className={`space-y-6 transition-all duration-300`}>
              {/* Title - Always editable */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-stone-700 mb-2">
                  Title *
                  {simpleMode && metadata && (
                    <span className="ml-2 text-xs text-orange-600 font-normal">
                      (auto-detected, editable)
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, title: e.target.value }))
                    setTitleManuallyEdited(true)
                  }}
                  placeholder={metadata?.title || "Give this tab a descriptive title"}
                  className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white transition-all text-stone-700 placeholder-stone-400 text-lg ${
                    errors.title ? 'border-red-300' : 'border-stone-200'
                  }`}
                  maxLength={100}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              {/* Show additional fields only in detailed mode */}
              {!simpleMode && (
                <div className="space-y-6">
                  {/* Quick Setup Row */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-semibold text-stone-700 mb-2">Description (optional)</label>
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder={metadata?.description || "What makes this tab special?"}
                        rows={3}
                        className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white transition-all text-stone-700 placeholder-stone-400 resize-none"
                        maxLength={500}
                      />
                    </div>

                    {/* Quick Tags */}
                    <div>
                      <label htmlFor="tags" className="flex items-center justify-between text-sm font-semibold text-stone-700 mb-2">
                        <span>Quick Tags</span>
                        <span className={`text-xs ${
                          parsedTags.length > MAX_USER_TAGS * 0.8 
                            ? 'text-orange-600 font-medium' 
                            : 'text-stone-500'
                        }`}>
                          {parsedTags.length}/{MAX_USER_TAGS}
                        </span>
                      </label>
                      <input
                        type="text"
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder={metadata?.suggestedTags.join(', ') || "ai, tools, inspiration"}
                        className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 transition-all text-stone-700 placeholder-stone-400 ${
                          tagLimitExceeded 
                            ? 'border-orange-300 focus:ring-orange-200 focus:border-orange-400 bg-orange-50' 
                            : 'border-stone-200 focus:ring-orange-200 focus:border-orange-300 bg-white'
                        }`}
                      />
                      
                      {/* Tag Preview */}
                      {parsedTags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {parsedTags.slice(0, 4).map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                          {parsedTags.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                              +{parsedTags.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Validation info */}
                      {tagLimitExceeded ? (
                        <p className="mt-1 text-xs text-orange-600">Maximum {MAX_USER_TAGS} tags allowed. Additional tags have been trimmed.</p>
                      ) : (
                        <p className="mt-1 text-xs text-stone-500">Separate tags with commas</p>
                      )}
                    </div>
                  </div>

                  {/* Resource Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-3">Resource Type</label>
                    <div className="grid grid-cols-5 gap-3">
                      {resourceTypes.map((type) => {
                        const IconComponent = type.icon
                        const isSelected = formData.resource_type === type.value
                        const isAutoDetected = metadata?.resourceType === type.value
                        return (
                          <button 
                            key={type.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, resource_type: type.value }))}
                            className={`p-4 border rounded-2xl transition-all text-center group relative ${
                              isSelected 
                                ? 'border-orange-300 bg-orange-50 ring-2 ring-orange-200' 
                                : 'border-stone-200 hover:border-orange-300 hover:bg-orange-50/50'
                            }`}
                          >
                            {isAutoDetected && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                            )}
                            <div className="flex flex-col items-center gap-2">
                              <IconComponent className="w-5 h-5 text-orange-500" />
                              <span className="text-xs font-semibold text-stone-800">{type.label}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Personal Notes */}
                  <div>
                    <label htmlFor="notes" className="block text-sm font-semibold text-stone-700 mb-2">
                      Personal Notes (optional)
                    </label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Private notes about why you saved this tab..."
                      rows={3}
                      className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white transition-all text-stone-700 placeholder-stone-400 resize-none"
                    />
                    <p className="mt-1 text-sm text-stone-500">Only you can see these notes</p>
                  </div>
                </div>
              )}
            </div>

            {/* Pro Tip - Updated for smart features */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-orange-800 font-medium text-sm">Smart Detection</p>
                  <p className="text-orange-700 text-sm mt-1">
                    {simpleMode 
                      ? "We'll automatically detect the type, title, and tags from your URL!"
                      : "Toggle simple mode for one-click adding with auto-detection, or customize everything here."
                    }
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 px-8 py-6 border-t border-stone-200 flex items-center justify-between flex-shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-stone-600 hover:text-stone-800 font-medium transition-colors"
          >
            Cancel
          </button>
          
          <button 
            type="submit"
            form="add-tab-form"
            disabled={isLoading || fetchingMetadata}
            className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-500 flex items-center gap-3 ${
              isLoading || fetchingMetadata
                ? 'bg-gradient-to-r from-[#31a9d6] to-[#000d85] text-white scale-105' 
                : 'bg-gradient-to-r from-[#af0946] to-[#dc8c35] hover:from-[#31a9d6] hover:to-[#000d85] text-white hover:scale-105'
            } shadow-lg hover:shadow-xl`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding...
              </>
            ) : fetchingMetadata ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Detecting...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Add Tab
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
