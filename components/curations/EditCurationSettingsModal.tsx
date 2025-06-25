'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, RefreshCw, Sparkles, Search, ChevronDown, Check, AlertCircle, X, Lock, Globe, Folder, Tag } from 'lucide-react'

// Tag limits for user experience
const MAX_USER_TAGS = 6
const TAGS_DISPLAY_LIMIT = 4

interface EditCurationSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    primary_category: CollectionCategory
    secondary_category?: CollectionCategory | null
    tags: string
    visibility: 'private' | 'public'
  }) => Promise<void>
  isLoading: boolean
  currentData: {
    primary_category: CollectionCategory
    secondary_category?: CollectionCategory | null
    tags: string[]
    visibility: 'private' | 'public'
  }
}

type CollectionCategory = 
  | 'technology' 
  | 'design' 
  | 'business' 
  | 'education' 
  | 'lifestyle' 
  | 'travel' 
  | 'food' 
  | 'entertainment' 
  | 'news' 
  | 'shopping' 
  | 'home' 
  | 'finance'

interface CategoryOption {
  id: CollectionCategory
  label: string
  icon: string
  description: string
  searchTerms: string[]
}

const categories: CategoryOption[] = [
  { 
    id: 'technology', 
    label: 'Technology & Tools', 
    icon: '💻', 
    description: 'Software, apps, dev resources, productivity tools',
    searchTerms: ['tech', 'software', 'coding', 'development', 'apps', 'tools', 'productivity']
  },
  { 
    id: 'design', 
    label: 'Design & Creative', 
    icon: '🎨', 
    description: 'Inspiration, tutorials, design resources, portfolios',
    searchTerms: ['design', 'creative', 'art', 'visual', 'inspiration', 'graphics', 'ui', 'ux']
  },
  { 
    id: 'business', 
    label: 'Business & Career', 
    icon: '💼', 
    description: 'Professional development, industry resources, networking',
    searchTerms: ['business', 'career', 'professional', 'work', 'industry', 'networking', 'leadership']
  },
  { 
    id: 'education', 
    label: 'Learning & Education', 
    icon: '📚', 
    description: 'Courses, tutorials, research, academic resources',
    searchTerms: ['education', 'learning', 'courses', 'tutorials', 'academic', 'study', 'knowledge']
  },
  { 
    id: 'lifestyle', 
    label: 'Lifestyle & Health', 
    icon: '🌿', 
    description: 'Fitness, wellness, self-improvement, hobbies',
    searchTerms: ['lifestyle', 'health', 'fitness', 'wellness', 'personal', 'habits', 'hobbies']
  },
  { 
    id: 'travel', 
    label: 'Travel & Places', 
    icon: '✈️', 
    description: 'Destinations, guides, planning resources',
    searchTerms: ['travel', 'destinations', 'places', 'adventure', 'vacation', 'tourism', 'exploration']
  },
  { 
    id: 'food', 
    label: 'Food & Cooking', 
    icon: '🍳', 
    description: 'Recipes, restaurants, culinary inspiration',
    searchTerms: ['food', 'cooking', 'recipes', 'culinary', 'restaurants', 'nutrition', 'dining']
  },
  { 
    id: 'entertainment', 
    label: 'Entertainment & Media', 
    icon: '🎬', 
    description: 'Movies, music, books, games, podcasts',
    searchTerms: ['entertainment', 'media', 'movies', 'music', 'games', 'books', 'podcasts', 'shows']
  },
  { 
    id: 'news', 
    label: 'News & Current Events', 
    icon: '📰', 
    description: 'Articles, analysis, staying informed',
    searchTerms: ['news', 'current events', 'politics', 'journalism', 'analysis', 'updates']
  },
  { 
    id: 'shopping', 
    label: 'Shopping & Products', 
    icon: '🛍️', 
    description: 'Product research, wishlists, recommendations',
    searchTerms: ['shopping', 'products', 'reviews', 'deals', 'marketplace', 'ecommerce', 'buying']
  },
  { 
    id: 'home', 
    label: 'Home & DIY', 
    icon: '🏠', 
    description: 'Decoration, projects, organization, gardening',
    searchTerms: ['home', 'diy', 'decoration', 'organization', 'gardening', 'projects', 'interior']
  },
  { 
    id: 'finance', 
    label: 'Finance & Investing', 
    icon: '💰', 
    description: 'Financial planning, investment research, money management',
    searchTerms: ['finance', 'investing', 'money', 'budgeting', 'planning', 'stocks', 'crypto']
  }
]

