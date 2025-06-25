import { useState } from 'react'
import { Trash2, MoreVertical, Edit3, Eye, EyeOff, Heart } from 'lucide-react'
import Image from 'next/image'
import { useDeleteConfirmation } from '@/components/ui/DeleteConfirmationModal'

interface CurationCardProps {
  curation: {
    id: string
    title: string
    description?: string
    tab_count: number
    visibility: 'private' | 'public'
    cover_image_url?: string
    like_count: number
    view_count: number
    user: {
      username?: string
      full_name?: string
      avatar_url?: string
    }
  }
  onDelete?: (curationId: string) => void
  onUpdate?: () => void
  isOwner?: boolean
}

export default function CurationCardWithDelete({ 
  curation, 
  onDelete, 
  onUpdate,
  isOwner = false 
}: CurationCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const { openDeleteModal, DeleteModal } = useDeleteConfirmation()

  const handleDeleteClick = () => {
    setShowMenu(false)
    
    openDeleteModal({
      type: 'curation',
      itemName: curation.title,
      itemCount: curation.tab_count,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/curations/${curation.id}`, {
            method: 'DELETE',
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to delete curation')
          }

          // Success - call parent callback
          onDelete?.(curation.id)
          onUpdate?.() // Refresh the list
          
        } catch (error) {
          console.error('Delete failed:', error)
          alert('Failed to delete curation. Please try again.')
          throw error // Re-throw to keep modal open
        }
      }
    })
  }

  return (
    <>
      <div className="group bg-white/80 backdrop-blur-xl rounded-3xl border border-orange-100/50 hover:border-orange-200/50 transition-all duration-700 hover:shadow-2xl hover:shadow-orange-100/20 overflow-hidden">
        {/* Cover Image */}
        {curation.cover_image_url && (
          <div className="relative h-48 overflow-hidden">
            <Image 
              src={curation.cover_image_url} 
              alt={curation.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60" />
          </div>
        )}

        {/* Card Content */}
        <div className="p-6">
          {/* Header with Actions */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-serif text-stone-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#af0946] group-hover:to-[#dc8c35] group-hover:bg-clip-text transition-all duration-500">
                {curation.title}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-sm text-stone-600">
                <span className="flex items-center gap-1">
                  <span>{curation.tab_count} tab{curation.tab_count !== 1 ? 's' : ''}</span>
                </span>
                <span className="flex items-center gap-1">
                  {curation.visibility === 'private' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {curation.visibility}
                </span>
              </div>
            </div>

            {/* Actions Menu - Only show for owners */}
            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="w-4 h-4 text-stone-600" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <>
                    <div className="absolute top-10 right-0 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 min-w-[160px]">
                      <button
                        onClick={() => {
                          setShowMenu(false)
                          // Handle edit action
                        }}
                        className="w-full px-4 py-2 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-3 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Curation
                      </button>
                      
                      <div className="border-t border-stone-100 my-1" />
                      
                      <button
                        onClick={handleDeleteClick}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Curation
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
          {curation.description && (
            <p className="text-stone-600 text-sm mb-4 line-clamp-2">
              {curation.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-stone-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {curation.like_count}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {curation.view_count}
              </span>
            </div>
            
            {/* User info */}
            <div className="flex items-center gap-2">
              {curation.user.avatar_url && (
                <Image 
                  src={curation.user.avatar_url} 
                  alt={curation.user.full_name || 'User'}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <span className="text-xs">
                {curation.user.full_name || curation.user.username || 'Anonymous'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {DeleteModal}
    </>
  )
}
