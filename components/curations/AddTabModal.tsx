'use client'

import { useState } from 'react'
import { Plus, X, Link, Globe, FileText, Video, FileImage, Download } from 'lucide-react'

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
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    resource_type: 'webpage',
    tags: '',
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

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
        url: formData.url.trim(),
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        resource_type: formData.resource_type,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        notes: formData.notes.trim() || undefined
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
      setErrors({})
      onClose()
    } catch (error) {
      console.error('Error adding tab:', error)
    }
  }

  const handleUrlBlur = async () => {
    if (!formData.url || formData.title) return

    // Auto-fetch title from URL (basic implementation)
    try {
      const url = new URL(formData.url)
      if (!formData.title) {
        // Simple title extraction from domain
        const domain = url.hostname.replace('www.', '')
        setFormData(prev => ({
          ...prev,
          title: `${domain.charAt(0).toUpperCase() + domain.slice(1)} Resource`
        }))
      }
    } catch {
      // Invalid URL, ignore
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-50 to-amber-50/50 px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Link
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              URL *
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                id="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                onBlur={handleUrlBlur}
                placeholder="https://example.com"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                  errors.url ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url}</p>}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Give this link a descriptive title"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Optional description of what this link contains..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          {/* Resource Type */}
          <div>
            <label htmlFor="resource_type" className="block text-sm font-medium text-gray-700 mb-2">
              Resource Type
            </label>
            <div className="grid grid-cols-5 gap-2">
              {resourceTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, resource_type: type.value }))}
                    className={`p-3 border rounded-lg flex flex-col items-center gap-1 text-xs transition-all ${
                      formData.resource_type === type.value
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {type.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="AI, Development, Tools (comma separated)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
          </div>

          {/* Personal Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Personal Notes
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Private notes about why you saved this link..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            <p className="mt-1 text-sm text-gray-500">Only you can see these notes</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Link
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
