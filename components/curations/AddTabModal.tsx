'use client'

import { useState } from 'react'
import { Plus, Link, Globe, FileText, Video, FileImage, Download, Sparkles } from 'lucide-react'

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
            {/* URL */}
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
                  onBlur={handleUrlBlur}
                  placeholder="https://example.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white transition-all text-stone-700 placeholder-stone-400 ${
                    errors.url ? 'border-red-300' : 'border-stone-200'
                  }`}
                  autoFocus
                />
              </div>
              {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url}</p>}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-stone-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Give this tab a descriptive title"
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white transition-all text-stone-700 placeholder-stone-400 text-lg ${
                  errors.title ? 'border-red-300' : 'border-stone-200'
                }`}
                maxLength={100}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Quick Setup Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-stone-700 mb-2">Description (optional)</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What makes this tab special?"
                  rows={3}
                  className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white transition-all text-stone-700 placeholder-stone-400 resize-none"
                  maxLength={500}
                />
              </div>

              {/* Quick Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-semibold text-stone-700 mb-2">Quick Tags</label>
                <input
                  type="text"
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="ai, tools, inspiration"
                  className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white transition-all text-stone-700 placeholder-stone-400"
                />
                <p className="mt-1 text-sm text-stone-500">Separate tags with commas</p>
              </div>
            </div>

            {/* Resource Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-3">Resource Type</label>
              <div className="grid grid-cols-5 gap-3">
                {resourceTypes.map((type) => {
                  const IconComponent = type.icon
                  const isSelected = formData.resource_type === type.value
                  return (
                    <button 
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, resource_type: type.value }))}
                      className={`p-4 border rounded-2xl transition-all text-center group ${
                        isSelected 
                          ? 'border-orange-300 bg-orange-50 ring-2 ring-orange-200' 
                          : 'border-stone-200 hover:border-orange-300 hover:bg-orange-50/50'
                      }`}
                    >
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

            {/* Pro Tip */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-orange-800 font-medium text-sm">Pro Tip</p>
                  <p className="text-orange-700 text-sm mt-1">
                    We'll automatically try to fetch the page title and preview when you add the URL!
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
            disabled={isLoading}
            className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-500 flex items-center gap-3 ${
              isLoading 
                ? 'bg-gradient-to-r from-[#31a9d6] to-[#000d85] text-white scale-105' 
                : 'bg-gradient-to-r from-[#af0946] to-[#dc8c35] hover:from-[#31a9d6] hover:to-[#000d85] text-white hover:scale-105'
            } shadow-lg hover:shadow-xl`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding...
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
