import { useState } from 'react'
import { Trash2, MoreVertical, Edit3, ExternalLink, Heart, Clock } from 'lucide-react'
import Image from 'next/image'
import { useDeleteConfirmation } from '@/components/ui/DeleteConfirmationModal'

interface TabCardProps {
  tab: {
    id: string
    title: string
    description?: string
    url: string
    thumbnail_url?: string
    favicon_url?: string
    domain?: string
    resource_type: string
    click_count: number
    added_at: string
    tags: string[]
    notes?: string
    is_favorite: boolean
  }
  curationId: string
  onDelete?: (tabId: string) => void
  onUpdate?: () => void
  isOwner?: boolean
}

export default function TabCardWithDelete({ 
  tab, 
  curationId,
  onDelete, 
  onUpdate,
  isOwner = false 
}: TabCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const { openDeleteModal, DeleteModal } = useDeleteConfirmation()

  const handleDeleteClick = () => {
    setShowMenu(false)
    
    openDeleteModal({
      type: 'tab',
      itemName: tab.title,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/curations/${curationId}/tabs/${tab.id}`, {
            method: 'DELETE',
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to delete tab')
          }

          // Success - call parent callback
          onDelete?.(tab.id)
          onUpdate?.() // Refresh the list
          
        } catch (error) {
          console.error('Delete failed:', error)
          alert('Failed to delete tab. Please try again.')
          throw error // Re-throw to keep modal open
        }
      }
    })
  }

  const handleVisitClick = async () => {
    // Track click analytics
    try {
      await fetch(`/api/analytics/tab-click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tabId: tab.id })
      })
    } catch (error) {
      console.error('Analytics tracking failed:', error)
    }
    
    // Open the URL
    window.open(tab.url, '_blank')
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return diffInHours === 0 ? 'Just now' : `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  return (
    <>
      <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-orange-100/50 hover:border-orange-200/50 transition-all duration-500 hover:shadow-lg hover:shadow-orange-100/20 overflow-hidden">
        {/* Thumbnail */}
        {tab.thumbnail_url && (
          <div className="relative h-32 overflow-hidden">
            <Image 
              src={tab.thumbnail_url} 
              alt={tab.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60" />
            
            {/* Resource type badge */}
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-md backdrop-blur-sm">
                {tab.resource_type}
              </span>
            </div>
          </div>
        )}

        {/* Card Content */}
        <div className="p-4">
          {/* Header with Actions */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-stone-800 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#af0946] group-hover:to-[#dc8c35] group-hover:bg-clip-text transition-all duration-500">
                {tab.title}
              </h4>
              
              {/* Domain info */}
              <div className="flex items-center gap-2 mt-1">
                {tab.favicon_url && (
                  <Image 
                    src={tab.favicon_url} 
                    alt=""
                    width={16}
                    height={16}
                    className="rounded-sm"
                  />
                )}
                <span className="text-xs text-stone-500 truncate">
                  {tab.domain || new URL(tab.url).hostname}
                </span>
              </div>
            </div>

            {/* Actions Menu - Only show for owners */}
            {isOwner && (
              <div className="relative flex-shrink-0 ml-2">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="w-3 h-3 text-stone-600" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <>
                    <div className="absolute top-8 right-0 bg-white rounded-xl shadow-2xl border border-stone-200 py-1 z-50 min-w-[140px]">
                      <button
                        onClick={() => {
                          setShowMenu(false)
                          // Handle edit action
                        }}
                        className="w-full px-3 py-2 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2 transition-colors text-sm"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit Tab
                      </button>
                      
                      <div className="border-t border-stone-100 my-1" />
                      
                      <button
                        onClick={handleDeleteClick}
                        className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors text-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete Tab
                      </button>
                    </div>

                    {/* Click outside to close */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowMenu(false)}
                    />
                  </>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          {tab.description && (
            <p className="text-stone-600 text-sm mb-3 line-clamp-2">
              {tab.description}
            </p>
          )}

          {/* Tags */}
          {tab.tags && tab.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tab.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-md"
                >
                  #{tag}
                </span>
              ))}
              {tab.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                  +{tab.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Notes */}
          {tab.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
              <p className="text-amber-800 text-sm line-clamp-2">
                💭 {tab.notes}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(tab.added_at)}
              </span>
              
              {tab.click_count > 0 && (
                <span className="flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  {tab.click_count} click{tab.click_count !== 1 ? 's' : ''}
                </span>
              )}
              
              {tab.is_favorite && (
                <span className="flex items-center gap-1 text-red-500">
                  <Heart className="w-3 h-3 fill-current" />
                </span>
              )}
            </div>

            {/* Visit Button */}
            <button
              onClick={handleVisitClick}
              className="px-3 py-1.5 bg-gradient-to-r from-[#af0946] to-[#dc8c35] hover:from-[#31a9d6] hover:to-[#000d85] text-white text-xs font-medium rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Visit
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {DeleteModal}
    </>
  )
}