interface CategoryDropdownProps {
  label: string
  value: CollectionCategory | null | undefined
  onChange: (category: CollectionCategory | null) => void
  placeholder: string
  excludeCategory?: CollectionCategory
  isOptional?: boolean
}

function CategoryDropdown({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  excludeCategory,
  isOptional = false 
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCategories = useMemo(() => {
    let filtered = categories
    
    // Exclude specific category (for secondary dropdown)
    if (excludeCategory) {
      filtered = filtered.filter(cat => cat.id !== excludeCategory)
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(cat => 
        cat.label.toLowerCase().includes(term) ||
        cat.description.toLowerCase().includes(term) ||
        cat.searchTerms.some(searchTerm => searchTerm.includes(term))
      )
    }
    
    return filtered
  }, [searchTerm, excludeCategory])

  const selectedCategory = value ? categories.find(cat => cat.id === value) : null

  const handleSelect = (category: CategoryOption | null) => {
    onChange(category?.id || null)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-stone-700 mb-2">
        {label} {!isOptional && '*'}
      </label>
      
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white transition-all text-left flex items-center justify-between ${
          !selectedCategory ? 'text-stone-400' : 'text-stone-700'
        }`}
      >
        <div className="flex items-center gap-3">
          {selectedCategory ? (
            <>
              <span className="text-lg">{selectedCategory.icon}</span>
              <div>
                <div className="font-medium">{selectedCategory.label}</div>
                <div className="text-sm text-stone-500">{selectedCategory.description}</div>
              </div>
            </>
          ) : (
            <span>{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-200 rounded-2xl shadow-2xl z-50 max-h-80 overflow-hidden">
          {/* Search Box */}
          <div className="p-3 border-b border-stone-100">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* Category Options */}
          <div className="max-h-60 overflow-y-auto">
            {/* Optional: Clear Selection for Secondary */}
            {isOptional && value && (
              <button
                type="button"
                onClick={() => handleSelect(null)}
                className="w-full px-4 py-3 text-left hover:bg-stone-50 transition-colors border-b border-stone-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">✖️</span>
                  <div>
                    <div className="font-medium text-stone-600">No secondary category</div>
                    <div className="text-sm text-stone-500">This collection fits in one category</div>
                  </div>
                </div>
              </button>
            )}

            {filteredCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleSelect(category)}
                className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center justify-between ${
                  value === category.id ? 'bg-orange-50 border-r-2 border-orange-300' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{category.icon}</span>
                  <div>
                    <div className="font-medium text-stone-700">{category.label}</div>
                    <div className="text-sm text-stone-500">{category.description}</div>
                  </div>
                </div>
                {value === category.id && (
                  <Check className="w-4 h-4 text-orange-500" />
                )}
              </button>
            ))}

            {filteredCategories.length === 0 && (
              <div className="px-4 py-6 text-center text-stone-500">
                <div className="text-lg mb-2">🔍</div>
                <div className="text-sm">No categories found matching "{searchTerm}"</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default function EditCurationSettingsModal({ 
  isOpen, 
  onClose, 
  onSave, 
  isLoading,
  currentData
}: EditCurationSettingsModalProps) {
  const [formData, setFormData] = useState({
    primary_category: currentData.primary_category,
    secondary_category: currentData.secondary_category,
    tags: currentData.tags.join(', '),
    visibility: currentData.visibility
  })

  // Reset form data when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setFormData({
        primary_category: currentData.primary_category,
        secondary_category: currentData.secondary_category,
        tags: currentData.tags.join(', '),
        visibility: currentData.visibility
      })
    }
  }, [isOpen, currentData])

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

  const handleFormChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.primary_category) {
      alert('Please select a primary category')
      return
    }

    await onSave({
      primary_category: formData.primary_category,
      secondary_category: formData.secondary_category,
      tags: formData.tags,
      visibility: formData.visibility
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-fade-in">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-stone-50 to-amber-50/30 px-8 py-6 border-b border-stone-200 flex-shrink-0 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center">
                <Folder className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-800">Edit Curation Settings</h2>
                <p className="text-stone-600 mt-1 text-sm">Update categories, tags, and visibility</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-stone-600" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Category Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CategoryDropdown
              label="Primary Category"
              value={formData.primary_category}
              onChange={(category) => handleFormChange('primary_category', category!)}
              placeholder="Select main category..."
            />
            
            <CategoryDropdown
              label="Secondary Category"
              value={formData.secondary_category}
              onChange={(category) => handleFormChange('secondary_category', category)}
              placeholder="Also fits in... (optional)"
              excludeCategory={formData.primary_category}
              isOptional={true}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center justify-between text-sm font-semibold text-stone-700 mb-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>Tags</span>
              </div>
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
              value={formData.tags}
              onChange={(e) => handleFormChange('tags', e.target.value)}
              placeholder="design, tools, inspiration"
              className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 transition-all text-stone-700 placeholder-stone-400 ${
                tagLimitExceeded 
                  ? 'border-orange-300 focus:ring-orange-200 focus:border-orange-400 bg-orange-50' 
                  : 'border-stone-200 focus:ring-orange-200 focus:border-orange-300 bg-white'
              }`}
            />
            
            {/* Tag Preview */}
            {parsedTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {parsedTags.slice(0, TAGS_DISPLAY_LIMIT).map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-lg font-medium"
                  >
                    #{tag}
                  </span>
                ))}
                {parsedTags.length > TAGS_DISPLAY_LIMIT && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg">
                    +{parsedTags.length - TAGS_DISPLAY_LIMIT}
                  </span>
                )}
              </div>
            )}
            
            {/* Validation Warning */}
            {tagLimitExceeded && (
              <div className="mt-2 flex items-center gap-2 text-orange-600 text-xs">
                <AlertCircle className="w-3 h-3" />
                <span>Maximum {MAX_USER_TAGS} tags allowed. Additional tags have been trimmed.</span>
              </div>
            )}
            
            <p className="mt-2 text-xs text-stone-500">Separate tags with commas</p>
          </div>

          {/* Visibility */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-3">
              <Globe className="w-4 h-4" />
              <span>Visibility</span>
            </label>
            <div className="flex bg-stone-100 rounded-2xl p-1">
              <button 
                type="button"
                onClick={() => handleFormChange('visibility', 'private')}
                disabled={isLoading}
                className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  formData.visibility === 'private' 
                    ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                    : 'text-stone-600 hover:text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Lock className="w-4 h-4" />
                Private
              </button>
              <button 
                type="button"
                onClick={() => handleFormChange('visibility', 'public')}
                disabled={isLoading}
                className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  formData.visibility === 'public' 
                    ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                    : 'text-stone-600 hover:text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Globe className="w-4 h-4" />
                Public
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 px-8 py-6 border-t border-stone-200 flex items-center justify-between flex-shrink-0 rounded-b-3xl">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 text-stone-600 hover:text-stone-800 font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-500 flex items-center gap-3 disabled:opacity-50 ${
              isLoading 
                ? 'bg-gradient-to-r from-[#31a9d6] to-[#000d85] text-white scale-105' 
                : 'bg-gradient-to-r from-[#af0946] to-[#dc8c35] hover:from-[#31a9d6] hover:to-[#000d85] text-white hover:scale-105'
            } shadow-lg hover:shadow-xl`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Saving...
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
