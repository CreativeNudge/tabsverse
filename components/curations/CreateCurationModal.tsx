import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { Plus, RefreshCw, Sparkles, Search, ChevronDown, Check, AlertCircle, Upload, Image as ImageIcon, X, Lock, Globe } from 'lucide-react'
import { useImageCompression } from '@/hooks/useImageCompression'
import { uploadCurationImage } from '@/lib/services/enhanced-image-upload'
import { formatFileSize } from '@/lib/services/image-compression'

// Tag limits for user experience
const MAX_USER_TAGS = 6
const TAGS_DISPLAY_LIMIT = 4

interface CreateCurationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: CurationFormData) => Promise<void>
  isLoading: boolean
  limitInfo: {
    remaining: number
  }
}

export interface CurationFormData {
  title: string
  description: string
  visibility: 'private' | 'public'
  tags: string
  primary_category: CollectionCategory
  secondary_category?: CollectionCategory | null
  coverImageUrl?: string
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
  defaultTags: string[] // Auto-generated tags for this category
}

const categories: CategoryOption[] = [
  { 
    id: 'technology', 
    label: 'Technology & Tools', 
    icon: '💻', 
    description: 'Software, apps, dev resources, productivity tools',
    searchTerms: ['tech', 'software', 'coding', 'development', 'apps', 'tools', 'productivity'],
    defaultTags: ['tech', 'tools', 'software']
  },
  { 
    id: 'design', 
    label: 'Design & Creative', 
    icon: '🎨', 
    description: 'Inspiration, tutorials, design resources, portfolios',
    searchTerms: ['design', 'creative', 'art', 'visual', 'inspiration', 'graphics', 'ui', 'ux'],
    defaultTags: ['design', 'creative', 'inspiration']
  },
  { 
    id: 'business', 
    label: 'Business & Career', 
    icon: '💼', 
    description: 'Professional development, industry resources, networking',
    searchTerms: ['business', 'career', 'professional', 'work', 'industry', 'networking', 'leadership'],
    defaultTags: ['business', 'career', 'professional']
  },
  { 
    id: 'education', 
    label: 'Learning & Education', 
    icon: '📚', 
    description: 'Courses, tutorials, research, academic resources',
    searchTerms: ['education', 'learning', 'courses', 'tutorials', 'academic', 'study', 'knowledge'],
    defaultTags: ['learning', 'education', 'knowledge']
  },
  { 
    id: 'lifestyle', 
    label: 'Lifestyle & Health', 
    icon: '🌿', 
    description: 'Fitness, wellness, self-improvement, hobbies',
    searchTerms: ['lifestyle', 'health', 'fitness', 'wellness', 'personal', 'habits', 'hobbies'],
    defaultTags: ['lifestyle', 'wellness', 'personal']
  },
  { 
    id: 'travel', 
    label: 'Travel & Places', 
    icon: '✈️', 
    description: 'Destinations, guides, planning resources',
    searchTerms: ['travel', 'destinations', 'places', 'adventure', 'vacation', 'tourism', 'exploration'],
    defaultTags: ['travel', 'places', 'adventure']
  },
  { 
    id: 'food', 
    label: 'Food & Cooking', 
    icon: '🍳', 
    description: 'Recipes, restaurants, culinary inspiration',
    searchTerms: ['food', 'cooking', 'recipes', 'culinary', 'restaurants', 'nutrition', 'dining'],
    defaultTags: ['food', 'cooking', 'recipes']
  },
  { 
    id: 'entertainment', 
    label: 'Entertainment & Media', 
    icon: '🎬', 
    description: 'Movies, music, books, games, podcasts',
    searchTerms: ['entertainment', 'media', 'movies', 'music', 'games', 'books', 'podcasts', 'shows'],
    defaultTags: ['entertainment', 'media', 'fun']
  },
  { 
    id: 'news', 
    label: 'News & Current Events', 
    icon: '📰', 
    description: 'Articles, analysis, staying informed',
    searchTerms: ['news', 'current events', 'politics', 'journalism', 'analysis', 'updates'],
    defaultTags: ['news', 'current', 'updates']
  },
  { 
    id: 'shopping', 
    label: 'Shopping & Products', 
    icon: '🛍️', 
    description: 'Product research, wishlists, recommendations',
    searchTerms: ['shopping', 'products', 'reviews', 'deals', 'marketplace', 'ecommerce', 'buying'],
    defaultTags: ['shopping', 'products', 'deals']
  },
  { 
    id: 'home', 
    label: 'Home & DIY', 
    icon: '🏠', 
    description: 'Decoration, projects, organization, gardening',
    searchTerms: ['home', 'diy', 'decoration', 'organization', 'gardening', 'projects', 'interior'],
    defaultTags: ['home', 'diy', 'projects']
  },
  { 
    id: 'finance', 
    label: 'Finance & Investing', 
    icon: '💰', 
    description: 'Financial planning, investment research, money management',
    searchTerms: ['finance', 'investing', 'money', 'budgeting', 'planning', 'stocks', 'crypto'],
    defaultTags: ['finance', 'investing', 'money']
  }
]

