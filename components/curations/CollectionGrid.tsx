import Image from 'next/image'
import Link from 'next/link'
import { Heart, Eye, ExternalLink, Clock, LucideIcon } from 'lucide-react'
import type { PersonalityType } from '@/types/dashboard'

interface CollectionData {
  id: string
  title: string
  description: string
  personality: PersonalityType
  coverImage: string
  itemCount: number
  likes: number
  views: number
  lastUpdated: string
  tags: string[]
  icon: LucideIcon
  gradient: string
}

interface CollectionGridProps {
  collections: CollectionData[]
}

interface PersonalityStylesMap {
  [key: string]: {
    titleFont: string
    cardStyle: string
    textColor: string
    border: string
  }
}

const getPersonalityStyles = (personality: PersonalityType) => {
  const styles: PersonalityStylesMap = {
    creative: {
      titleFont: 'font-serif',
      cardStyle: 'hover:rotate-1',
      textColor: 'text-purple-900',
      border: 'border-purple-200'
    },
    ambitious: {
      titleFont: 'font-sans font-bold',
      cardStyle: 'hover:scale-105',
      textColor: 'text-blue-900',
      border: 'border-blue-200'
    },
    wanderlust: {
      titleFont: 'font-serif italic',
      cardStyle: 'hover:-translate-y-2',
      textColor: 'text-orange-900',
      border: 'border-orange-200'
    },
    technical: {
      titleFont: 'font-mono font-semibold',
      cardStyle: 'hover:shadow-2xl',
      textColor: 'text-green-900',
      border: 'border-green-200'
    },
    artistic: {
      titleFont: 'font-serif',
      cardStyle: 'hover:sepia hover:scale-105',
      textColor: 'text-gray-800',
      border: 'border-gray-300'
    },
    mindful: {
      titleFont: 'font-light',
      cardStyle: 'hover:shadow-lg',
      textColor: 'text-indigo-900',
      border: 'border-indigo-200'
    }
  }
  
  return styles[personality] || styles.creative
}

export default function CollectionGrid({ collections }: CollectionGridProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {collections.map((collection, index) => {
        const personalityStyles = getPersonalityStyles(collection.personality)
        const IconComponent = collection.icon
        
        return (
          <Link
            key={collection.id}
            href={`/curations/${collection.id}`}
            className={`group relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-stone-200/50 hover:border-orange-200/50 transition-all duration-700 hover:shadow-2xl hover:shadow-orange-100/20 block ${personalityStyles.cardStyle}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Cover Image */}
            <div className="relative h-48 overflow-hidden">
              <Image 
                src={collection.coverImage} 
                alt={collection.title}
                width={400}
                height={250}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                unoptimized
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${collection.gradient} opacity-60`}></div>
              
              {/* Floating icon */}
              <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <IconComponent className={`w-6 h-6 ${personalityStyles.textColor}`} />
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
            
            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className={`text-xl ${personalityStyles.titleFont} ${personalityStyles.textColor} leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#af0946] group-hover:to-[#dc8c35] group-hover:bg-clip-text transition-all duration-500`}>
                  {collection.title}
                </h3>
              </div>
              
              <p className="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-2">
                {collection.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.isArray(collection.tags) ? collection.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-full font-medium"
                  >
                    {tag}
                  </span>
                )) : null}
              </div>
              
              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <div className="flex items-center gap-4 text-sm text-stone-500">
                  <span className="font-medium">{collection.itemCount} items</span>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{collection.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{collection.views.toLocaleString()}</span>
                  </div>
                </div>
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {collection.lastUpdated}
                </span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export type { CollectionData }
