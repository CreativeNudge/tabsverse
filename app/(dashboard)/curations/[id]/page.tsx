'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { 
  Heart, 
  MessageCircle, 
  Eye, 
  Share2, 
  ExternalLink, 
  MoreHorizontal,
  Calendar,
  Tag,
  Star,
  Clock,
  Globe,
  FileText,
  Video,
  FileImage,
  Download,
  Plus,
  Link as LinkIcon,
  Trash2,
  Edit,
  ArrowLeft,
  User,
  Folder
} from 'lucide-react'
import { useGroup, useLikeGroup, useUnlikeGroup, useDeleteGroup } from '@/lib/hooks/useGroups'
import { useCreateTab, useTrackTabClick } from '@/lib/hooks/useTabs'
import { useAuth } from '@/lib/hooks/useAuth'
import AddTabModal from '@/components/curations/AddTabModal'
import FloatingActionButton from '@/components/dashboard/FloatingActionButton'

// Resource type icons
const getResourceIcon = (type: string) => {
  switch (type) {
    case 'video': return Video
    case 'image': return FileImage
    case 'pdf': return Download
    case 'document': return FileText
    default: return Globe
  }
}

// Format category names for display
const formatCategoryName = (category: string) => {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Personality-based styling
const getPersonalityStyles = (personality: string) => {
  switch (personality) {
    case 'creative':
      return 'hover:rotate-1 font-serif italic'
    case 'ambitious':
      return 'hover:scale-105 font-sans font-bold'
    case 'wanderlust':
      return 'hover:-translate-y-2 font-serif italic'
    case 'technical':
      return 'hover:shadow-2xl font-mono font-semibold'
    case 'artistic':
      return 'hover:sepia hover:scale-105 font-serif'
    case 'mindful':
      return 'hover:shadow-lg font-sans font-light'
    default:
      return 'hover:scale-102'
  }
}

// Tab card component
function TabCard({ tab, personality, onTabClick }: { 
  tab: any
  personality: string
  onTabClick: (url: string) => void 
}) {
  const ResourceIcon = getResourceIcon(tab.resource_type)
  const personalityClass = getPersonalityStyles(personality)

  const handleClick = () => {
    onTabClick(tab.url)
    // Open link in new tab
    window.open(tab.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div 
      className={`group bg-white/80 backdrop-blur-xl rounded-2xl border border-orange-100/50 hover:border-orange-200/50 transition-all duration-700 hover:shadow-2xl hover:shadow-orange-100/20 cursor-pointer ${personalityClass}`}
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl">
        {tab.thumbnail_url ? (
          <Image
            src={tab.thumbnail_url}
            alt={tab.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
            <ResourceIcon className="w-12 h-12 text-orange-400" />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Resource type badge */}
        <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
          <ResourceIcon className="w-3 h-3 inline mr-1" />
          {tab.resource_type}
        </div>

        {/* Favorite star */}
        {tab.is_favorite && (
          <div className="absolute top-3 left-3 bg-yellow-500/90 text-white p-1.5 rounded-lg backdrop-blur-sm">
            <Star className="w-3 h-3 fill-current" />
          </div>
        )}

        {/* External link indicator */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 p-2 rounded-lg shadow-lg">
            <ExternalLink className="w-4 h-4 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Domain and favicon */}
        <div className="flex items-center gap-2 mb-2">
          {tab.favicon_url && (
            <Image
              src={tab.favicon_url}
              alt=""
              width={16}
              height={16}
              className="rounded"
            />
          )}
          <span className="text-sm text-gray-500">{tab.domain}</span>
          <div className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
            <Eye className="w-3 h-3" />
            {tab.click_count}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#af0946] group-hover:to-[#dc8c35] group-hover:bg-clip-text transition-all duration-500">
          {tab.title}
        </h3>

        {/* Description */}
        {tab.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {tab.description}
          </p>
        )}

        {/* Tags */}
        {tab.tags && tab.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tab.tags.slice(0, 3).map((tag: string, index: number) => (
              <span 
                key={index}
                className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
            {tab.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md">
                +{tab.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Notes (if any) */}
        {tab.notes && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
            <p className="text-amber-800 text-sm italic">"{tab.notes}"</p>
          </div>
        )}

        {/* Metadata */}
        {tab.metadata?.reading_time && (
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-3">
            <Clock className="w-3 h-3" />
            {tab.metadata.reading_time} min read
          </div>
        )}
      </div>
    </div>
  )
}

export default function CurationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const curationId = params.id as string

  const { data: curation, isLoading, error } = useGroup(curationId)
  const likeMutation = useLikeGroup()
  const unlikeMutation = useUnlikeGroup()
  const deleteMutation = useDeleteGroup()
  const createTabMutation = useCreateTab(curationId)
  const trackClickMutation = useTrackTabClick()

  const [showActions, setShowActions] = useState(false)
  const [showAddTab, setShowAddTab] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  if (error || !curation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Curation not found</h1>
          <p className="text-gray-600 mb-4">This curation might be private or no longer exist.</p>
          <Link 
            href="/dashboard"
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const isOwner = user?.id === curation.user_id
  const personality = (curation.settings as any)?.personality || 'creative'
  const displayStyle = (curation.settings as any)?.display_style || 'grid'

  const handleLike = async () => {
    if (!user) return
    
    try {
      if (curation.isLiked) {
        await unlikeMutation.mutateAsync(curationId)
      } else {
        await likeMutation.mutateAsync(curationId)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this curation? This action cannot be undone.')) {
      return
    }

    try {
      await deleteMutation.mutateAsync(curationId)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error deleting curation:', error)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: curation.title,
          text: curation.description || `Check out this curated collection: ${curation.title}`,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleTabClick = async (url: string, tabId: string) => {
    // Track click analytics
    trackClickMutation.mutate(tabId)
  }

  const handleAddTab = async (tabData: {
    url: string
    title: string
    description?: string
    resource_type: string
    tags: string[]
    notes?: string
  }) => {
    await createTabMutation.mutateAsync(tabData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-orange-100/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>

                {showActions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <button 
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => router.push(`/curations/${curationId}/edit`)}
                    >
                      <Edit className="w-4 h-4" />
                      Edit Curation
                    </button>
                    <button 
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                      onClick={handleDelete}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Curation
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        {/* Cover Image */}
        {curation.cover_image_url && (
          <div className="relative h-96 overflow-hidden">
            <Image
              src={curation.cover_image_url}
              alt={curation.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        )}

        {/* Content Overlay */}
        <div className={`relative ${curation.cover_image_url ? 'absolute inset-0 flex items-end' : 'py-16'}`}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-start justify-between">
              <div className={`${curation.cover_image_url ? 'text-white' : 'text-gray-900'} max-w-4xl`}>
                {/* User info */}
                <div className="flex items-center gap-3 mb-4">
                  {curation.user.avatar_url ? (
                    <Image
                      src={curation.user.avatar_url}
                      alt={curation.user.full_name || 'User'}
                      width={48}
                      height={48}
                      className="rounded-full border-2 border-white/20"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center border-2 border-white/20">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {curation.user.full_name || curation.user.username || 'Anonymous'}
                    </p>
                    <p className={`text-sm ${curation.cover_image_url ? 'text-white/80' : 'text-gray-600'}`}>
                      @{curation.user.username || 'user'}
                    </p>
                  </div>
                </div>

                {/* Title */}
                <h1 className={`text-4xl font-bold mb-4 ${getPersonalityStyles(personality)}`}>
                  {curation.title}
                </h1>

                {/* Description */}
                {curation.description && (
                  <p className={`text-lg mb-6 leading-relaxed ${curation.cover_image_url ? 'text-white/90' : 'text-gray-700'}`}>
                    {curation.description}
                  </p>
                )}

                {/* Categories and Tags - Side by Side */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                  {/* Categories Section */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <Folder className={`w-4 h-4 ${curation.cover_image_url ? 'text-white/80' : 'text-gray-600'}`} />
                      <span className={`text-sm font-medium ${curation.cover_image_url ? 'text-white/80' : 'text-gray-600'}`}>
                        Categories:
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                        curation.cover_image_url 
                          ? 'bg-white/30 text-white border-white/40 backdrop-blur-sm' 
                          : 'bg-gradient-to-r from-pink-50 to-orange-50 text-pink-700 border-pink-200'
                      }`}>
                        {formatCategoryName(curation.primary_category)}
                      </span>
                      
                      {curation.secondary_category && (
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                          curation.cover_image_url 
                            ? 'bg-white/20 text-white/90 border-white/30 backdrop-blur-sm' 
                            : 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200'
                        }`}>
                          {formatCategoryName(curation.secondary_category)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tags Section */}
                  {curation.tags && curation.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <Tag className={`w-4 h-4 ${curation.cover_image_url ? 'text-white/80' : 'text-gray-600'}`} />
                        <span className={`text-sm font-medium ${curation.cover_image_url ? 'text-white/80' : 'text-gray-600'}`}>
                          Tags:
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {curation.tags.slice(0, 4).map((tag, index) => (
                          <span 
                            key={index}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                              curation.cover_image_url 
                                ? 'bg-white/20 text-white backdrop-blur-sm' 
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                        {curation.tags.length > 4 && (
                          <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                            curation.cover_image_url 
                              ? 'bg-white/10 text-white/80 backdrop-blur-sm' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            +{curation.tags.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats and actions */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <LinkIcon className="w-5 h-5" />
                      <span className="font-medium">{curation.tab_count}</span>
                      <span className="text-sm">tabs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-5 h-5" />
                      <span className="font-medium">{curation.view_count}</span>
                      <span className="text-sm">views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className={`w-5 h-5 ${curation.isLiked ? 'fill-current text-red-500' : ''}`} />
                      <span className="font-medium">{curation.like_count}</span>
                      <span className="text-sm">likes</span>
                    </div>
                    {curation.comments_enabled && (
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium">{curation.comment_count}</span>
                        <span className="text-sm">comments</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    {user && !isOwner && (
                      <button
                        onClick={handleLike}
                        disabled={likeMutation.isPending || unlikeMutation.isPending}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          curation.isLiked
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : curation.cover_image_url
                            ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                            : 'bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600'
                        }`}
                      >
                        <Heart className={`w-4 h-4 inline mr-1 ${curation.isLiked ? 'fill-current' : ''}`} />
                        {curation.isLiked ? 'Liked' : 'Like'}
                      </button>
                    )}

                    <button
                      onClick={handleShare}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        curation.cover_image_url
                          ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Share2 className="w-4 h-4 inline mr-1" />
                      Share
                    </button>
                  </div>
                </div>

                {/* Created date */}
                <div className={`flex items-center gap-2 mt-4 text-sm ${curation.cover_image_url ? 'text-white/80' : 'text-gray-500'}`}>
                  <Calendar className="w-4 h-4" />
                  Created {new Date(curation.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {curation.tabs && curation.tabs.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Curated Tabs ({curation.tabs.length})
              </h2>
              
              {isOwner && (
                <button 
                  onClick={() => setShowAddTab(true)}
                  className="px-4 py-2 bg-gradient-to-r from-[#af0946] to-[#dc8c35] hover:from-[#31a9d6] hover:to-[#000d85] text-white rounded-lg transition-all duration-500 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  Add Tab
                </button>
              )}
            </div>

            <div className={`grid gap-6 ${
              displayStyle === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 max-w-4xl'
            }`}>
              {curation.tabs.map((tab) => (
                <TabCard 
                  key={tab.id} 
                  tab={tab} 
                  personality={personality}
                  onTabClick={(url) => handleTabClick(url, tab.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center">
              <LinkIcon className="w-12 h-12 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tabs yet</h3>
            <p className="text-gray-600 mb-6">This curation is waiting for its first digital gem.</p>
            {isOwner && (
              <button 
                onClick={() => setShowAddTab(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#af0946] to-[#dc8c35] hover:from-[#31a9d6] hover:to-[#000d85] text-white rounded-2xl font-semibold transition-all duration-500 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add Your First Tab
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Tab Modal */}
      <AddTabModal
        isOpen={showAddTab}
        onClose={() => setShowAddTab(false)}
        onAdd={handleAddTab}
        isLoading={createTabMutation.isPending}
      />

      {/* Floating Action Button - Add Tab variant for detail pages */}
      {isOwner && (
        <FloatingActionButton 
          onClick={() => setShowAddTab(true)}
          variant="add"
          tooltipText="Add Tab"
        />
      )}
    </div>
  )
}