// Helper function to generate auto-tags based on categories
function generateCategoryTags(primaryCategory: CollectionCategory, secondaryCategory?: CollectionCategory | null): string[] {
  const primaryCat = categories.find(cat => cat.id === primaryCategory)
  const secondaryCat = secondaryCategory ? categories.find(cat => cat.id === secondaryCategory) : null
  
  let autoTags: string[] = []
  
  // Add primary category tags (all 3)
  if (primaryCat) {
    autoTags.push(...primaryCat.defaultTags)
  }
  
  // Add secondary category tags (just 2 to avoid overwhelming)
  if (secondaryCat) {
    autoTags.push(...secondaryCat.defaultTags.slice(0, 2))
  }
  
  // Remove duplicates and ensure we don't exceed max tags
  const uniqueTags = [...new Set(autoTags)]
  return uniqueTags.slice(0, MAX_USER_TAGS)
}

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

export default function CreateCurationModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading, 
  limitInfo 
}: CreateCurationModalProps) {
  const [formData, setFormData] = useState<CurationFormData>({
    title: '',
    description: '',
    visibility: 'private',
    tags: '',
    primary_category: 'technology',
    secondary_category: null,
    coverImageUrl: ''
  })

  // Image compression and upload state
  const { 
    compressFile, 
    compressionResult, 
    isCompressing, 
    error: compressionError,
    previewUrl,
    clearCompression,
    getStats
  } = useImageCompression()

  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Auto-generate tags when categories change
  useEffect(() => {
    if (formData.primary_category) {
      const autoTags = generateCategoryTags(formData.primary_category, formData.secondary_category)
      
      // Only auto-fill if user hasn't manually entered tags yet
      if (!formData.tags.trim()) {
        setFormData(prev => ({
          ...prev,
          tags: autoTags.join(', ')
        }))
      }
    }
  }, [formData.primary_category, formData.secondary_category, formData.tags])

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

  const handleFormChange = (field: keyof CurationFormData, value: string | CollectionCategory | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    try {
      // Step 1: Compress the image
      const result = await compressFile(file)
      if (!result || !result.compressedFile) {
        setUploadError('Image compression failed')
        return
      }

      // Step 2: Upload compressed image to storage (simplified)
      setIsUploading(true)
      const uploadResult = await uploadCurationImage(result.compressedFile)
      
      if (uploadResult.success && uploadResult.url) {
        // Step 3: Update form with uploaded image URL
        handleFormChange('coverImageUrl', uploadResult.url)
        
        // Optional: Show success message with compression stats
        const stats = getStats()
        if (stats) {
          console.log(`Image uploaded! Compressed from ${stats.originalSize} to ${stats.compressedSize} (${stats.savings} smaller)`)
        }
      } else {
        setUploadError(uploadResult.error || 'Upload failed')
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }

    // Clear the input so same file can be selected again
    e.target.value = ''
  }

  const handleRemoveImage = () => {
    handleFormChange('coverImageUrl', '')
    clearCompression()
    setUploadError(null)
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a title for your curation')
      return
    }

    if (!formData.primary_category) {
      alert('Please select a primary category for your curation')
      return
    }

    await onSubmit(formData)
    
    // Reset form on success
    setFormData({
      title: '',
      description: '',
      visibility: 'private',
      tags: '',
      primary_category: 'technology',
      secondary_category: null,
      coverImageUrl: ''
    })
    clearCompression()
    setUploadError(null)
  }

  if (!isOpen) return null

  // Get compression stats for display
  const compressionStats = getStats()

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-fade-in">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-stone-50 to-amber-50/30 px-8 py-6 border-b border-stone-200 flex-shrink-0 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-800">Create Curation</h2>
              <p className="text-stone-600 mt-1">Start curating your digital discoveries ({limitInfo.remaining} remaining)</p>
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
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Curation Title*
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleFormChange('title', e.target.value)}
              placeholder="e.g., Design System Goldmine, Tokyo Coffee Culture"
              className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white transition-all text-stone-700 placeholder-stone-400 text-lg"
              autoFocus
              maxLength={100}
            />
          </div>

          {/* Enhanced Cover Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Cover Image (Optional)
            </label>
            
            {formData.coverImageUrl ? (
              // Image Preview with Compression Stats
              <div className="space-y-3">
                <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-stone-200 group">
                  <Image 
                    src={formData.coverImageUrl} 
                    alt="Cover preview" 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  {/* Edit overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Remove Image
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
              // Upload Area with Enhanced Feedback
              <div className="space-y-3">
                <label className={`w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isCompressing || isUploading
                    ? 'border-blue-300 bg-blue-50/30'
                    : 'border-stone-300 hover:border-orange-300 hover:bg-orange-50/30'
                }`}>
                  {isCompressing || isUploading ? (
                    <>
                      <RefreshCw className="w-6 h-6 text-blue-500 mb-2 animate-spin" />
                      <span className="text-sm text-blue-600 font-medium">
                        {isCompressing ? 'Compressing image...' : 'Uploading image...'}
                      </span>
                      <span className="text-xs text-blue-500 mt-1">
                        {isCompressing ? 'Optimizing to 600×600 square format' : 'Saving to secure storage'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-stone-400 mb-2" />
                      <span className="text-sm text-stone-500 font-medium">Upload custom cover image</span>
                      <span className="text-xs text-stone-400 mt-1">
                        Leave blank for automatic category-based image selection from our curated collection
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isCompressing || isUploading}
                  />
                </label>

                {/* Error Display */}
                {(compressionError || uploadError) && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-red-800 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">Upload Failed</span>
                    </div>
                    <div className="text-red-700 text-sm mt-1">
                      {compressionError || uploadError}
                    </div>
                  </div>
                )}


              </div>
            )}
          </div>

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



          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Description (optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              placeholder="What makes this curation special? What will people discover?"
              rows={3}
              className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white transition-all text-stone-700 placeholder-stone-400 resize-none"
              maxLength={500}
            />
          </div>

          {/* Quick Setup Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Visibility Toggle */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Visibility</label>
              <div className="flex bg-stone-100 rounded-2xl p-1">
                <button 
                  type="button"
                  onClick={() => handleFormChange('visibility', 'private')}
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

            {/* Quick Tags */}
            <div>
              <label className="flex items-center justify-between text-sm font-semibold text-stone-700 mb-2">
                <span>Tags (Auto-Generated)</span>
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
                <div className="mt-2 flex flex-wrap gap-1">
                  {parsedTags.slice(0, TAGS_DISPLAY_LIMIT).map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                  {parsedTags.length > TAGS_DISPLAY_LIMIT && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
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
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 px-8 py-6 border-t border-stone-200 flex items-center justify-between flex-shrink-0 rounded-b-3xl">
          <button 
            onClick={onClose}
            className="px-6 py-3 text-stone-600 hover:text-stone-800 font-medium transition-colors"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleSubmit}
            className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-500 flex items-center gap-3 ${
              isLoading 
                ? 'bg-gradient-to-r from-[#31a9d6] to-[#000d85] text-white scale-105' 
                : 'bg-gradient-to-r from-[#af0946] to-[#dc8c35] hover:from-[#31a9d6] hover:to-[#000d85] text-white hover:scale-105'
            } shadow-lg hover:shadow-xl`}
            disabled={isLoading || isCompressing || isUploading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Create Curation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
