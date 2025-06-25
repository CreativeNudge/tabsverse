import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, Eye, ExternalLink, Clock, Share2, Edit3, Trash2 } from 'lucide-react'
import { useDeleteConfirmation } from '@/components/ui/DeleteConfirmationModal'
import { getCategoryIconColor } from '@/lib/utils/dataTransforms'
import type { Database } from '@/types/database'

type CollectionCategory = Database['public']['Enums']['collection_category']

interface CollectionData {
  id: string
  title: string
  description: string
  primary_category: CollectionCategory
  secondary_category?: CollectionCategory | null
  coverImage: string
  itemCount: number
  likes: number
  views: number
  comments: number
  lastUpdated: string
  tags: string[]
  primaryIcon: any // Lucide Icon component
  secondaryIcon?: any // Lucide Icon component for secondary category
  gradient: string
}

interface CollectionGridProps {
  collections: CollectionData[]
  onDelete?: (collectionId: string) => void
  onUpdate?: () => void
}

export default function CollectionGrid({ collections, onDelete, onUpdate }: CollectionGridProps) {
  const { openDeleteModal, DeleteModal } = useDeleteConfirmation()

  const handleDelete = (e: React.MouseEvent, collection: CollectionData) => {
    e.preventDefault() // Prevent navigation to detail page
    e.stopPropagation()
    
    openDeleteModal({
      type: 'curation',
      itemName: collection.title,
      itemCount: collection.itemCount,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/curations/${collection.id}`, {
            method: 'DELETE',
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to delete curation')
          }

          // Success - call parent callbacks
          onDelete?.(collection.id)
          onUpdate?.()
          
        } catch (error) {
          console.error('Delete failed:', error)
          alert('Failed to delete curation. Please try again.')
          throw error // Re-throw to keep modal open
        }
      }
    })
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement share functionality
    console.log('Share functionality coming soon!')
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement edit functionality
    console.log('Edit functionality coming soon!')
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-stone-400" />
        </div>
        <h3 className="text-xl font-semibold text-stone-800 mb-2">No curations yet</h3>
        <p className="text-stone-600">Create your first curation to get started!</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((collection, index) => {
          const PrimaryIcon = collection.primaryIcon
          const SecondaryIcon = collection.secondaryIcon
          const primaryIconColor = getCategoryIconColor(collection.primary_category, false)
          const secondaryIconColor = collection.secondary_category ? 
            getCategoryIconColor(collection.secondary_category, true) : ''
          
          return (
            <Link
              key={collection.id}
              href={`/curations/${collection.id}`}
              className="group relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-stone-200/50 hover:border-orange-200/50 transition-all duration-700 hover:shadow-2xl hover:shadow-orange-100/20 block hover:scale-[1.02] hover:-translate-y-1 flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                <Image 
                  src={collection.coverImage} 
                  alt={collection.title}
                  width={400}
                  height={250}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${collection.gradient} opacity-60`}></div>
                
                {/* Category Icons - Brand Aligned */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {/* Primary Category Icon */}
                  <div className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
                    <PrimaryIcon className={`w-6 h-6 ${primaryIconColor}`} />
                  </div>
                  
                  {/* Secondary Category Icon - if exists */}
                  {SecondaryIcon && (
                    <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md border border-white/20">
                      <SecondaryIcon className={`w-5 h-5 ${secondaryIconColor}`} />
                    </div>
                  )}
                </div>
                
                {/* Quick actions */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:scale-110 transition-transform group/heart">
                    <Heart className="w-5 h-5 text-red-400 group-hover/heart:fill-red-400 transition-all" />
                  </button>
                  <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                    <ExternalLink className="w-5 h-5 text-stone-600 group-hover:text-orange-600 transition-colors" />
                  </button>
                </div>
              </div>
              
              {/* Content - Tighter Layout */}
              <div className="p-6 flex flex-col flex-1">
                {/* Title */}
                <h3 className="text-xl font-serif text-stone-900 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#af0946] group-hover:to-[#dc8c35] group-hover:bg-clip-text transition-all duration-500 line-clamp-2 mb-3">
                  {collection.title}
                </h3>
                
                {/* Description - Consistent 2 lines */}
                <p className="text-stone-600 text-sm leading-relaxed line-clamp-2 h-10 mb-4">
                  {collection.description || "No description provided"}
                </p>
                
                {/* Tags - Consistent area but more compact */}
                <div className="flex flex-wrap gap-2 mb-4 min-h-[1.75rem]">
                  {Array.isArray(collection.tags) ? collection.tags.slice(0, 4).map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  )) : null}
                  {collection.tags && collection.tags.length > 4 && (
                    <span className="px-3 py-1 bg-stone-200 text-stone-500 text-xs rounded-full font-medium">
                      +{collection.tags.length - 4}
                    </span>
                  )}
                </div>
                
                {/* Stats & Actions - Pushed to bottom with less space */}
                <div className="mt-auto pt-3 border-t border-stone-100">
                  {/* Stats Row */}
                  <div className="flex items-center gap-4 text-sm text-stone-500 mb-3">
                    <span className="font-medium">{collection.itemCount} items</span>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{collection.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{collection.views.toLocaleString()}</span>
                    </div>
                    <span className="text-xs text-stone-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {collection.lastUpdated}
                    </span>
                  </div>

                  {/* Action Icons Row */}
                  <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {/* Left side - Share and Edit */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleShare}
                        className="w-8 h-8 rounded-lg bg-stone-50 hover:bg-stone-100 flex items-center justify-center transition-all duration-200 group/share"
                        title="Share (Coming Soon)"
                      >
                        <Share2 className="w-4 h-4 text-stone-400 group-hover/share:text-stone-500 transition-colors" />
                      </button>

                      <button
                        onClick={handleEdit}
                        className="w-8 h-8 rounded-lg bg-stone-50 hover:bg-stone-100 flex items-center justify-center transition-all duration-200 group/edit"
                        title="Edit (Coming Soon)"
                      >
                        <Edit3 className="w-4 h-4 text-stone-400 group-hover/edit:text-stone-500 transition-colors" />
                      </button>
                    </div>

                    {/* Right side - Delete */}
                    <button
                      onClick={(e) => handleDelete(e, collection)}
                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-all duration-200 group/delete hover:scale-105"
                      title="Delete Curation"
                    >
                      <Trash2 className="w-4 h-4 text-red-500 group-hover/delete:text-red-600 transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      
      {/* Delete Confirmation Modal */}
      {DeleteModal}
    </>
  )
}

export type { CollectionData }