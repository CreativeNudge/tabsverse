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
  ArrowLeft,
  User,
  Folder,
  ImageIcon,
  Pencil,
  Lock,
  Edit3
} from 'lucide-react'
import { useGroup, useLikeGroup, useUnlikeGroup, useDeleteGroup, useUpdateGroup } from '@/lib/hooks/useGroups'
import { useCreateTab, useTrackTabClick } from '@/lib/hooks/useTabs'
import { useAuth } from '@/lib/hooks/useAuth'
import AddTabModal from '@/components/curations/AddTabModal'
import EditImageModal from '@/components/curations/EditImageModal'
import EditCurationSettingsModal from '@/components/curations/EditCurationSettingsModal'
import FloatingActionButton from '@/components/dashboard/FloatingActionButton'
import { useDeleteConfirmation } from '@/components/ui/DeleteConfirmationModal'
import InlineEdit from '@/components/ui/InlineEdit'
import { generateSmartCoverImage } from '@/lib/utils/dataTransforms'

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

// Personality-based styling from our design system
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

// Get the best cover image (custom upload or smart auto-selection)
const getCoverImageUrl = (curation: any) => {
  return curation.cover_image_url || generateSmartCoverImage(curation.primary_category, curation.id)
}

// Get enhanced domain name (remove common prefixes)
const getCleanDomainName = (domain: string) => {
  return domain
    .replace(/^www\./i, '')
    .replace(/^m\./i, '')
    .replace(/^mobile\./i, '')
    .split('.')[0]
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

// Known platform icons for TRULY broken cases only (use Lucide icons)
const FALLBACK_PLATFORM_ICONS: Record<string, string> = {
  'instagram.com': 'Instagram', // We'll use Lucide Camera icon
  'facebook.com': 'Facebook',   // We'll use Lucide Users icon  
  'twitter.com': 'Twitter',     // We'll use Lucide Bird icon
  'x.com': 'X'                  // We'll use Lucide X icon
}

// Get platform name for truly broken favicons
const getPlatformName = (domain: string) => {
  const cleanDomain = domain.replace(/^www\./i, '')
  return FALLBACK_PLATFORM_ICONS[cleanDomain] || null
}

// Check if favicon URL is ACTUALLY broken (be very permissive)
const isFaviconActuallyBroken = (faviconUrl: string | null) => {
  // Only return true if there's no favicon URL at all
  // Let the browser handle broken favicon URLs through the onError handler
  return !faviconUrl
}

// Tab card component
function TabCard({ tab, personality, onTabClick, canEdit, onTabDelete }: { 
  tab: any
  personality: string
  onTabClick: (url: string) => void
  canEdit: boolean
  onTabDelete: (tab: any) => void // Changed to pass the whole tab object
}) {
  const ResourceIcon = getResourceIcon(tab.resource_type)
  // Removed useDeleteConfirmation from individual tab cards

  const handleClick = () => {
    onTabClick(tab.url)
    window.open(tab.url, '_blank', 'noopener,noreferrer')
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent tab opening
    e.stopPropagation()
    // Call parent handler instead of opening modal directly
    onTabDelete(tab)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement tab share functionality
    console.log('Tab share functionality coming soon!')
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement tab edit functionality
    console.log('Tab edit functionality coming soon!')
  }

  return (
    <div 
      className={`group bg-white/80 backdrop-blur-xl rounded-2xl border border-orange-100/50 hover:border-orange-200/50 transition-all duration-700 hover:shadow-2xl hover:shadow-orange-100/20 cursor-pointer flex flex-col ${getPersonalityStyles(personality)}`}
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
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-pink-100 flex flex-col items-center justify-center text-center p-4">
            {/* Enhanced fallback with favicon + domain */}
            <div className="flex flex-col items-center gap-3">
              {/* Always try to use favicon first, only fallback to icon if truly broken */}
              {tab.favicon_url && !isFaviconActuallyBroken(tab.favicon_url) ? (
                <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Image
                    src={tab.favicon_url}
                    alt=""
                    width={24}
                    height={24}
                    className="rounded"
                    onError={(e) => {
                      // On error, replace with Globe icon, not hide
                      const parent = e.currentTarget.parentElement
                      if (parent) {
                        parent.innerHTML = '<div class="w-6 h-6 text-orange-600"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg></div>'
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
              )}
              
              {/* Clean domain name */}
              <div className="text-orange-700 font-medium text-sm">
                {getCleanDomainName(tab.domain)}
              </div>
              
              {/* Resource type icon as small indicator */}
              <ResourceIcon className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        )}
        
        {/* Resource type badge */}
        <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
          <ResourceIcon className="w-3 h-3 inline mr-1" />
          {tab.resource_type}
        </div>

        {/* External link indicator */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 p-2 rounded-lg shadow-lg">
            <ExternalLink className="w-4 h-4 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Domain and favicon - keep original favicon unless truly broken */}
        <div className="flex items-center gap-2 mb-2">
          {/* Conservative favicon display - keep working favicons */}
          {tab.favicon_url && !isFaviconActuallyBroken(tab.favicon_url) ? (
            <Image
              src={tab.favicon_url}
              alt=""
              width={16}
              height={16}
              className="rounded"
              onError={(e) => {
                // On error, replace with Globe icon
                const parent = e.currentTarget.parentElement
                if (parent) {
                  parent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-gray-500"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>'
                }
              }}
            />
          ) : (
            <Globe className="w-4 h-4 text-gray-500" />
          )}
          
          <span className="text-sm text-gray-500">{getCleanDomainName(tab.domain)}</span>
          <div className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
            <Eye className="w-3 h-3" />
            {tab.click_count}
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#af0946] group-hover:to-[#dc8c35] group-hover:bg-clip-text transition-all duration-500 ${getPersonalityStyles(personality)}`}>
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

        {/* Action Icons Row - Only visible to owners/editors on hover */}
        {canEdit && (
          <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 mt-auto pt-2 border-t border-gray-100">
            {/* Left side - Share and Edit */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="w-7 h-7 rounded-lg bg-stone-50 hover:bg-stone-100 flex items-center justify-center transition-all duration-200 group/share"
                title="Share Tab (Coming Soon)"
              >
                <Share2 className="w-3.5 h-3.5 text-stone-400 group-hover/share:text-stone-500 transition-colors" />
              </button>

              <button
                onClick={handleEdit}
                className="w-7 h-7 rounded-lg bg-stone-50 hover:bg-stone-100 flex items-center justify-center transition-all duration-200 group/edit"
                title="Edit Tab (Coming Soon)"
              >
                <Edit3 className="w-3.5 h-3.5 text-stone-400 group-hover/edit:text-stone-500 transition-colors" />
              </button>
            </div>

            {/* Right side - Delete */}
            <button
              onClick={handleDelete}
              className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-all duration-200 group/delete hover:scale-105"
              title="Delete Tab"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500 group-hover/delete:text-red-600 transition-colors" />
            </button>
          </div>
        )}
      </div>
      
      {/* No individual DeleteModal - handled at page level */}
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
  const updateMutation = useUpdateGroup()
  const createTabMutation = useCreateTab(curationId)
  const trackClickMutation = useTrackTabClick()
  const { openDeleteModal, DeleteModal } = useDeleteConfirmation()

  const [showAddTab, setShowAddTab] = useState(false)
  const [showEditImage, setShowEditImage] = useState(false)
  const [showEditSettings, setShowEditSettings] = useState(false)

  const handleUpdateTitle = async (newTitle: string) => {
    await updateMutation.mutateAsync({
      id: curationId,
      data: { title: newTitle }
    })
  }

  const handleUpdateDescription = async (newDescription: string) => {
    await updateMutation.mutateAsync({
      id: curationId,
      data: { description: newDescription }
    })
  }

  const handleUpdateSettings = async (data: {
    primary_category: any
    secondary_category?: any | null
    tags: string
    visibility: 'private' | 'public'
  }) => {
    await updateMutation.mutateAsync({
      id: curationId,
      data: {
        primary_category: data.primary_category,
        secondary_category: data.secondary_category,
        tags: data.tags,
        visibility: data.visibility
      }
    })
    setShowEditSettings(false)
  }

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

  // Permission system: Owner (creator) has full control, collaborators can edit/add, public can only view
  const isOwner = user?.id === curation.user_id
  const isCollaborator = false // TODO: Implement collaborator system in future
  const canEdit = isOwner || isCollaborator
  const canDelete = isOwner // Only creator can delete
  const personality = (curation.settings as any)?.personality || 'creative'
  const displayStyle = (curation.settings as any)?.display_style || 'grid'
  
  // Get the cover image (custom upload or auto-selected)
  const coverImageUrl = getCoverImageUrl(curation)

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

  const handleDelete = () => {
    openDeleteModal({
      type: 'curation',
      itemName: curation.title,
      itemCount: curation.tab_count,
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(curationId)
          router.push('/dashboard')
        } catch (error) {
          console.error('Error deleting curation:', error)
          throw error // Re-throw to keep modal open on error
        }
      }
    })
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
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleTabClick = async (url: string, tabId: string) => {
    trackClickMutation.mutate(tabId)
  }

  const handleTabDelete = (tab: any) => {
    openDeleteModal({
      type: 'tab',
      itemName: tab.title,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/curations/${tab.group_id}/tabs/${tab.id}`, {
            method: 'DELETE',
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to delete tab')
          }

          // Success - refresh the page to update tab list
          window.location.reload()
          
        } catch (error) {
          console.error('Delete failed:', error)
          alert('Failed to delete tab. Please try again.')
          throw error // Re-throw to keep modal open
        }
      }
    })
  }

  const handleAddTab = async (tabData: {
    url: string
    title: string
    description?: string
    resource_type: string
    tags: string[]
    notes?: string
    thumbnail_url?: string
    favicon_url?: string
    metadata?: any
  }) => {
    await createTabMutation.mutateAsync(tabData)
  }

  const handleImageUpdated = (newImageUrl: string) => {
    // Refresh the curation data to show the new image
    // This will trigger a re-fetch from React Query
    window.location.reload() // Simple solution for now
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20">
      {/* Header - Simplified */}
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
          </div>
        </div>
      </div>

      {/* COMPACT HORIZONTAL LAYOUT with Inline Editing */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        
        {/* Main Content: Compact Horizontal Layout */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8 group">
          
          {/* LEFT: Compact Cover Image (200x200) */}
          <div className="lg:w-[200px] lg:h-[200px] w-full h-48 lg:flex-shrink-0">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg group/image">
              <Image
                src={coverImageUrl}
                alt={curation.title}
                fill
                className="object-cover transition-transform duration-500 group-hover/image:scale-105"
                priority
              />
              
              {/* Edit Image Overlay (Edit Permission) */}
              {canEdit && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => setShowEditImage(true)}
                    className="px-3 py-1.5 bg-white/90 text-gray-800 rounded-lg font-medium hover:bg-white transition-colors flex items-center gap-1.5 shadow-lg text-xs"
                  >
                    <ImageIcon className="w-3 h-3" />
                    Edit Image
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Dense Information Layout */}
          <div className="flex-1 min-w-0">
            
            {/* Top Row: Title with inline edit + user info beside it */}
            <div className="flex items-center gap-3 mb-3">
              {/* Title with inline edit */}
              <InlineEdit
                value={curation.title}
                onSave={handleUpdateTitle}
                type="text"
                canEdit={canEdit}
                className={`text-2xl lg:text-3xl font-bold text-gray-900 leading-tight ${getPersonalityStyles(personality)}`}
                editClassName="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight"
                placeholder="Enter curation title..."
                maxLength={100}
                showEditButton={true}
                triggerOnClick={false}
              />

              {/* User Info - Right beside title (Instagram-style) */}
              <button 
                onClick={() => router.push(`/users/${curation.user.username || curation.user.id}`)}
                className="flex items-center gap-2 flex-shrink-0 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors group/user"
              >
                {curation.user.avatar_url ? (
                  <Image
                    src={curation.user.avatar_url}
                    alt={curation.user.full_name || 'User'}
                    width={28}
                    height={28}
                    className="rounded-full border border-orange-200 group-hover/user:border-orange-300 transition-colors"
                  />
                ) : (
                  <div className="w-7 h-7 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center border border-orange-200 group-hover/user:border-orange-300 transition-colors">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className="min-w-0 text-left">
                  <p className="text-sm font-medium text-gray-700 group-hover/user:text-gray-900 transition-colors">
                    {curation.user.full_name || curation.user.username || 'Anonymous'}
                  </p>
                  <p className="text-xs text-gray-500 truncate group-hover/user:text-gray-400 transition-colors">
                    @{curation.user.username || 'user'}
                  </p>
                </div>
              </button>
            </div>

            {/* Description with inline edit */}
            <div className="mb-3">
              <InlineEdit
                value={curation.description || ''}
                onSave={handleUpdateDescription}
                type="textarea"
                canEdit={canEdit}
                className="text-gray-700 text-sm leading-relaxed"
                editClassName="w-full text-gray-700 text-sm leading-relaxed"
                placeholder="Add a description..."
                emptyText="Click to add description..."
                rows={2}
                maxLength={500}
                showEditButton={false}
                triggerOnClick={true}
              />
            </div>

            {/* Categories and Tags with edit controls */}
            <div className="flex flex-wrap gap-4 mb-4">
              {/* Categories and Tags with single edit button */}
              <div className="flex items-center gap-4 group/settings">
                {/* Categories */}
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-gray-500" />
                  <span className="px-2 py-1 bg-gradient-to-r from-pink-50 to-orange-50 text-pink-700 border border-pink-200 rounded-lg text-xs font-medium">
                    {formatCategoryName(curation.primary_category)}
                  </span>
                  {curation.secondary_category && (
                    <span className="px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium">
                      {formatCategoryName(curation.secondary_category)}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {curation.tags && curation.tags.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <div className="flex flex-wrap gap-1">
                      {curation.tags.slice(0, 4).map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-orange-100 text-orange-800 rounded-lg text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                      {curation.tags.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs">
                          +{curation.tags.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Visibility indicator */}
                <div className="flex items-center gap-1.5">
                  {curation.visibility === 'private' ? (
                    <>
                      <Lock className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500">Private</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500">Public</span>
                    </>
                  )}
                </div>

                {/* Single edit button for all settings */}
                {canEdit && (
                  <button
                    onClick={() => setShowEditSettings(true)}
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors opacity-0 group-hover/settings:opacity-100"
                    title="Edit categories, tags, and visibility"
                  >
                    <Pencil className="w-3 h-3 text-gray-500 hover:text-gray-700" />
                  </button>
                )}
              </div>
            </div>

            {/* Stats Row - Compact */}
            <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
              <div className="flex items-center gap-1">
                <LinkIcon className="w-4 h-4" />
                <span className="font-semibold text-gray-900">{curation.tab_count}</span>
                <span>tabs</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span className="font-semibold text-gray-900">{curation.view_count}</span>
                <span>views</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className={`w-4 h-4 ${curation.isLiked ? 'fill-current text-red-500' : ''}`} />
                <span className="font-semibold text-gray-900">{curation.like_count}</span>
                <span>likes</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Created {new Date(curation.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}</span>
              </div>
            </div>

            {/* Action Buttons with delete separated to far right */}
            <div className="flex items-center justify-between">
              {/* Left side: Main action buttons */}
              <div className="flex items-center gap-3">
                {/* Open All Tabs Button */}
                {curation.tabs && curation.tabs.length > 0 && (
                  <button 
                    onClick={() => curation.tabs.forEach((tab: any) => window.open(tab.url, '_blank'))}
                    className="px-4 py-2 bg-gradient-to-r from-[#af0946] to-[#dc8c35] hover:from-[#31a9d6] hover:to-[#000d85] text-white rounded-xl font-medium transition-all duration-500 shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open All Tabs
                  </button>
                )}

                {/* Like Button */}
                {user && !isOwner && (
                  <button
                    onClick={handleLike}
                    disabled={likeMutation.isPending || unlikeMutation.isPending}
                    className={`px-3 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-1.5 text-sm ${
                      curation.isLiked
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${curation.isLiked ? 'fill-current' : ''}`} />
                    {curation.isLiked ? 'Liked' : 'Like'}
                  </button>
                )}

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-all duration-300 flex items-center gap-1.5 text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              {/* Right side: Delete button (creator only) */}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-xl font-medium transition-all duration-300 flex items-center gap-1.5 text-sm"
                  title="Delete curation (creator only)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div>
          {curation.tabs && curation.tabs.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Tabs <span className="text-gray-500">({curation.tabs.length})</span>
                </h2>
                
                {canEdit && (
                  <button 
                    onClick={() => setShowAddTab(true)}
                    className="px-4 py-2 bg-gradient-to-r from-[#af0946] to-[#dc8c35] hover:from-[#31a9d6] hover:to-[#000d85] text-white rounded-xl font-medium transition-all duration-500 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Tab
                  </button>
                )}
              </div>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {curation.tabs.map((tab) => (
                  <TabCard 
                    key={tab.id} 
                    tab={tab} 
                    personality={personality}
                    onTabClick={(url) => handleTabClick(url, tab.id)}
                    canEdit={canEdit}
                    onTabDelete={handleTabDelete}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center">
                <LinkIcon className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tabs yet</h3>
              <p className="text-gray-600 mb-4">This curation is waiting for its first digital gem.</p>
              {canEdit && (
                <button 
                  onClick={() => setShowAddTab(true)}
                  className="px-4 py-2 bg-gradient-to-r from-[#af0946] to-[#dc8c35] hover:from-[#31a9d6] hover:to-[#000d85] text-white rounded-xl font-medium transition-all duration-500 flex items-center gap-2 mx-auto shadow-md hover:shadow-lg hover:scale-105 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Tab
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddTabModal
        isOpen={showAddTab}
        onClose={() => setShowAddTab(false)}
        onAdd={handleAddTab}
        isLoading={createTabMutation.isPending}
      />

      <EditImageModal
        isOpen={showEditImage}
        onClose={() => setShowEditImage(false)}
        curationId={curationId}
        curationTitle={curation.title}
        onImageUpdated={handleImageUpdated}
      />

      <EditCurationSettingsModal
        isOpen={showEditSettings}
        onClose={() => setShowEditSettings(false)}
        onSave={handleUpdateSettings}
        isLoading={updateMutation.isPending}
        currentData={{
          primary_category: curation.primary_category,
          secondary_category: curation.secondary_category,
          tags: curation.tags || [],
          visibility: curation.visibility
        }}
      />

      {/* Floating Action Button - Edit Permission */}
      {canEdit && (
        <FloatingActionButton 
          onClick={() => setShowAddTab(true)}
          variant="add"
          tooltipText="Add Tab"
        />
      )}

      {/* Delete Confirmation Modal */}
      {DeleteModal}
    </div>
  )
}
